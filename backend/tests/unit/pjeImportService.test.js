// Testes da coleta de linhas da importação PJe (pjeImportService.coletarRows),
// com o cliente MNI e o banco mockados — foco no filtro de intimações SEM PRAZO.

jest.mock('../../utils/logger', () => ({
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
  http: jest.fn(),
  debug: jest.fn(),
}));

jest.mock('../../models', () => ({
  PjeImportLog: { create: jest.fn() },
  sequelize: { transaction: jest.fn(), query: jest.fn(), QueryTypes: {} },
}));

jest.mock('../../utils/pjeClient', () => ({
  consultarAvisosPendentes: jest.fn(),
  consultarTeorComunicacao: jest.fn(),
}));

jest.mock('../../services/pjeCredentialService', () => ({
  getCredentials: jest.fn(),
}));

const pjeClient = require('../../utils/pjeClient');
const pjeCredentialService = require('../../services/pjeCredentialService');
const { coletarRows } = require('../../services/pjeImportService');

const UNIDADE = { id: 1, nome: 'Delegacia Teste', nome_pje: null };

// Data de disponibilização bem no passado, para o aviso sempre passar do limiar
// de ciência (cienciaMinDias) usado nos testes.
const DISPONIBILIZADO = '20200110000000';

function aviso(idAviso, numero) {
  return {
    idAviso,
    tipoComunicacao: 'INTIMACAO',
    numeroProcesso: numero,
    classeProcessual: '279',
    assuntoCodigo: '3546',
    nivelSigilo: '0',
    orgaoJulgador: 'Vara Teste',
    dataDisponibilizacao: DISPONIBILIZADO,
    vinculacao: 'POLICIA CIVIL DO CEARA',
  };
}

// Teor "sem prazo": é o que o PJe devolve nos atos de praxe (o painel mostra
// "Prazo: sem prazo").
const TEOR_SEM_PRAZO = { tipoPrazo: null, dataReferencia: null, prazoDias: '0' };
const TEOR_COM_PRAZO = { tipoPrazo: 'DIAS', dataReferencia: null, prazoDias: '10' };

beforeEach(() => {
  jest.clearAllMocks();
  pjeCredentialService.getCredentials.mockResolvedValue({ cpf: '1', senha: '2' });
});

describe('pjeImportService - coletarRows e intimações sem prazo', () => {
  test('descarta as intimações cujo teor vem sem prazo (padrão)', async () => {
    pjeClient.consultarAvisosPendentes.mockResolvedValue([
      aviso('a1', '00000000120268060001'),
      aviso('a2', '00000000220268060001'),
    ]);
    pjeClient.consultarTeorComunicacao
      .mockResolvedValueOnce(TEOR_COM_PRAZO)
      .mockResolvedValueOnce(TEOR_SEM_PRAZO);

    const r = await coletarRows({ unidade: UNIDADE });

    expect(r.avisos).toBe(2);
    expect(r.ignoradosSemPrazo).toBe(1);
    expect(r.rows).toHaveLength(1);
    expect(r.rows[0].prazo_processual).toBe('10');
    // O teor foi aberto nos dois (a ciência é o preço de saber se há prazo).
    expect(pjeClient.consultarTeorComunicacao).toHaveBeenCalledTimes(2);
  });

  test('ignorarSemPrazo=false mantém o comportamento antigo', async () => {
    pjeClient.consultarAvisosPendentes.mockResolvedValue([aviso('a1', '00000000120268060001')]);
    pjeClient.consultarTeorComunicacao.mockResolvedValue(TEOR_SEM_PRAZO);

    const r = await coletarRows({ unidade: UNIDADE, ignorarSemPrazo: false });

    expect(r.ignoradosSemPrazo).toBe(0);
    expect(r.rows).toHaveLength(1);
    expect(r.rows[0].prazo_processual).toBe('');
  });

  test('falha ao abrir o teor não conta como "sem prazo" — o aviso é importado', async () => {
    pjeClient.consultarAvisosPendentes.mockResolvedValue([aviso('a1', '00000000120268060001')]);
    pjeClient.consultarTeorComunicacao.mockRejectedValue(new Error('timeout no MNI'));

    const r = await coletarRows({ unidade: UNIDADE });

    expect(r.falhasTeor).toBe(1);
    expect(r.ignoradosSemPrazo).toBe(0);
    expect(r.rows).toHaveLength(1);
  });

  test('aviso adiado (mais novo que o limiar) não é afetado pelo filtro', async () => {
    const novo = { ...aviso('a1', '00000000120268060001') };
    novo.dataDisponibilizacao = new Date().toISOString().slice(0, 10).replace(/-/g, '') + '000000';
    pjeClient.consultarAvisosPendentes.mockResolvedValue([novo]);

    const r = await coletarRows({ unidade: UNIDADE, cienciaMinDias: 5 });

    expect(r.adiados).toBe(1);
    expect(r.ignoradosSemPrazo).toBe(0);
    expect(r.rows).toHaveLength(0);
    expect(pjeClient.consultarTeorComunicacao).not.toHaveBeenCalled();
  });
});
