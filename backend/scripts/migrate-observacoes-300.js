#!/usr/bin/env node

/**
 * Altera a coluna observacoes de VARCHAR(100) para VARCHAR(300).
 *
 * USO:
 *   node scripts/migrate-observacoes-300.js
 */

require('dotenv').config({ path: __dirname + '/../.env' });
const mysql = require('mysql2/promise');

const config = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
};

(async () => {
  const conn = await mysql.createConnection(config);
  try {
    await conn.execute(
      "ALTER TABLE processos MODIFY COLUMN observacoes VARCHAR(300) NOT NULL DEFAULT ''"
    );
    console.log('Coluna observacoes alterada para VARCHAR(300) com sucesso.');
  } finally {
    await conn.end();
  }
})().catch(err => {
  console.error('Erro na migração:', err.message);
  process.exit(1);
});
