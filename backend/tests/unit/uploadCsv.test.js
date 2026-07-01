// Testes da checagem de conteúdo real do CSV enviado (processController.uploadCSV).
// Cobre especificamente a regressão: um arquivo legítimo MENOR que o buffer
// de leitura (4096 bytes) não pode ser rejeitado por engano — Buffer.alloc()
// vem zerado, então usar o buffer inteiro (em vez de só os bytes lidos) faz
// qualquer arquivo pequeno parecer ter bytes NUL "de sobra".
const fs = require('fs');
const os = require('os');
const path = require('path');

jest.mock('../../models', () => ({
  sequelize: { transaction: jest.fn((fn) => fn({})) },
  User: { findAll: jest.fn().mockResolvedValue([]) },
  Process: {
    findAll: jest.fn().mockResolvedValue([]),
    bulkCreate: jest.fn().mockResolvedValue([]),
  },
  PjeImportLog: {},
}));

const processController = require('../../controllers/processController');

const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const writeTempFile = (name, content) => {
  const filePath = path.join(os.tmpdir(), `upload-csv-test-${Date.now()}-${name}`);
  fs.writeFileSync(filePath, content);
  return filePath;
};

// uploadCSV rejeita conteúdo binário de forma síncrona (dentro do await do
// próprio handler), mas o parsing de um CSV aceito continua num pipeline de
// stream que roda DEPOIS da promise de uploadCSV já ter resolvido — então
// para os casos de sucesso é preciso esperar res.json ser chamado, não só
// aguardar o retorno de uploadCSV.
const callUploadCSV = (req, res) => new Promise((resolve, reject) => {
  res.json.mockImplementation((body) => { resolve(body); return res; });
  processController.uploadCSV(req, res).catch(reject);
});

describe('processController.uploadCSV - checagem de conteúdo real', () => {
  test('rejeita um arquivo PNG disfarçado de .csv (assinatura binária)', async () => {
    const filePath = writeTempFile('fake.csv', Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
    const res = mockRes();

    await callUploadCSV({ file: { path: filePath, originalname: 'fake.csv' }, userId: 1 }, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(fs.existsSync(filePath)).toBe(false); // arquivo rejeitado é apagado
  });

  test('aceita um CSV legítimo PEQUENO (< 4096 bytes) — regressão do falso positivo', async () => {
    const csv = 'Numero do processo;Prazo processual;Classe principal;Assunto principal;Tarjas;Data da intimacao\n' +
      '1234567;30;Inquerito;Furto;;01/01/2026\n';
    expect(Buffer.byteLength(csv)).toBeLessThan(4096);
    const filePath = writeTempFile('ok.csv', Buffer.from(csv, 'latin1'));
    const res = mockRes();

    const body = await callUploadCSV({ file: { path: filePath, originalname: 'ok.csv' }, userId: 1 }, res);

    expect(res.status).not.toHaveBeenCalledWith(400);
    expect(body).toEqual(expect.objectContaining({ totalRows: 1 }));
  });

  test('aceita um CSV legítimo com acentuação em Latin-1', async () => {
    const csv = 'Numero do processo;Prazo processual;Classe principal;Assunto principal;Tarjas;Data da intimacao\n' +
      '1234567;30;Inquérito Policial;Furto qualificado;Sigiloso;01/01/2026\n';
    const filePath = writeTempFile('ok-acentos.csv', Buffer.from(csv, 'latin1'));
    const res = mockRes();

    await callUploadCSV({ file: { path: filePath, originalname: 'ok-acentos.csv' }, userId: 1 }, res);

    expect(res.status).not.toHaveBeenCalledWith(400);
  });
});
