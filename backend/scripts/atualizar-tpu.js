// /scripts/atualizar-tpu.js
//
// Versão de linha de comando da atualização da TPU (mesma lógica do botão no
// painel — ver services/tpuService.js). Descobre os códigos em rótulo
// provisório a partir dos processos, busca os nomes no SGT/CNJ, corrige as
// linhas no banco e grava utils/tpu-data.json.
//
// Rode na máquina/servidor COM acesso à internet:
//   cd backend && node scripts/atualizar-tpu.js
//   (opcional) SGT_ENDPOINT=https://wwwh.cnj.jus.br/sgt/sgt_ws.php

require('dotenv').config({ path: __dirname + '/../.env' });

const { sequelize } = require('../models');
const { atualizarTpu } = require('../services/tpuService');

(async () => {
  try {
    await sequelize.authenticate();

    const resumo = await atualizarTpu({
      onSample: (raw) => {
        console.log('\n--- amostra da resposta do SGT (depuração) ---');
        console.log(String(raw).slice(0, 700));
        console.log('----------------------------------------------\n');
      },
    });

    console.log(
      `Classes: ${resumo.classes.resolvidos}/${resumo.classes.pendentes} resolvidas ` +
        `(${resumo.classes.corrigidos} linhas).`
    );
    console.log(
      `Assuntos: ${resumo.assuntos.resolvidos}/${resumo.assuntos.pendentes} resolvidos ` +
        `(${resumo.assuntos.corrigidos} linhas).`
    );
    if (resumo.naoEncontrados.length) {
      console.log('Não encontrados:', resumo.naoEncontrados.join(', '));
    }
    console.log('\ntpu-data.json atualizado. Reinicie o app (touch tmp/restart.txt) se quiser.');

    await sequelize.close();
    process.exit(0);
  } catch (err) {
    console.error('Falha ao atualizar a TPU:', err.message);
    try { await sequelize.close(); } catch { /* ignore */ }
    process.exit(1);
  }
})();
