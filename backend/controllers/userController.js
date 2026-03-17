// /controllers/userController.js
// Gerencia operações de usuários (CRUD, reset de senha)

const { User, Process } = require('../models');
const bcryptjs = require('bcryptjs');
const logger = require('../utils/logger');
const { getRealIP, isValidPassword, generateRandomPassword } = require('../utils/helpers');

// Lista usuários (apenas matrícula e nome) - COM PAGINAÇÃO
exports.listUsers = async (req, res) => {
  try {
    const { limit = 1000, offset = 0 } = req.query;

    const users = await User.findAll({
      attributes: ['id', 'matricula', 'nome'],
      limit: parseInt(limit, 10),
      offset: parseInt(offset, 10),
      order: [['nome', 'ASC']]
    });

    logger.info('Lista de usuários consultada', {
      count: users.length,
      requestedBy: req.userId
    });
    res.json(users);
  } catch (error) {
    logger.error('Erro ao buscar usuários', {
      error: error.message,
      stack: error.stack,
      userId: req.userId,
      ip: getRealIP(req)
    });
    res.status(500).json({ error: 'Erro ao buscar usuários.' });
  }
};

// Pré-cadastro de usuário
exports.preCadastro = async (req, res) => {
  const { matricula, nome, senha, tipoCadastro, updateIfExists } = req.body;

  if (!matricula || !nome || !senha || !tipoCadastro) {
    return res.status(400).json({ error: 'Campos obrigatórios ausentes.' });
  }

  if (!isValidPassword(senha)) {
    logger.warn('Tentativa de cadastro com senha fraca', {
      matricula,
      userId: req.userId,
      ip: getRealIP(req)
    });
    return res.status(400).json({
      error: 'Senha deve ter pelo menos 8 caracteres, uma letra maiúscula, uma minúscula e um número'
    });
  }

  let admin_padrao = false;
  let admin_super = false;
  if (tipoCadastro === 'admin_padrao') {
    admin_padrao = true;
  } else if (tipoCadastro === 'admin_super') {
    admin_padrao = true;
    admin_super = true;
  }

  try {
    const senhaHasheada = await bcryptjs.hash(senha, 10);

    const existingUser = await User.findOne({ where: { matricula } });
    if (existingUser) {
      if (updateIfExists) {
        const novaSenhaTemp = generateRandomPassword();
        existingUser.nome = nome;
        existingUser.senha = await bcryptjs.hash(novaSenhaTemp, 10);
        existingUser.senha_padrao = true;
        existingUser.admin_padrao = admin_padrao;
        existingUser.admin_super = admin_super;
        await existingUser.save();
        return res.json({
          message: 'Usuário atualizado com sucesso.',
          senhaTemporaria: novaSenhaTemp
        });
      } else {
        return res.status(409).json({
          error: 'Usuário já cadastrado.',
          updatePrompt: 'Deseja atualizar o usuário existente? Uma nova senha temporária será gerada.'
        });
      }
    }

    await User.create({
      matricula,
      nome,
      senha: senhaHasheada,
      admin_padrao,
      admin_super
    });
    logger.info('Pré-cadastro realizado com sucesso', {
      matricula,
      tipoCadastro,
      createdBy: req.userId
    });
    res.status(201).json({ message: 'Pré-cadastro realizado com sucesso.' });
  } catch (error) {
    logger.error('Erro ao realizar pré-cadastro', {
      error: error.message,
      stack: error.stack,
      matricula,
      userId: req.userId,
      ip: getRealIP(req)
    });
    res.status(500).json({ error: 'Erro ao realizar pré-cadastro.' });
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

    const novaSenhaTemp = generateRandomPassword();
    user.senha = await bcryptjs.hash(novaSenhaTemp, 10);
    user.senha_padrao = true;
    await user.save();

    logger.info('Senha resetada com sucesso', {
      matricula,
      userId: user.id,
      resetBy: req.userId,
      ip: getRealIP(req)
    });
    res.json({
      message: 'Senha resetada com sucesso.',
      senhaTemporaria: novaSenhaTemp
    });
  } catch (error) {
    logger.error('Erro ao resetar senha', {
      error: error.message,
      stack: error.stack,
      matricula,
      userId: req.userId,
      ip: getRealIP(req)
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

    const count = await Process.count({
      where: { userId: user.id }
    });
    logger.info('Verificando processos atribuídos para exclusão de usuário', {
      matricula,
      userId: user.id,
      processCount: count
    });
    if (count > 0) {
      logger.warn('Tentativa de exclusão de usuário com processos atribuídos', {
        matricula,
        userId: user.id,
        processCount: count,
        requestedBy: req.userId
      });
      return res.status(409).json({
        error: `Este usuário não pode ser excluído pois ainda possui ${count} processo(s) atribuído(s).`
      });
    }

    await user.destroy();
    logger.info('Usuário deletado com sucesso', {
      matricula,
      deletedBy: req.userId,
      ip: getRealIP(req)
    });
    res.status(200).json({ message: 'Usuário deletado com sucesso.' });

  } catch (error) {
    logger.error('Erro ao deletar usuário', {
      error: error.message,
      stack: error.stack,
      matricula,
      userId: req.userId,
      ip: getRealIP(req)
    });
    if (error.name === 'SequelizeForeignKeyConstraintError') {
         return res.status(409).json({ error: 'Este usuário não pode ser excluído pois está referenciado em outros registros.' });
    }
    res.status(500).json({ error: 'Erro interno ao deletar usuário.' });
  }
};
