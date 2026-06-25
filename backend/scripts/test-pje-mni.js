// /scripts/test-pje-mni.js
//
// Script de DIAGNÓSTICO do webservice MNI do PJe (TJCE).
// NÃO faz parte do servidor — é uma ferramenta de linha de comando para
// validar, antes de qualquer integração definitiva:
//   1. Se o endpoint MNI está no ar e o WSDL é legível.
//   2. Os nomes/estrutura EXATOS dos parâmetros de cada operação.
//   3. Se a autenticação por CPF + senha funciona apesar do MFA do TJCE.
//   4. O formato dos avisos pendentes (para mapear nos 6 campos do sistema).
//
// COMO USAR (na sua máquina, fora do ambiente remoto):
//   cd backend
//   npm install soap            # dependência usada só por este script
//   set PJE_CPF=00000000000      (Windows CMD)   |  export PJE_CPF=... (Linux/Mac)
//   set PJE_SENHA=suaSenhaPje
//   node scripts/test-pje-mni.js
//
// Opcional:
//   set PJE_WSDL=https://pje.tjce.jus.br/pje2grau/intercomunicacao?wsdl   (2º grau)
//
// NUNCA comite suas credenciais. Use sempre variáveis de ambiente.

let soap;
try {
  soap = require('soap');
} catch {
  console.error('\n[ERRO] A lib "soap" não está instalada.');
  console.error('Rode:  npm install soap\n');
  process.exit(1);
}

const https = require('https');

const WSDL =
  process.env.PJE_WSDL ||
  'https://pje.tjce.jus.br/pje1grau/intercomunicacao?wsdl';
const CPF = process.env.PJE_CPF;
const SENHA = process.env.PJE_SENHA;

// POST cru de um envelope SOAP, devolvendo o corpo da resposta como string.
// Usado em vez da montagem automática da lib soap para controlar os namespaces.
function postSoap(endpoint, xml, soapAction = '') {
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
          SOAPAction: soapAction,
        },
      },
      (res) => {
        let chunks = '';
        res.setEncoding('utf8');
        res.on('data', (c) => (chunks += c));
        res.on('end', () => resolve({ status: res.statusCode, body: chunks }));
      }
    );
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function main() {
  console.log('=== Diagnóstico MNI/PJe ===');
  console.log('WSDL:', WSDL);

  // 1) Cria o client a partir do WSDL. Se isto falhar, o endpoint não está
  //    publicado/acessível a partir desta rede.
  let client;
  try {
    client = await soap.createClientAsync(WSDL, { disableCache: true });
    console.log('\n[OK] WSDL carregado com sucesso — endpoint está no ar.');
  } catch (err) {
    console.error('\n[FALHA] Não foi possível carregar o WSDL:', err.message);
    console.error('Verifique a URL, a rede e se o serviço está publicado.');
    process.exit(2);
  }

  // 2) Lista as operações disponíveis e a estrutura de entrada de cada uma.
  //    É aqui que descobrimos os nomes EXATOS dos parâmetros (variam por versão
  //    do MNI: idConsultante/idRepresentante, senhaConsultante, dataReferencia...).
  const description = client.describe();
  console.log('\n=== Operações expostas pelo serviço ===');
  for (const service of Object.keys(description)) {
    for (const port of Object.keys(description[service])) {
      const ops = Object.keys(description[service][port]);
      console.log(`Service ${service} / Port ${port}:`);
      ops.forEach((op) => console.log('   -', op));
      // Mostra o schema de entrada da operação de avisos pendentes, se existir.
      const avisosOp = ops.find((o) => /consultarAvisosPendentes/i.test(o));
      if (avisosOp) {
        console.log(`\nSchema de entrada de "${avisosOp}":`);
        console.dir(description[service][port][avisosOp].input, { depth: 4 });
      }
    }
  }

  // 3) Tenta autenticar e consultar os avisos pendentes.
  if (!CPF || !SENHA) {
    console.log(
      '\n[PULADO] Defina PJE_CPF e PJE_SENHA para testar a autenticação e a consulta.'
    );
    return;
  }

  // Estrutura exigida pelo TJCE (confirmada pelos erros de unmarshalling):
  //   <ser:consultarAvisosPendentes>   -> namespace do SERVIÇO (com barra final)
  //     <tip:idConsultante>            -> namespace de TIPOS
  //     <tip:senhaConsultante>
  // Montamos o envelope à mão para controlar os dois namespaces.
  const SERVICE_NS = 'http://www.cnj.jus.br/servico-intercomunicacao-2.2.2/';
  const TIPOS_NS = 'http://www.cnj.jus.br/tipos-servico-intercomunicacao-2.2.2';
  const esc = (s) =>
    String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

  const envelope =
    `<?xml version="1.0" encoding="UTF-8"?>` +
    `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"` +
    ` xmlns:ser="${SERVICE_NS}" xmlns:tip="${TIPOS_NS}">` +
    `<soapenv:Header/>` +
    `<soapenv:Body>` +
    `<ser:consultarAvisosPendentes>` +
    `<tip:idConsultante>${esc(CPF)}</tip:idConsultante>` +
    `<tip:senhaConsultante>${esc(SENHA)}</tip:senhaConsultante>` +
    `</ser:consultarAvisosPendentes>` +
    `</soapenv:Body>` +
    `</soapenv:Envelope>`;

  const endpoint = WSDL.replace(/\?wsdl.*$/i, '');
  console.log('\n=== Chamando consultarAvisosPendentes (POST cru) ===');
  console.log('Endpoint:', endpoint);

  let resp;
  try {
    resp = await postSoap(endpoint, envelope);
  } catch (err) {
    console.error('\n[FALHA] Erro de rede no POST:', err.message);
    return;
  }

  const body = resp.body || '';
  console.log('HTTP status:', resp.status);

  if (/<(\w+:)?Fault[> ]/i.test(body)) {
    console.error('\n[FALHA] SOAP Fault retornado:\n');
    console.log(body.slice(0, 4000));
    console.error(
      '\nInterpretação:\n' +
        ' - "usuario/senha", "credenciais", "nao autorizado", "2FA": o acesso por\n' +
        '   CPF+senha foi recusado (possível efeito do MFA) -> certificado ou\n' +
        '   credencial de sistema. CATI TJCE: (85) 3366-2966.\n' +
        ' - "Unmarshalling/elemento inesperado": ainda há ajuste de XML a fazer.'
    );
    return;
  }

  console.log('\n[OK] Resposta sem Fault. XML bruto (até 8000 chars):\n');
  console.log(body.slice(0, 8000));

  const sucesso = (body.match(/<(?:\w+:)?sucesso>([^<]*)</i) || [])[1];
  const mensagem = (body.match(/<(?:\w+:)?mensagem>([^<]*)</i) || [])[1];
  const qtdAvisos = (body.match(/<(?:\w+:)?aviso\b/gi) || []).length;
  console.log('\n--- Resumo ---');
  console.log('sucesso :', sucesso);
  console.log('mensagem:', mensagem);
  console.log('avisos  :', qtdAvisos);
}

main().catch((e) => {
  console.error('Erro inesperado:', e);
  process.exit(1);
});
