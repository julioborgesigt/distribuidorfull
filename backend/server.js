// server.js (Apenas Admin)
require('dotenv').config({ path: __dirname + '/.env' });
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./utils/swagger');
const { sequelize } = require('./models');
const adminRoutes = require('./routes/admin');
const authRoutes = require('./routes/auth');
const logger = require('./utils/logger');
const {
  errorHandler,
  notFoundHandler,
  httpLogger,
  validateJSON
} = require('./middlewares/errorHandler');
const { sanitizeInput } = require('./middlewares/sanitizer');
const {
  validateAjaxHeader,
  validateOriginForCriticalOps,
  addSecurityHeaders
} = require('./middlewares/csrfProtection');
// const userRoutes = require('./routes/user'); // REMOVIDO

// Validação de Variáveis de Ambiente Obrigatórias
const requiredEnvVars = ['DB_HOST', 'DB_USER', 'DB_PASS', 'DB_NAME', 'JWT_SECRET'];
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
if (missingVars.length > 0) {
  logger.error(`Variáveis de ambiente obrigatórias não definidas: ${missingVars.join(', ')}`);
  process.exit(1);
}

const app = express();

app.set('trust proxy', 1); // Confiar apenas no primeiro proxy reverso (DomCloud/Nginx)
// Configuração de Segurança - Helmet
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", ...(process.env.NODE_ENV !== 'production' ? ["'unsafe-inline'"] : [])],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'", "https://cdn.jsdelivr.net", "https://fonts.googleapis.com", "https://fonts.gstatic.com"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  crossOriginEmbedderPolicy: false, // Permite embedding se necessário
}));

// ✅ Compressão HTTP com gzip
app.use(compression());

// Configuração de CORS Segura
// Em produção, não permitir localhost; em desenvolvimento, incluir para facilitar
const isProduction = process.env.NODE_ENV === 'production';
const allowedOrigins = [
  ...(isProduction ? [] : ['http://localhost:3000', 'http://localhost:3001']),
  process.env.FRONTEND_URL,
  process.env.FRONTEND_URL_2,
  process.env.FRONTEND_URL_3
].filter(Boolean);

// Log das origens permitidas na inicialização
logger.info('Origens CORS permitidas:', { origins: allowedOrigins });

app.use(cors({
  origin: function (origin, callback) {
    // Log de debugging para ver qual origem está tentando acessar
    logger.debug('CORS - Requisição de origem:', {
      origin: origin || 'sem origin',
      allowed: allowedOrigins
    });

    // Permite requisições sem origin (Postman, curl, apps mobile, etc.)
    if (!origin) {
      logger.debug('CORS - Requisição sem origin permitida');
      return callback(null, true);
    }

    // Verifica se a origem está na lista de permitidas
    if (allowedOrigins.includes(origin)) {
      logger.debug('CORS - Origem permitida:', { origin });
      return callback(null, true);
    }

    // Origem não permitida
    logger.warn('CORS - Origem bloqueada:', {
      origin,
      allowedOrigins
    });

    // Retornar erro detalhado
    const error = new Error(`Origem não permitida pelo CORS: ${origin}`);
    error.statusCode = 403;
    callback(error);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  maxAge: 600 // Cache da preflight request por 10 minutos
}));

// Validação e parsing de PORT
const PORT = parseInt(process.env.PORT, 10) || 3000;
if (PORT < 1 || PORT > 65535) {
  logger.error(`Porta inválida: ${PORT}. Deve estar entre 1 e 65535.`);
  process.exit(1);
}

// Middleware de logging HTTP
app.use(httpLogger);

// Parsers de JSON, URL-encoded e cookies
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(cookieParser());

// Middleware para validar JSON
app.use(validateJSON);

// Middleware de sanitização XSS
app.use(sanitizeInput);

// Middlewares de proteção CSRF e segurança adicional
app.use(addSecurityHeaders);
app.use(validateAjaxHeader);
app.use(validateOriginForCriticalOps);

// --- 1. ROTAS DE API ---
// Todas as suas rotas de API (agora apenas admin e auth)
app.use('/api/admin', adminRoutes);
app.use('/api/auth', authRoutes);
// app.use('/api/user', userRoutes); // REMOVIDO

// --- DOCUMENTAÇÃO SWAGGER/OpenAPI ---
// Swagger UI disponível apenas em desenvolvimento (não expor em produção)
if (process.env.NODE_ENV !== 'production') {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Distribuidor API Docs'
  }));
  logger.info('Swagger UI disponível em /api-docs');
} else {
  logger.info('Swagger UI desabilitado em produção');
}

// --- 2. ARQUIVOS ESTÁTICOS DO FRONT-END ---
const frontendDist = path.join(__dirname, '../frontend/dist');
app.use(express.static(frontendDist, {
  maxAge: '1y', // Vite gera nomes com hash → cache longo é seguro
  etag: true,
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('index.html')) {
      // index.html nunca deve ser cacheado (ponto de entrada do SPA)
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    }
  }
}));

// SPA fallback: rotas não-API retornam o index.html do Vue
app.get(/^(?!\/api|\/api-docs|\/health).*$/, (req, res) => {
  res.sendFile(path.join(frontendDist, 'index.html'));
});

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Healthcheck do sistema
 *     description: Retorna status de saúde do servidor, banco de dados e métricas
 *     tags: [Sistema]
 *     security: []
 *     responses:
 *       200:
 *         description: Sistema saudável
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HealthCheck'
 *       503:
 *         description: Sistema com problemas
 */
app.get('/health', async (req, res) => {
  const healthcheck = {
    uptime: process.uptime(),
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    version: require('./package.json').version,
    database: 'unknown',
    memory: {
      used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
      total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
      unit: 'MB'
    }
  };

  try {
    // Testa conexão com banco de dados
    await sequelize.authenticate();
    healthcheck.database = 'connected';

    res.status(200).json(healthcheck);
  } catch (error) {
    logger.error('Healthcheck falhou - Database disconnected', { error: error.message });

    healthcheck.status = 'error';
    healthcheck.database = 'disconnected';
    healthcheck.error = error.message;

    res.status(503).json(healthcheck);
  }
});

// --- MIDDLEWARE DE ERRO ---
// Deve vir DEPOIS de todas as rotas

// 404 - Rota não encontrada
app.use(notFoundHandler);

// Tratamento de erros global
app.use(errorHandler);

// --- 3. INICIAR SERVIDOR ---
// O schema é gerenciado por MIGRATIONS (npm run db:migrate), não por sync().
// sync()/alter em produção já causou índices duplicados no MySQL — toda
// mudança de schema deve ser uma nova migration em backend/migrations/.

// Variável para armazenar a referência do servidor
let server;

sequelize.authenticate()
  .then(() => {
    logger.info('Conexão com o banco de dados estabelecida');

    // Inicia o servidor e guarda referência
    server = app.listen(PORT, () => {
      logger.info(`Servidor API rodando na porta ${PORT}`);
      logger.info(`Ambiente: ${process.env.NODE_ENV || 'development'}`);
      logger.info(`Logs salvos em: ./logs/`);
    });
  })
  .catch(err => {
    logger.error('Erro ao conectar ao banco de dados', {
      error: err.message,
      stack: err.stack
    });
    process.exit(1);
  });

// Tratamento de erros não capturados
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection', {
    reason,
    promise
  });
});

process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception', {
    error: error.message,
    stack: error.stack
  });
  process.exit(1);
});

// ✅ GRACEFUL SHUTDOWN
// Função para fechar conexões gracefully
const gracefulShutdown = async (signal) => {
  logger.info(`${signal} recebido. Iniciando shutdown graceful...`);

  if (!server) {
    logger.warn('Servidor ainda não foi iniciado');
    process.exit(0);
  }

  // Fecha o servidor HTTP (para de aceitar novas conexões)
  server.close(async () => {
    logger.info('Servidor HTTP fechado (não aceita mais conexões)');

    try {
      // Fecha conexão com o banco de dados
      await sequelize.close();
      logger.info('Conexão com banco de dados fechada');

      logger.info('Shutdown graceful concluído com sucesso');
      process.exit(0);
    } catch (err) {
      logger.error('Erro ao fechar conexões durante shutdown', {
        error: err.message,
        stack: err.stack
      });
      process.exit(1);
    }
  });

  // Timeout de segurança: forçar shutdown após 10 segundos
  setTimeout(() => {
    logger.error('Shutdown forçado após timeout de 10 segundos');
    process.exit(1);
  }, 10000);
};

// Escutar sinais de término
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
