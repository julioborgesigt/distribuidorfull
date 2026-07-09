// /scripts/import-pje-cron.js
//
// Importação automática (não interativa) dos processos do PJe, para ser
// agendada via cron do sistema. Percorre TODAS as unidades que tenham
// credenciais PJe configuradas e importa cada uma isoladamente, com a mesma
// trava de unidade da importação manual (nunca mistura processos de unidades).
//
// ATENÇÃO: por padrão abre o teor de cada aviso (registra ciência e inicia o
// prazo). Para importar só a fila, sem dar ciência, defina:
//   PJE_CRON_ABRIR_TEOR=false
//
// Pré-requisitos: credenciais PJe cadastradas por unidade (tela "Autenticação
// PJe") e as credenciais de banco já usadas pelo app.
//
// Agendamento (exemplo de crontab — todo dia às 6h, a partir de backend/):
//   0 6 * * *  cd /caminho/para/backend && /usr/bin/node scripts/import-pje-cron.js >> logs/cron-pje.log 2>&1

require('dotenv').config({ path: __dirname + '/../.env' });

const { sequelize, Unidade } = require('../models');
const { coletarRows, registrarLog, acquireImportLock } = require('../services/pjeImportService');
const { unidadesComCredencial } = require('../services/pjeCredentialService');
const { upsertProcessos } = require('../controllers/processController');
const { atualizarTpu } = require('../services/tpuService');
const logger = require('../utils/logger');

(async () => {
  const inicioTotal = Date.now();
  let importLock = null;
  try {
    await sequelize.authenticate();

    // Mesmo lock (MySQL GET_LOCK) usado pela importação manual — impede que o
    // cron e um clique no painel rodem juntos e deem ciência duplicada.
    importLock = await acquireImportLock();
    if (!importLock) {
      logger.info('Cron PJe: outra importação em andamento, pulando esta execução.');
      console.log(`[${new Date().toISOString()}] PJe: importação já em andamento, pulando.`);
      await sequelize.close();
      process.exit(0);
    }

    const abrirTeor = process.env.PJE_CRON_ABRIR_TEOR !== 'false';

    // Só importa as unidades que têm credencial configurada.
    const ids = await unidadesComCredencial();
    if (ids.length === 0) {
      logger.info('Cron PJe: nenhuma unidade com credencial configurada.');
      console.log(`[${new Date().toISOString()}] PJe: nenhuma unidade com credencial.`);
      await importLock.release();
      await sequelize.close();
      process.exit(0);
    }

    const unidades = await Unidade.findAll({ where: { id: ids } });
    let totalAvisos = 0;
    let totalCriados = 0;
    let unidadesComErro = 0;

    for (const unidade of unidades) {
      const inicio = Date.now();
      try {
        const { avisos, rows, comPrazo, falhasTeor, adiados } = await coletarRows({ abrirTeor, unidade });
        const { total: totalRows, criados, atualizados } =
          avisos > 0 ? await upsertProcessos(rows, unidade.id) : { total: 0, criados: 0, atualizados: 0 };

        totalAvisos += avisos;
        totalCriados += criados;

        logger.info('Cron de importação PJe (unidade) concluído', {
          unidadeId: unidade.id, unidade: unidade.nome,
          avisos, totalRows, criados, atualizados, comPrazo, falhasTeor, adiados,
          ms: Date.now() - inicio,
        });
        await registrarLog({
          usuario: `Cron automático — ${unidade.nome}`,
          unidade_id: unidade.id,
          avisos, criados, atualizados, comPrazo,
          semPrazo: Math.max(0, avisos - comPrazo),
          adiados,
          falhasTeor,
          duracaoMs: Date.now() - inicio,
          status: 'ok',
        });
        console.log(
          `[${new Date().toISOString()}] PJe [${unidade.nome}]: ${avisos} avisos, ` +
          `${totalRows} processados, ${comPrazo} com prazo, ${falhasTeor} falha(s).`
        );
      } catch (err) {
        // Uma unidade com erro (ex.: trava de unidade divergente, sem credencial)
        // NÃO deve abortar as demais.
        unidadesComErro += 1;
        logger.error('Cron PJe: falha em uma unidade', {
          unidadeId: unidade.id, unidade: unidade.nome, error: err.message,
        });
        await registrarLog({
          usuario: `Cron automático — ${unidade.nome}`,
          unidade_id: unidade.id,
          duracaoMs: Date.now() - inicio,
          status: 'erro',
          erro: (err.message || 'Erro na importação da unidade.').slice(0, 500),
        });
        console.error(`[${new Date().toISOString()}] PJe [${unidade.nome}] FALHOU:`, err.message);
      }
    }

    // Traduz os códigos novos uma vez ao final (não derruba o cron se falhar).
    try {
      const tpu = await atualizarTpu();
      console.log(
        `[${new Date().toISOString()}] TPU: ${tpu.classes.resolvidos} classe(s), ` +
        `${tpu.assuntos.resolvidos} assunto(s) traduzidos.`
      );
    } catch (e) {
      logger.warn('Cron: atualização TPU falhou', { error: e.message });
    }

    logger.info('Cron de importação PJe finalizado', {
      unidades: unidades.length, unidadesComErro, totalAvisos, totalCriados,
      ms: Date.now() - inicioTotal,
    });
    console.log(
      `[${new Date().toISOString()}] PJe: ${unidades.length} unidade(s), ` +
      `${unidadesComErro} com erro, ${totalAvisos} avisos no total.`
    );

    await importLock.release();
    await sequelize.close();
    process.exit(unidadesComErro > 0 ? 1 : 0);
  } catch (err) {
    logger.error('Cron de importação PJe falhou', { error: err.message, stack: err.stack });
    console.error(`[${new Date().toISOString()}] Falha na importação PJe:`, err.message);
    if (importLock) { await importLock.release().catch(() => {}); }
    try { await sequelize.close(); } catch { /* ignore */ }
    process.exit(1);
  }
})();
