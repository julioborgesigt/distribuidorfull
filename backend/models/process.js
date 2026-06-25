// /models/process.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Process = sequelize.define('Process', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    numero_processo: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
        len: [1, 50]
      }
    },
    prazo_processual: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    classe_principal: {
      type: DataTypes.STRING(255)
    },
    assunto_principal: {
      type: DataTypes.STRING(255)
    },
    tarjas: {
      type: DataTypes.STRING(255)
    },
    data_intimacao: {
      type: DataTypes.DATEONLY
    },
    prazo_vencimento: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    cumprido: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    reiteracoes: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    cumpridoDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    observacoes: {
      type: DataTypes.STRING(300),
      allowNull: false,
      defaultValue: '',
      validate: {
        len: [0, 300]
      }
    },
    // Origem do registro: 'esaj' (CSV) ou 'pje' (webservice MNI).
    fonte: {
      type: DataTypes.ENUM('esaj', 'pje'),
      allowNull: false,
      defaultValue: 'esaj'
    }

  }, {
    tableName: 'processos',
    timestamps: false,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      { fields: ['cumprido'] },
      { fields: ['prazo_vencimento'] },
      { fields: ['classe_principal'] },
      { fields: ['assunto_principal'] },
      { fields: ['tarjas'] },
      { fields: ['cumpridoDate'] },
      { fields: ['cumprido', 'prazo_vencimento'], name: 'idx_cumprido_prazo_vencimento' },
      { fields: ['userId', 'cumprido'], name: 'idx_userid_cumprido' },
      { fields: ['fonte'] },
    ],
    hooks: {
      beforeCreate: (process) => {
        // Calcula prazo_vencimento ao criar um novo registro (inclui bulkCreate com individualHooks)
        if (process.data_intimacao && process.prazo_processual) {
          const dias = parseInt(process.prazo_processual, 10) || 0;
          const data = new Date(process.data_intimacao);
          data.setDate(data.getDate() + dias);
          process.prazo_vencimento = data.toISOString().split('T')[0]; // YYYY-MM-DD
        } else {
          process.prazo_vencimento = null;
        }
      },
      beforeSave: (process) => {
        // Recalcula prazo_vencimento ao atualizar se campos relevantes mudarem ou prazo estiver nulo
        if (process.changed('data_intimacao') || process.changed('prazo_processual') || !process.prazo_vencimento) {
          if (process.data_intimacao && process.prazo_processual) {
            const dias = parseInt(process.prazo_processual, 10) || 0;
            const data = new Date(process.data_intimacao);
            data.setDate(data.getDate() + dias);
            process.prazo_vencimento = data.toISOString().split('T')[0]; // YYYY-MM-DD
          } else {
            process.prazo_vencimento = null;
          }
        }
      }
    }
  });

  return Process;
};
