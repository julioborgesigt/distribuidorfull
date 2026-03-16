// /controllers/authController.js (Apenas Admin)
const crypto = require('crypto');
const { User } = require('../models');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');
const { getRealIP } = require('../utils/helpers');
const { setTokenCookie, clearTokenCookie } = require('../utils/cookieHelper');
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRATION = process.env.JWT_EXPIRATION || '2h';

exports.login = async (req, res) => {
  const { matricula, senha, loginType } = req.body;
  const clientIP = getRealIP(req);

  logger.info('Tentativa de login', { matricula, loginType, ip: clientIP });

  // --- 1. VALIDAÇÃO DO TIPO DE LOGIN (NOVO) ---
  // Exige que o loginType seja especificado como admin
  if (!loginType || (loginType !== 'admin_super' && loginType !== 'admin_padrao')) {
    return res.status(400).json({ error: 'Tipo de login (loginType) é obrigatório e deve ser admin_super ou admin_padrao.' });
  }

  try {
    const user = await User.findOne({ where: { matricula } });
    if (!user) {
      logger.logAuthAttempt(false, matricula, clientIP, 'Usuário não encontrado');
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    // --- 2. VALIDAÇÃO DE PERMISSÃO (MODIFICADO) ---
    // Verifica se o usuário TEM a permissão que ele ESTÁ PEDINDO
    let effectiveLoginType = null;

    if (loginType === 'admin_super' && user.admin_super) {
        effectiveLoginType = 'admin_super';
    } else if (loginType === 'admin_padrao' && (user.admin_padrao || user.admin_super)) {
        // Um admin_super pode logar como admin_padrao
        effectiveLoginType = 'admin_padrao';
    }

    // Se, após as verificações, ele não for um admin válido, rejeita.
    if (!effectiveLoginType) {
        logger.logAuthAttempt(false, matricula, clientIP, 'Permissão insuficiente');
        logger.logSecurityEvent('Tentativa de acesso sem permissão', { matricula, loginType, ip: clientIP });
        return res.status(403).json({ error: 'Acesso negado. O usuário não possui as permissões de administrador solicitadas.' });
    }
    // --- Fim da validação de permissão ---

    // Verificação de senha (assíncrona para não bloquear o event loop)
    const senhaValida = await bcryptjs.compare(senha, user.senha);
    if (!senhaValida) {
      logger.logAuthAttempt(false, matricula, clientIP, 'Senha incorreta');
      return res.status(401).json({ error: 'Senha incorreta' });
    }

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
      const token = jwt.sign({ id: user.id, loginType: effectiveLoginType }, JWT_SECRET, { expiresIn: JWT_EXPIRATION });

      let loginUser = {
        id: user.id,
        matricula: user.matricula,
        nome: user.nome,
        admin_padrao: user.admin_padrao,
        admin_super: user.admin_super
      };

      if (effectiveLoginType === 'admin_padrao') {
        loginUser.admin_super = false;
      }

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
      decoded = jwt.verify(firstLoginToken, JWT_SECRET);
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

    const token = jwt.sign({ id: user.id, loginType: loginType }, JWT_SECRET, { expiresIn: JWT_EXPIRATION });

    let loginUser = {
      id: user.id,
      matricula: user.matricula,
      nome: user.nome,
      admin_padrao: user.admin_padrao,
      admin_super: user.admin_super
    };

    if (loginType === 'admin_padrao') {
      loginUser.admin_super = false;
    }

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