'use strict';

/**
 * Cria a tabela pje_import_logs (histórico de importações do PJe).
 * Idempotente: se a tabela já existir, não faz nada.
 */
module.exports = {
  async up(queryInterface, Sequelize) {
    const tables = await queryInterface.showAllTables();
    if (tables.includes('pje_import_logs')) return;

    await queryInterface.createTable('pje_import_logs', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      usuario: {
        type: Sequelize.STRING(120),
        allowNull: false,
        defaultValue: 'Desconhecido',
      },
      avisos: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      criados: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      atualizados: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      comPrazo: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      semPrazo: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      falhasTeor: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      duracaoMs: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      status: {
        type: Sequelize.ENUM('ok', 'erro'),
        allowNull: false,
        defaultValue: 'ok',
      },
      erro: { type: Sequelize.STRING(500), allowNull: true },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });

    await queryInterface.addIndex('pje_import_logs', ['created_at'], {
      name: 'pje_import_logs_created_at',
    });
  },

  async down(queryInterface) {
    const tables = await queryInterface.showAllTables();
    if (tables.includes('pje_import_logs')) {
      await queryInterface.dropTable('pje_import_logs');
    }
  },
};
