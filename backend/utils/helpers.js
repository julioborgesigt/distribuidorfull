// /utils/helpers.js
// Funções auxiliares reutilizáveis

const crypto = require('crypto');

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

  // Embaralha a senha para não ter padrão previsível
  return password.split('').sort(() => crypto.randomInt(3) - 1).join('');
};

/**
 * Retorna a cláusula WHERE de escopo de processos para a requisição atual.
 * - admin_super: sem restrição (objeto vazio) → enxerga/opera em todos os processos.
 * - demais admins: restrito aos processos atribuídos ao próprio usuário.
 * Centraliza a regra para que operações em massa e individuais não vazem dados
 * de outros usuários.
 * @param {Object} req - Objeto de requisição Express (após autenticarAdmin)
 * @returns {Object} Cláusula WHERE do Sequelize
 */
const processScopeWhere = (req) => {
  return req.loginType === 'admin_super' ? {} : { userId: req.userId };
};

module.exports = {
  parseArrayFilter,
  isValidPassword,
  getRealIP,
  isValidCPF,
  formatCPF,
  generateRandomPassword,
  processScopeWhere,
};
