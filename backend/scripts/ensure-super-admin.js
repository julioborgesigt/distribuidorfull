// /scripts/ensure-super-admin.js
//
// Garante o SUPER ADMIN GLOBAL a partir de variáveis de ambiente, para ser
// executado no deploy. Idempotente.
//
// Variáveis:
//   SUPER_ADMIN_MATRICULA  (obrigatória) — matrícula do super global
//   SUPER_ADMIN_NOME       (opcional)    — nome; default "Administrador"
//   SUPER_ADMIN_SENHA      (obrigatória na criação) — senha inicial
//
// Comportamento:
//   - Se o usuário existe: promove a super global (role='super', sem unidade).
//     NÃO altera a senha (preserva a que o usuário já definiu).
//   - Se não existe e há SUPER_ADMIN_SENHA: cria como super global.
//   - Rebaixa QUALQUER OUTRO usuário com role='super' para 'admin_unidade',
//     vinculando-o à unidade padrão — garante um único super global.
//
// A senha NUNCA é registrada em log.

require('dotenv').config({ path: __dirname + '/../.env' });

const bcryptjs = require('bcryptjs');
const { sequelize, User, Unidade } = require('../models');
const { DEFAULT_UNIDADE_NOME } = require('../data/unidades');
const { Op } = require('sequelize');
const logger = require('../utils/logger');

(async () => {
  try {
    await sequelize.authenticate();

    const matricula = (process.env.SUPER_ADMIN_MATRICULA || '').trim();
    const nome = (process.env.SUPER_ADMIN_NOME || 'Administrador').trim();
    const senha = process.env.SUPER_ADMIN_SENHA || '';

    if (!matricula) {
      console.log('[ensure-super-admin] SUPER_ADMIN_MATRICULA não definida — nada a fazer.');
      await sequelize.close();
      process.exit(0);
    }

    let superUser = await User.findOne({ where: { matricula } });

    if (superUser) {
      superUser.role = 'super';
      superUser.admin_super = true;
      superUser.admin_padrao = true;
      superUser.unidade_id = null; // super global não pertence a unidade
      if (nome) superUser.nome = nome;
      await superUser.save();
      logger.info('Super admin global garantido (usuário existente)', { userId: superUser.id, matricula });
      console.log(`[ensure-super-admin] Usuário ${matricula} promovido/confirmado como super global.`);
    } else {
      if (!senha) {
        console.error('[ensure-super-admin] Usuário não existe e SUPER_ADMIN_SENHA não foi definida — abortando criação.');
        await sequelize.close();
        process.exit(1);
      }
      const senhaHash = await bcryptjs.hash(senha, 10);
      superUser = await User.create({
        matricula,
        nome: nome || 'Administrador',
        senha: senhaHash,
        senha_padrao: false, // senha definida pelo operador no deploy
        role: 'super',
        admin_super: true,
        admin_padrao: true,
        unidade_id: null,
      });
      logger.info('Super admin global criado', { userId: superUser.id, matricula });
      console.log(`[ensure-super-admin] Super global ${matricula} criado.`);
    }

    // Rebaixa qualquer outro "super" para admin da unidade padrão.
    const unidadePadrao = await Unidade.findOne({ where: { nome: DEFAULT_UNIDADE_NOME } });
    const outrosSupers = await User.findAll({
      where: { role: 'super', id: { [Op.ne]: superUser.id } },
    });
    for (const u of outrosSupers) {
      u.role = 'admin_unidade';
      u.admin_super = false;
      u.admin_padrao = true;
      if (u.unidade_id == null && unidadePadrao) {
        u.unidade_id = unidadePadrao.id;
      }
      await u.save();
      logger.info('Super rebaixado para admin da unidade', { userId: u.id, matricula: u.matricula });
      console.log(`[ensure-super-admin] Usuário ${u.matricula} rebaixado para admin_unidade.`);
    }

    await sequelize.close();
    process.exit(0);
  } catch (err) {
    logger.error('Falha ao garantir super admin', { error: err.message, stack: err.stack });
    console.error('[ensure-super-admin] Falha:', err.message);
    try { await sequelize.close(); } catch { /* ignore */ }
    process.exit(1);
  }
})();
