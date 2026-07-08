// /models/pjeCredential.js
// Uma credencial PJe por unidade (no máximo 1 linha por unidade_id).
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const PjeCredential = sequelize.define('PjeCredential', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    // CPF criptografado (AES-256-GCM via credenciaisCrypto).
    cpfCriptografado: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: 'cpf_criptografado'
    },
    // Senha criptografada (AES-256-GCM via credenciaisCrypto).
    senhaCriptografada: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: 'senha_criptografada'
    },
    // Últimos 2 dígitos do CPF em texto plano para exibir no painel sem descriptografar.
    cpfDisplay: {
      type: DataTypes.STRING(20),
      allowNull: true,
      field: 'cpf_display'
    },
    // ID do usuário que fez o último salvamento (auditoria).
    atualizadoPorId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'atualizado_por_id'
    },
    // Unidade dona desta credencial. No máximo 1 credencial por unidade.
    unidade_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    tableName: 'pje_credentials',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return PjeCredential;
};
