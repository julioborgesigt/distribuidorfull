// /services/pjeCredentialService.js
//
// CRUD de credenciais PJe: CPF + senha armazenados criptografados no banco,
// UMA credencial POR UNIDADE (delegacia). Cada unidade loga no PJe com o
// próprio CPF; o webservice MNI devolve os avisos daquela unidade.
// A chave de criptografia vive apenas em PJE_CRED_ENC_KEY (variável de
// ambiente), nunca no banco.

const { PjeCredential, User, Unidade } = require('../models');
const { encrypt, decrypt } = require('../utils/credenciaisCrypto');
const logger = require('../utils/logger');

// Retorna { cpf, senha } desencriptados da credencial da unidade, ou null se
// não houver credencial salva para ela.
async function getCredentials(unidadeId) {
  if (unidadeId == null) return null;
  const row = await PjeCredential.findOne({ where: { unidade_id: unidadeId } });
  if (!row) return null;
  try {
    return {
      cpf: decrypt(row.cpfCriptografado),
      senha: decrypt(row.senhaCriptografada),
    };
  } catch (err) {
    logger.error('Falha ao descriptografar credenciais PJe do banco', { error: err.message, unidadeId });
    throw new Error(
      'Não foi possível descriptografar as credenciais PJe armazenadas. ' +
      'Verifique se PJE_CRED_ENC_KEY está correta no ambiente.'
    );
  }
}

// Salva (ou substitui) as credenciais PJe criptografadas de uma unidade.
async function saveCredentials(unidadeId, cpf, senha, userId) {
  if (unidadeId == null) {
    throw new Error('unidadeId é obrigatório para salvar credenciais PJe.');
  }
  const cpfDigits = String(cpf).replace(/\D/g, '');
  const cpfDisplay = `***.***.***-${cpfDigits.slice(-2)}`;

  const cpfCriptografado = encrypt(cpfDigits);
  const senhaCriptografada = encrypt(senha);

  await PjeCredential.destroy({ where: { unidade_id: unidadeId } });
  await PjeCredential.create({
    cpfCriptografado,
    senhaCriptografada,
    cpfDisplay,
    atualizadoPorId: userId || null,
    unidade_id: unidadeId,
  });
}

// Remove as credenciais salvas de uma unidade.
async function clearCredentials(unidadeId) {
  if (unidadeId == null) return;
  await PjeCredential.destroy({ where: { unidade_id: unidadeId } });
}

// Metadados (sem descriptografar a senha) da credencial de uma unidade.
async function getStatus(unidadeId) {
  if (unidadeId == null) return { configured: false };
  const row = await PjeCredential.findOne({ where: { unidade_id: unidadeId } });
  if (!row) return { configured: false, unidadeId };

  let atualizadoPorNome = null;
  if (row.atualizadoPorId) {
    try {
      const u = await User.findByPk(row.atualizadoPorId, { attributes: ['nome'] });
      atualizadoPorNome = u ? u.nome : null;
    } catch { /* não-crítico */ }
  }

  return {
    configured: true,
    unidadeId,
    cpfDisplay: row.cpfDisplay,
    atualizadoEm: row.updatedAt,
    atualizadoPorNome,
  };
}

// Lista o status das credenciais de TODAS as unidades (para o painel do super).
async function getStatusAll() {
  const unidades = await Unidade.findAll({
    attributes: ['id', 'nome'],
    order: [['nome', 'ASC']],
  });
  const rows = await PjeCredential.findAll();
  const byUnidade = new Map(rows.map(r => [r.unidade_id, r]));
  return unidades.map(u => {
    const row = byUnidade.get(u.id);
    return {
      unidadeId: u.id,
      unidadeNome: u.nome,
      configured: !!row,
      cpfDisplay: row ? row.cpfDisplay : null,
      atualizadoEm: row ? row.updatedAt : null,
    };
  });
}

// Lista os ids das unidades que possuem credencial configurada (usado pelo cron
// para iterar apenas quem tem credencial).
async function unidadesComCredencial() {
  const rows = await PjeCredential.findAll({ attributes: ['unidade_id'] });
  return rows.map(r => r.unidade_id);
}

module.exports = {
  getCredentials,
  saveCredentials,
  clearCredentials,
  getStatus,
  getStatusAll,
  unidadesComCredencial,
};
