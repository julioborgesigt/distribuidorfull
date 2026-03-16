// /utils/cookieHelper.js
// Configuração centralizada do cookie JWT httpOnly

const JWT_EXPIRATION = process.env.JWT_EXPIRATION || '2h';

/**
 * Converte a string de expiração JWT (ex: '2h', '7d') para milissegundos
 */
const parseExpirationToMs = (expiration) => {
  const match = expiration.match(/^(\d+)([smhd])$/);
  if (!match) return 2 * 60 * 60 * 1000; // fallback: 2h

  const value = parseInt(match[1], 10);
  const unit = match[2];

  switch (unit) {
    case 's': return value * 1000;
    case 'm': return value * 60 * 1000;
    case 'h': return value * 60 * 60 * 1000;
    case 'd': return value * 24 * 60 * 60 * 1000;
    default: return 2 * 60 * 60 * 1000;
  }
};

/**
 * Define o cookie JWT httpOnly na resposta
 * @param {Object} res - Objeto de resposta Express
 * @param {string} token - Token JWT
 */
const setTokenCookie = (res, token) => {
  const isProduction = process.env.NODE_ENV === 'production';
  const maxAge = parseExpirationToMs(JWT_EXPIRATION);

  res.cookie('token', token, {
    httpOnly: true,              // Não acessível via JavaScript (protege contra XSS)
    secure: isProduction,        // HTTPS only em produção
    sameSite: isProduction ? 'strict' : 'lax', // Proteção CSRF
    maxAge,                      // Expira junto com o JWT
    path: '/',                   // Disponível em todas as rotas
  });
};

/**
 * Remove o cookie JWT da resposta
 * @param {Object} res - Objeto de resposta Express
 */
const clearTokenCookie = (res) => {
  const isProduction = process.env.NODE_ENV === 'production';

  res.cookie('token', '', {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'strict' : 'lax',
    maxAge: 0,
    path: '/',
  });
};

module.exports = { setTokenCookie, clearTokenCookie };
