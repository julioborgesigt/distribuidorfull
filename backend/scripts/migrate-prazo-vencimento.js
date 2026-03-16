#!/usr/bin/env node

/**
 * Script para preencher a coluna prazo_vencimento nos registros existentes.
 * Executa um UPDATE em batch direto no MySQL (sem carregar dados na memória).
 *
 * USO:
 *   node scripts/migrate-prazo-vencimento.js
 *
 * O script cria a coluna prazo_vencimento automaticamente caso não exista.
 */

require('dotenv').config({ path: __dirname + '/../.env' });
const mysql = require('mysql2/promise');

const config = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: 3306
};

async function main() {
  console.log('═══════════════════════════════════════════════════════');
  console.log('  MIGRAÇÃO: Preencher prazo_vencimento');
  console.log('═══════════════════════════════════════════════════════\n');

  let connection;

  try {
    console.log('→ Conectando ao banco de dados...');
    connection = await mysql.createConnection(config);
    console.log('✓ Conectado com sucesso!\n');

    // Verifica se a coluna prazo_vencimento já existe
    const [columns] = await connection.query(
      `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS
       WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'processos' AND COLUMN_NAME = 'prazo_vencimento'`,
      [config.database]
    );

    if (columns.length === 0) {
      console.log('→ Coluna prazo_vencimento não existe. Criando...');
      await connection.query(
        `ALTER TABLE processos ADD COLUMN prazo_vencimento DATE NULL`
      );
      console.log('✓ Coluna prazo_vencimento criada com sucesso!\n');
    } else {
      console.log('✓ Coluna prazo_vencimento já existe.\n');
    }

    // Verifica quantos registros precisam ser atualizados
    const [countResult] = await connection.query(
      `SELECT COUNT(*) as total FROM processos
       WHERE prazo_vencimento IS NULL
       AND data_intimacao IS NOT NULL
       AND prazo_processual IS NOT NULL`
    );
    const total = countResult[0].total;
    console.log(`→ Registros a atualizar: ${total}`);

    if (total === 0) {
      console.log('\n✓ Nenhum registro precisa ser atualizado.');
      return;
    }

    // Atualiza em batch direto no MySQL (muito mais rápido que carregar no Node)
    console.log('→ Executando UPDATE em batch...');
    const [result] = await connection.query(
      `UPDATE processos
       SET prazo_vencimento = DATE_ADD(data_intimacao, INTERVAL CAST(prazo_processual AS UNSIGNED) DAY)
       WHERE prazo_vencimento IS NULL
       AND data_intimacao IS NOT NULL
       AND prazo_processual IS NOT NULL`
    );

    console.log(`✓ ${result.affectedRows} registros atualizados com sucesso!\n`);

    // Verifica se restou algum NULL
    const [verification] = await connection.query(
      `SELECT COUNT(*) as remaining FROM processos
       WHERE prazo_vencimento IS NULL
       AND data_intimacao IS NOT NULL
       AND prazo_processual IS NOT NULL`
    );
    console.log(`→ Registros restantes sem prazo_vencimento: ${verification[0].remaining}`);

    console.log('\n═══════════════════════════════════════════════════════');
    console.log('  MIGRAÇÃO CONCLUÍDA');
    console.log('═══════════════════════════════════════════════════════\n');

  } catch (error) {
    console.error('\n✗ ERRO:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('✓ Conexão fechada.\n');
    }
  }
}

if (!config.host || !config.user || !config.password || !config.database) {
  console.error('✗ ERRO: Variáveis de ambiente não configuradas');
  console.error('Certifique-se de que DB_HOST, DB_USER, DB_PASS e DB_NAME estão definidas no .env');
  process.exit(1);
}

main();
