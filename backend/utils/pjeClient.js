// /utils/pjeClient.js
//
// Cliente do webservice MNI 2.2.2 do PJe (TJCE). Faz POST SOAP cru com o módulo
// https nativo (sem dependência externa) e delega o parsing ao pjeParser.
//
// Configuração por variáveis de ambiente:
//   PJE_MNI_ENDPOINT  endpoint SOAP (default: 1º grau do TJCE)
//   PJE_CPF           CPF do consultante (somente números)
//   PJE_SENHA         senha do PJe
//   PJE_MNI_TIMEOUT   timeout por requisição em ms (default 30000)
//
// IMPORTANTE: consultarTeorComunicacao REGISTRA CIÊNCIA e INICIA O PRAZO do
// aviso. Só deve ser chamado de forma deliberada (ver pjeController).

const https = require('https');
const logger = require('./logger');
const { parseAvisos, parseTeor } = require('./pjeParser');

const SERVICE_NS = 'http://www.cnj.jus.br/servico-intercomunicacao-2.2.2/';
const TIPOS_NS = 'http://www.cnj.jus.br/tipos-servico-intercomunicacao-2.2.2';

const DEFAULT_ENDPOINT = 'https://pje.tjce.jus.br/pje1grau/intercomunicacao';

function getEndpoint() {
  return process.env.PJE_MNI_ENDPOINT || DEFAULT_ENDPOINT;
}

function getCredentials({ cpf, senha } = {}) {
  const id = cpf || process.env.PJE_CPF;
  const pass = senha || process.env.PJE_SENHA;
  if (!id || !pass) {
    throw new Error(
      'Credenciais do PJe ausentes. Configure em "Autenticação PJe" no painel ' +
      '(ou defina PJE_CPF e PJE_SENHA no ambiente, para o cron).'
    );
  }
  return { id, pass };
}

function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function buildEnvelope(operation, innerXml) {
  return (
    `<?xml version="1.0" encoding="UTF-8"?>` +
    `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"` +
    ` xmlns:ser="${SERVICE_NS}" xmlns:tip="${TIPOS_NS}">` +
    `<soapenv:Header/>` +
    `<soapenv:Body>` +
    `<ser:${operation}>${innerXml}</ser:${operation}>` +
    `</soapenv:Body>` +
    `</soapenv:Envelope>`
  );
}

// POST SOAP cru; resolve com o corpo (string). A resposta pode ser MTOM
// (multipart/related) — o pjeParser trabalha sobre o texto sem precisar separar
// as partes MIME, pois só casa com os blocos XML de interesse.
function postSoap(xml) {
  const endpoint = getEndpoint();
  const timeout = parseInt(process.env.PJE_MNI_TIMEOUT, 10) || 30000;
  return new Promise((resolve, reject) => {
    const u = new URL(endpoint);
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
          SOAPAction: '',
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
    req.on('timeout', () => req.destroy(new Error('Timeout na requisição ao PJe')));
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

function extractFault(body) {
  if (!/<(\w+:)?Fault[> ]/i.test(body)) return null;
  const msg =
    (body.match(/<faultstring>([\s\S]*?)<\/faultstring>/i) || [])[1] ||
    (body.match(/<(?:\w+:)?mensagem>([^<]*)</i) || [])[1] ||
    'Falha SOAP não detalhada';
  return msg.trim();
}

// O MNI sinaliza falhas de negócio (ex.: credenciais inválidas) SEM <Fault>,
// apenas com <sucesso>false</sucesso><mensagem>...</mensagem>. Sem checar isso,
// uma falha de autenticação seria confundida com "0 avisos". Devolve a mensagem
// de erro quando sucesso=false, ou null quando ok.
function extractInsucesso(body) {
  const sucesso = (body.match(/<(?:\w+:)?sucesso>([^<]*)</i) || [])[1];
  if (sucesso && sucesso.trim().toLowerCase() === 'false') {
    const msg = (body.match(/<(?:\w+:)?mensagem>([^<]*)</i) || [])[1];
    return (msg && msg.trim()) || 'falha não detalhada';
  }
  return null;
}

// Lista avisos pendentes do consultante. NÃO registra ciência.
async function consultarAvisosPendentes(creds) {
  const { id, pass } = getCredentials(creds);
  const inner =
    `<tip:idConsultante>${esc(id)}</tip:idConsultante>` +
    `<tip:senhaConsultante>${esc(pass)}</tip:senhaConsultante>`;
  const { body } = await postSoap(buildEnvelope('consultarAvisosPendentes', inner));

  const fault = extractFault(body) || extractInsucesso(body);
  if (fault) {
    logger.error('MNI consultarAvisosPendentes falhou', { fault });
    throw new Error(`PJe: ${fault}`);
  }
  return parseAvisos(body);
}

// Consulta o teor de UM aviso. ATENÇÃO: registra ciência e inicia o prazo.
async function consultarTeorComunicacao(idAviso, creds) {
  if (!idAviso) throw new Error('idAviso é obrigatório.');
  const { id, pass } = getCredentials(creds);
  const inner =
    `<tip:idConsultante>${esc(id)}</tip:idConsultante>` +
    `<tip:senhaConsultante>${esc(pass)}</tip:senhaConsultante>` +
    `<tip:identificadorAviso>${esc(idAviso)}</tip:identificadorAviso>`;
  const { body } = await postSoap(buildEnvelope('consultarTeorComunicacao', inner));

  const fault = extractFault(body) || extractInsucesso(body);
  if (fault) {
    logger.error('MNI consultarTeorComunicacao falhou', { idAviso, fault });
    throw new Error(`PJe: ${fault}`);
  }
  return parseTeor(body);
}

module.exports = {
  getEndpoint,
  consultarAvisosPendentes,
  consultarTeorComunicacao,
  // exportados para teste
  _internal: { buildEnvelope, extractFault, extractInsucesso, esc },
};
