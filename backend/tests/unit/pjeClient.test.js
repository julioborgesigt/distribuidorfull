// Testes unitários dos helpers puros do cliente MNI (sem I/O de rede).
// Mock do logger para não depender do winston neste teste isolado.
jest.mock('../../utils/logger', () => ({
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
  http: jest.fn(),
  debug: jest.fn(),
}));
const { _internal } = require('../../utils/pjeClient');
const { buildEnvelope, extractFault, esc } = _internal;

describe('pjeClient - esc', () => {
  test('escapa caracteres especiais de XML', () => {
    expect(esc('a&b<c>')).toBe('a&amp;b&lt;c&gt;');
  });
});

describe('pjeClient - buildEnvelope', () => {
  const env = buildEnvelope(
    'consultarAvisosPendentes',
    '<tip:idConsultante>123</tip:idConsultante>'
  );
  test('usa o namespace do serviço no wrapper da operação', () => {
    expect(env).toContain('<ser:consultarAvisosPendentes>');
    expect(env).toContain('xmlns:ser="http://www.cnj.jus.br/servico-intercomunicacao-2.2.2/"');
  });
  test('inclui o conteúdo interno qualificado por tip:', () => {
    expect(env).toContain('<tip:idConsultante>123</tip:idConsultante>');
  });
});

describe('pjeClient - extractFault', () => {
  test('devolve null quando não há Fault', () => {
    expect(extractFault('<sucesso>true</sucesso>')).toBeNull();
  });
  test('extrai a faultstring quando há Fault', () => {
    const body =
      '<soap:Fault><faultcode>soap:Client</faultcode>' +
      '<faultstring>usuario ou senha invalidos</faultstring></soap:Fault>';
    expect(extractFault(body)).toBe('usuario ou senha invalidos');
  });
});
