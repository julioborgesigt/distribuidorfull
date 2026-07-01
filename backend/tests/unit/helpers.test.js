// Testes unitários para funções utilitárias
const { isValidPassword, getRealIP, generateRandomPassword, looksLikeBinaryFile } = require('../../utils/helpers');

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

describe('Helpers - generateRandomPassword', () => {
  test('gera senha do tamanho padrão (10) que passa em isValidPassword', () => {
    const senha = generateRandomPassword();
    expect(senha).toHaveLength(10);
    expect(isValidPassword(senha)).toBe(true);
  });

  test('gera senha do tamanho pedido', () => {
    expect(generateRandomPassword(16)).toHaveLength(16);
  });

  test('não repete o mesmo valor em execuções sucessivas (aleatoriedade básica)', () => {
    const senhas = new Set(Array.from({ length: 20 }, () => generateRandomPassword()));
    expect(senhas.size).toBe(20);
  });

  test('o embaralhamento não deixa sempre a maiúscula/minúscula/dígito garantidos nas 3 primeiras posições', () => {
    // Antes da correção (sort com comparador aleatório), era só um viés
    // estatístico e não uma garantia determinística — este teste teria
    // passado por acaso também. Mantido como smoke test: gera várias senhas
    // e confirma que a posição dos tipos de caractere varia.
    const primeiraPosEhMaiuscula = Array.from({ length: 30 }, () => /[A-Z]/.test(generateRandomPassword()[0]));
    expect(primeiraPosEhMaiuscula.some(v => v === false)).toBe(true);
  });
});

describe('Helpers - looksLikeBinaryFile', () => {
  test('detecta assinatura de PDF', () => {
    expect(looksLikeBinaryFile(Buffer.from('%PDF-1.4\n...'))).toBe(true);
  });

  test('detecta assinatura de ZIP/Office (docx, xlsx...)', () => {
    expect(looksLikeBinaryFile(Buffer.from([0x50, 0x4b, 0x03, 0x04, 0x00, 0x00]))).toBe(true);
  });

  test('detecta assinatura de PNG', () => {
    expect(looksLikeBinaryFile(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a]))).toBe(true);
  });

  test('detecta binário pela presença de byte NUL', () => {
    expect(looksLikeBinaryFile(Buffer.from([0x41, 0x42, 0x00, 0x43]))).toBe(true);
  });

  test('não marca CSV legítimo (ASCII) como binário', () => {
    const csv = Buffer.from('Numero do processo;Prazo processual\n123456;30\n', 'utf8');
    expect(looksLikeBinaryFile(csv)).toBe(false);
  });

  test('não marca CSV com acentuação (Latin-1) como binário', () => {
    const csv = Buffer.from('Número do processo;Observação\n123456;citação', 'latin1');
    expect(looksLikeBinaryFile(csv)).toBe(false);
  });

  test('lida com buffer vazio ou ausente', () => {
    expect(looksLikeBinaryFile(Buffer.alloc(0))).toBe(false);
    expect(looksLikeBinaryFile(null)).toBe(false);
    expect(looksLikeBinaryFile(undefined)).toBe(false);
  });
});
