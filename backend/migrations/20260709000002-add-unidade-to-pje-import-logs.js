'use strict';

/**
 * Adiciona `unidade_id` a pje_import_logs para permitir "última importação por
 * unidade" (visibilidade/alerta de falha). Idempotente.
 *
 * Faz um backfill best-effort dos logs antigos a partir do sufixo do campo
 * `usuario` ("... — NomeDaUnidade"). Se não casar, o log fica sem unidade e a
 * próxima importação daquela unidade já grava o unidade_id corretamente.
 */
module.exports = {
  async up(queryInterface, Sequelize) {
    const table = await queryInterface.describeTable('pje_import_logs');
    if (!table.unidade_id) {
      await queryInterface.addColumn('pje_import_logs', 'unidade_id', {
        type: Sequelize.INTEGER,
        allowNull: true,
      });
      await queryInterface.addIndex('pje_import_logs', ['unidade_id'], {
        name: 'pje_import_logs_unidade_id',
      });

      // Backfill best-effort (MySQL). Não falha a migration se der erro.
      try {
        await queryInterface.sequelize.query(
          "UPDATE pje_import_logs l JOIN unidades u " +
            "ON l.usuario LIKE CONCAT('%— ', u.nome) " +
            'SET l.unidade_id = u.id WHERE l.unidade_id IS NULL'
        );
      } catch {
        /* backfill é opcional */
      }
    }
  },

  async down(queryInterface) {
    const table = await queryInterface.describeTable('pje_import_logs');
    if (table.unidade_id) {
      await queryInterface.removeIndex('pje_import_logs', 'pje_import_logs_unidade_id');
      await queryInterface.removeColumn('pje_import_logs', 'unidade_id');
    }
  },
};
