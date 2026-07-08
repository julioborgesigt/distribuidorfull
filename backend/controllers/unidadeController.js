// /controllers/unidadeController.js
// CRUD de unidades (delegacias). Criar/editar/excluir é exclusivo do super
// global (rotas protegidas por requireSuperAdmin). A listagem é permitida a
// qualquer gestor para popular seletores no painel.

const { Unidade, User, Process } = require('../models');
const logger = require('../utils/logger');
const { getRealIP } = require('../utils/helpers');

// Lista unidades. O super vê todas; um admin de unidade vê apenas a sua (para
// exibir o nome no painel, sem vazar a lista completa de delegacias).
exports.listUnidades = async (req, res) => {
  try {
    const where = {};
    if (req.loginType !== 'admin_super' && req.role !== 'super') {
      where.id = req.unidadeId || 0;
    }
    const unidades = await Unidade.findAll({
      where,
      attributes: ['id', 'nome', 'sigla', 'nome_pje', 'ativo'],
      order: [['nome', 'ASC']],
    });
    res.json(unidades);
  } catch (error) {
    logger.error('Erro ao listar unidades', { error: error.message });
    res.status(500).json({ error: 'Erro ao listar unidades.' });
  }
};

exports.createUnidade = async (req, res) => {
  const { nome, sigla, nome_pje, ativo } = req.body || {};
  if (!nome || !String(nome).trim()) {
    return res.status(400).json({ error: 'Nome da unidade é obrigatório.' });
  }
  try {
    const nomeTrim = String(nome).trim();
    const existing = await Unidade.findOne({ where: { nome: nomeTrim } });
    if (existing) {
      return res.status(409).json({ error: 'Já existe uma unidade com este nome.' });
    }
    const unidade = await Unidade.create({
      nome: nomeTrim,
      sigla: sigla ? String(sigla).trim() : null,
      // Sem nome_pje explícito, deriva do nome (uppercase). Pode ser ajustado
      // depois, ou definido automaticamente ao cadastrar a credencial PJe.
      nome_pje: nome_pje ? String(nome_pje).trim().toUpperCase() : nomeTrim.toUpperCase(),
      ativo: ativo !== undefined ? !!ativo : true,
    });
    logger.info('Unidade criada', { unidadeId: unidade.id, nome: unidade.nome, createdBy: req.userId, ip: getRealIP(req) });
    res.status(201).json(unidade);
  } catch (error) {
    logger.error('Erro ao criar unidade', { error: error.message, stack: error.stack });
    res.status(500).json({ error: 'Erro ao criar unidade.' });
  }
};

exports.updateUnidade = async (req, res) => {
  const { id } = req.params;
  const { nome, sigla, nome_pje, ativo } = req.body || {};
  try {
    const unidade = await Unidade.findByPk(id);
    if (!unidade) {
      return res.status(404).json({ error: 'Unidade não encontrada.' });
    }
    if (nome !== undefined) {
      const nomeTrim = String(nome).trim();
      if (!nomeTrim) return res.status(400).json({ error: 'Nome não pode ser vazio.' });
      const dup = await Unidade.findOne({ where: { nome: nomeTrim } });
      if (dup && dup.id !== unidade.id) {
        return res.status(409).json({ error: 'Já existe outra unidade com este nome.' });
      }
      unidade.nome = nomeTrim;
    }
    if (sigla !== undefined) unidade.sigla = sigla ? String(sigla).trim() : null;
    if (nome_pje !== undefined) unidade.nome_pje = nome_pje ? String(nome_pje).trim().toUpperCase() : null;
    if (ativo !== undefined) unidade.ativo = !!ativo;
    await unidade.save();
    logger.info('Unidade atualizada', { unidadeId: unidade.id, updatedBy: req.userId, ip: getRealIP(req) });
    res.json(unidade);
  } catch (error) {
    logger.error('Erro ao atualizar unidade', { error: error.message, stack: error.stack });
    res.status(500).json({ error: 'Erro ao atualizar unidade.' });
  }
};

exports.deleteUnidade = async (req, res) => {
  const { id } = req.params;
  try {
    const unidade = await Unidade.findByPk(id);
    if (!unidade) {
      return res.status(404).json({ error: 'Unidade não encontrada.' });
    }
    // Só permite excluir unidade vazia (sem usuários nem processos) para não
    // deixar registros órfãos nem violar a FK RESTRICT.
    const [numUsuarios, numProcessos] = await Promise.all([
      User.count({ where: { unidade_id: unidade.id } }),
      Process.count({ where: { unidade_id: unidade.id } }),
    ]);
    if (numUsuarios > 0 || numProcessos > 0) {
      return res.status(409).json({
        error: `A unidade não pode ser excluída: possui ${numUsuarios} usuário(s) e ${numProcessos} processo(s) vinculado(s).`,
      });
    }
    await unidade.destroy();
    logger.info('Unidade excluída', { unidadeId: id, deletedBy: req.userId, ip: getRealIP(req) });
    res.json({ message: 'Unidade excluída com sucesso.' });
  } catch (error) {
    logger.error('Erro ao excluir unidade', { error: error.message, stack: error.stack });
    res.status(500).json({ error: 'Erro ao excluir unidade.' });
  }
};
