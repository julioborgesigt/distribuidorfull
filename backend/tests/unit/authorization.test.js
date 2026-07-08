// Testes unitários para as regras de autorização
const requireSuperAdmin = require('../../middlewares/requireSuperAdmin');
const requireGestor = require('../../middlewares/requireGestor');
const { processScopeWhere, unidadeScopeWhere, canSeeBeyondOwn } = require('../../utils/helpers');
const { mesmaVinculacao } = require('../../utils/pjeParser');

const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('Middleware - requireSuperAdmin', () => {
  test('deve permitir sessão admin_super', () => {
    const req = { loginType: 'admin_super', userId: 1, ip: '127.0.0.1' };
    const res = mockRes();
    const next = jest.fn();

    requireSuperAdmin(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  test('deve bloquear sessão admin_padrao com 403', () => {
    const req = { loginType: 'admin_padrao', userId: 2, ip: '127.0.0.1', originalUrl: '/api/admin/pre-cadastro' };
    const res = mockRes();
    const next = jest.fn();

    requireSuperAdmin(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(403);
  });

  test('deve bloquear quando loginType está ausente', () => {
    const req = { userId: 3, ip: '127.0.0.1', originalUrl: '/api/admin/reset-password' };
    const res = mockRes();
    const next = jest.fn();

    requireSuperAdmin(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(403);
  });

  test('admin_super logado como admin_padrao deve ser bloqueado (menor privilégio)', () => {
    // O middleware decide pelo loginType da sessão, não pelo flag do usuário
    const req = {
      loginType: 'admin_padrao',
      user: { admin_super: true, matricula: 'X1' },
      userId: 4,
      ip: '127.0.0.1',
      originalUrl: '/api/admin/delete-matricula'
    };
    const res = mockRes();
    const next = jest.fn();

    requireSuperAdmin(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(403);
  });
});

describe('Middleware - requireGestor', () => {
  test('permite super global', () => {
    const req = { loginType: 'admin_super', role: 'super', userId: 1, ip: '127.0.0.1' };
    const res = mockRes();
    const next = jest.fn();
    requireGestor(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  test('permite admin da unidade', () => {
    const req = { loginType: 'admin_padrao', role: 'admin_unidade', userId: 2, ip: '127.0.0.1' };
    const res = mockRes();
    const next = jest.fn();
    requireGestor(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  test('bloqueia servidor com 403', () => {
    const req = { loginType: 'admin_padrao', role: 'servidor', userId: 3, ip: '127.0.0.1', originalUrl: '/api/admin/unidades' };
    const res = mockRes();
    const next = jest.fn();
    requireGestor(req, res, next);
    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(403);
  });
});

describe('Helpers - processScopeWhere (multi-unidade)', () => {
  test('super logado como super enxerga todas as unidades', () => {
    expect(processScopeWhere({ loginType: 'admin_super', role: 'super', userId: 1 })).toEqual({});
  });

  test('super logado como admin_padrao opera com privilégio reduzido (só os próprios)', () => {
    expect(processScopeWhere({ loginType: 'admin_padrao', role: 'super', userId: 5 })).toEqual({ userId: 5 });
  });

  test('admin da unidade enxerga toda a sua unidade', () => {
    expect(processScopeWhere({ loginType: 'admin_padrao', role: 'admin_unidade', userId: 6, unidadeId: 3 }))
      .toEqual({ unidade_id: 3 });
  });

  test('servidor é restrito aos próprios processos, dentro da sua unidade', () => {
    expect(processScopeWhere({ loginType: 'admin_padrao', role: 'servidor', userId: 7, unidadeId: 3 }))
      .toEqual({ unidade_id: 3, userId: 7 });
  });

  test('sem papel é tratado como restrito por unidade+usuário (fail-closed)', () => {
    expect(processScopeWhere({ userId: 9, unidadeId: 4 })).toEqual({ unidade_id: 4, userId: 9 });
  });
});

describe('Helpers - unidadeScopeWhere', () => {
  test('super sem restrição', () => {
    expect(unidadeScopeWhere({ loginType: 'admin_super', role: 'super' })).toEqual({});
  });
  test('admin da unidade restrito à unidade', () => {
    expect(unidadeScopeWhere({ role: 'admin_unidade', unidadeId: 3 })).toEqual({ unidade_id: 3 });
  });
  test('servidor restrito à unidade (ignora dono)', () => {
    expect(unidadeScopeWhere({ role: 'servidor', unidadeId: 3, userId: 7 })).toEqual({ unidade_id: 3 });
  });
});

describe('Helpers - canSeeBeyondOwn', () => {
  test('super e admin da unidade enxergam além dos próprios', () => {
    expect(canSeeBeyondOwn({ loginType: 'admin_super' })).toBe(true);
    expect(canSeeBeyondOwn({ role: 'admin_unidade' })).toBe(true);
  });
  test('servidor não', () => {
    expect(canSeeBeyondOwn({ role: 'servidor' })).toBe(false);
  });
});

describe('Trava de importação - mesmaVinculacao', () => {
  test('bate ignorando caixa e acentos', () => {
    expect(mesmaVinculacao('DELEGACIA DE POLICIA CIVIL DE IGUATU', 'Delegacia de Polícia Civil de Iguatu')).toBe(true);
  });
  test('unidades diferentes não batem', () => {
    expect(mesmaVinculacao('DELEGACIA DE IGUATU', 'DELEGACIA DE ICO')).toBe(false);
  });
  test('valor vazio nunca bate (fail-closed)', () => {
    expect(mesmaVinculacao('', 'DELEGACIA DE IGUATU')).toBe(false);
    expect(mesmaVinculacao(null, null)).toBe(false);
  });
});
