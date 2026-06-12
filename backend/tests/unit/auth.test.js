// Testes unitários do fluxo de autenticação (versão de senha / invalidação de token)
process.env.JWT_SECRET = 'segredo-de-teste';

jest.mock('../../models', () => ({
  User: { findByPk: jest.fn() },
}));

const jwt = require('jsonwebtoken');
const { passwordVersion } = require('../../utils/helpers');
const { User } = require('../../models');
const autenticarAdmin = require('../../middlewares/autenticarAdmin');

const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const makeReq = (token) => ({
  cookies: token ? { token } : {},
  headers: {},
  ip: '127.0.0.1',
  url: '/api/admin/processes',
});

describe('Helpers - passwordVersion', () => {
  test('é determinística para o mesmo hash', () => {
    expect(passwordVersion('$2a$10$abc')).toBe(passwordVersion('$2a$10$abc'));
  });

  test('muda quando o hash da senha muda', () => {
    expect(passwordVersion('$2a$10$abc')).not.toBe(passwordVersion('$2a$10$xyz'));
  });

  test('tem 16 caracteres hexadecimais e não expõe o hash', () => {
    const v = passwordVersion('$2a$10$abc');
    expect(v).toMatch(/^[0-9a-f]{16}$/);
    expect(v).not.toContain('abc');
  });
});

describe('Middleware - autenticarAdmin (invalidação por troca de senha)', () => {
  const usuario = {
    id: 1,
    matricula: 'A123',
    senha: '$2a$10$hash-atual',
    admin_padrao: true,
    admin_super: false,
  };

  beforeEach(() => {
    User.findByPk.mockReset();
  });

  test('aceita token com pwv da senha atual', async () => {
    User.findByPk.mockResolvedValue(usuario);
    const token = jwt.sign(
      { id: 1, loginType: 'admin_padrao', pwv: passwordVersion(usuario.senha) },
      process.env.JWT_SECRET
    );
    const req = makeReq(token);
    const res = mockRes();
    const next = jest.fn();

    await autenticarAdmin(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(req.userId).toBe(1);
    expect(req.loginType).toBe('admin_padrao');
  });

  test('rejeita com 401 token emitido antes da troca de senha', async () => {
    User.findByPk.mockResolvedValue(usuario);
    const token = jwt.sign(
      { id: 1, loginType: 'admin_padrao', pwv: passwordVersion('$2a$10$hash-antigo') },
      process.env.JWT_SECRET
    );
    const res = mockRes();
    const next = jest.fn();

    await autenticarAdmin(makeReq(token), res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(401);
  });

  test('rejeita com 401 token legado sem claim pwv', async () => {
    User.findByPk.mockResolvedValue(usuario);
    const token = jwt.sign({ id: 1, loginType: 'admin_padrao' }, process.env.JWT_SECRET);
    const res = mockRes();
    const next = jest.fn();

    await autenticarAdmin(makeReq(token), res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(401);
  });

  test('rejeita com 401 token expirado (frontend faz logout automático em 401)', async () => {
    const token = jwt.sign(
      { id: 1, loginType: 'admin_padrao', pwv: passwordVersion(usuario.senha) },
      process.env.JWT_SECRET,
      { expiresIn: '-1s' }
    );
    const res = mockRes();
    const next = jest.fn();

    await autenticarAdmin(makeReq(token), res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(401);
  });

  test('rejeita com 401 quando não há token', async () => {
    const res = mockRes();
    const next = jest.fn();

    await autenticarAdmin(makeReq(null), res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(401);
  });

  test('rejeita com 403 usuário sem privilégios de admin', async () => {
    User.findByPk.mockResolvedValue({ ...usuario, admin_padrao: false, admin_super: false });
    const token = jwt.sign(
      { id: 1, loginType: 'admin_padrao', pwv: passwordVersion(usuario.senha) },
      process.env.JWT_SECRET
    );
    const res = mockRes();
    const next = jest.fn();

    await autenticarAdmin(makeReq(token), res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(403);
  });
});
