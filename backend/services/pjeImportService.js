// /services/pjeImportService.js
//
// Coleta os avisos pendentes do PJe (MNI) e os converte em linhas no formato do
// model Process. É usado tanto pela rota manual (processController.importPje)
// quanto pelo cron (scripts/import-pje-cron.js), evitando duplicar a lógica.
//
// ATENÇÃO: quando abrirTeor=true, consultarTeorComunicacao é chamado para cada
// aviso para capturar o prazo — e ISSO REGISTRA CIÊNCIA e INICIA O PRAZO.

const pjeClient = require('../utils/pjeClient');
const {
  formatNumeroCNJ,
  mniDateToISO,
  computePrazo,
  deveAbrirTeor,
} = require('../utils/pjeParser');
const tpu = require('../utils/tpu');
const logger = require('../utils/logger');

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
  const avisos = await pjeClient.consultarAvisosPendentes();
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
        const teor = await pjeClient.consultarTeorComunicacao(aviso.idAviso);
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

module.exports = { coletarRows, avisoToRow };
