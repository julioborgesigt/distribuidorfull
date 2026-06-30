// /controllers/pjeAuthController.js
//
// Gerencia as credenciais PJe armazenadas no banco (criptografadas).
// Todos os endpoints exigem admin_super (requireSuperAdmin aplicado nas rotas).
//
// Endpoints:
//   GET  /pje-auth/status  — status sem revelar a senha
//   POST /pje-auth/salvar  — valida CPF + testa conexão MNI + salva criptografado
//   DELETE /pje-auth       — remove as credenciais salvas (volta para env vars)

const pjeCredentialService = require('../services/pjeCredentialService');
const pjeClient = require('../utils/pjeClient');
const { vinculacoesDistintas } = require('../utils/pjeParser');
const logger = require('../utils/logger');
const { getRealIP } = require('../utils/helpers');

exports.getStatus = async (req, res) => {
  try {
    const status = await pjeCredentialService.getStatus();
    res.json(status);
  } catch (err) {
    logger.error('Erro ao buscar status das credenciais PJe', { error: err.message });
    res.status(500).json({ error: 'Erro ao verificar credenciais armazenadas.' });
  }
};

exports.salvar = async (req, res) => {
  const { cpf, senha } = req.body || {};

  // Validação de formato
  if (!cpf || !senha) {
    return res.status(400).json({ error: 'CPF e senha são obrigatórios.' });
  }
  const cpfDigits = String(cpf).replace(/\D/g, '');
  if (cpfDigits.length !== 11) {
    return res.status(400).json({ error: 'CPF inválido. Informe 11 dígitos.' });
  }
  if (String(senha).trim().length === 0) {
    return res.status(400).json({ error: 'Senha não pode ser vazia.' });
  }

  // Verifica se a chave de criptografia está configurada antes de tentar o teste
  try {
    const { encrypt } = require('../utils/credenciaisCrypto');
    encrypt('_probe_');
  } catch (keyErr) {
    return res.status(500).json({ error: keyErr.message });
  }

  // Testa as credenciais contra o webservice MNI (não registra ciência).
  // Qualquer erro (credencial errada, rede, endpoint) impede o salvamento.
  let avisos;
  try {
    avisos = await pjeClient.consultarAvisosPendentes({ cpf: cpfDigits, senha });
  } catch (mniErr) {
    logger.warn('Falha ao validar credenciais PJe', {
      error: mniErr.message,
      userId: req.userId,
      ip: getRealIP(req),
    });
    // pjeClient lança "PJe: ..." para erros de negócio do MNI (incluindo auth).
    // Outros erros são de rede/conexão.
    const isMniError = mniErr.message.startsWith('PJe:');
    const userMsg = isMniError
      ? 'Usuário ou senha errado(s), verifique.'
      : `Não foi possível conectar ao PJe. Verifique a conexão e tente novamente. (${mniErr.message})`;
    return res.status(400).json({ error: userMsg });
  }

  // Best-effort: barra credenciais de usuários vinculados a mais de uma
  // unidade representativa, detectado pelos destinatários distintos entre os
  // avisos pendentes no momento (vinculacoesDistintas já ignora a vinculação
  // genérica "Polícia Civil do Ceará", que aparece junto da delegacia/vara
  // real na maioria dos avisos e não conta como unidade própria). Limitação:
  // uma unidade sem avisos pendentes agora não aparece aqui — não há operação
  // no MNI que liste as unidades de um consultante independente de haver
  // avisos pendentes. A importação (pjeImportService) reforça essa mesma
  // checagem a cada execução.
  const unidades = vinculacoesDistintas(avisos);
  if (unidades.length > 1) {
    logger.warn('Credenciais PJe recusadas: usuário com múltiplas unidades', {
      vinculacoes: unidades,
      userId: req.userId,
      ip: getRealIP(req),
    });
    return res.status(400).json({
      error: `Este usuário do PJe está vinculado a mais de uma unidade representativa ` +
        `(${unidades.join(', ')}). Cadastre credenciais de um usuário ` +
        `vinculado a apenas uma unidade.`
    });
  }

  // Salva criptografado
  try {
    await pjeCredentialService.saveCredentials(cpfDigits, senha, req.userId);
    logger.info('Credenciais PJe salvas/atualizadas', { userId: req.userId, ip: getRealIP(req) });
    const status = await pjeCredentialService.getStatus();
    res.json({ message: 'Credenciais salvas com sucesso.', ...status });
  } catch (saveErr) {
    logger.error('Erro ao salvar credenciais PJe', { error: saveErr.message });
    res.status(500).json({ error: saveErr.message });
  }
};

exports.remover = async (req, res) => {
  try {
    await pjeCredentialService.clearCredentials();
    logger.info('Credenciais PJe removidas do banco', { userId: req.userId, ip: getRealIP(req) });
    res.json({ message: 'Credenciais removidas. O sistema voltará a usar as variáveis de ambiente PJE_CPF/PJE_SENHA.' });
  } catch (err) {
    logger.error('Erro ao remover credenciais PJe', { error: err.message });
    res.status(500).json({ error: 'Erro ao remover credenciais.' });
  }
};
