// /scripts/import-pje-cron.js
//
// Importação automática (não interativa) dos processos do PJe, para ser
// agendada via cron do sistema. Reaproveita o mesmo service e pipeline de
// upsert da rota manual.
//
// ATENÇÃO: por padrão abre o teor de cada aviso (registra ciência e inicia o
// prazo). Para importar só a fila, sem dar ciência, defina:
//   PJE_CRON_ABRIR_TEOR=false
//
// Pré-requisitos no ambiente (.env do backend ou variáveis exportadas):
//   PJE_CPF, PJE_SENHA            credenciais do PJe
//   PJE_MNI_ENDPOINT (opcional)   default: 1º grau do TJCE
//   credenciais de banco já usadas pelo app
//
// Agendamento (exemplo de crontab — todo dia às 6h, a partir de backend/):
//   0 6 * * *  cd /caminho/para/backend && /usr/bin/node scripts/import-pje-cron.js >> logs/cron-pje.log 2>&1

require('dotenv').config({ path: __dirname + '/../.env' });

const { sequelize } = require('../models');
const { coletarRows, registrarLog, acquireImportLock } = require('../services/pjeImportService');
const { upsertProcessos } = require('../controllers/processController');
const { atualizarTpu } = require('../services/tpuService');
const logger = require('../utils/logger');

(async () => {
  const inicio = Date.now();
  let importLock = null;
  try {
    await sequelize.authenticate();

    // Mesmo lock (MySQL GET_LOCK) usado pela importação manual — impede que o
    // cron e um clique no painel rodem juntos e deem ciência duplicada.
    importLock = await acquireImportLock();
    if (!importLock) {
      logger.info('Cron PJe: outra importação em andamento, pulando esta execução.');
      // eslint-disable-next-line no-console
      console.log(`[${new Date().toISOString()}] PJe: importação já em andamento, pulando.`);
      await sequelize.close();
      process.exit(0);
    }

    const abrirTeor = process.env.PJE_CRON_ABRIR_TEOR !== 'false';
    const { avisos, rows, comPrazo, falhasTeor } = await coletarRows({ abrirTeor });
    const { total: totalRows, criados, atualizados } =
      avisos > 0 ? await upsertProcessos(rows) : { total: 0, criados: 0, atualizados: 0 };

    const resumo = { avisos, totalRows, criados, atualizados, comPrazo, falhasTeor, abrirTeor, ms: Date.now() - inicio };
    logger.info('Cron de importação PJe concluído', resumo);

    await registrarLog({
      usuario: 'Cron automático',
      avisos,
      criados,
      atualizados,
      comPrazo,
      semPrazo: Math.max(0, avisos - comPrazo),
      falhasTeor,
      duracaoMs: Date.now() - inicio,
      status: 'ok',
    });

    // Traduz os códigos novos logo após importar (não derruba o cron se falhar).
    try {
      const tpu = await atualizarTpu();
      console.log(
        `[${new Date().toISOString()}] TPU: ${tpu.classes.resolvidos} classe(s), ` +
          `${tpu.assuntos.resolvidos} assunto(s) traduzidos.`
      );
    } catch (e) {
      logger.warn('Cron: atualização TPU falhou', { error: e.message });
    }

    // eslint-disable-next-line no-console
    console.log(
      `[${new Date().toISOString()}] PJe: ${avisos} avisos, ${totalRows} processados, ` +
        `${comPrazo} com prazo, ${falhasTeor} falha(s).`
    );
    await importLock.release();
    await sequelize.close();
    process.exit(0);
  } catch (err) {
    logger.error('Cron de importação PJe falhou', { error: err.message, stack: err.stack });
    await registrarLog({
      usuario: 'Cron automático',
      duracaoMs: Date.now() - inicio,
      status: 'erro',
      erro: (err.message || 'Erro no cron de importação PJe.').slice(0, 500),
    });
    // eslint-disable-next-line no-console
    console.error(`[${new Date().toISOString()}] Falha na importação PJe:`, err.message);
    if (importLock) { await importLock.release().catch(() => {}); }
    try { await sequelize.close(); } catch { /* ignore */ }
    process.exit(1);
  }
})();
