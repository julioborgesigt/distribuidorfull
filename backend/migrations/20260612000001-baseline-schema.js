'use strict';

/**
 * Baseline do schema: cria as tabelas usuarios e processos em ambientes novos.
 *
 * Em bancos que já existem (a produção atual foi criada via sequelize.sync())
 * as tabelas são detectadas e a criação é PULADA — a migration apenas entra
 * no histórico (SequelizeMeta). Isso permite adotar migrations sem tocar nos
 * dados existentes.
 *
 * A partir daqui, toda mudança de schema deve ser uma nova migration
 * (npx sequelize-cli migration:generate --name descricao-da-mudanca),
 * mantendo os models em models/ sincronizados manualmente.
 */
module.exports = {
  async up(queryInterface, Sequelize) {
    const tables = await queryInterface.showAllTables();
    const hasTable = name => tables.includes(name);

    if (!hasTable('usuarios')) {
      await queryInterface.createTable('usuarios', {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
          allowNull: false,
        },
        matricula: {
          type: Sequelize.STRING(20),
          allowNull: false,
          unique: true,
        },
        nome: {
          type: Sequelize.STRING(100),
          allowNull: false,
        },
        senha: {
          type: Sequelize.STRING(100),
          allowNull: false,
        },
        senha_padrao: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: true,
        },
        admin_padrao: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
        admin_super: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
      }, { charset: 'utf8mb4' });
    }

    if (!hasTable('processos')) {
      await queryInterface.createTable('processos', {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
          allowNull: false,
        },
        numero_processo: {
          type: Sequelize.STRING(50),
          allowNull: false,
          unique: true,
        },
        prazo_processual: {
          type: Sequelize.STRING(20),
          allowNull: false,
        },
        classe_principal: {
          type: Sequelize.STRING(255),
        },
        assunto_principal: {
          type: Sequelize.STRING(255),
        },
        tarjas: {
          type: Sequelize.STRING(255),
        },
        data_intimacao: {
          type: Sequelize.DATEONLY,
        },
        prazo_vencimento: {
          type: Sequelize.DATEONLY,
          allowNull: true,
        },
        cumprido: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
        reiteracoes: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
        cumpridoDate: {
          type: Sequelize.DATE,
          allowNull: true,
        },
        observacoes: {
          type: Sequelize.STRING(300),
          allowNull: false,
          defaultValue: '',
        },
        userId: {
          type: Sequelize.INTEGER,
          allowNull: true,
          references: { model: 'usuarios', key: 'id' },
          onDelete: 'SET NULL',
          onUpdate: 'CASCADE',
        },
      }, { charset: 'utf8mb4' });

      // Índices de performance (espelham models/process.js)
      await queryInterface.addIndex('processos', ['cumprido']);
      await queryInterface.addIndex('processos', ['prazo_vencimento']);
      await queryInterface.addIndex('processos', ['classe_principal']);
      await queryInterface.addIndex('processos', ['assunto_principal']);
      await queryInterface.addIndex('processos', ['tarjas']);
      await queryInterface.addIndex('processos', ['cumpridoDate']);
      await queryInterface.addIndex('processos', ['cumprido', 'prazo_vencimento'], { name: 'idx_cumprido_prazo_vencimento' });
      await queryInterface.addIndex('processos', ['userId', 'cumprido'], { name: 'idx_userid_cumprido' });
    }
  },

  async down(queryInterface) {
    await queryInterface.dropTable('processos');
    await queryInterface.dropTable('usuarios');
  },
};
