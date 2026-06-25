// /scripts/atualizar-tpu.js
//
// Popula utils/tpu-data.json com os nomes reais de classes e assuntos do CNJ,
// consultando o webservice público do SGT, e CORRIGE os processos já importados
// que ficaram com o rótulo provisório ("Classe NNN" / "Assunto NNN").
//
// Rode na máquina/servidor COM acesso à internet (o ambiente do app no DomCloud
// alcança o CNJ):
//   cd backend && node scripts/atualizar-tpu.js
//
// Opcional:
//   SGT_ENDPOINT=https://wwwh.cnj.jus.br/sgt/sgt_ws.php   (homologação)
//
// Como ele descobre os códigos a partir dos próprios processos, basta rodar
// novamente sempre que aparecerem códigos novos no painel. Após rodar, reinicie
// o app para as próximas importações já usarem os nomes (tmp/restart.txt).

require('dotenv').config({ path: __dirname + '/../.env' });

const fs = require('fs');
const path = require('path');
const { sequelize, Process } = require('../models');
const { Op } = require('sequelize');
const sgt = require('../utils/sgtClient');

const DATA_FILE = path.join(__dirname, '..', 'utils', 'tpu-data.json');

function carregarData() {
  try {
    const json = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    return { classes: json.classes || {}, assuntos: json.assuntos || {} };
  } catch {
    return { classes: {}, assuntos: {} };
  }
}

// Descobre os códigos ainda não traduzidos a partir do rótulo provisório.
async function codigosPendentes(coluna, prefixo) {
  const rows = await Process.findAll({
    attributes: [[sequelize.fn('DISTINCT', sequelize.col(coluna)), 'v']],
    where: { [coluna]: { [Op.like]: `${prefixo} %` } },
    raw: true,
  });
  const re = new RegExp(`^${prefixo}\\s+(\\d+)$`);
  return rows
    .map((r) => (re.exec(String(r.v || '')) || [])[1])
    .filter(Boolean);
}

let mostrouAmostra = false;

async function resolver(tipoTabela, codigos, destino, prefixo, coluna) {
  for (const cod of codigos) {
    try {
      const { items, raw } = await sgt.pesquisar(tipoTabela, 'C', cod);
      if (!mostrouAmostra) {
        console.log('\n--- amostra da resposta do SGT (para depuração) ---');
        console.log(raw.slice(0, 700));
        console.log('--------------------------------------------------\n');
        mostrouAmostra = true;
      }
      const match = items.find((i) => String(i.cod_item) === String(cod)) || items[0];
      const nome = match && match.nome;
      if (nome) {
        destino[cod] = nome;
        const [n] = await Process.update(
          { [coluna]: nome },
          { where: { [coluna]: `${prefixo} ${cod}` } }
        );
        console.log(`${prefixo} ${cod} = ${nome}  (${n} processo(s) corrigido(s))`);
      } else {
        console.warn(`${prefixo} ${cod}: nome não encontrado no SGT`);
      }
    } catch (e) {
      console.error(`${prefixo} ${cod}: erro -> ${e.message}`);
    }
  }
}

(async () => {
  try {
    await sequelize.authenticate();
    const data = carregarData();

    const classes = await codigosPendentes('classe_principal', 'Classe');
    const assuntos = await codigosPendentes('assunto_principal', 'Assunto');
    console.log(
      `Códigos pendentes: ${classes.length} classe(s), ${assuntos.length} assunto(s).`
    );

    await resolver('C', classes, data.classes, 'Classe', 'classe_principal');
    await resolver('A', assuntos, data.assuntos, 'Assunto', 'assunto_principal');

    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2) + '\n');
    console.log(
      `\ntpu-data.json atualizado: ${Object.keys(data.classes).length} classe(s), ` +
        `${Object.keys(data.assuntos).length} assunto(s).`
    );
    console.log('Reinicie o app (toque tmp/restart.txt) para as próximas importações usarem os nomes.');

    await sequelize.close();
    process.exit(0);
  } catch (err) {
    console.error('Falha ao atualizar a TPU:', err.message);
    try { await sequelize.close(); } catch { /* ignore */ }
    process.exit(1);
  }
})();
