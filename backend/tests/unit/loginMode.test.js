// Testa o mapeamento "modo de acesso × papel real" no login (resolveSession):
// - modo 'usuario' sempre rebaixa para usuário comum (só os próprios processos);
// - modo 'unidade' opera na plenitude do papel (admin da unidade / admin global);
// - servidor nunca ganha gestão, qualquer que seja o modo pedido.
process.env.JWT_SECRET = 'segredo-de-teste';

jest.mock('../../models', () => ({
  User: { findOne: jest.fn(), findByPk: jest.fn() },
  Unidade: { findByPk: jest.fn() },
}));

const { __resolveSession: resolveSession } = require('../../controllers/authController');

describe('resolveSession (modo × papel)', () => {
  test('servidor sempre entra como usuário comum', () => {
    expect(resolveSession('servidor', 'usuario')).toEqual({ role: 'servidor', loginType: 'admin_padrao' });
    expect(resolveSession('servidor', 'unidade')).toEqual({ role: 'servidor', loginType: 'admin_padrao' });
  });

  test('admin da unidade escolhe entre modo usuário e gestão da unidade', () => {
    expect(resolveSession('admin_unidade', 'usuario')).toEqual({ role: 'servidor', loginType: 'admin_padrao' });
    expect(resolveSession('admin_unidade', 'unidade')).toEqual({ role: 'admin_unidade', loginType: 'admin_padrao' });
  });

  test('admin global: modo unidade vira acesso global; modo usuário rebaixa', () => {
    expect(resolveSession('super', 'unidade')).toEqual({ role: 'super', loginType: 'admin_super' });
    expect(resolveSession('super', 'usuario')).toEqual({ role: 'servidor', loginType: 'admin_padrao' });
  });
});
