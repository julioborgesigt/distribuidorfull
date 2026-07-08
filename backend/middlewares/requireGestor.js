// /middlewares/requireGestor.js
// Exige que o usuário seja gestor: super global OU admin da unidade.
// Servidores (que só enxergam os próprios processos) são barrados.
// Deve ser usado depois de autenticarAdmin (que popula req.role/req.loginType).

const logger = require('../utils/logger');
const { getRealIP } = require('../utils/helpers');

const requireGestor = (req, res, next) => {
  const ok = req.loginType === 'admin_super' || req.role === 'super' || req.role === 'admin_unidade';
  if (!ok) {
    logger.logSecurityEvent('Tentativa de operação restrita a gestores', {
      userId: req.userId,
      matricula: req.user?.matricula,
      role: req.role,
      loginType: req.loginType,
      ip: getRealIP(req),
      attemptedRoute: req.originalUrl,
    });
    return res.status(403).json({ error: 'Acesso negado. Requer administrador de unidade ou super.' });
  }
  next();
};

module.exports = requireGestor;
