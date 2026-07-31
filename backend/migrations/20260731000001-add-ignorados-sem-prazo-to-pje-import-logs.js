'use strict';

/**
 * Adiciona a coluna `ignoradosSemPrazo` a pje_import_logs (intimações do PJe
 * descartadas por virem sem prazo no teor). Idempotente.
 */
module.exports = {
  async up(queryInterface, Sequelize) {
    const table = await queryInterface.describeTable('pje_import_logs');
    if (!table.ignoradosSemPrazo) {
      await queryInterface.addColumn('pje_import_logs', 'ignoradosSemPrazo', {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      });
    }
  },

  async down(queryInterface) {
    const table = await queryInterface.describeTable('pje_import_logs');
    if (table.ignoradosSemPrazo) {
      await queryInterface.removeColumn('pje_import_logs', 'ignoradosSemPrazo');
    }
  },
};
