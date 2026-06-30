// Testes unitários do parser/mapeador do MNI (PJe). Usa amostras REAIS de XML
// capturadas do webservice do TJCE (dados sanitizados onde necessário).
const {
  formatNumeroCNJ,
  mniDateToISO,
  daysBetween,
  diasDesdeDisponibilizacao,
  deveAbrirTeor,
  parseAvisos,
  parseTeor,
  computePrazo,
  vinculacaoFromDestinatario,
  vinculacoesDistintas,
} = require('../../utils/pjeParser');

// Trecho real da resposta de consultarAvisosPendentes (2 avisos).
const AVISOS_XML = `
<ns4:consultarAvisosPendentesResposta xmlns="http://www.cnj.jus.br/tipos-servico-intercomunicacao-2.2.2" xmlns:ns2="http://www.cnj.jus.br/intercomunicacao-2.2.2">
<sucesso>true</sucesso><mensagem>Consultados 2 de 2</mensagem>
<aviso idAviso="14726043" tipoComunicacao="INT"><ns2:destinatario assistenciaJudiciaria="false" intimacaoPendente="0"><ns2:pessoa nome="policia civil do ceara" tipoPessoa="juridica"/></ns2:destinatario><ns2:processo numero="30000649020268069091" competencia="40" classeProcessual="279" codigoLocalidade="229" nivelSigilo="0" dataAjuizamento="20260612100044"><ns2:assunto principal="true"><ns2:codigoNacional>3546</ns2:codigoNacional></ns2:assunto><ns2:valorCausa>0.0</ns2:valorCausa><ns2:orgaoJulgador codigoOrgao="507" nomeOrgao="2º Núcleo Regional de Custódia e das Garantias" instancia="ORI" codigoMunicipioIBGE="2305506"/></ns2:processo><ns2:dataDisponibilizacao>20260615152502</ns2:dataDisponibilizacao></aviso>
<aviso idAviso="14710359" tipoComunicacao="INT"><ns2:destinatario assistenciaJudiciaria="false" intimacaoPendente="0"><ns2:pessoa nome="DELEGACIA DE POLICIA CIVIL DE IGUATU" tipoPessoa="autoridade"/></ns2:destinatario><ns2:processo numero="30000683020268069091" competencia="44" classeProcessual="279" codigoLocalidade="164" nivelSigilo="1" dataAjuizamento="20260614233213"><ns2:assunto principal="true"><ns2:codigoNacional>12194</ns2:codigoNacional></ns2:assunto><ns2:valorCausa>0.0</ns2:valorCausa><ns2:orgaoJulgador codigoOrgao="582" nomeOrgao="1ª Vara da Comarca de Jucás" instancia="ORI" codigoMunicipioIBGE="0"/></ns2:processo><ns2:dataDisponibilizacao>20260615081910</ns2:dataDisponibilizacao></aviso>
</ns4:consultarAvisosPendentesResposta>`;

// Trecho real da resposta de consultarTeorComunicacao (parte XML, sem o anexo).
const TEOR_XML = `
<ns4:consultarTeorComunicacaoResposta xmlns:ns2="http://www.cnj.jus.br/intercomunicacao-2.2.2">
<sucesso>true</sucesso><mensagem>Comunicações processuais consultadas com sucesso!</mensagem>
<comunicacao id="14726043" tipoComunicacao="INT" tipoPrazo="DATA_CERTA" dataReferencia="20260824235959" prazo="0" nivelSigilo="0"><ns2:destinatario assistenciaJudiciaria="false" intimacaoPendente="0"><ns2:pessoa nome="policia civil do ceara"/></ns2:destinatario><ns2:processo>30000649020268069091</ns2:processo><ns2:documento idDocumento="207140147" tipoDocumento="14575" dataHora="20260615152503" mimetype="text/html" nivelSigilo="0" movimento="168198158" hash="d14c6f12e1f661ed3d118e65721d17ff" descricao="Ato Ordinatório"><ns2:conteudo/></ns2:documento><ns2:parametro>meioComunicacao:E</ns2:parametro><ns2:parametro>dataHoraInicioPrazo:20260625154248</ns2:parametro></comunicacao>
</ns4:consultarTeorComunicacaoResposta>`;

describe('pjeParser - formatNumeroCNJ', () => {
  test('formata 20 dígitos no padrão CNJ', () => {
    expect(formatNumeroCNJ('30000649020268069091')).toBe('3000064-90.2026.8.06.9091');
  });
  test('mantém valor se não tiver 20 dígitos', () => {
    expect(formatNumeroCNJ('123')).toBe('123');
  });
  test('lida com null/undefined', () => {
    expect(formatNumeroCNJ(null)).toBe('');
  });
});

describe('pjeParser - datas', () => {
  test('mniDateToISO converte AAAAMMDDHHMMSS', () => {
    expect(mniDateToISO('20260615152502')).toBe('2026-06-15');
  });
  test('mniDateToISO aceita só AAAAMMDD', () => {
    expect(mniDateToISO('20260824')).toBe('2026-08-24');
  });
  test('mniDateToISO devolve null para inválido', () => {
    expect(mniDateToISO('abc')).toBeNull();
  });
  test('daysBetween calcula diferença em dias', () => {
    expect(daysBetween('2026-06-15', '2026-08-24')).toBe(70);
  });
});

describe('pjeParser - ciência por idade', () => {
  // disponibilização 2026-06-15; "hoje" fixo para o teste
  test('diasDesdeDisponibilizacao calcula a idade', () => {
    expect(diasDesdeDisponibilizacao('20260615152502', '2026-06-24')).toBe(9);
  });
  test('deveAbrirTeor=true quando idade >= limiar', () => {
    expect(deveAbrirTeor('20260615152502', 9, '2026-06-24')).toBe(true);
  });
  test('deveAbrirTeor=false quando ainda jovem', () => {
    expect(deveAbrirTeor('20260615152502', 9, '2026-06-23')).toBe(false);
  });
  test('limiar 0 abre sempre', () => {
    expect(deveAbrirTeor('20260615152502', 0, '2026-06-15')).toBe(true);
  });
});

describe('pjeParser - parseAvisos', () => {
  const avisos = parseAvisos(AVISOS_XML);
  test('extrai os 2 avisos', () => {
    expect(avisos).toHaveLength(2);
  });
  test('mapeia campos do primeiro aviso', () => {
    expect(avisos[0]).toMatchObject({
      idAviso: '14726043',
      tipoComunicacao: 'INT',
      numeroProcesso: '30000649020268069091',
      classeProcessual: '279',
      assuntoCodigo: '3546',
      nivelSigilo: '0',
      dataDisponibilizacao: '20260615152502',
      vinculacao: 'POLICIA CIVIL DO CEARA',
    });
    expect(avisos[0].orgaoJulgador).toMatch(/Núcleo Regional/);
  });
  test('isola o assunto de cada processo (não vaza do anterior)', () => {
    expect(avisos[1].assuntoCodigo).toBe('12194');
    expect(avisos[1].numeroProcesso).toBe('30000683020268069091');
  });
  test('normaliza a vinculação para maiúsculas', () => {
    expect(avisos[1].vinculacao).toBe('DELEGACIA DE POLICIA CIVIL DE IGUATU');
  });
});

describe('pjeParser - vinculacaoFromDestinatario', () => {
  test('extrai e normaliza o nome do destinatário', () => {
    const bloco = '<ns2:destinatario><ns2:pessoa nome="policia civil do ceara"/></ns2:destinatario>';
    expect(vinculacaoFromDestinatario(bloco)).toBe('POLICIA CIVIL DO CEARA');
  });
  test('devolve null quando não há nome', () => {
    expect(vinculacaoFromDestinatario('')).toBeNull();
  });
});

describe('pjeParser - vinculacoesDistintas', () => {
  test('detecta múltiplas unidades entre os avisos', () => {
    const avisos = parseAvisos(AVISOS_XML);
    expect(vinculacoesDistintas(avisos)).toEqual([
      'POLICIA CIVIL DO CEARA',
      'DELEGACIA DE POLICIA CIVIL DE IGUATU',
    ]);
  });
  test('uma única unidade entre os avisos', () => {
    const avisos = [{ vinculacao: 'A' }, { vinculacao: 'A' }];
    expect(vinculacoesDistintas(avisos)).toEqual(['A']);
  });
  test('ignora avisos sem vinculação e lida com lista vazia/nula', () => {
    expect(vinculacoesDistintas([{ vinculacao: null }, {}])).toEqual([]);
    expect(vinculacoesDistintas([])).toEqual([]);
    expect(vinculacoesDistintas(null)).toEqual([]);
  });
});

describe('pjeParser - parseTeor', () => {
  const teor = parseTeor(TEOR_XML);
  test('extrai prazo estruturado da comunicacao', () => {
    expect(teor).toMatchObject({
      tipoPrazo: 'DATA_CERTA',
      dataReferencia: '20260824235959',
      prazoDias: '0',
      dataHoraInicioPrazo: '20260625154248',
      descricaoDocumento: 'Ato Ordinatório',
    });
  });
});

describe('pjeParser - computePrazo', () => {
  test('DATA_CERTA usa dataReferencia como vencimento e calcula os dias', () => {
    const r = computePrazo({
      dataIntimacaoISO: '2026-06-15',
      tipoPrazo: 'DATA_CERTA',
      dataReferencia: '20260824235959',
      prazoDias: '0',
    });
    expect(r.prazo_vencimento).toBe('2026-08-24');
    expect(r.prazo_processual).toBe('70');
  });

  test('prazo em dias calcula o vencimento pela data de intimação', () => {
    const r = computePrazo({
      dataIntimacaoISO: '2026-06-15',
      tipoPrazo: 'DIAS',
      dataReferencia: null,
      prazoDias: '30',
    });
    expect(r.prazo_processual).toBe('30');
    expect(r.prazo_vencimento).toBe('2026-07-15');
  });

  test('sem prazo identificável devolve vazio', () => {
    const r = computePrazo({
      dataIntimacaoISO: '2026-06-15',
      tipoPrazo: 'OUTRO',
      dataReferencia: null,
      prazoDias: '0',
    });
    expect(r.prazo_processual).toBe('');
    expect(r.prazo_vencimento).toBeNull();
  });
});
