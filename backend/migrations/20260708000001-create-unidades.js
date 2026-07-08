'use strict';

/**
 * Cria a tabela `unidades` (delegacias/órgãos) — a dimensão de multi-tenancy.
 *
 * Cada usuário (exceto o super global) e cada processo pertence a exatamente
 * uma unidade. Semeia aqui apenas a unidade PADRÃO (a delegacia já existente
 * em produção), necessária para o backfill das migrations seguintes. As demais
 * unidades são semeadas pelo seeder/scripts a partir de data/unidades.js.
 */
const { DEFAULT_UNIDADE_NOME } = require('../data/unidades');

module.exports = {
  async up(queryInterface, Sequelize) {
    const tables = await queryInterface.showAllTables();
    if (!tables.includes('unidades')) {
      await queryInterface.createTable('unidades', {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
          allowNull: false,
        },
        nome: {
          type: Sequelize.STRING(150),
          allowNull: false,
          unique: true,
        },
        sigla: {
          type: Sequelize.STRING(30),
          allowNull: true,
        },
        // Nome como o PJe escreve na vinculação do aviso (uppercase). Chave da
        // trava de importação — só entram avisos cuja vinculação bate com isto.
        nome_pje: {
          type: Sequelize.STRING(255),
          allowNull: true,
        },
        ativo: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: true,
        },
        created_at: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        },
        updated_at: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        },
      }, { charset: 'utf8mb4' });

      await queryInterface.addIndex('unidades', ['nome_pje'], { name: 'idx_unidades_nome_pje' });
    }

    // Garante a unidade padrão (Iguatu) para o backfill de usuarios/processos.
    const [existing] = await queryInterface.sequelize.query(
      'SELECT id FROM unidades WHERE nome = ? LIMIT 1',
      { replacements: [DEFAULT_UNIDADE_NOME], type: Sequelize.QueryTypes.SELECT },
    );
    if (!existing) {
      await queryInterface.bulkInsert('unidades', [{
        nome: DEFAULT_UNIDADE_NOME,
        nome_pje: DEFAULT_UNIDADE_NOME.toUpperCase(),
        ativo: true,
        created_at: new Date(),
        updated_at: new Date(),
      }]);
    }
  },

  async down(queryInterface) {
    await queryInterface.dropTable('unidades');
  },
};
