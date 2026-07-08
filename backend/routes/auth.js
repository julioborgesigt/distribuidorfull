// /routes/auth.js (Apenas Admin)
const express = require('express');
const rateLimit = require('express-rate-limit');
const router = express.Router();
const authController = require('../controllers/authController');
const { validateLogin, validateFirstLogin } = require('../middlewares/validators');

// Rate Limiter POR IP contra flood/força-bruta distribuída (muitas matrículas
// a partir do mesmo IP). É uma rede de segurança grosseira; a proteção fina,
// por conta, é o lockout por (IP + matrícula) no authController.
//
// IMPORTANTE:
// - `skipSuccessfulRequests: true` → só conta tentativas que FALHARAM (status
//   >= 400). Logins corretos NUNCA contam, então usar o sistema normalmente
//   (vários logins/logouts) jamais bloqueia.
// - o teto é alto e por IP: numa rede compartilhada (lanhouse/NAT) vários
//   servidores dividem o mesmo IP, então precisa tolerar erros ocasionais de
//   todos sem travar a rede inteira. Ajustável por LOGIN_IP_MAX_FAILURES.
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: parseInt(process.env.LOGIN_IP_MAX_FAILURES, 10) || 50,
  skipSuccessfulRequests: true,
  message: {
    error: 'Muitas tentativas de login malsucedidas a partir deste endereço. Tente novamente em alguns minutos.'
  },
  standardHeaders: true, // Retorna informações de rate limit nos headers
  legacyHeaders: false, // Desabilita headers X-RateLimit-*
});

// Rate Limiter para Primeiro Login. Também só conta falhas — concluir a troca
// de senha (sucesso) não penaliza.
const firstLoginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: parseInt(process.env.FIRST_LOGIN_IP_MAX_FAILURES, 10) || 10,
  skipSuccessfulRequests: true,
  message: {
    error: 'Muitas tentativas de troca de senha malsucedidas. Tente novamente em alguns minutos.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Autenticação de administrador
 *     description: Realiza login de usuário administrador (admin_padrao ou admin_super)
 *     tags: [Autenticação]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login realizado com sucesso ou primeiro login detectado
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - $ref: '#/components/schemas/LoginResponse'
 *                 - $ref: '#/components/schemas/FirstLoginResponse'
 *       401:
 *         description: Matrícula ou senha incorretos (resposta única para evitar enumeração de usuários)
 *       403:
 *         description: Acesso negado - sem permissão de administrador
 *       429:
 *         description: Muitas tentativas de login
 */
router.post('/login', loginLimiter, validateLogin, authController.login);

/**
 * @swagger
 * /api/auth/primeiro-login:
 *   post:
 *     summary: Troca de senha no primeiro acesso
 *     description: Permite que o usuário altere a senha padrão no primeiro login
 *     tags: [Autenticação]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [firstLoginToken, novaSenha]
 *             properties:
 *               firstLoginToken:
 *                 type: string
 *                 description: Token temporário recebido no login quando senha_padrao é true
 *                 example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *               novaSenha:
 *                 type: string
 *                 format: password
 *                 example: NovaSenhaForte123
 *     responses:
 *       200:
 *         description: Senha alterada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       404:
 *         description: Usuário não encontrado
 *       429:
 *         description: Muitas tentativas de troca de senha
 */
router.post('/primeiro-login', firstLoginLimiter, validateFirstLogin, authController.firstLogin);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout
 *     description: Remove o cookie de autenticação httpOnly
 *     tags: [Autenticação]
 *     security: []
 *     responses:
 *       200:
 *         description: Logout realizado com sucesso
 */
router.post('/logout', authController.logout);

module.exports = router;