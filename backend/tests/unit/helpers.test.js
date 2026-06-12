// Testes unitários para funções utilitárias
const { isValidPassword, getRealIP } = require('../../utils/helpers');

describe('Helpers - isValidPassword', () => {
  test('deve aceitar senha válida com maiúscula, minúscula e número', () => {
    expect(isValidPassword('SenhaForte123')).toBe(true);
  });

  test('deve aceitar senha válida com símbolos', () => {
    expect(isValidPassword('Senha@Forte123')).toBe(true);
  });

  test('deve rejeitar senha sem maiúscula', () => {
    expect(isValidPassword('senhafraca123')).toBe(false);
  });

  test('deve rejeitar senha sem minúscula', () => {
    expect(isValidPassword('SENHAFRACA123')).toBe(false);
  });

  test('deve rejeitar senha sem número', () => {
    expect(isValidPassword('SenhaFraca')).toBe(false);
  });

  test('deve rejeitar senha muito curta', () => {
    expect(isValidPassword('Sen1')).toBe(false);
  });

  test('deve rejeitar senha vazia', () => {
    expect(isValidPassword('')).toBe(false);
  });

  test('deve rejeitar senha null ou undefined', () => {
    expect(isValidPassword(null)).toBe(false);
    expect(isValidPassword(undefined)).toBe(false);
  });
});

describe('Helpers - getRealIP', () => {
  // getRealIP confia no req.ip resolvido pelo Express (via trust proxy),
  // e NÃO em cabeçalhos forjáveis como X-Forwarded-For.
  test('deve retornar req.ip resolvido pelo Express', () => {
    const req = {
      headers: { 'x-forwarded-for': '203.0.113.7' },
      ip: '192.168.1.100'
    };
    expect(getRealIP(req)).toBe('192.168.1.100');
  });

  test('não deve confiar em X-Forwarded-For forjado pelo cliente', () => {
    const req = {
      headers: { 'x-forwarded-for': '10.0.0.1' },
      ip: '198.51.100.42'
    };
    expect(getRealIP(req)).toBe('198.51.100.42');
  });

  test('deve cair para o endereço do socket quando req.ip não existe', () => {
    const req = {
      headers: {},
      socket: { remoteAddress: '127.0.0.1' }
    };
    expect(getRealIP(req)).toBe('127.0.0.1');
  });

  test('deve retornar "unknown" quando não há IP disponível', () => {
    expect(getRealIP({ headers: {} })).toBe('unknown');
  });
});
