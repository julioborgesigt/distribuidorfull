'use strict';

/**
 * Adiciona a coluna `adiados` a pje_import_logs (pendentes de ciência não
 * importados — mais novos que o limiar). Idempotente.
 */
module.exports = {
  async up(queryInterface, Sequelize) {
    const table = await queryInterface.describeTable('pje_import_logs');
    if (!table.adiados) {
      await queryInterface.addColumn('pje_import_logs', 'adiados', {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      });
    }
  },

  async down(queryInterface) {
    const table = await queryInterface.describeTable('pje_import_logs');
    if (table.adiados) {
      await queryInterface.removeColumn('pje_import_logs', 'adiados');
    }
  },
};
