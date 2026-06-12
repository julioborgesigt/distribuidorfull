// /middlewares/requireSuperAdmin.js
// Exige que a sessão atual seja de admin_super.
// Deve ser usado SEMPRE depois de autenticarAdmin, que popula req.loginType.
//
// Importante: a checagem é feita sobre req.loginType (o tipo escolhido no login),
// não sobre user.admin_super. Isso preserva o princípio de menor privilégio já
// adotado no fluxo de login — um admin_super que entrou como admin_padrao opera
// sem privilégios de super até reautenticar como super.

const logger = require('../utils/logger');
const { getRealIP } = require('../utils/helpers');

const requireSuperAdmin = (req, res, next) => {
  if (req.loginType !== 'admin_super') {
    logger.logSecurityEvent('Tentativa de operação restrita a admin_super', {
      userId: req.userId,
      matricula: req.user?.matricula,
      loginType: req.loginType,
      ip: getRealIP(req),
      attemptedRoute: req.originalUrl
    });
    return res.status(403).json({ error: 'Acesso negado. Requer privilégios de administrador máster.' });
  }
  next();
};

module.exports = requireSuperAdmin;
