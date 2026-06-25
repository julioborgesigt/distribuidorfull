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

const WSDL =
  process.env.PJE_WSDL ||
  'https://pje.tjce.jus.br/pje1grau/intercomunicacao?wsdl';
const CPF = process.env.PJE_CPF;
const SENHA = process.env.PJE_SENHA;

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

  // O TJCE exige que os elementos venham QUALIFICADOS no namespace de tipos do
  // MNI 2.2.2 (elementFormDefault="qualified"). A lib soap, por padrão, envia os
  // filhos sem namespace (uri:"") e o servidor rejeita com "elemento inesperado".
  // Solução robusta: injetar o corpo como XML cru já namespaceado, na ordem do
  // schema (idRepresentado?, idConsultante, senhaConsultante, dataReferencia?).
  const NS = 'http://www.cnj.jus.br/tipos-servico-intercomunicacao-2.2.2';
  const esc = (s) =>
    String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  const args = {
    _xml:
      `<ns2:idConsultante xmlns:ns2="${NS}">${esc(CPF)}</ns2:idConsultante>` +
      `<ns2:senhaConsultante xmlns:ns2="${NS}">${esc(SENHA)}</ns2:senhaConsultante>`,
  };

  console.log('\n=== Chamando consultarAvisosPendentes ===');
  try {
    const [result] = await client.consultarAvisosPendentesAsync(args);
    const sucesso = result?.sucesso;
    const mensagem = result?.mensagem;
    console.log('sucesso:', sucesso, '| mensagem:', mensagem);

    // A estrutura exata do retorno varia; imprimimos cru para inspeção e
    // tentamos um resumo amigável dos campos que interessam ao sistema.
    const avisos =
      result?.aviso ||
      result?.avisoPendente ||
      result?.avisos ||
      [];
    const lista = Array.isArray(avisos) ? avisos : [avisos].filter(Boolean);

    console.log(`\nTotal de avisos pendentes: ${lista.length}`);
    lista.slice(0, 5).forEach((a, i) => {
      console.log(`\n--- Aviso ${i + 1} ---`);
      // Tentativa de extrair os campos equivalentes ao CSV do eSAJ.
      console.log('numero_processo  :', a?.numeroProcesso || a?.processo?.numero);
      console.log('data_intimacao   :', a?.dataDisponibilizacao || a?.data);
      console.log('classe_principal :', a?.classeProcessual || a?.processo?.classeProcessual);
      console.log('teor/assunto     :', a?.teor ? '(presente — usar consultarTeorComunicacao)' : '(n/d)');
    });

    console.log('\n=== Retorno bruto (para mapeamento) ===');
    console.dir(result, { depth: 6 });
  } catch (err) {
    console.error('\n[FALHA] Erro na chamada:', err.message);
    console.error(
      'Diagnóstico do erro:\n' +
        ' - "elemento inesperado / Unmarshalling": problema de XML/namespace.\n' +
        ' - "usuario/senha", "credenciais", "nao autorizado", "2FA": o acesso\n' +
        '   por CPF+senha foi recusado (possível efeito do MFA) — nesse caso\n' +
        '   será necessário certificado ou credencial de sistema. Confirme com\n' +
        '   a CATI do TJCE: (85) 3366-2966.'
    );
    if (err.root?.Envelope?.Body?.Fault) {
      console.dir(err.root.Envelope.Body.Fault, { depth: 6 });
    }
  }
}

main().catch((e) => {
  console.error('Erro inesperado:', e);
  process.exit(1);
});
