// /services/tpuService.js
//
// Atualiza a tradução de classes/assuntos (TPU) consultando o SGT/CNJ:
// descobre os códigos ainda em rótulo provisório ("Classe NNN"/"Assunto NNN")
// a partir dos processos, busca os nomes no SGT, corrige as linhas no banco,
// grava utils/tpu-data.json e atualiza o cache em memória do tpu.
//
// Usado tanto pela rota (botão no painel) quanto pelo script de linha de comando.

const fs = require('fs');
const path = require('path');
const { Process } = require('../models');
const { Op } = require('sequelize');
const sequelize = require('../models').sequelize;
const sgt = require('../utils/sgtClient');
const tpu = require('../utils/tpu');
const logger = require('../utils/logger');

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
  return rows.map((r) => (re.exec(String(r.v || '')) || [])[1]).filter(Boolean);
}

// Executa a atualização completa e devolve um resumo. onSample (opcional) é
// chamado com a primeira resposta crua do SGT (para depuração no CLI).
async function atualizarTpu({ onSample } = {}) {
  const data = carregarData();
  const classes = await codigosPendentes('classe_principal', 'Classe');
  const assuntos = await codigosPendentes('assunto_principal', 'Assunto');

  const resumo = {
    classes: { pendentes: classes.length, resolvidos: 0, corrigidos: 0 },
    assuntos: { pendentes: assuntos.length, resolvidos: 0, corrigidos: 0 },
    naoEncontrados: [],
  };
  let amostrou = false;

  async function resolver(tipoTabela, codigos, destino, prefixo, coluna, stats) {
    for (const cod of codigos) {
      try {
        const { items, raw } = await sgt.pesquisar(tipoTabela, 'C', cod);
        if (!amostrou && typeof onSample === 'function') {
          onSample(raw);
          amostrou = true;
        }
        const match = items.find((i) => String(i.cod_item) === String(cod)) || items[0];
        const nome = match && match.nome;
        if (nome) {
          destino[cod] = nome;
          const [n] = await Process.update(
            { [coluna]: nome },
            { where: { [coluna]: `${prefixo} ${cod}` } }
          );
          stats.resolvidos += 1;
          stats.corrigidos += n;
        } else {
          resumo.naoEncontrados.push(`${prefixo} ${cod}`);
        }
      } catch (e) {
        resumo.naoEncontrados.push(`${prefixo} ${cod} (erro: ${e.message})`);
        logger.warn('Falha ao traduzir código TPU', { prefixo, cod, error: e.message });
      }
    }
  }

  await resolver('C', classes, data.classes, 'Classe', 'classe_principal', resumo.classes);
  await resolver('A', assuntos, data.assuntos, 'Assunto', 'assunto_principal', resumo.assuntos);

  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2) + '\n');
  tpu.mesclar(data); // vale para as próximas importações sem reiniciar

  return resumo;
}

module.exports = { atualizarTpu, codigosPendentes };
