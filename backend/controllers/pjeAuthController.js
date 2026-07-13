// /controllers/pjeAuthController.js
//
// Gerencia as credenciais PJe armazenadas no banco (criptografadas), UMA por
// unidade. O admin da unidade gerencia a credencial da PRÓPRIA unidade; o super
// global gerencia a de qualquer unidade (informando unidadeId).
//
// Endpoints:
//   GET    /pje-auth/status  — status (uma unidade, ou todas p/ o super)
//   POST   /pje-auth/salvar  — valida CPF + testa MNI + trava de unidade + salva
//   DELETE /pje-auth         — remove as credenciais da unidade

const pjeCredentialService = require('../services/pjeCredentialService');
const pjeClient = require('../utils/pjeClient');
const { vinculacoesDistintas, mesmaVinculacao } = require('../utils/pjeParser');
const { Unidade } = require('../models');
const logger = require('../utils/logger');
const { getRealIP } = require('../utils/helpers');

// Resolve a unidade-alvo da operação. admin_unidade só opera na própria; super
// escolhe via `unidadeId` (body ou query). Retorna { unidade } ou { error, status }.
async function resolveUnidade(req, unidadeIdRaw) {
  if (req.role === 'servidor') {
    return { error: 'Acesso negado. Requer administrador de unidade.', status: 403 };
  }
  let unidadeId;
  if (req.loginType === 'admin_super' || req.role === 'super') {
    unidadeId = parseInt(unidadeIdRaw, 10) || null;
    if (!unidadeId) {
      return { error: 'Informe a unidade (unidadeId).', status: 400 };
    }
  } else {
    // admin_unidade
    unidadeId = req.unidadeId;
    if (!unidadeId) {
      return { error: 'Seu usuário não está vinculado a nenhuma unidade.', status: 400 };
    }
  }
  const unidade = await Unidade.findByPk(unidadeId);
  if (!unidade) {
    return { error: 'Unidade não encontrada.', status: 404 };
  }
  return { unidade };
}

exports.getStatus = async (req, res) => {
  try {
    // Super sem unidadeId: devolve o status de todas as unidades.
    if ((req.loginType === 'admin_super' || req.role === 'super') && !req.query.unidadeId) {
      const all = await pjeCredentialService.getStatusAll();
      return res.json({ all });
    }
    const r = await resolveUnidade(req, req.query.unidadeId);
    if (r.error) return res.status(r.status).json({ error: r.error });
    const status = await pjeCredentialService.getStatus(r.unidade.id);
    res.json({ ...status, unidadeNome: r.unidade.nome });
  } catch (err) {
    logger.error('Erro ao buscar status das credenciais PJe', { error: err.message });
    res.status(500).json({ error: 'Erro ao verificar credenciais armazenadas.' });
  }
};

exports.salvar = async (req, res) => {
  const { cpf, senha, unidadeId } = req.body || {};

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

  // Unidade-alvo da credencial.
  const r = await resolveUnidade(req, unidadeId);
  if (r.error) return res.status(r.status).json({ error: r.error });
  const unidade = r.unidade;

  // Verifica se a chave de criptografia está configurada antes de tentar o teste
  try {
    const { encrypt } = require('../utils/credenciaisCrypto');
    encrypt('_probe_');
  } catch (keyErr) {
    return res.status(500).json({ error: keyErr.message });
  }

  // Testa as credenciais contra o webservice MNI (não registra ciência).
  let avisos;
  try {
    avisos = await pjeClient.consultarAvisosPendentes({ cpf: cpfDigits, senha });
  } catch (mniErr) {
    logger.warn('Falha ao validar credenciais PJe', {
      error: mniErr.message, userId: req.userId, ip: getRealIP(req),
    });
    const isMniError = mniErr.message.startsWith('PJe:');
    const userMsg = isMniError
      ? 'Usuário ou senha errado(s), verifique.'
      : `Não foi possível conectar ao PJe. Verifique a conexão e tente novamente. (${mniErr.message})`;
    return res.status(400).json({ error: userMsg });
  }

  // TRAVA DE UNIDADE (no salvamento):
  // 1) A credencial não pode abranger mais de uma unidade representativa.
  const unidadesAviso = vinculacoesDistintas(avisos);
  if (unidadesAviso.length > 1) {
    logger.warn('Credenciais PJe recusadas: usuário com múltiplas unidades', {
      vinculacoes: unidadesAviso, userId: req.userId, ip: getRealIP(req),
    });
    return res.status(400).json({
      error: `Este usuário do PJe está vinculado a mais de uma unidade representativa ` +
        `(${unidadesAviso.join(', ')}). Cadastre credenciais de um usuário ` +
        `vinculado a apenas uma unidade.`
    });
  }

  // 2) Se a unidade já tem um nome_pje definido, a vinculação detectada tem que
  //    bater — impede cadastrar nesta unidade uma credencial de OUTRA delegacia.
  //    Se ainda não tem (bootstrap) e detectamos exatamente uma, adotamos ela.
  let nomePjeDetectado = unidadesAviso.length === 1 ? unidadesAviso[0] : null;
  if (unidade.nome_pje) {
    if (nomePjeDetectado && !mesmaVinculacao(nomePjeDetectado, unidade.nome_pje)) {
      logger.warn('Credenciais PJe recusadas: vinculação diverge da unidade', {
        detectada: nomePjeDetectado, esperada: unidade.nome_pje,
        unidadeId: unidade.id, userId: req.userId, ip: getRealIP(req),
      });
      return res.status(400).json({
        error: `Os avisos deste usuário pertencem à unidade "${nomePjeDetectado}", que ` +
          `não corresponde à unidade "${unidade.nome_pje}". Cadastre a credencial na ` +
          `unidade correta.`
      });
    }
  } else if (nomePjeDetectado) {
    // Bootstrap: adota a vinculação detectada como nome_pje da unidade.
    try {
      unidade.nome_pje = nomePjeDetectado;
      await unidade.save();
      logger.info('nome_pje da unidade definido automaticamente pela credencial', {
        unidadeId: unidade.id, nome_pje: nomePjeDetectado,
      });
    } catch (e) {
      logger.warn('Falha ao definir nome_pje automaticamente', { error: e.message, unidadeId: unidade.id });
    }
  }

  // Salva criptografado, vinculado à unidade.
  try {
    await pjeCredentialService.saveCredentials(unidade.id, cpfDigits, senha, req.userId);
    logger.info('Credenciais PJe salvas/atualizadas', {
      userId: req.userId, unidadeId: unidade.id, ip: getRealIP(req),
    });
    const status = await pjeCredentialService.getStatus(unidade.id);
    // 0 avisos NÃO impede salvar (a fila pode estar legitimamente vazia), mas
    // também é o sintoma de usuário sem papel de representante no PJe — nesse
    // caso a importação virá sempre vazia. Avisa para não passar em silêncio.
    const aviso = avisos.length === 0
      ? 'Atenção: a credencial autenticou, mas o PJe não retornou NENHUM aviso pendente ' +
        'para este usuário. Se o painel do PJe mostra intimações pendentes desta unidade, ' +
        'o usuário provavelmente não tem o papel de representante processual do órgão — ' +
        'a importação virá vazia até corrigir o cadastro no PJe.'
      : null;
    res.json({ message: 'Credenciais salvas com sucesso.', aviso, unidadeNome: unidade.nome, ...status });
  } catch (saveErr) {
    logger.error('Erro ao salvar credenciais PJe', { error: saveErr.message });
    res.status(500).json({ error: saveErr.message });
  }
};

exports.remover = async (req, res) => {
  try {
    const r = await resolveUnidade(req, req.query.unidadeId || req.body?.unidadeId);
    if (r.error) return res.status(r.status).json({ error: r.error });
    await pjeCredentialService.clearCredentials(r.unidade.id);
    logger.info('Credenciais PJe removidas do banco', {
      userId: req.userId, unidadeId: r.unidade.id, ip: getRealIP(req),
    });
    res.json({ message: 'Credenciais removidas.' });
  } catch (err) {
    logger.error('Erro ao remover credenciais PJe', { error: err.message });
    res.status(500).json({ error: 'Erro ao remover credenciais.' });
  }
};
