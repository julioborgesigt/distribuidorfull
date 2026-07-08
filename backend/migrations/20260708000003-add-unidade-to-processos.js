'use strict';

/**
 * Adiciona `unidade_id` (NOT NULL) aos processos e troca a unicidade global do
 * número do processo por unicidade POR UNIDADE.
 *
 * Antes: UNIQUE(numero_processo) — um número só pode existir uma vez no sistema
 *        inteiro, o que impediria duas delegacias de terem o "mesmo" número.
 * Depois: UNIQUE(unidade_id, numero_processo) — cada unidade tem seu próprio
 *         espaço de números; o upsert de importação passa a ser por unidade.
 *
 * Backfill: todos os processos existentes recebem a unidade padrão (Iguatu).
 */
const { DEFAULT_UNIDADE_NOME } = require('../data/unidades');

module.exports = {
  async up(queryInterface, Sequelize) {
    const table = await queryInterface.describeTable('processos');

    if (!table.unidade_id) {
      // 1. Adiciona nullable para permitir o backfill.
      await queryInterface.addColumn('processos', 'unidade_id', {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'unidades', key: 'id' },
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE',
      });
    }

    const [unidade] = await queryInterface.sequelize.query(
      'SELECT id FROM unidades WHERE nome = ? LIMIT 1',
      { replacements: [DEFAULT_UNIDADE_NOME], type: Sequelize.QueryTypes.SELECT },
    );
    if (!unidade) {
      throw new Error('Unidade padrão não encontrada — a migration de criação de unidades deve rodar antes.');
    }

    // 2. Backfill de todos os processos existentes.
    await queryInterface.sequelize.query(
      'UPDATE processos SET unidade_id = ? WHERE unidade_id IS NULL',
      { replacements: [unidade.id] },
    );

    // 3. Agora que não há mais NULL, torna a coluna obrigatória.
    //    Sem `references` aqui de propósito: a FK já foi criada no addColumn e
    //    reespecificá-la faria o MySQL tentar criar uma FK duplicada.
    await queryInterface.changeColumn('processos', 'unidade_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
    });

    // 4. Remove QUALQUER índice UNIQUE que cubra apenas numero_processo
    //    (o baseline criou-o via `unique: true`; o nome varia entre bancos).
    const uniqueIdx = await queryInterface.sequelize.query(
      `SELECT INDEX_NAME
         FROM information_schema.STATISTICS
        WHERE TABLE_SCHEMA = DATABASE()
          AND TABLE_NAME = 'processos'
          AND NON_UNIQUE = 0
          AND COLUMN_NAME = 'numero_processo'
        GROUP BY INDEX_NAME
       HAVING COUNT(*) = 1`,
      { type: Sequelize.QueryTypes.SELECT },
    );
    for (const row of Array.isArray(uniqueIdx) ? uniqueIdx : [uniqueIdx]) {
      if (row && row.INDEX_NAME && row.INDEX_NAME !== 'PRIMARY') {
        await queryInterface.removeIndex('processos', row.INDEX_NAME);
      }
    }

    // 5. Cria a unicidade por unidade.
    const stats = await queryInterface.sequelize.query(
      `SELECT INDEX_NAME FROM information_schema.STATISTICS
        WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'processos'
          AND INDEX_NAME = 'uniq_unidade_numero_processo' LIMIT 1`,
      { type: Sequelize.QueryTypes.SELECT },
    );
    if (!stats || (Array.isArray(stats) && stats.length === 0)) {
      await queryInterface.addIndex('processos', ['unidade_id', 'numero_processo'], {
        unique: true,
        name: 'uniq_unidade_numero_processo',
      });
    }

    // 6. Índices de escopo por unidade (espelham models/process.js).
    await queryInterface.addIndex('processos', ['unidade_id', 'cumprido'], {
      name: 'idx_unidade_cumprido',
    }).catch(() => {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('processos', 'uniq_unidade_numero_processo').catch(() => {});
    await queryInterface.removeIndex('processos', 'idx_unidade_cumprido').catch(() => {});
    await queryInterface.removeColumn('processos', 'unidade_id');
    // Restaura a unicidade global do número do processo.
    await queryInterface.addIndex('processos', ['numero_processo'], {
      unique: true,
      name: 'processos_numero_processo_unique',
    }).catch(() => {});
  },
};
