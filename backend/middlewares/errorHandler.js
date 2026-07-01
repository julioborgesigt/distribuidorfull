// /middlewares/errorHandler.js
// Middleware global de tratamento de erros

const logger = require('../utils/logger');

/**
 * Sanitiza o body da requisição removendo campos sensíveis antes de logar.
 * Casa por SUBSTRING (case-insensitive) em vez de nomes exatos — uma lista de
 * nomes exatos já ficou desatualizada uma vez (o campo `cpf` das credenciais
 * do PJe não estava coberto) e vai ficar de novo a cada campo novo. Cobrindo
 * por padrão (senha/password, token/jwt, cpf/cnpj) reduz a chance de um
 * futuro campo sensível vazar para os logs sem ninguém lembrar de atualizar
 * esta lista.
 * @param {Object} body - Body da requisição
 * @returns {Object} Body sanitizado
 */
const SENSITIVE_FIELD_PATTERN = /senha|password|token|jwt|secret|cpf|cnpj/i;

// Recursivo: um body aninhado (ex.: { user: { senha } }) também precisa ser
// redigido — a versão anterior só cobria o primeiro nível. maxDepth evita
// custo excessivo em payloads patológicos (JSON não tem ciclos).
const sanitizeBodyForLog = (body, depth = 0) => {
  if (!body || typeof body !== 'object' || depth > 5) return body;

  if (Array.isArray(body)) {
    return body.map(item => sanitizeBodyForLog(item, depth + 1));
  }

  const sanitized = { ...body };

  Object.keys(sanitized).forEach(field => {
    if (sanitized[field] && SENSITIVE_FIELD_PATTERN.test(field)) {
      sanitized[field] = '[REDACTED]';
    } else if (sanitized[field] && typeof sanitized[field] === 'object') {
      sanitized[field] = sanitizeBodyForLog(sanitized[field], depth + 1);
    }
  });

  return sanitized;
};

// Middleware para tratar erros não capturados
const errorHandler = (err, req, res, next) => {
  // Log do erro (com body sanitizado)
  logger.error(`Error: ${err.message}`, {
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userId: req.userId || 'anonymous',
    body: sanitizeBodyForLog(req.body),
  });

  // Determinar status code
  const statusCode = err.statusCode || err.status || 500;

  // Em produção, erros 5xx retornam mensagem genérica: err.message de erros
  // não tratados (Sequelize, bibliotecas) pode expor detalhes internos
  // (tabelas, caminhos) a clientes não autenticados. O detalhe completo já
  // foi logado acima.
  const hideDetails = statusCode >= 500 && process.env.NODE_ENV === 'production';

  // Preparar resposta
  const response = {
    error: hideDetails ? 'Erro interno do servidor' : (err.message || 'Erro interno do servidor'),
    status: statusCode,
  };

  // Em desenvolvimento, incluir stack trace
  if (process.env.NODE_ENV === 'development') {
    response.stack = err.stack;
    response.details = err.details || null;
  }

  // Enviar resposta
  res.status(statusCode).json(response);
};

// Middleware para tratar rotas não encontradas (404)
const notFoundHandler = (req, res, next) => {
  const error = new Error(`Rota não encontrada: ${req.method} ${req.url}`);
  error.statusCode = 404;

  logger.warn(`404 - Rota não encontrada: ${req.method} ${req.url}`, {
    ip: req.ip,
    userId: req.userId || 'anonymous',
  });

  next(error);
};

// Middleware para logar requisições HTTP
const httpLogger = (req, res, next) => {
  const start = Date.now();

  // Capturar quando a resposta for enviada
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.logRequest(req, res, duration);
  });

  next();
};

// Middleware para validar se é JSON válido
const validateJSON = (err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    logger.warn('JSON inválido recebido', {
      url: req.url,
      method: req.method,
      ip: req.ip,
    });

    return res.status(400).json({
      error: 'JSON inválido no corpo da requisição',
    });
  }

  next(err);
};

module.exports = {
  errorHandler,
  notFoundHandler,
  httpLogger,
  validateJSON,
};
