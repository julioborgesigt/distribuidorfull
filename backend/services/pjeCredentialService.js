// /services/pjeCredentialService.js
//
// CRUD de credenciais PJe: CPF + senha armazenados criptografados no banco.
// A tabela é singleton (no máximo 1 linha). A chave de criptografia vive apenas
// em PJE_CRED_ENC_KEY (variável de ambiente), nunca no banco.

const { PjeCredential, User } = require('../models');
const { encrypt, decrypt } = require('../utils/credenciaisCrypto');
const logger = require('../utils/logger');

// Retorna { cpf, senha } desencriptados, ou null se não houver credenciais salvas.
// Se a chave de criptografia faltar ou estiver errada, lança com mensagem clara.
async function getCredentials() {
  const row = await PjeCredential.findOne();
  if (!row) return null;
  try {
    return {
      cpf: decrypt(row.cpfCriptografado),
      senha: decrypt(row.senhaCriptografada),
    };
  } catch (err) {
    logger.error('Falha ao descriptografar credenciais PJe do banco', { error: err.message });
    throw new Error(
      'Não foi possível descriptografar as credenciais PJe armazenadas. ' +
      'Verifique se PJE_CRED_ENC_KEY está correta no ambiente.'
    );
  }
}

// Salva (ou substitui) as credenciais PJe criptografadas.
// cpfDisplay: últimos 2 dígitos do CPF, exibido no painel sem descriptografar.
async function saveCredentials(cpf, senha, userId) {
  const cpfDigits = String(cpf).replace(/\D/g, '');
  const cpfDisplay = `***.***.***-${cpfDigits.slice(-2)}`;

  const cpfCriptografado = encrypt(cpfDigits);
  const senhaCriptografada = encrypt(senha);

  await PjeCredential.destroy({ where: {} });
  await PjeCredential.create({
    cpfCriptografado,
    senhaCriptografada,
    cpfDisplay,
    atualizadoPorId: userId || null,
  });
}

// Remove as credenciais salvas (volta a usar env vars PJE_CPF/PJE_SENHA).
async function clearCredentials() {
  await PjeCredential.destroy({ where: {} });
}

// Retorna metadados sem descriptografar a senha, para o painel de status.
async function getStatus() {
  const row = await PjeCredential.findOne();
  if (!row) return { configured: false };

  let atualizadoPorNome = null;
  if (row.atualizadoPorId) {
    try {
      const u = await User.findByPk(row.atualizadoPorId, { attributes: ['nome'] });
      atualizadoPorNome = u ? u.nome : null;
    } catch { /* não-crítico */ }
  }

  return {
    configured: true,
    cpfDisplay: row.cpfDisplay,
    atualizadoEm: row.updatedAt,
    atualizadoPorNome,
  };
}

module.exports = { getCredentials, saveCredentials, clearCredentials, getStatus };
