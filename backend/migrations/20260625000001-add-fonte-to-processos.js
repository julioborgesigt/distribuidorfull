'use strict';

/**
 * Adiciona a coluna `fonte` à tabela processos para distinguir a origem do
 * registro: 'esaj' (importação por CSV) ou 'pje' (webservice MNI).
 *
 * Idempotente: se a coluna já existir, não faz nada. Registros existentes
 * recebem o default 'esaj' (toda a base atual veio do eSAJ).
 */
module.exports = {
  async up(queryInterface, Sequelize) {
    const table = await queryInterface.describeTable('processos');
    if (!table.fonte) {
      await queryInterface.addColumn('processos', 'fonte', {
        type: Sequelize.ENUM('esaj', 'pje'),
        allowNull: false,
        defaultValue: 'esaj',
      });
      await queryInterface.addIndex('processos', ['fonte'], {
        name: 'processos_fonte',
      });
    }
  },

  async down(queryInterface) {
    const table = await queryInterface.describeTable('processos');
    if (table.fonte) {
      await queryInterface.removeIndex('processos', 'processos_fonte');
      await queryInterface.removeColumn('processos', 'fonte');
      // Limpa o tipo ENUM no Postgres; no MySQL é no-op silencioso.
      if (queryInterface.sequelize.getDialect() === 'postgres') {
        await queryInterface.sequelize.query(
          'DROP TYPE IF EXISTS "enum_processos_fonte";'
        );
      }
    }
  },
};
