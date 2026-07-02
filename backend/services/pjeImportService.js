// /services/pjeImportService.js
//
// Coleta os avisos pendentes do PJe (MNI) e os converte em linhas no formato do
// model Process. É usado tanto pela rota manual (processController.importPje)
// quanto pelo cron (scripts/import-pje-cron.js), evitando duplicar a lógica.
//
// ATENÇÃO: quando abrirTeor=true, consultarTeorComunicacao é chamado para cada
// aviso para capturar o prazo — e ISSO REGISTRA CIÊNCIA e INICIA O PRAZO.

const pjeClient = require('../utils/pjeClient');
const pjeCredentialService = require('./pjeCredentialService');
const {
  formatNumeroCNJ,
  mniDateToISO,
  computePrazo,
  deveAbrirTeor,
  vinculacoesDistintas,
} = require('../utils/pjeParser');
const tpu = require('../utils/tpu');
const logger = require('../utils/logger');
const { PjeImportLog, sequelize } = require('../models');

// --- Lock de importação entre processos/instâncias ---
//
// O guard em memória do controller (pjeImportStatus.running) só vale dentro
// de UM processo Node. O Passenger pode manter vários processos do app, e o
// cron roda num processo próprio — duas importações simultâneas abririam o
// teor dos mesmos avisos DUAS VEZES (ciência duplicada no PJe).
//
// GET_LOCK do MySQL é um lock nomeado do servidor de banco, válido para
// qualquer processo que use o mesmo banco. Ele pertence à CONEXÃO que o
// adquiriu, então usamos uma transaction não gerenciada apenas para "fixar"
// uma conexão do pool durante toda a importação; se o processo morrer no
// meio, a conexão cai e o MySQL libera o lock sozinho.
const IMPORT_LOCK_NAME = 'distribuidor_pje_import';

async function acquireImportLock() {
  const t = await sequelize.transaction();
  try {
    const rows = await sequelize.query('SELECT GET_LOCK(?, 0) AS ok', {
      replacements: [IMPORT_LOCK_NAME],
      type: sequelize.QueryTypes.SELECT,
      transaction: t,
    });
    if (!rows[0] || Number(rows[0].ok) !== 1) {
      await t.rollback();
      return null; // outra importação (outro processo/cron) está em andamento
    }
  } catch (err) {
    await t.rollback().catch(() => {});
    throw err;
  }
  return {
    release: async () => {
      try {
        await sequelize.query('SELECT RELEASE_LOCK(?)', {
          replacements: [IMPORT_LOCK_NAME],
          type: sequelize.QueryTypes.SELECT,
          transaction: t,
        });
      } catch (err) {
        logger.warn('Falha ao liberar lock de importação PJe', { error: err.message });
      } finally {
        await t.commit().catch(() => {});
      }
    },
  };
}

// Grava um registro no histórico de importações do PJe. Nunca lança — uma falha
// ao logar não deve derrubar a importação.
async function registrarLog(dados) {
  try {
    await PjeImportLog.create(dados);
  } catch (e) {
    logger.error('Falha ao registrar log de importação PJe', { error: e.message });
  }
}

// Converte um aviso (+ prazo já calculado) numa linha do model Process.
function avisoToRow(aviso, prazo) {
  return {
    numero_processo: formatNumeroCNJ(aviso.numeroProcesso),
    prazo_processual: (prazo && prazo.prazo_processual) || '',
    classe_principal: tpu.classeNome(aviso.classeProcessual),
    assunto_principal: tpu.assuntoNome(aviso.assuntoCodigo),
    tarjas: aviso.nivelSigilo && Number(aviso.nivelSigilo) > 0 ? 'Sigiloso' : '',
    data_intimacao: mniDateToISO(aviso.dataDisponibilizacao),
    fonte: 'pje',
    vinculacao: aviso.vinculacao || null,
  };
}

// Busca avisos pendentes e monta as linhas. Não persiste nada.
//
// cienciaMinDias: só abre o teor (toma ciência) de avisos com idade >= esse
// número de dias desde a disponibilização. 0 = abre todos. Avisos mais novos
// são importados sem prazo (sem ciência) e ganham o prazo num import futuro,
// quando amadurecerem — aproveitando a janela de 10 dias para ciência.
async function coletarRows({
  abrirTeor = true,
  cienciaMinDias = Number(process.env.PJE_CIENCIA_MIN_DIAS) || 0,
} = {}) {
  // Credenciais: banco tem prioridade sobre env vars (PJE_CPF/PJE_SENHA).
  // null = pjeClient usa os env vars diretamente.
  const creds = await pjeCredentialService.getCredentials().catch(() => null);

  const avisos = await pjeClient.consultarAvisosPendentes(creds || undefined);

  // A credencial deve estar vinculada a uma única unidade representativa (já
  // checado ao salvar em "Autenticação PJe", mas uma unidade sem avisos
  // pendentes naquele momento pode não ter sido detectada). Reforça aqui,
  // antes de processar qualquer aviso, para nunca misturar unidades.
  const unidades = vinculacoesDistintas(avisos);
  if (unidades.length > 1) {
    throw new Error(
      `A credencial do PJe em uso está vinculada a mais de uma unidade ` +
      `representativa (${unidades.join(', ')}). A importação foi cancelada — ` +
      `configure uma credencial de unidade única em "Autenticação PJe".`
    );
  }

  const rows = [];
  let comPrazo = 0;
  let falhasTeor = 0;
  let adiados = 0;

  for (const aviso of avisos) {
    let prazo = { prazo_processual: '', prazo_vencimento: null };

    const abrirEste =
      abrirTeor && deveAbrirTeor(aviso.dataDisponibilizacao, cienciaMinDias);

    if (abrirTeor && !abrirEste) {
      adiados += 1; // ainda jovem: importa sem ciência, prazo virá depois
    }

    if (abrirEste) {
      try {
        // Registra ciência e inicia o prazo do aviso.
        const teor = await pjeClient.consultarTeorComunicacao(aviso.idAviso, creds || undefined);
        prazo = computePrazo({
          dataIntimacaoISO: mniDateToISO(aviso.dataDisponibilizacao),
          tipoPrazo: teor.tipoPrazo,
          dataReferencia: teor.dataReferencia,
          prazoDias: teor.prazoDias,
        });
        if (prazo.prazo_processual) comPrazo += 1;
      } catch (err) {
        falhasTeor += 1;
        logger.warn('Falha ao obter teor de aviso PJe', {
          idAviso: aviso.idAviso,
          error: err.message,
        });
      }
    }

    rows.push(avisoToRow(aviso, prazo));
  }

  return { avisos: avisos.length, rows, comPrazo, falhasTeor, adiados };
}

module.exports = { coletarRows, avisoToRow, registrarLog, acquireImportLock };
