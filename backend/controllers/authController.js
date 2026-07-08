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

// Hierarquia de autoridade dos papéis (para limitar o modo escolhido no login
// ao teto do papel real e para validar tokens em autenticarAdmin).
const ROLE_AUTHORITY = { servidor: 0, admin_unidade: 1, super: 2 };

// Resolve o "modo de acesso" pedido no login (personal x gestão) ao PAPEL REAL
// do usuário, devolvendo o papel/privilégio EFETIVO da sessão:
//   - modo 'usuario'  → sempre opera como usuário comum (só os próprios processos).
//   - modo 'unidade'  → opera na plenitude do papel: admin_unidade vê a unidade;
//                       super (admin global) vê TODAS as unidades.
//   - servidor sempre opera como usuário, independentemente do modo pedido.
function resolveSession(realRole, modo) {
  const querGestao = modo === 'unidade';
  if (realRole === 'super') {
    return querGestao
      ? { role: 'super', loginType: 'admin_super' }        // admin global
      : { role: 'servidor', loginType: 'admin_padrao' };   // modo pessoal
  }
  if (realRole === 'admin_unidade') {
    return querGestao
      ? { role: 'admin_unidade', loginType: 'admin_padrao' }
      : { role: 'servidor', loginType: 'admin_padrao' };
  }
  // servidor: sem autoridade de gestão — sempre pessoal.
  return { role: 'servidor', loginType: 'admin_padrao' };
}

// Monta o objeto de usuário devolvido ao frontend após o login.
// `session` é o resultado de resolveSession (papel/privilégio EFETIVO).
async function buildLoginUser(user, session) {
  let unidadeNome = null;
  if (user.unidade_id) {
    try {
      const u = await Unidade.findByPk(user.unidade_id, { attributes: ['nome'] });
      unidadeNome = u ? u.nome : null;
    } catch { /* não-crítico */ }
  }
  return {
    id: user.id,
    matricula: user.matricula,
    nome: user.nome,
    // Papel/privilégio EFETIVO desta sessão (não necessariamente o do banco:
    // um gestor pode ter entrado em modo usuário).
    role: session.role,
    admin_super: session.loginType === 'admin_super',
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
  const { matricula, senha } = req.body;
  const clientIP = getRealIP(req);

  logger.info('Tentativa de login', { matricula, ip: clientIP });

  // --- 0. VERIFICAÇÃO DE LOCKOUT ---
  const lockStatus = checkLockout(clientIP, matricula);
  if (lockStatus.locked) {
    logger.warn('Tentativa de login em conta bloqueada', { matricula, ip: clientIP });
    return res.status(429).json({
      error: `Conta temporariamente bloqueada por tentativas excessivas. Tente novamente em ${lockStatus.remainingMinutes} minuto(s).`
    });
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

    // --- 3. PRIVILÉGIO DA SESSÃO (papel efetivo = modo escolhido ∩ papel real) ---
    // `modo` vem do login: 'usuario' (ver só os próprios) ou 'unidade' (operar
    // na plenitude do papel). resolveSession limita o modo ao teto do papel
    // real: servidor sempre entra como usuário; admin_unidade em modo 'unidade'
    // vê a sua unidade; super (admin global) em modo 'unidade' vê TODAS.
    // (as tentativas já foram zeradas ao validar a senha)
    const modo = req.body.modo === 'unidade' ? 'unidade' : 'usuario';
    const session = resolveSession(user.role, modo);

    // Lógica de primeiro login
    if (user.senha_padrao) {
      // Gera um token JWT de curta duração (5 min) vinculado ao userId
      // para garantir que apenas quem fez o login pode trocar a senha
      const firstLoginToken = jwt.sign(
        { id: user.id, loginType: session.loginType, role: session.role, purpose: 'first_login' },
        JWT_SECRET,
        { expiresIn: '5m' }
      );
      logger.info('Primeiro login detectado', { userId: user.id, matricula });
      return res.json({ firstLogin: true, firstLoginToken, loginType: session.loginType });
    } else {
      logger.logAuthAttempt(true, matricula, clientIP);
      // pwv: versão da senha — invalida o token se a senha mudar (ver autenticarAdmin)
      // role no token = papel EFETIVO da sessão (pode ser menor que o do banco).
      const token = jwt.sign(
        { id: user.id, loginType: session.loginType, role: session.role, pwv: passwordVersion(user.senha) },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRATION }
      );

      const loginUser = await buildLoginUser(user, session);

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
    // Papel/privilégio EFETIVO escolhido no login (limitado ao papel real).
    const session = {
      loginType: decoded.loginType || 'admin_padrao',
      role: decoded.role || 'servidor',
    };

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
      { id: user.id, loginType: session.loginType, role: session.role, pwv: passwordVersion(user.senha) },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRATION }
    );

    const loginUser = await buildLoginUser(user, session);

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

// Exposto para testes: mapeamento do modo de acesso × papel real.
exports.__resolveSession = resolveSession;
