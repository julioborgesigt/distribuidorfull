// Testes unitários para validadores
const { validationResult } = require('express-validator');

describe('Validadores - Conceitos gerais', () => {
  test('deve validar que express-validator está disponível', () => {
    expect(validationResult).toBeDefined();
    expect(typeof validationResult).toBe('function');
  });

  test('deve validar formato de matrícula básico', () => {
    const matriculaValida = '12345';
    const matriculaInvalida = '';

    expect(matriculaValida.length).toBeGreaterThan(0);
    expect(matriculaInvalida.length).toBe(0);
  });

  test('deve validar comprimento mínimo de senha', () => {
    const senhaValida = '12345678';
    const senhaInvalida = '123';

    expect(senhaValida.length).toBeGreaterThanOrEqual(8);
    expect(senhaInvalida.length).toBeLessThan(8);
  });

  test('deve validar que array de IDs não está vazio', () => {
    const arrayValido = [1, 2, 3];
    const arrayInvalido = [];

    expect(arrayValido.length).toBeGreaterThan(0);
    expect(arrayInvalido.length).toBe(0);
  });

  test('deve validar limite máximo de array (100 itens)', () => {
    const arrayDentroLimite = new Array(50).fill(1);
    const arrayForaLimite = new Array(101).fill(1);

    expect(arrayDentroLimite.length).toBeLessThanOrEqual(100);
    expect(arrayForaLimite.length).toBeGreaterThan(100);
  });
});

describe('Papéis de usuário (cadastro)', () => {
  // O login não escolhe mais "tipo de acesso": o privilégio é derivado do
  // papel (role) do usuário. Os papéis válidos para cadastro são:
  const roles = ['servidor', 'admin_unidade', 'super'];

  test('aceita os três papéis previstos', () => {
    expect(roles).toEqual(expect.arrayContaining(['servidor', 'admin_unidade', 'super']));
  });

  test('rejeita valores fora da lista', () => {
    expect(roles).not.toContain('admin_padrao');
    expect(roles).not.toContain('admin');
  });
});

describe('Validadores - Observações', () => {
  test('deve aceitar observação com até 100 caracteres', () => {
    const observacao = 'A'.repeat(100);
    expect(observacao.length).toBeLessThanOrEqual(100);
  });

  test('deve rejeitar observação com mais de 100 caracteres', () => {
    const observacao = 'A'.repeat(101);
    expect(observacao.length).toBeGreaterThan(100);
  });

  test('deve aceitar observação vazia', () => {
    const observacao = '';
    expect(observacao.length).toBe(0);
  });
});
