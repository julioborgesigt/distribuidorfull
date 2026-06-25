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

  // 4) PROBE OPCIONAL DO TEOR — só roda se PJE_TEOR_IDAVISO estiver definido.
  //    ATENÇÃO: consultarTeorComunicacao REGISTRA CIÊNCIA e INICIA O PRAZO do
  //    aviso consultado. Use um idAviso real que você ACEITE abrir. Serve para
  //    inspecionar o formato do teor e construir o parser do prazo.
  const idAviso = process.env.PJE_TEOR_IDAVISO;
  if (!idAviso) {
    console.log(
      '\n[TEOR] Para inspecionar o teor de UM aviso (ISSO DÁ CIÊNCIA E INICIA O PRAZO),\n' +
        '       rode com:  PJE_TEOR_IDAVISO=<idAviso>  (ex.: um dos idAviso listados acima).'
    );
    return;
  }

  // Mostra o schema de entrada da operação de teor, se a lib soap o expôs.
  try {
    const desc = client.describe();
    for (const s of Object.keys(desc)) {
      for (const p of Object.keys(desc[s])) {
        const teorOp = Object.keys(desc[s][p]).find((o) =>
          /consultarTeorComunicacao/i.test(o)
        );
        if (teorOp) {
          console.log(`\nSchema de entrada de "${teorOp}":`);
          console.dir(desc[s][p][teorOp].input, { depth: 4 });
        }
      }
    }
  } catch { /* ignore */ }

  console.log(
    `\n=== Chamando consultarTeorComunicacao para idAviso=${idAviso} (ABRE/DÁ CIÊNCIA) ===`
  );
  const teorEnvelope =
    `<?xml version="1.0" encoding="UTF-8"?>` +
    `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"` +
    ` xmlns:ser="${SERVICE_NS}" xmlns:tip="${TIPOS_NS}">` +
    `<soapenv:Header/>` +
    `<soapenv:Body>` +
    `<ser:consultarTeorComunicacao>` +
    `<tip:idConsultante>${esc(CPF)}</tip:idConsultante>` +
    `<tip:senhaConsultante>${esc(SENHA)}</tip:senhaConsultante>` +
    `<tip:identificadorAviso>${esc(idAviso)}</tip:identificadorAviso>` +
    `</ser:consultarTeorComunicacao>` +
    `</soapenv:Body>` +
    `</soapenv:Envelope>`;

  let teorResp;
  try {
    teorResp = await postSoap(endpoint, teorEnvelope);
  } catch (err) {
    console.error('\n[FALHA] Erro de rede no POST do teor:', err.message);
    return;
  }
  console.log('HTTP status:', teorResp.status);
  const tbody = teorResp.body || '';
  if (/<(\w+:)?Fault[> ]/i.test(tbody)) {
    console.error('\n[FALHA] SOAP Fault no teor (provável nome de campo errado):\n');
    console.log(tbody.slice(0, 4000));
    return;
  }
  // O teor costuma vir como anexo MTOM (base64) e/ou texto. Mostramos o XML
  // (sem o binário gigante) para identificar onde está o prazo/estrutura.
  const semBinario = tbody.replace(/[A-Za-z0-9+/]{200,}={0,2}/g, '[BASE64_OMITIDO]');
  console.log('\n[OK] Resposta do teor (XML, base64 omitido, até 8000 chars):\n');
  console.log(semBinario.slice(0, 8000));
  console.log(
    '\n[DICA] Procure no XML acima por: prazo, "dias", mimetype/mimeType,\n' +
      '       <documento>, descrição do ato. É daí que sai o prazo_processual.'
  );
}

main().catch((e) => {
  console.error('Erro inesperado:', e);
  process.exit(1);
});
