// Middleware de proteção CSRF e validações de origem
// NOTA: a autenticação primária é via cookie JWT httpOnly (ver cookieHelper.js
// e autenticarAdmin.js — o header Authorization é só um fallback). Como
// cookies SÃO enviados automaticamente em requisições cross-site pelo
// navegador, CSRF é sim uma preocupação real aqui. As defesas em camadas são:
// 1. Cookie com SameSite=Strict em produção (cookieHelper.js) — o navegador
//    nem envia o cookie em requisições cross-site.
// 2. Allowlist estrita de Origin no CORS global (server.js) — bloqueia
//    qualquer requisição (não só preflight) de origem não cadastrada.
// 3. Validação extra de Origin/Referer para as operações mais sensíveis
//    (abaixo), como defesa em profundidade caso as duas acima sejam
//    enfraquecidas no futuro.
// 4. Rate limiting nas operações sensíveis.

const logger = require('../utils/logger');
const { getRealIP } = require('../utils/helpers');

/**
 * Valida Origin/Referer para operações críticas
 * Útil como defesa em profundidade
 */
const validateOriginForCriticalOps = (req, res, next) => {
  // Lista de operações críticas que requerem validação extra.
  // Inclui criação de conta e troca/remoção de credenciais do PJe: são pelo
  // menos tão sensíveis quanto reset-password/delete-matricula (criar um
  // admin_super ou sequestrar as credenciais do PJe), mas ficaram de fora
  // dessa lista até esta revisão.
  const criticalPaths = [
    '/api/admin/delete-matricula',
    '/api/admin/bulk-delete',
    '/api/admin/reset-password',
    '/api/admin/pre-cadastro',
    '/api/admin/pje-auth/salvar',
    '/api/admin/pje-auth'
  ];

  // Verifica se é uma operação crítica
  const isCritical = criticalPaths.some(path => req.path === path);

  if (!isCritical) {
    return next();
  }

  const isProduction = process.env.NODE_ENV === 'production';
  const origin = req.headers.origin || req.headers.referer;
  // Localhost só é aceitável fora de produção — mesma regra do CORS em
  // server.js. Mantê-lo em produção permitiria que um app local malicioso
  // na máquina da vítima passasse por esta camada.
  const allowedOrigins = [
    ...(isProduction ? [] : ['http://localhost:3000', 'http://localhost:3001']),
    process.env.FRONTEND_URL,
    process.env.FRONTEND_URL_2,
    process.env.FRONTEND_URL_3
  ].filter(Boolean);

  // Sem Origin/Referer: navegadores modernos sempre enviam Origin em
  // requisições não-GET, então em produção a ausência indica cliente
  // não-navegador (curl/script) — que não deveria executar operações
  // críticas com cookie de sessão. Em desenvolvimento apenas loga.
  if (!origin) {
    if (isProduction) {
      logger.logSecurityEvent('Operação crítica sem Origin/Referer bloqueada', {
        path: req.path,
        method: req.method,
        ip: getRealIP(req),
        userId: req.userId
      });
      return res.status(403).json({ error: 'Origem não permitida para esta operação' });
    }
    logger.warn('Operação crítica sem Origin/Referer (permitida fora de produção)', {
      path: req.path,
      method: req.method,
      ip: getRealIP(req),
      userId: req.userId
    });
    return next();
  }

  // Valida se o origin está na lista de permitidos.
  // Comparação estrita por origem (scheme + host + porta). Se o header não
  // for uma URL parseável, NEGA — o antigo fallback por substring
  // (origin.includes(allowed)) era contornável com um header malformado
  // contendo a URL permitida em qualquer posição.
  const isAllowed = allowedOrigins.some(allowed => {
    try {
      const originUrl = new URL(origin);
      const allowedUrl = new URL(allowed);
      return originUrl.origin === allowedUrl.origin;
    } catch {
      return false;
    }
  });

  if (!isAllowed) {
    logger.logSecurityEvent('Operação crítica de origem não permitida bloqueada', {
      path: req.path,
      method: req.method,
      origin: origin,
      ip: getRealIP(req),
      userId: req.userId
    });

    return res.status(403).json({
      error: 'Origem não permitida para esta operação'
    });
  }

  next();
};

/**
 * Middleware que adiciona headers de segurança relacionados a CSRF
 */
const addSecurityHeaders = (req, res, next) => {
  // Previne que a página seja embutida em iframes (Clickjacking)
  res.setHeader('X-Frame-Options', 'DENY');

  // Previne MIME type sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');

  next();
};

module.exports = {
  validateOriginForCriticalOps,
  addSecurityHeaders
};
