// /models/unidade.js
// Unidade (delegacia/órgão) — dimensão de multi-tenancy do sistema.
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Unidade = sequelize.define('Unidade', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nome: {
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: true,
      validate: { notEmpty: true, len: [1, 150] },
    },
    sigla: {
      type: DataTypes.STRING(30),
      allowNull: true,
    },
    // Nome como o PJe escreve na vinculação do aviso (uppercase). Chave da
    // trava de importação: só entram avisos cuja vinculação bate com este valor.
    nome_pje: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    ativo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  }, {
    tableName: 'unidades',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });

  return Unidade;
};
