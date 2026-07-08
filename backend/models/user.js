// /models/user.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const User = sequelize.define('User', {
    id: { 
      type: DataTypes.INTEGER, 
      autoIncrement: true, 
      primaryKey: true 
    },
    matricula: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true, // ✅ REATIVADO após correção de índices duplicados
      validate: {
        notEmpty: true,
        len: [1, 20]
      }
    },
    nome: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [1, 100]
      }
    },
    senha: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [8, 100]
      }
    },
    // Campo para identificar se é a senha padrão
    senha_padrao: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    admin_padrao: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    admin_super: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    // Papel de acesso (fonte de verdade da autorização multi-unidade):
    //   super         → cruza todas as unidades (global)
    //   admin_unidade → gerencia toda a sua unidade
    //   servidor      → vê apenas os próprios processos, dentro da sua unidade
    role: {
      type: DataTypes.ENUM('super', 'admin_unidade', 'servidor'),
      allowNull: false,
      defaultValue: 'servidor'
    },
    // Unidade (delegacia) do usuário. NULL apenas para o super global, que não
    // pertence a nenhuma unidade. Obrigatório para admin_unidade e servidor
    // (validado na aplicação, ver userController).
    unidade_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    tableName: 'usuarios',
    timestamps: false,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return User;
};
