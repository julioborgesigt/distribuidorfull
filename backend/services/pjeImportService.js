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
  diasDesdeDisponibilizacao,
  vinculacoesDistintas,
  mesmaVinculacao,
  semPrazoEstruturado,
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
//
// ignorarSemPrazo: descarta as intimações cujo teor veio SEM prazo (o PJe
// mostra "Prazo: sem prazo"). São, na grande maioria, atos enviados de praxe
// pelo sistema do emitente, sem nada a cumprir — poluem o painel. A ciência
// já foi registrada ao abrir o teor (é irreversível); o que este filtro evita
// é apenas a gravação da linha no painel. Desligue com
// PJE_IGNORAR_SEM_PRAZO=false (ou ?ignorarSemPrazo=false na rota manual).
async function coletarRows({
  abrirTeor = true,
  cienciaMinDias = Number(process.env.PJE_CIENCIA_MIN_DIAS) || 0,
  ignorarSemPrazo = process.env.PJE_IGNORAR_SEM_PRAZO !== 'false',
  unidade,
} = {}) {
  if (!unidade || unidade.id == null) {
    throw new Error('coletarRows: a unidade de destino da importação é obrigatória.');
  }

  // Credenciais PJe DA UNIDADE (cada delegacia loga com o próprio CPF).
  const creds = await pjeCredentialService.getCredentials(unidade.id);
  if (!creds) {
    throw new Error(
      `A unidade "${unidade.nome}" não tem credenciais PJe configuradas. ` +
      `Cadastre em "Autenticação PJe" antes de importar.`
    );
  }

  const avisos = await pjeClient.consultarAvisosPendentes(creds);

  // TRAVA DE IMPORTAÇÃO (isolamento entre unidades):
  //
  // 1) A credencial não pode abranger mais de uma unidade representativa. (Já
  //    checado ao salvar, mas uma unidade sem avisos pendentes na hora pode
  //    ter escapado — reforça aqui.)
  const unidadesAviso = vinculacoesDistintas(avisos);
  if (unidadesAviso.length > 1) {
    throw new Error(
      `A credencial do PJe em uso está vinculada a mais de uma unidade ` +
      `representativa (${unidadesAviso.join(', ')}). A importação foi cancelada — ` +
      `use uma credencial de unidade única.`
    );
  }

  // 2) A unidade dos avisos precisa BATER com a unidade de destino. Impede que
  //    um usuário que mudou (ou passou a gerenciar outra) unidade de gestão no
  //    PJe importe avisos de uma delegacia para a caixa de outra. Se
  //    unidade.nome_pje ainda não foi definido, cai para a checagem best-effort
  //    de "unidade única" acima.
  if (unidadesAviso.length === 1 && unidade.nome_pje) {
    if (!mesmaVinculacao(unidadesAviso[0], unidade.nome_pje)) {
      throw new Error(
        `Os avisos retornados pertencem à unidade "${unidadesAviso[0]}", mas a ` +
        `credencial está registrada para "${unidade.nome_pje}". A importação foi ` +
        `cancelada para não misturar processos de unidades diferentes. Verifique ` +
        `se a unidade de gestão no PJe foi alterada.`
      );
    }
  }

  const rows = [];
  let comPrazo = 0;
  let falhasTeor = 0;
  let adiados = 0;
  let ignoradosSemPrazo = 0;

  // DIAGNÓSTICO: registra a decisão tomada para cada aviso (importado, adiado
  // e por quê, falha no teor). Exibido no modal de resultado para depurar
  // importações que terminam "sem erro, mas sem nada importado".
  const avisosDetalhe = [];

  for (const aviso of avisos) {
    const idadeDias = diasDesdeDisponibilizacao(aviso.dataDisponibilizacao);
    const abrirEste =
      abrirTeor && deveAbrirTeor(aviso.dataDisponibilizacao, cienciaMinDias);
    const detalhe = {
      processo: formatNumeroCNJ(aviso.numeroProcesso),
      dataDisponibilizacao: aviso.dataDisponibilizacao || null,
      idadeDias,
      vinculacao: aviso.vinculacao || null,
    };

    // Avisos ainda pendentes de ciência (mais novos que o limiar) NÃO são
    // importados — apenas contados (informativo). Eles entram numa importação
    // futura, quando amadurecerem e a ciência for tomada.
    if (!abrirEste) {
      if (abrirTeor) adiados += 1;
      detalhe.decisao = abrirTeor ? 'adiado' : 'não importado (abrirTeor=false)';
      detalhe.motivo = !abrirTeor
        ? 'importação configurada para não tomar ciência'
        : idadeDias == null
          ? `dataDisponibilizacao ausente/inválida ("${aviso.dataDisponibilizacao}") — o aviso nunca atinge o limiar`
          : `idade ${idadeDias}d < limiar ${cienciaMinDias}d`;
      avisosDetalhe.push(detalhe);
      continue;
    }

    let prazo = { prazo_processual: '', prazo_vencimento: null };
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

      // Intimação "sem prazo": nada a cumprir, só ciência de praxe. A ciência já
      // foi registrada acima (irreversível), mas a linha não vai para o painel.
      if (ignorarSemPrazo && semPrazoEstruturado(prazo)) {
        ignoradosSemPrazo += 1;
        detalhe.decisao = 'ignorado (sem prazo)';
        detalhe.motivo = 'teor sem prazo estruturado — intimação sem prazo a cumprir';
        avisosDetalhe.push(detalhe);
        continue;
      }

      detalhe.decisao = 'importado';
      detalhe.motivo = prazo.prazo_processual
        ? `com prazo (${prazo.prazo_processual}d)`
        : 'sem prazo estruturado no teor';
    } catch (err) {
      falhasTeor += 1;
      detalhe.decisao = 'importado (falha ao abrir teor)';
      detalhe.motivo = err.message;
      logger.warn('Falha ao obter teor de aviso PJe', {
        idAviso: aviso.idAviso,
        error: err.message,
      });
    }

    avisosDetalhe.push(detalhe);
    rows.push(avisoToRow(aviso, prazo));
  }

  const diagnostico = {
    unidadeDestino: { id: unidade.id, nome: unidade.nome, nome_pje: unidade.nome_pje || null },
    cienciaMinDias,
    abrirTeor,
    ignorarSemPrazo,
    avisosRetornadosPeloMni: avisos.length,
    vinculacoesEncontradas: [...new Set(avisos.map(a => a.vinculacao).filter(Boolean))],
    vinculacoesConsideradas: unidadesAviso, // após remover a genérica
    // Limita a lista para não inflar a resposta em unidades com muitos avisos.
    avisosDetalhe: avisosDetalhe.slice(0, 200),
  };
  logger.info('Diagnóstico da importação PJe', diagnostico);

  return {
    avisos: avisos.length,
    rows,
    comPrazo,
    falhasTeor,
    adiados,
    ignoradosSemPrazo,
    diagnostico,
  };
}

module.exports = { coletarRows, avisoToRow, registrarLog, acquireImportLock };
