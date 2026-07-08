// /scripts/seed-unidades.js
//
// Semeia/atualiza a lista de unidades (delegacias) a partir de data/unidades.js.
// Idempotente: casa por `nome`, cria as que faltam e completa `nome_pje`
// quando estiver vazio. NÃO remove nem renomeia unidades existentes (o super
// global gerencia isso pelo painel).
//
// Uso (a partir de backend/):  node scripts/seed-unidades.js

require('dotenv').config({ path: __dirname + '/../.env' });

const { sequelize, Unidade } = require('../models');
const { UNIDADES } = require('../data/unidades');
const logger = require('../utils/logger');

(async () => {
  try {
    await sequelize.authenticate();

    let criadas = 0;
    let atualizadas = 0;
    for (const u of UNIDADES) {
      const [row, created] = await Unidade.findOrCreate({
        where: { nome: u.nome },
        defaults: { nome: u.nome, nome_pje: u.nome_pje, ativo: u.ativo },
      });
      if (created) {
        criadas += 1;
      } else if (!row.nome_pje && u.nome_pje) {
        row.nome_pje = u.nome_pje;
        await row.save();
        atualizadas += 1;
      }
    }

    logger.info('Seed de unidades concluído', { total: UNIDADES.length, criadas, atualizadas });
    console.log(`[seed-unidades] ${UNIDADES.length} unidades — ${criadas} criada(s), ${atualizadas} atualizada(s).`);
    await sequelize.close();
    process.exit(0);
  } catch (err) {
    logger.error('Falha no seed de unidades', { error: err.message, stack: err.stack });
    console.error('[seed-unidades] Falha:', err.message);
    try { await sequelize.close(); } catch { /* ignore */ }
    process.exit(1);
  }
})();
