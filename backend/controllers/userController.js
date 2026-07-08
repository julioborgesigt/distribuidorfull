// /controllers/userController.js
// Gerencia operações de usuários (CRUD, reset de senha) com isolamento por
// unidade e papéis (super / admin_unidade / servidor).

const { User, Process, Unidade } = require('../models');
const bcryptjs = require('bcryptjs');
const logger = require('../utils/logger');
const { getRealIP, isValidPassword, generateRandomPassword } = require('../utils/helpers');

// Mantém as flags booleanas legadas em sincronia com o papel (role é a fonte
// de verdade; as booleanas seguem existindo para compatibilidade).
function boolsFromRole(role) {
  return {
    admin_super: role === 'super',
    admin_padrao: true, // todo papel acessa o painel; o escopo é que muda
  };
}

// Indica se o requisitante é super (enxerga/administra todas as unidades).
function isSuper(req) {
  return req.loginType === 'admin_super' || req.role === 'super';
}

// Lista usuários. super vê todos; admin da unidade vê apenas os da sua unidade.
exports.listUsers = async (req, res) => {
  try {
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 1000, 1), 1000);
    const offset = Math.max(parseInt(req.query.offset, 10) || 0, 0);

    const where = {};
    if (!isSuper(req)) {
      where.unidade_id = req.unidadeId || 0;
    } else if (req.query.unidadeId) {
      const uid = parseInt(req.query.unidadeId, 10);
      if (uid) where.unidade_id = uid;
    }

    const users = await User.findAll({
      attributes: ['id', 'matricula', 'nome', 'role', 'unidade_id'],
      where,
      limit,
      offset,
      include: [{ model: Unidade, attributes: ['id', 'nome', 'sigla'] }],
      order: [['nome', 'ASC']],
    });

    logger.info('Lista de usuários consultada', { count: users.length, requestedBy: req.userId });
    res.json(users);
  } catch (error) {
    logger.error('Erro ao buscar usuários', {
      error: error.message, stack: error.stack, userId: req.userId, ip: getRealIP(req),
    });
    res.status(500).json({ error: 'Erro ao buscar usuários.' });
  }
};

// Pré-cadastro de usuário
exports.preCadastro = async (req, res) => {
  const { matricula, nome, senha, tipoCadastro, updateIfExists, unidadeId } = req.body;

  if (!matricula || !nome || !senha || !tipoCadastro) {
    return res.status(400).json({ error: 'Campos obrigatórios ausentes.' });
  }

  if (!isValidPassword(senha)) {
    logger.warn('Tentativa de cadastro com senha fraca', { matricula, userId: req.userId, ip: getRealIP(req) });
    return res.status(400).json({
      error: 'Senha deve ter pelo menos 8 caracteres, uma letra maiúscula, uma minúscula e um número',
    });
  }

  const role = tipoCadastro; // 'servidor' | 'admin_unidade' | 'super' (validado)

  // --- Autorização por papel do requisitante ---
  let unidade_id = null;
  if (isSuper(req)) {
    if (role === 'super') {
      unidade_id = null; // super global não pertence a unidade
    } else {
      unidade_id = parseInt(unidadeId, 10) || null;
      if (!unidade_id) {
        return res.status(400).json({ error: 'Selecione a unidade do usuário.' });
      }
      const unidade = await Unidade.findByPk(unidade_id);
      if (!unidade) {
        return res.status(404).json({ error: 'Unidade não encontrada.' });
      }
    }
  } else {
    // admin_unidade: só cria servidor/admin_unidade DENTRO da própria unidade.
    if (role === 'super') {
      return res.status(403).json({ error: 'Você não pode criar um administrador super.' });
    }
    if (!req.unidadeId) {
      return res.status(400).json({ error: 'Seu usuário não está vinculado a nenhuma unidade.' });
    }
    unidade_id = req.unidadeId;
  }

  const bools = boolsFromRole(role);

  try {
    const senhaHasheada = await bcryptjs.hash(senha, 10);

    const existingUser = await User.findOne({ where: { matricula } });
    if (existingUser) {
      // Um admin de unidade não pode alterar usuário de outra unidade nem super.
      if (!isSuper(req) && (existingUser.unidade_id !== req.unidadeId || existingUser.role === 'super')) {
        return res.status(403).json({ error: 'Você não pode alterar este usuário.' });
      }
      if (updateIfExists) {
        const novaSenhaTemp = generateRandomPassword();
        existingUser.nome = nome;
        existingUser.senha = await bcryptjs.hash(novaSenhaTemp, 10);
        existingUser.senha_padrao = true;
        existingUser.role = role;
        existingUser.unidade_id = unidade_id;
        existingUser.admin_padrao = bools.admin_padrao;
        existingUser.admin_super = bools.admin_super;
        await existingUser.save();
        return res.json({ message: 'Usuário atualizado com sucesso.', senhaTemporaria: novaSenhaTemp });
      }
      return res.status(409).json({
        error: 'Usuário já cadastrado.',
        updatePrompt: 'Deseja atualizar o usuário existente? Uma nova senha temporária será gerada.',
      });
    }

    await User.create({
      matricula,
      nome,
      senha: senhaHasheada,
      role,
      unidade_id,
      admin_padrao: bools.admin_padrao,
      admin_super: bools.admin_super,
    });
    logger.info('Pré-cadastro realizado com sucesso', { matricula, role, unidade_id, createdBy: req.userId });
    res.status(201).json({ message: 'Pré-cadastro realizado com sucesso.' });
  } catch (error) {
    logger.error('Erro ao realizar pré-cadastro', {
      error: error.message, stack: error.stack, matricula, userId: req.userId, ip: getRealIP(req),
    });
    res.status(500).json({ error: 'Erro ao realizar pré-cadastro.' });
  }
};

// Verifica se o requisitante pode administrar (reset/exclusão) o usuário alvo.
function canManageTarget(req, target) {
  if (isSuper(req)) return true;
  // admin_unidade: só usuários da própria unidade e nunca um super.
  return target.unidade_id === req.unidadeId && target.role !== 'super';
}

// Edita papel/unidade/nome de um usuário existente (sem mexer na senha).
// Permite ao admin global corrigir papéis (ex.: rebaixar um super para admin
// da unidade) direto pela interface. O admin da unidade edita apenas usuários
// da própria unidade e não pode criar/def­inir admin global.
exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { nome, role, unidadeId } = req.body;

  try {
    const target = await User.findByPk(id);
    if (!target) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }
    if (!canManageTarget(req, target)) {
      return res.status(403).json({ error: 'Você não pode editar este usuário.' });
    }

    const newRole = role || target.role;
    if (!['servidor', 'admin_unidade', 'super'].includes(newRole)) {
      return res.status(400).json({ error: 'Papel inválido.' });
    }

    // Trava de segurança: não permite rebaixar o ÚLTIMO admin global (evita
    // ficar sem ninguém capaz de gerir o sistema inteiro).
    if (target.role === 'super' && newRole !== 'super') {
      const totalSupers = await User.count({ where: { role: 'super' } });
      if (totalSupers <= 1) {
        return res.status(409).json({ error: 'Não é possível rebaixar o último admin global.' });
      }
    }

    // Define a unidade conforme o papel e quem está editando.
    let newUnidadeId = target.unidade_id;
    if (isSuper(req)) {
      if (newRole === 'super') {
        newUnidadeId = null; // admin global não pertence a unidade
      } else {
        newUnidadeId = unidadeId != null ? (parseInt(unidadeId, 10) || null) : target.unidade_id;
        if (!newUnidadeId) {
          return res.status(400).json({ error: 'Selecione a unidade do usuário.' });
        }
        const unidade = await Unidade.findByPk(newUnidadeId);
        if (!unidade) {
          return res.status(404).json({ error: 'Unidade não encontrada.' });
        }
      }
    } else {
      // admin_unidade: não pode promover a global nem mover para outra unidade.
      if (newRole === 'super') {
        return res.status(403).json({ error: 'Você não pode definir um admin global.' });
      }
      newUnidadeId = req.unidadeId;
    }

    if (nome != null && String(nome).trim()) target.nome = String(nome).trim();
    target.role = newRole;
    target.unidade_id = newUnidadeId;
    const bools = boolsFromRole(newRole);
    target.admin_super = bools.admin_super;
    target.admin_padrao = bools.admin_padrao;
    await target.save();

    logger.info('Usuário editado (papel/unidade)', {
      targetId: target.id, matricula: target.matricula, newRole, newUnidadeId,
      editedBy: req.userId, ip: getRealIP(req),
    });
    res.json({ message: 'Usuário atualizado com sucesso.' });
  } catch (error) {
    logger.error('Erro ao editar usuário', {
      error: error.message, stack: error.stack, targetId: id, userId: req.userId, ip: getRealIP(req),
    });
    res.status(500).json({ error: 'Erro ao editar usuário.' });
  }
};

// Reset de senha
exports.resetPassword = async (req, res) => {
  const { matricula } = req.body;
  if (!matricula) {
    return res.status(400).json({ error: 'Matrícula obrigatória.' });
  }

  try {
    const user = await User.findOne({ where: { matricula } });
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }
    if (!canManageTarget(req, user)) {
      return res.status(403).json({ error: 'Você não pode resetar a senha deste usuário.' });
    }

    const novaSenhaTemp = generateRandomPassword();
    user.senha = await bcryptjs.hash(novaSenhaTemp, 10);
    user.senha_padrao = true;
    await user.save();

    logger.info('Senha resetada com sucesso', { matricula, userId: user.id, resetBy: req.userId, ip: getRealIP(req) });
    res.json({ message: 'Senha resetada com sucesso.', senhaTemporaria: novaSenhaTemp });
  } catch (error) {
    logger.error('Erro ao resetar senha', {
      error: error.message, stack: error.stack, matricula, userId: req.userId, ip: getRealIP(req),
    });
    res.status(500).json({ error: 'Erro ao resetar senha.' });
  }
};

// Deletar usuário por matrícula
exports.deleteMatricula = async (req, res) => {
  const { matricula } = req.body;
  if (!matricula) {
    return res.status(400).json({ error: 'Matrícula obrigatória.' });
  }
  try {
    const user = await User.findOne({ where: { matricula } });
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }
    if (!canManageTarget(req, user)) {
      return res.status(403).json({ error: 'Você não pode excluir este usuário.' });
    }

    const count = await Process.count({ where: { userId: user.id } });
    logger.info('Verificando processos atribuídos para exclusão de usuário', {
      matricula, userId: user.id, processCount: count,
    });
    if (count > 0) {
      logger.warn('Tentativa de exclusão de usuário com processos atribuídos', {
        matricula, userId: user.id, processCount: count, requestedBy: req.userId,
      });
      return res.status(409).json({
        error: `Este usuário não pode ser excluído pois ainda possui ${count} processo(s) atribuído(s).`,
      });
    }

    await user.destroy();
    logger.info('Usuário deletado com sucesso', { matricula, deletedBy: req.userId, ip: getRealIP(req) });
    res.status(200).json({ message: 'Usuário deletado com sucesso.' });
  } catch (error) {
    logger.error('Erro ao deletar usuário', {
      error: error.message, stack: error.stack, matricula, userId: req.userId, ip: getRealIP(req),
    });
    if (error.name === 'SequelizeForeignKeyConstraintError') {
      return res.status(409).json({ error: 'Este usuário não pode ser excluído pois está referenciado em outros registros.' });
    }
    res.status(500).json({ error: 'Erro interno ao deletar usuário.' });
  }
};
