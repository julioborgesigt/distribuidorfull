// /utils/tpu.js
//
// Tradução de códigos da TPU (Tabela Processual Unificada do CNJ) para nomes,
// usada para deixar os processos vindos do PJe (que trazem só códigos) com a
// mesma aparência dos do eSAJ (que trazem nomes).
//
// As tabelas oficiais do CNJ são extensas; aqui mantemos uma semente dos
// códigos efetivamente vistos no acervo (predominantemente criminal). Quando um
// código não está na semente, devolvemos um rótulo legível (ex.: "Classe 279"),
// nunca um nome inventado. Para popular a tabela completa, rode na sua máquina:
//   node scripts/atualizar-tpu.js   (baixa do SGT/CNJ e sobrescreve tpu-data.json)
//
// Se existir utils/tpu-data.json, ele tem prioridade sobre a semente abaixo.

const path = require('path');

// Semente mínima e confiável (alta confiança nos nomes). A tabela completa é
// populada por scripts/atualizar-tpu.js (gera utils/tpu-data.json).
const SEED = {
  classes: {
    277: 'Procedimentos Investigatórios',
    279: 'Inquérito Policial',
    280: 'Auto de Prisão em Flagrante',
  },
  assuntos: {},
};

let data = SEED;
try {
  // eslint-disable-next-line global-require
  const external = require(path.join(__dirname, 'tpu-data.json'));
  data = {
    classes: { ...SEED.classes, ...(external.classes || {}) },
    assuntos: { ...SEED.assuntos, ...(external.assuntos || {}) },
  };
} catch {
  // tpu-data.json é opcional; segue com a semente.
}

function lookup(tabela, codigo, rotuloPadrao) {
  if (codigo == null || codigo === '') return '';
  const nome = data[tabela] ? data[tabela][String(codigo).trim()] : undefined;
  return nome || `${rotuloPadrao} ${String(codigo).trim()}`;
}

function classeNome(codigo) {
  return lookup('classes', codigo, 'Classe');
}

function assuntoNome(codigo) {
  return lookup('assuntos', codigo, 'Assunto');
}

module.exports = { classeNome, assuntoNome };
