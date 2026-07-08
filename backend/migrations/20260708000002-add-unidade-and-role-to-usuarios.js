'use strict';

/**
 * Adiciona a dimensão de unidade e o papel (role) aos usuários.
 *
 * - `unidade_id`: FK para unidades. NULLABLE de propósito — o super global não
 *   pertence a nenhuma unidade (cruza todas). admin_unidade e servidor exigem
 *   unidade (validado na aplicação).
 * - `role`: papel de acesso. Fonte de verdade da autorização:
 *     super         → cruza todas as unidades (global)
 *     admin_unidade → gerencia toda a sua unidade
 *     servidor      → vê apenas os próprios processos, dentro da sua unidade
 *
 * Backfill: todos os usuários existentes recebem a unidade padrão (Iguatu).
 * role = 'super' para quem já era admin_super; 'servidor' para os demais.
 * O ajuste final (só o julio permanece super; os outros ex-supers viram
 * admin_unidade) é feito pelo script de deploy scripts/ensure-super-admin.js,
 * guiado pela env SUPER_ADMIN_MATRICULA — mantendo esta migration genérica.
 *
 * As colunas booleanas admin_padrao/admin_super são mantidas em sincronia com
 * role para não quebrar código legado durante a transição.
 */
const { DEFAULT_UNIDADE_NOME } = require('../data/unidades');

module.exports = {
  async up(queryInterface, Sequelize) {
    const table = await queryInterface.describeTable('usuarios');

    if (!table.unidade_id) {
      await queryInterface.addColumn('usuarios', 'unidade_id', {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'unidades', key: 'id' },
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE',
      });
    }

    if (!table.role) {
      await queryInterface.addColumn('usuarios', 'role', {
        type: Sequelize.ENUM('super', 'admin_unidade', 'servidor'),
        allowNull: false,
        defaultValue: 'servidor',
      });
    }

    // Descobre o id da unidade padrão (Iguatu).
    const [unidade] = await queryInterface.sequelize.query(
      'SELECT id FROM unidades WHERE nome = ? LIMIT 1',
      { replacements: [DEFAULT_UNIDADE_NOME], type: Sequelize.QueryTypes.SELECT },
    );
    if (!unidade) {
      throw new Error('Unidade padrão não encontrada — a migration de criação de unidades deve rodar antes.');
    }

    // Backfill: vincula todos os usuários existentes à unidade padrão.
    await queryInterface.sequelize.query(
      'UPDATE usuarios SET unidade_id = ? WHERE unidade_id IS NULL',
      { replacements: [unidade.id] },
    );

    // Deriva role a partir das flags atuais.
    await queryInterface.sequelize.query(
      "UPDATE usuarios SET role = 'super' WHERE admin_super = 1",
    );
    await queryInterface.sequelize.query(
      "UPDATE usuarios SET role = 'servidor' WHERE admin_super = 0",
    );
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('usuarios', 'unidade_id');
    await queryInterface.removeColumn('usuarios', 'role');
    // MySQL: o tipo ENUM é removido junto com a coluna.
  },
};
