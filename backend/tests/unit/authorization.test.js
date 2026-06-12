// Testes unitários para as regras de autorização
const requireSuperAdmin = require('../../middlewares/requireSuperAdmin');
const { processScopeWhere } = require('../../utils/helpers');

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

describe('Helpers - processScopeWhere', () => {
  test('admin_super não recebe restrição de escopo', () => {
    expect(processScopeWhere({ loginType: 'admin_super', userId: 1 })).toEqual({});
  });

  test('admin_padrao é restrito aos próprios processos', () => {
    expect(processScopeWhere({ loginType: 'admin_padrao', userId: 7 })).toEqual({ userId: 7 });
  });

  test('loginType ausente é tratado como restrito (fail-closed)', () => {
    expect(processScopeWhere({ userId: 9 })).toEqual({ userId: 9 });
  });
});
