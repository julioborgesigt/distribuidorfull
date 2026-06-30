'use strict';

/**
 * Cria a tabela `pje_credentials` para guardar as credenciais do PJe
 * criptografadas (AES-256-GCM). No máximo 1 linha (singleton gerenciado
 * pelo serviço). A chave de criptografia nunca vai ao banco — fica em
 * variável de ambiente (PJE_CRED_ENC_KEY).
 *
 * Idempotente: se a tabela já existir, não faz nada.
 */
module.exports = {
  async up(queryInterface, Sequelize) {
    const tables = await queryInterface.showAllTables();
    if (tables.includes('pje_credentials')) return;

    await queryInterface.createTable('pje_credentials', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      cpf_criptografado: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      senha_criptografada: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      // Últimos 2 dígitos do CPF, em texto plano, para exibição no painel.
      cpf_display: {
        type: Sequelize.STRING(20),
        allowNull: true
      },
      // Auditoria: quem fez o último salvamento.
      atualizado_por_id: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
      }
    });
  },

  async down(queryInterface) {
    const tables = await queryInterface.showAllTables();
    if (tables.includes('pje_credentials')) {
      await queryInterface.dropTable('pje_credentials');
    }
  }
};
