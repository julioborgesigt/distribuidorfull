// /utils/sgtClient.js
//
// Cliente do webservice público do SGT/CNJ (Tabelas Processuais Unificadas).
// Usado para traduzir códigos de classe/assunto em nomes.
//
// WSDL: https://www.cnj.jus.br/sgt/sgt_ws.php?wsdl  (RPC/literal)
// Operação: pesquisarItemPublicoWS(tipoTabela, tipoPesquisa, valorPesquisa)
//   tipoTabela:   'C' classes | 'A' assuntos | 'M' movimentos
//   tipoPesquisa: 'C' por código | 'N' por nome | 'G' por glossário
//   retorno: array de Item { cod_item, cod_item_pai, nome, dscGlossario }
//
// Endpoint configurável por SGT_ENDPOINT (default = produção do CNJ).

const https = require('https');

const ENDPOINT = process.env.SGT_ENDPOINT || 'https://www.cnj.jus.br/sgt/sgt_ws.php';
const NS = 'https://www.cnj.jus.br/sgt/sgt_ws.php';

function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function decode(s) {
  return String(s)
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, '&');
}

function postSoap(action, xml) {
  const timeout = parseInt(process.env.SGT_TIMEOUT, 10) || 30000;
  return new Promise((resolve, reject) => {
    const u = new URL(ENDPOINT);
    const data = Buffer.from(xml, 'utf8');
    const req = https.request(
      {
        hostname: u.hostname,
        port: u.port || 443,
        path: u.pathname + u.search,
        method: 'POST',
        headers: {
          'Content-Type': 'text/xml; charset=utf-8',
          'Content-Length': data.length,
          SOAPAction: action,
        },
        timeout,
      },
      (res) => {
        let body = '';
        res.setEncoding('utf8');
        res.on('data', (c) => (body += c));
        res.on('end', () => resolve({ status: res.statusCode, body }));
      }
    );
    req.on('timeout', () => req.destroy(new Error('Timeout na requisição ao SGT')));
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

// Extrai os itens (cod_item + nome) do XML de resposta. Tolera prefixos de
// namespace e atributos nas tags (ex.: xsi:type).
function parseItems(xml) {
  const items = [];
  const re =
    /<(?:\w+:)?cod_item[^>]*>(\d+)<\/(?:\w+:)?cod_item>[\s\S]*?<(?:\w+:)?nome[^>]*>([\s\S]*?)<\/(?:\w+:)?nome>/gi;
  let m;
  while ((m = re.exec(xml)) !== null) {
    items.push({ cod_item: m[1], nome: decode(m[2].trim()) });
  }
  return items;
}

async function pesquisar(tipoTabela, tipoPesquisa, valorPesquisa) {
  const envelope =
    `<?xml version="1.0" encoding="UTF-8"?>` +
    `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:sgt="${NS}">` +
    `<soapenv:Body>` +
    `<sgt:pesquisarItemPublicoWS>` +
    `<tipoTabela>${esc(tipoTabela)}</tipoTabela>` +
    `<tipoPesquisa>${esc(tipoPesquisa)}</tipoPesquisa>` +
    `<valorPesquisa>${esc(valorPesquisa)}</valorPesquisa>` +
    `</sgt:pesquisarItemPublicoWS>` +
    `</soapenv:Body>` +
    `</soapenv:Envelope>`;
  const { body } = await postSoap(`${NS}#pesquisarItemPublicoWS`, envelope);
  return { items: parseItems(body), raw: body };
}

// Devolve o nome de um item pelo código exato (ou null se não achar).
async function buscarNomePorCodigo(tipoTabela, codigo) {
  const { items } = await pesquisar(tipoTabela, 'C', String(codigo));
  const match = items.find((i) => String(i.cod_item) === String(codigo)) || items[0];
  return match ? match.nome : null;
}

module.exports = { pesquisar, buscarNomePorCodigo, parseItems, ENDPOINT };
