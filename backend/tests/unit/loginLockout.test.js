// Testes do mecanismo de bloqueio de login (janela deslizante + limite).
process.env.JWT_SECRET = 'segredo-de-teste';

// authController carrega os models na importação — mock mínimo.
jest.mock('../../models', () => ({
  User: { findOne: jest.fn(), findByPk: jest.fn() },
  Unidade: { findByPk: jest.fn() },
}));

const { __lockout } = require('../../controllers/authController');
const { checkLockout, recordFailedAttempt, clearAttempts, MAX_LOGIN_ATTEMPTS, ATTEMPT_WINDOW_MS } = __lockout;

describe('Login lockout', () => {
  test('o limite padrão é 10 tentativas', () => {
    expect(MAX_LOGIN_ATTEMPTS).toBe(10);
  });

  test('bloqueia somente na 10ª falha (as 9 primeiras não travam)', () => {
    const ip = '1.1.1.1'; const mat = 'USR-A';
    clearAttempts(ip, mat);
    for (let i = 1; i <= MAX_LOGIN_ATTEMPTS - 1; i++) {
      const r = recordFailedAttempt(ip, mat);
      expect(r.lockedUntil).toBeFalsy();
      expect(checkLockout(ip, mat).locked).toBe(false);
    }
    const rLock = recordFailedAttempt(ip, mat); // 10ª
    expect(rLock.lockedUntil).toBeTruthy();
    expect(checkLockout(ip, mat).locked).toBe(true);
  });

  test('clearAttempts (senha correta) zera a contagem', () => {
    const ip = '2.2.2.2'; const mat = 'USR-B';
    clearAttempts(ip, mat);
    recordFailedAttempt(ip, mat);
    recordFailedAttempt(ip, mat);
    clearAttempts(ip, mat);
    expect(checkLockout(ip, mat).locked).toBe(false);
    const r = recordFailedAttempt(ip, mat);
    expect(r.count).toBe(1); // recomeçou do zero
  });

  test('o bloqueio é por IP+matrícula: mesma máquina, outra matrícula não trava', () => {
    const ip = '3.3.3.3';
    clearAttempts(ip, 'USR-C');
    clearAttempts(ip, 'USR-D');
    for (let i = 0; i < MAX_LOGIN_ATTEMPTS; i++) recordFailedAttempt(ip, 'USR-C');
    expect(checkLockout(ip, 'USR-C').locked).toBe(true);   // travou USR-C
    expect(checkLockout(ip, 'USR-D').locked).toBe(false);  // USR-D no mesmo IP, livre
  });

  test('janela deslizante: falhas fora da janela recomeçam a contagem', () => {
    const ip = '4.4.4.4'; const mat = 'USR-E';
    clearAttempts(ip, mat);
    const nowSpy = jest.spyOn(Date, 'now');
    try {
      let t = 1_000_000;
      nowSpy.mockImplementation(() => t);
      for (let i = 0; i < MAX_LOGIN_ATTEMPTS - 1; i++) recordFailedAttempt(ip, mat); // 9 falhas
      expect(checkLockout(ip, mat).locked).toBe(false);

      // Passa mais que a janela sem falhas → a próxima falha recomeça em 1.
      t += ATTEMPT_WINDOW_MS + 1;
      const r = recordFailedAttempt(ip, mat);
      expect(r.count).toBe(1);
      expect(r.lockedUntil).toBeFalsy();
    } finally {
      nowSpy.mockRestore();
    }
  });
});
