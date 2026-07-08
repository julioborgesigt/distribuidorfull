// /data/unidades.js
//
// Fonte única da lista de unidades (delegacias) para semear o banco.
// Usada tanto pelo seeder do sequelize-cli (seeders/) quanto pelo script de
// deploy (scripts/seed-unidades.js). Manter aqui evita duplicar a lista.
//
// `nome`     — nome de exibição da unidade.
// `nome_pje` — nome como o PJe escreve no destinatário do aviso (vinculação).
//              É a chave da TRAVA DE IMPORTAÇÃO: só entram no sistema avisos
//              cuja vinculação bate (ignorando acentos/caixa) com este valor.
//              Derivado de `nome` em maiúsculas; ajuste manualmente se o PJe
//              usar um nome diferente para alguma unidade.
//
// A unidade padrão (DEFAULT_UNIDADE_NOME) é a delegacia já existente em
// produção — todos os usuários e processos atuais são vinculados a ela na
// migração de backfill.

const DEFAULT_UNIDADE_NOME = 'Delegacia de Polícia Civil de Iguatu';

const NOMES = [
  'Delegacia de Polícia Civil de Alto Santo',
  'Delegacia de Polícia Civil de Aracati',
  'Delegacia de Polícia Civil de Beberibe',
  'Delegacia de Polícia Civil de Icapuí',
  'Delegacia de Polícia Civil de Iracema',
  'Delegacia de Polícia Civil de Jaguaribe',
  'Delegacia de Polícia Civil de Jaguaruana',
  'Delegacia de Polícia Civil de Limoeiro do Norte',
  'Delegacia de Polícia Civil de Russas',
  'Delegacia de Polícia Civil de São João do Jaguaribe',
  'Delegacia de Polícia Civil de Tabuleiro do Norte',
  'Unidade de Atendimento de Fortim',
  'Unidade de Atendimento de Quixeré',
  'Delegacia de Polícia Civil de Juazeiro do Norte',
  '2ª Delegacia de Polícia Civil de Juazeiro do Norte',
  'Delegacia de Polícia Civil de Araripe',
  'Delegacia de Polícia Civil de Assaré',
  'Delegacia de Polícia Civil de Aurora',
  'Delegacia de Polícia Civil de Barbalha',
  'Delegacia de Polícia Civil de Barro',
  'Delegacia de Polícia Civil de Brejo Santo',
  'Delegacia de Polícia Civil de Campos Sales',
  'Delegacia de Polícia Civil de Caririaçu',
  'Delegacia de Polícia Civil de Crato',
  'Delegacia de Polícia Civil de Farias Brito',
  'Delegacia de Polícia Civil de Jardim',
  'Delegacia de Polícia Civil de Mauriti',
  'Delegacia de Polícia Civil de Milagres',
  'Delegacia de Polícia Civil de Missão Velha',
  'Delegacia de Polícia Civil de Nova Olinda',
  'Delegacia de Polícia Civil de Penaforte',
  'Delegacia de Polícia Civil de Banabuiú',
  'Delegacia de Polícia Civil de Jaguaretama',
  'Delegacia de Polícia Civil de Morada Nova',
  'Delegacia de Polícia Civil de Pedra Branca',
  'Delegacia de Polícia Civil de Quixadá',
  'Delegacia de Polícia Civil de Quixeramobim',
  'Delegacia de Polícia Civil de Senador Pompeu',
  'Delegacia de Polícia Civil de Solonópole',
  'Delegacia de Polícia Civil de Acopiara',
  'Delegacia de Polícia Civil de Cedro',
  'Delegacia de Polícia Civil de Icó',
  'Delegacia de Polícia Civil de Iguatu',
  'Delegacia de Polícia Civil de Ipaumirim',
  'Delegacia de Polícia Civil de Jucás',
  'Delegacia de Polícia Civil de Lavras da Mangabeira',
  'Delegacia de Polícia Civil de Orós',
  'Delegacia de Polícia Civil de Saboeiro',
  'Delegacia de Polícia Civil de Várzea Alegre',
  'Delegacia de Polícia Civil de Mombaça',
  'Delegacia de Polícia Civil de Parambu',
  'Delegacia de Polícia Civil de Quiterianópolis',
  'Delegacia de Polícia Civil de Tauá',
  'Unidade de Atendimento de Aiuaba',
];

// Monta as linhas prontas para inserção ({ nome, nome_pje, ativo }).
const UNIDADES = NOMES.map(nome => ({
  nome,
  nome_pje: nome.toUpperCase(),
  ativo: true,
}));

module.exports = { UNIDADES, NOMES, DEFAULT_UNIDADE_NOME };
