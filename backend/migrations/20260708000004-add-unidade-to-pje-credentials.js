'use strict';

/**
 * Transforma pje_credentials de singleton (1 credencial global) em uma
 * credencial POR UNIDADE. Cada delegacia loga no PJe com o próprio CPF e o
 * webservice MNI devolve os avisos daquela unidade.
 *
 * - Adiciona `unidade_id` (NOT NULL) com UNIQUE — no máximo 1 credencial por unidade.
 * - Backfill: a credencial existente (se houver) é atribuída à unidade padrão.
 */
const { DEFAULT_UNIDADE_NOME } = require('../data/unidades');

module.exports = {
  async up(queryInterface, Sequelize) {
    const tables = await queryInterface.showAllTables();
    if (!tables.includes('pje_credentials')) {
      // Tabela ainda não existe neste banco — nada a migrar.
      return;
    }

    const table = await queryInterface.describeTable('pje_credentials');
    if (table.unidade_id) return; // já migrada

    await queryInterface.addColumn('pje_credentials', 'unidade_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: { model: 'unidades', key: 'id' },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });

    const [unidade] = await queryInterface.sequelize.query(
      'SELECT id FROM unidades WHERE nome = ? LIMIT 1',
      { replacements: [DEFAULT_UNIDADE_NOME], type: Sequelize.QueryTypes.SELECT },
    );
    if (unidade) {
      await queryInterface.sequelize.query(
        'UPDATE pje_credentials SET unidade_id = ? WHERE unidade_id IS NULL',
        { replacements: [unidade.id] },
      );
    }

    // Só torna NOT NULL/UNIQUE se não sobrou linha órfã (sem unidade).
    const orfas = await queryInterface.sequelize.query(
      'SELECT COUNT(*) AS n FROM pje_credentials WHERE unidade_id IS NULL',
      { type: Sequelize.QueryTypes.SELECT },
    );
    const n = Number((Array.isArray(orfas) ? orfas[0] : orfas)?.n || 0);
    if (n === 0) {
      // Sem `references` aqui: a FK já foi criada no addColumn.
      await queryInterface.changeColumn('pje_credentials', 'unidade_id', {
        type: Sequelize.INTEGER,
        allowNull: false,
      });
      await queryInterface.addIndex('pje_credentials', ['unidade_id'], {
        unique: true,
        name: 'uniq_pje_credentials_unidade',
      });
    }
  },

  async down(queryInterface) {
    await queryInterface.removeIndex('pje_credentials', 'uniq_pje_credentials_unidade').catch(() => {});
    await queryInterface.removeColumn('pje_credentials', 'unidade_id');
  },
};
