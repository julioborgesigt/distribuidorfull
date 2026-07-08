// /utils/helpers.js
// Funções auxiliares reutilizáveis

const crypto = require('crypto');

/**
 * Deriva a "versão da senha" de um usuário a partir do hash bcrypt armazenado.
 * O valor é embutido no JWT (claim pwv); quando a senha muda (reset, primeiro
 * login, recadastro), o hash muda e todos os tokens antigos deixam de valer.
 * Não expõe nada do hash original (sha256 truncado).
 * @param {string} senhaHash - Hash bcrypt armazenado em user.senha
 * @returns {string} Identificador curto da versão da senha
 */
const passwordVersion = (senhaHash) => {
  return crypto.createHash('sha256').update(String(senhaHash)).digest('hex').slice(0, 16);
};

// Formatos de expiração aceitos pelo jsonwebtoken (biblioteca vercel/ms):
// "120", "2h", "30m", "7d", "2 days" etc.
const JWT_EXPIRATION_PATTERN =
  /^\d+\s*(ms|s|m|h|d|w|y|msecs?|secs?|mins?|hrs?|milliseconds?|seconds?|minutes?|hours?|days?|weeks?|years?)?$/i;

/**
 * Retorna JWT_EXPIRATION validado, com fallback seguro para '2h'.
 * Um valor inválido (typo tipo "2hs", ou um placeholder "${JWT_EXPIRATION}"
 * não substituído pelo template de deploy) faria jwt.sign LANÇAR — ou seja,
 * TODOS os logins retornariam 500. Melhor degradar para o default e avisar.
 * @returns {string} Expiração válida para jwt.sign
 */
const getJwtExpiration = () => {
  const raw = (process.env.JWT_EXPIRATION || '').trim();
  if (!raw) return '2h';
  if (!JWT_EXPIRATION_PATTERN.test(raw)) return '2h';
  return raw;
};

/**
 * Converte filtros de query (string ou array) para array
 * @param {string|string[]} val - Valor do filtro
 * @returns {string[]|null} Array de valores ou null
 */
const parseArrayFilter = (val) => {
  if (!val) return null;
  return Array.isArray(val) ? val : [val];
};

/**
 * Valida se uma senha atende aos requisitos mínimos
 * @param {string} senha - Senha a ser validada
 * @returns {boolean} True se válida
 */
const isValidPassword = (senha) => {
  // Mínimo 8 caracteres, pelo menos uma maiúscula, uma minúscula e um número
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return regex.test(senha);
};

/**
 * Extrai o IP real da requisição.
 * Usa req.ip, que o Express resolve corretamente a partir da configuração
 * `trust proxy` (ver server.js). Como confiamos apenas em 1 hop de proxy,
 * o cliente não consegue forjar o IP via cabeçalho X-Forwarded-For — algo
 * que importa porque o rate limit e o lockout de login são por IP.
 * @param {Object} req - Objeto de requisição Express
 * @returns {string} IP do cliente
 */
const getRealIP = (req) => {
  return req.ip || req.socket?.remoteAddress || 'unknown';
};

/**
 * Valida CPF brasileiro (formato e dígitos verificadores)
 * @param {string} cpf - CPF a ser validado (com ou sem máscara)
 * @returns {boolean} True se CPF válido
 */
const isValidCPF = (cpf) => {
  if (!cpf) return false;

  // Remove caracteres não numéricos
  const cleanCPF = cpf.replace(/[^\d]/g, '');

  // CPF deve ter exatamente 11 dígitos
  if (cleanCPF.length !== 11) return false;

  // Rejeita CPFs com todos os dígitos iguais
  if (/^(\d)\1{10}$/.test(cleanCPF)) return false;

  // Validação dos dígitos verificadores
  let sum = 0;
  let remainder;

  // Valida primeiro dígito verificador
  for (let i = 1; i <= 9; i++) {
    sum += parseInt(cleanCPF.substring(i - 1, i)) * (11 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleanCPF.substring(9, 10))) return false;

  sum = 0;
  // Valida segundo dígito verificador
  for (let i = 1; i <= 10; i++) {
    sum += parseInt(cleanCPF.substring(i - 1, i)) * (12 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleanCPF.substring(10, 11))) return false;

  return true;
};

/**
 * Formata um CPF para o padrão 000.000.000-00.
 * @param {string} cpf - CPF com ou sem máscara
 * @returns {string|null} CPF formatado, ou null se não tiver 11 dígitos
 */
const formatCPF = (cpf) => {
  if (!cpf) return null;
  const clean = cpf.replace(/[^\d]/g, '');
  if (clean.length !== 11) return null;
  return clean.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
};

/**
 * Gera uma senha aleatória segura que atende aos requisitos do sistema
 * (mín. 8 caracteres, pelo menos uma maiúscula, uma minúscula e um número)
 * @param {number} length - Tamanho da senha (padrão: 10)
 * @returns {string} Senha aleatória
 */
const generateRandomPassword = (length = 10) => {
  const uppercase = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  const lowercase = 'abcdefghjkmnpqrstuvwxyz';
  const digits = '23456789';
  const allChars = uppercase + lowercase + digits;

  // Garante pelo menos 1 de cada tipo obrigatório
  let password = '';
  password += uppercase[crypto.randomInt(uppercase.length)];
  password += lowercase[crypto.randomInt(lowercase.length)];
  password += digits[crypto.randomInt(digits.length)];

  // Preenche o restante com caracteres aleatórios
  for (let i = password.length; i < length; i++) {
    password += allChars[crypto.randomInt(allChars.length)];
  }

  // Embaralha a senha para não ter padrão previsível (ex.: sempre maiúscula
  // primeiro). Fisher–Yates com crypto.randomInt: sort() com comparador
  // aleatório NÃO gera distribuição uniforme (viés bem conhecido, depende do
  // algoritmo de ordenação) — Fisher–Yates é o jeito correto de embaralhar.
  const chars = password.split('');
  for (let i = chars.length - 1; i > 0; i--) {
    const j = crypto.randomInt(i + 1);
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }
  return chars.join('');
};

// Assinaturas (magic bytes) de formatos binários comuns, usadas para
// detectar um arquivo disfarçado de CSV — o MIME type e a extensão que o
// multer valida vêm do CLIENTE (portanto falsificáveis); isto inspeciona o
// conteúdo real.
const BINARY_SIGNATURES = [
  Buffer.from('%PDF'),                      // PDF
  Buffer.from([0x50, 0x4b, 0x03, 0x04]),    // ZIP / Office (docx, xlsx, pptx...)
  Buffer.from([0x89, 0x50, 0x4e, 0x47]),    // PNG
  Buffer.from([0xff, 0xd8, 0xff]),          // JPEG
  Buffer.from('GIF8'),                      // GIF
  Buffer.from([0x7f, 0x45, 0x4c, 0x46]),    // ELF (binário Linux)
  Buffer.from('MZ'),                        // Windows PE/EXE
  Buffer.from([0x1f, 0x8b]),                // gzip
];

/**
 * Heurística leve para detectar arquivos binários disfarçados de CSV: checa
 * assinaturas de formatos binários comuns e a presença de bytes NUL, que não
 * deveriam aparecer em texto CSV legítimo (Latin-1 ou UTF-8).
 * @param {Buffer} buffer - Primeiros bytes do arquivo (alguns KB bastam)
 * @returns {boolean} True se o conteúdo parece binário, não texto/CSV
 */
const looksLikeBinaryFile = (buffer) => {
  if (!buffer || buffer.length === 0) return false;
  if (BINARY_SIGNATURES.some(sig => buffer.subarray(0, sig.length).equals(sig))) {
    return true;
  }
  return buffer.includes(0x00);
};

/**
 * Retorna a cláusula WHERE de escopo de PROCESSOS para a requisição atual.
 * É o ponto único de isolamento multi-unidade — toda query/operação sobre
 * processos deve mesclar este escopo para não vazar dados entre unidades ou
 * usuários. O `unidade_id`/`userId` vêm sempre do token (autenticarAdmin),
 * nunca do cliente.
 *
 *   super (login como super) → {}                              (todas as unidades)
 *   super (login como padrão) → { userId }                     (privilégio reduzido: só os próprios)
 *   admin_unidade             → { unidade_id }                 (toda a sua unidade)
 *   servidor                  → { unidade_id, userId }         (só os próprios, na sua unidade)
 *
 * @param {Object} req - Objeto de requisição Express (após autenticarAdmin)
 * @returns {Object} Cláusula WHERE do Sequelize
 */
const processScopeWhere = (req) => {
  if (req.loginType === 'admin_super') return {};
  if (req.role === 'super') return { userId: req.userId };
  if (req.role === 'admin_unidade') return { unidade_id: req.unidadeId };
  return { unidade_id: req.unidadeId, userId: req.userId };
};

/**
 * Escopo APENAS por unidade (ignora o dono do processo). Usado em contagens e
 * filtros onde admin_unidade deve enxergar toda a sua unidade — inclusive
 * processos não atribuídos.
 *   super         → {}                (todas as unidades)
 *   demais papéis → { unidade_id }    (apenas a própria unidade)
 * @param {Object} req - Objeto de requisição Express (após autenticarAdmin)
 * @returns {Object} Cláusula WHERE do Sequelize
 */
const unidadeScopeWhere = (req) => {
  if (req.loginType === 'admin_super') return {};
  if (req.role === 'super') return {};
  return { unidade_id: req.unidadeId };
};

/**
 * Indica se o usuário atual enxerga além dos próprios processos (pode filtrar
 * por outro servidor e ver não atribuídos): super ou admin da unidade.
 * @param {Object} req - Objeto de requisição Express (após autenticarAdmin)
 * @returns {boolean}
 */
const canSeeBeyondOwn = (req) => {
  return req.loginType === 'admin_super' || req.role === 'admin_unidade';
};

module.exports = {
  parseArrayFilter,
  isValidPassword,
  getRealIP,
  isValidCPF,
  formatCPF,
  generateRandomPassword,
  processScopeWhere,
  unidadeScopeWhere,
  canSeeBeyondOwn,
  passwordVersion,
  looksLikeBinaryFile,
  getJwtExpiration,
};
