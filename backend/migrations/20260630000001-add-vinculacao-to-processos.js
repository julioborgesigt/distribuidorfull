'use strict';

/**
 * Adiciona a coluna `vinculacao` à tabela processos: o nome do destinatário do
 * aviso no PJe (ex.: "DELEGACIA DE POLICIA CIVIL DE IGUATU"), sempre em
 * maiúsculas. Usada para filtrar o painel por vinculação. Nula para
 * processos vindos do eSAJ (CSV não traz essa informação).
 *
 * Idempotente: se a coluna já existir, não faz nada.
 */
module.exports = {
  async up(queryInterface, Sequelize) {
    const table = await queryInterface.describeTable('processos');
    if (!table.vinculacao) {
      await queryInterface.addColumn('processos', 'vinculacao', {
        type: Sequelize.STRING(255),
        allowNull: true,
      });
      await queryInterface.addIndex('processos', ['vinculacao'], {
        name: 'processos_vinculacao',
      });
    }
  },

  async down(queryInterface) {
    const table = await queryInterface.describeTable('processos');
    if (table.vinculacao) {
      await queryInterface.removeIndex('processos', 'processos_vinculacao');
      await queryInterface.removeColumn('processos', 'vinculacao');
    }
  },
};
