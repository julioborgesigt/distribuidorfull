// /controllers/authController.js (Apenas Admin)
const { User, Unidade } = require('../models');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');
const { getRealIP, passwordVersion, getJwtExpiration } = require('../utils/helpers');
const { setTokenCookie, clearTokenCookie } = require('../utils/cookieHelper');
const JWT_SECRET = process.env.JWT_SECRET;
// Validado: um JWT_EXPIRATION malformado faria jwt.sign lançar em TODO login
const JWT_EXPIRATION = getJwtExpiration();

// Mensagem única para matrícula inexistente e senha errada — evita enumeração
// de usuários válidos pelo formulário de login
const INVALID_CREDENTIALS_MSG = 'Matrícula ou senha incorretos.';

// Monta o objeto de usuário devolvido ao frontend após o login.
// Inclui papel e unidade. admin_super reflete o privilégio EFETIVO da sessão
// (um super logado como admin_padrao opera sem privilégios de super).
async function buildLoginUser(user, effectiveLoginType) {
  let unidadeNome = null;
  if (user.unidade_id) {
    try {
      const u = await Unidade.findByPk(user.unidade_id, { attributes: ['nome'] });
      unidadeNome = u ? u.nome : null;
    } catch { /* não-crítico */ }
  }
  const isSuperSession = effectiveLoginType === 'admin_super' && user.role === 'super';
  return {
    id: user.id,
    matricula: user.matricula,
    nome: user.nome,
    role: user.role,
    // Privilégio efetivo desta sessão (não necessariamente o papel do banco).
    admin_super: isSuperSession,
    admin_padrao: true,
    unidade_id: user.unidade_id,
    unidade_nome: unidadeNome,
  };
}

// Hash usado para equalizar o tempo de resposta quando a matrícula não existe
// (sem ele, a ausência do bcrypt.compare denunciaria matrículas inexistentes)
const DUMMY_HASH = bcryptjs.hashSync('timing-equalizer', 10);

// --- Account Lockout em memória ---
//
// O bloqueio é por (IP + matrícula), NÃO por IP puro: travar uma matrícula
// numa máquina nunca impede outras matrículas de logarem na MESMA máquina — o
// que importa numa rede compartilhada (lanhouse/NAT), onde vários servidores
// dividem o mesmo IP público. Também não é possível um terceiro travar a conta
// de uma vítima globalmente: o bloqueio fica preso ao par IP+matrícula.
//
// A contagem usa uma JANELA DESLIZANTE: erros espaçados de um usuário legítimo
// não se acumulam indefinidamente até o bloqueio — se não houver falha dentro
// da janela, a contagem recomeça do zero.
//
// Parâmetros ajustáveis por variável de ambiente (com defaults seguros).
const MAX_LOGIN_ATTEMPTS = parseInt(process.env.LOGIN_MAX_ATTEMPTS, 10) || 10;
const LOCKOUT_DURATION_MS = (parseInt(process.env.LOGIN_LOCKOUT_MINUTES, 10) || 15) * 60 * 1000;
const ATTEMPT_WINDOW_MS = (parseInt(process.env.LOGIN_ATTEMPT_WINDOW_MINUTES, 10) || 15) * 60 * 1000;
const LOCKOUT_MINUTES = Math.round(LOCKOUT_DURATION_MS / 60000);
const loginAttempts = new Map(); // chave "ip:matricula" -> { count, firstAt, lastAt, lockedUntil }

function getAttemptKey(ip, matricula) {
  return `${ip}:${matricula}`;
}

function checkLockout(ip, matricula) {
  const key = getAttemptKey(ip, matricula);
  const record = loginAttempts.get(key);
  if (!record) return { locked: false };
  if (record.lockedUntil && Date.now() < record.lockedUntil) {
    const remainingMs = record.lockedUntil - Date.now();
    return { locked: true, remainingMinutes: Math.ceil(remainingMs / 60000) };
  }
  if (record.lockedUntil && Date.now() >= record.lockedUntil) {
    loginAttempts.delete(key);
    return { locked: false };
  }
  return { locked: false };
}

function recordFailedAttempt(ip, matricula) {
  const key = getAttemptKey(ip, matricula);
  const now = Date.now();
  let record = loginAttempts.get(key);
  // Janela deslizante: se a última falha foi há mais que a janela, recomeça a
  // contagem — assim erros ocasionais ao longo do tempo não travam a conta.
  if (!record || (record.lastAt && now - record.lastAt > ATTEMPT_WINDOW_MS)) {
    record = { count: 0, firstAt: now, lastAt: now, lockedUntil: null };
  }
  record.count += 1;
  record.lastAt = now;
  if (record.count >= MAX_LOGIN_ATTEMPTS) {
    record.lockedUntil = now + LOCKOUT_DURATION_MS;
    logger.logSecurityEvent('Conta bloqueada por tentativas excessivas', { ip, matricula, attempts: record.count });
  }
  loginAttempts.set(key, record);
  return record;
}

function clearAttempts(ip, matricula) {
  loginAttempts.delete(getAttemptKey(ip, matricula));
}

// Limpeza periódica (a cada 10 min): remove locks expirados E registros
// antigos fora da janela (evita crescimento indefinido do Map).
const _cleanupInterval = setInterval(() => {
  const now = Date.now();
  for (const [key, record] of loginAttempts.entries()) {
    const lockExpirou = record.lockedUntil && now >= record.lockedUntil;
    const janelaExpirou = !record.lockedUntil && record.lastAt && now - record.lastAt > ATTEMPT_WINDOW_MS;
    if (lockExpirou || janelaExpirou) {
      loginAttempts.delete(key);
    }
  }
}, 10 * 60 * 1000);
// Não impede o processo de encerrar (ex.: fim da suíte de testes).
if (_cleanupInterval.unref) _cleanupInterval.unref();

exports.login = async (req, res) => {
  const { matricula, senha, loginType } = req.body;
  const clientIP = getRealIP(req);

  logger.info('Tentativa de login', { matricula, loginType, ip: clientIP });

  // --- 0. VERIFICAÇÃO DE LOCKOUT ---
  const lockStatus = checkLockout(clientIP, matricula);
  if (lockStatus.locked) {
    logger.warn('Tentativa de login em conta bloqueada', { matricula, ip: clientIP });
    return res.status(429).json({
      error: `Conta temporariamente bloqueada por tentativas excessivas. Tente novamente em ${lockStatus.remainingMinutes} minuto(s).`
    });
  }

  // --- 1. VALIDAÇÃO DO TIPO DE LOGIN (NOVO) ---
  // Exige que o loginType seja especificado como admin
  if (!loginType || (loginType !== 'admin_super' && loginType !== 'admin_padrao')) {
    return res.status(400).json({ error: 'Tipo de login (loginType) é obrigatório e deve ser admin_super ou admin_padrao.' });
  }

  try {
    const user = await User.findOne({ where: { matricula } });

    // --- 2. VERIFICAÇÃO DE SENHA (antes da permissão, com resposta uniforme) ---
    // Matrícula inexistente e senha errada retornam o MESMO erro 401, e o
    // bcrypt.compare roda nos dois casos (DUMMY_HASH) para equalizar o tempo
    // de resposta — sem isso seria possível enumerar matrículas válidas.
    const senhaValida = await bcryptjs.compare(senha, user ? user.senha : DUMMY_HASH);
    if (!user || !senhaValida) {
      const attempt = recordFailedAttempt(clientIP, matricula);
      logger.logAuthAttempt(false, matricula, clientIP, user ? 'Senha incorreta' : 'Usuário não encontrado');
      if (attempt.lockedUntil) {
        return res.status(429).json({
          error: `Conta bloqueada por ${MAX_LOGIN_ATTEMPTS} tentativas incorretas. Tente novamente em ${LOCKOUT_MINUTES} minutos.`
        });
      }
      return res.status(401).json({ error: INVALID_CREDENTIALS_MSG });
    }

    // Senha correta: zera as tentativas AGORA, antes mesmo da checagem de
    // permissão. Quem digitou a senha certa não é força-bruta — não deve ser
    // penalizado por erros anteriores nem por escolher o tipo de login errado.
    clearAttempts(clientIP, matricula);

    // --- 3. VALIDAÇÃO DE PERMISSÃO (só após provar a senha) ---
    // O papel (role) é a fonte de verdade. loginType é o privilégio SOLICITADO:
    //   - 'admin_super' exige role 'super' (acesso cross-unidade + rotas de super).
    //   - 'admin_padrao' vale para qualquer papel (super opera com privilégio
    //     reduzido; admin_unidade e servidor operam no escopo da sua unidade).
    let effectiveLoginType = null;

    if (loginType === 'admin_super' && user.role === 'super') {
        effectiveLoginType = 'admin_super';
    } else if (loginType === 'admin_padrao') {
        effectiveLoginType = 'admin_padrao';
    }

    // Se, após as verificações, ele não for um admin válido, rejeita.
    if (!effectiveLoginType) {
        logger.logAuthAttempt(false, matricula, clientIP, 'Permissão insuficiente');
        logger.logSecurityEvent('Tentativa de acesso sem permissão', { matricula, loginType, ip: clientIP });
        return res.status(403).json({ error: 'Acesso negado. O usuário não possui as permissões de administrador solicitadas.' });
    }
    // --- Fim da validação de permissão ---
    // (as tentativas já foram zeradas assim que a senha foi validada acima)

    // Lógica de primeiro login
    if (user.senha_padrao) {
      // Gera um token JWT de curta duração (5 min) vinculado ao userId
      // para garantir que apenas quem fez o login pode trocar a senha
      const firstLoginToken = jwt.sign(
        { id: user.id, loginType: effectiveLoginType, purpose: 'first_login' },
        JWT_SECRET,
        { expiresIn: '5m' }
      );
      logger.info('Primeiro login detectado', { userId: user.id, matricula });
      return res.json({ firstLogin: true, firstLoginToken, loginType: effectiveLoginType });
    } else {
      logger.logAuthAttempt(true, matricula, clientIP);
      // pwv: versão da senha — invalida o token se a senha mudar (ver autenticarAdmin)
      const token = jwt.sign(
        { id: user.id, loginType: effectiveLoginType, role: user.role, pwv: passwordVersion(user.senha) },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRATION }
      );

      const loginUser = await buildLoginUser(user, effectiveLoginType);

      // Define o token como cookie httpOnly (protegido contra XSS)
      setTokenCookie(res, token);

      return res.json({ user: loginUser });
    }
  } catch (error) {
    logger.error('Erro no processo de login', {
      error: error.message,
      stack: error.stack,
      matricula,
      ip: clientIP
    });
    return res.status(500).json({ error: 'Erro interno' });
  }
};


exports.logout = (req, res) => {
  clearTokenCookie(res);
  res.json({ message: 'Logout realizado com sucesso' });
};

exports.firstLogin = async (req, res) => {
  const { firstLoginToken, novaSenha } = req.body;
  const clientIP = getRealIP(req);

  if (!firstLoginToken) {
    return res.status(400).json({ error: 'Token de primeiro login é obrigatório.' });
  }

  try {
    // Verifica e decodifica o token temporário gerado no login
    let decoded;
    try {
      decoded = jwt.verify(firstLoginToken, JWT_SECRET, { algorithms: ['HS256'] });
    } catch (tokenErr) {
      if (tokenErr.name === 'TokenExpiredError') {
        logger.warn('Token de primeiro login expirado', { ip: clientIP });
        return res.status(401).json({ error: 'Sessão de primeiro login expirada. Faça login novamente.' });
      }
      logger.warn('Token de primeiro login inválido', { ip: clientIP, error: tokenErr.message });
      return res.status(401).json({ error: 'Token de primeiro login inválido.' });
    }

    // Valida que o token foi emitido para o propósito correto
    if (decoded.purpose !== 'first_login') {
      logger.logSecurityEvent('Token com propósito inválido usado no primeiro login', { ip: clientIP, purpose: decoded.purpose });
      return res.status(403).json({ error: 'Token inválido para esta operação.' });
    }

    const userId = decoded.id;
    const loginType = decoded.loginType;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    // Verifica que o usuário ainda está com senha padrão (previne replay)
    if (!user.senha_padrao) {
      logger.warn('Tentativa de primeiro login em conta já ativada', { userId, ip: clientIP });
      return res.status(400).json({ error: 'Esta conta já teve a senha alterada. Faça login normalmente.' });
    }

    user.senha = await bcryptjs.hash(novaSenha, 10);
    user.senha_padrao = false;
    await user.save();

    logger.info('Senha alterada no primeiro login', {
      userId: user.id,
      matricula: user.matricula,
      ip: clientIP
    });

    // pwv calculado APÓS a troca de senha — tokens antigos ficam inválidos
    const token = jwt.sign(
      { id: user.id, loginType: loginType, role: user.role, pwv: passwordVersion(user.senha) },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRATION }
    );

    const loginUser = await buildLoginUser(user, loginType);

    // Define o token como cookie httpOnly (protegido contra XSS)
    setTokenCookie(res, token);

    return res.json({ user: loginUser });
  } catch (error) {
    logger.error('Erro no primeiro login', {
      error: error.message,
      stack: error.stack,
      ip: clientIP
    });
    return res.status(500).json({ error: 'Erro interno' });
  }
};
// Exposto apenas para testes unitários do mecanismo de lockout (não usar em
// código de produção). Permite exercitar a janela deslizante e o limite.
exports.__lockout = {
  checkLockout,
  recordFailedAttempt,
  clearAttempts,
  MAX_LOGIN_ATTEMPTS,
  ATTEMPT_WINDOW_MS,
  LOCKOUT_DURATION_MS,
};
