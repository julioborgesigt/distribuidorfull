// Configuração de banco para o sequelize-cli (migrations)
// Usa as mesmas variáveis de ambiente do app (backend/.env)
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const base = {
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10) || 3306,
  dialect: 'mysql',
  dialectOptions: {
    charset: 'utf8mb4',
  },
  logging: false,
};

module.exports = {
  development: base,
  test: base,
  production: base,
};
