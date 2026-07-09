// /models/pjeImportLog.js
// Histórico de importações do PJe (manual e via cron).
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const PjeImportLog = sequelize.define('PjeImportLog', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    // Quem disparou: nome do usuário (manual) ou 'Cron automático'.
    usuario: {
      type: DataTypes.STRING(120),
      allowNull: false,
      defaultValue: 'Desconhecido'
    },
    // Unidade cuja importação gerou este log (para "última importação por
    // unidade"). Null em logs antigos anteriores a esta coluna.
    unidade_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    // Total de avisos pendentes encontrados no PJe.
    avisos: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    // Processos novos criados nesta importação.
    criados: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    // Processos existentes atualizados nesta importação.
    atualizados: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    // Quantos avisos vieram com prazo (teor aberto / ciência tomada).
    comPrazo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    // Quantos ficaram sem prazo (ainda jovens ou falha ao abrir o teor).
    semPrazo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    // Pendentes de ciência não importados (mais novos que o limiar). O nº de
    // importados (tomados ciência) é avisos - adiados.
    adiados: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    // Falhas ao abrir o teor de avisos individuais.
    falhasTeor: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    // Duração da importação em milissegundos.
    duracaoMs: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    // Resultado geral.
    status: {
      type: DataTypes.ENUM('ok', 'erro'),
      allowNull: false,
      defaultValue: 'ok'
    },
    // Mensagem de erro, quando status = 'erro'.
    erro: {
      type: DataTypes.STRING(500),
      allowNull: true
    }
  }, {
    tableName: 'pje_import_logs',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
    indexes: [
      { fields: ['created_at'] }
    ]
  });

  return PjeImportLog;
};
