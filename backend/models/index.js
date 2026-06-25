// /models/index.js
const { Sequelize } = require('sequelize');
const UserModel = require('./user');
const ProcessModel = require('./process');
const PjeImportLogModel = require('./pjeImportLog');
const logger = require('../utils/logger');

// Ajuste aqui suas credenciais e nome do banco
const sequelize = new Sequelize(
  process.env.DB_NAME,    //
  process.env.DB_USER,    //
  process.env.DB_PASS,    //
  {
    host: process.env.DB_HOST, // 'sao.domcloud.co'
    dialect: 'mysql',
    dialectOptions: {
      charset: 'utf8mb4',
    },
    port: 3306,
    logging: (msg) => logger.debug(msg),
    pool: {
      max: 10,   // máximo de conexões simultâneas
      min: 2,    // conexões mantidas ativas
      acquire: 30000, // ms para tentar adquirir conexão antes de erro
      idle: 10000     // ms sem uso antes de liberar a conexão
    }
  }
);


// Carrega os models
const User = UserModel(sequelize);
const Process = ProcessModel(sequelize);
const PjeImportLog = PjeImportLogModel(sequelize);

// Relacionamentos (1-N: 1 usuário pode ter vários processos)
User.hasMany(Process, { foreignKey: 'userId' });
Process.belongsTo(User, { foreignKey: 'userId' });

module.exports = {
  sequelize,
  User,
  Process,
  PjeImportLog
};
