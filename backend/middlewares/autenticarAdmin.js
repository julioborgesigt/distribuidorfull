// /middlewares/autenticarAdmin.js
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const logger = require('../utils/logger');
const { getRealIP, passwordVersion } = require('../utils/helpers');
const { COOKIE_NAME } = require('../utils/cookieHelper');

// Corrigido: Lendo o segredo das variáveis de ambiente
const JWT_SECRET = process.env.JWT_SECRET;

const autenticarAdmin = async (req, res, next) => {
  // Prioridade: cookie httpOnly > header Authorization (fallback)
  let token = req.cookies?.[COOKIE_NAME];

  if (!token) {
    const authHeader = req.headers['authorization'];
    if (authHeader) {
      token = authHeader.split(' ')[1];
    }
  }

  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  try {
    // 1. Decodifica o token (algoritmo fixado: impede downgrade/confusão de
    // algoritmo caso a biblioteca mude os defaults no futuro)
    const decoded = jwt.verify(token, JWT_SECRET, { algorithms: ['HS256'] });

    // 2. Busca o usuário no banco de dados
    const user = await User.findByPk(decoded.id);

    if (!user) {
      return res.status(401).json({ error: 'Sessão inválida. Faça login novamente.' });
    }

    // 2.1. VERSÃO DA SENHA: se a senha mudou depois que o token foi emitido
    // (reset, primeiro login, recadastro), o pwv não bate e a sessão antiga
    // é encerrada — sem isso, um token roubado valeria até expirar (2h)
    // mesmo após o reset da senha.
    if (decoded.pwv !== passwordVersion(user.senha)) {
      logger.logSecurityEvent('Token de sessão invalidado por troca de senha', {
        userId: user.id,
        matricula: user.matricula,
        ip: getRealIP(req)
      });
      return res.status(401).json({ error: 'Sessão expirada por troca de senha. Faça login novamente.' });
    }

    // 3. VERIFICAÇÃO DE PERMISSÃO
    // Todo usuário tem um papel válido (super, admin_unidade ou servidor) e
    // pode acessar o painel; o que ele ENXERGA é limitado pelo escopo de
    // unidade/usuário nos controllers. Um papel ausente/inválido é barrado.
    const PAPEIS_VALIDOS = ['super', 'admin_unidade', 'servidor'];
    if (!PAPEIS_VALIDOS.includes(user.role)) {
      logger.logSecurityEvent('Tentativa de acesso admin sem papel válido', {
        userId: user.id,
        matricula: user.matricula,
        role: user.role,
        ip: getRealIP(req),
        attemptedRoute: req.url
      });
      return res.status(403).json({ error: 'Acesso proibido. Requer privilégios de administrador.' });
    }

    // Coerência de sessão: um super que rebaixou de papel (ou vice-versa) não
    // deve continuar operando como super com um token antigo. Se o token diz
    // 'admin_super' mas o papel atual no banco não é 'super', encerra a sessão.
    if ((decoded.loginType || 'admin_padrao') === 'admin_super' && user.role !== 'super') {
      logger.logSecurityEvent('Token admin_super com papel divergente no banco', {
        userId: user.id,
        matricula: user.matricula,
        role: user.role,
        ip: getRealIP(req)
      });
      return res.status(401).json({ error: 'Sessão inválida. Faça login novamente.' });
    }

    // 4. Se passou, anexa os dados na requisição para os controllers usarem.
    // role e unidade_id vêm do BANCO (autoritativo), nunca do cliente.
    req.user = user;
    req.userId = user.id;
    req.role = user.role;
    req.unidadeId = user.unidade_id;
    // Anexa o tipo de login que foi usado (super ou padrao)
    req.loginType = decoded.loginType || 'admin_padrao';

    next(); // Permite o acesso à rota de admin

  } catch (err) {
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
      logger.warn('Token JWT inválido ou expirado', {
        error: err.message,
        ip: getRealIP(req),
        url: req.url
      });
      // 401 (não 403): o interceptor do frontend faz logout automático em 401,
      // então sessão expirada volta para a tela de login em vez de travar a UI
      return res.status(401).json({ error: 'Token inválido ou expirado' });
    }
    // Erro inesperado
    logger.error('Erro no middleware de autenticação admin', {
      error: err.message,
      stack: err.stack,
      ip: getRealIP(req),
      url: req.url
    });
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

module.exports = autenticarAdmin;