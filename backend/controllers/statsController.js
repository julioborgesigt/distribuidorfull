// /controllers/statsController.js
// Gerencia estatísticas e opções de filtro do dashboard

const { sequelize, User, Process } = require('../models');
const { Op } = require('sequelize');
const logger = require('../utils/logger');
const { getRealIP, parseArrayFilter } = require('../utils/helpers');

// Helper: Constrói a cláusula WHERE para os stats (ignora 'cumprido')
const buildStatsWhereClause = (req) => {
  const { search, classe, assunto, tarjas, userId, prazo } = req.query;
  const { loginType, userId: reqUserId } = req;

  const where = {};

  if (search) {
    where.numero_processo = { [Op.like]: `${search}%` };
  }
  const classeFilter = parseArrayFilter(classe);
  if (classeFilter) {
    where.classe_principal = { [Op.in]: classeFilter };
  }
  const assuntoFilter = parseArrayFilter(assunto);
  if (assuntoFilter) {
    where.assunto_principal = { [Op.in]: assuntoFilter };
  }
  const tarjasFilter = parseArrayFilter(tarjas);
  if (tarjasFilter) {
    where.tarjas = { [Op.in]: tarjasFilter };
  }

  const userIdFilter = parseArrayFilter(userId);
  const shouldIncludeNA = (req.query.includeNA === 'true');

  if (loginType !== 'admin_super') {
    where.userId = reqUserId;
  } else {
    let userWhereClause = null;
    if (userIdFilter && userIdFilter.length > 0) {
      userWhereClause = { [Op.in]: userIdFilter };
    }
    if (shouldIncludeNA) {
      where.userId = userWhereClause ? { [Op.or]: [userWhereClause, null] } : null;
    } else if (userWhereClause) {
      where.userId = userWhereClause;
    }
  }

  if (prazo) {
    const today = new Date().toISOString().split('T')[0];
    where.prazo_vencimento = { [Op.not]: null };

    if (prazo === 'vencido') {
      where.prazo_vencimento = { [Op.lt]: today };
    } else if (prazo === 'a_vencer') {
      where.prazo_vencimento = { [Op.gte]: today };
    }
  }

  return where;
};

// Estatísticas do dashboard
exports.getDashboardStats = async (req, res) => {
  try {
    const baseWhere = buildStatsWhereClause(req);

    const pendingWhere = { ...baseWhere, cumprido: false };

    const dataLimite = new Date();
    dataLimite.setDate(dataLimite.getDate() - 30);

    const { dataInicio, dataFim } = req.query;

    const cumpridoWhere = {
      ...baseWhere,
      cumprido: true,
    };

    if (dataInicio && dataFim) {
      cumpridoWhere.cumpridoDate = { [Op.between]: [dataInicio, dataFim] };
    } else if (dataInicio) {
      cumpridoWhere.cumpridoDate = { [Op.gte]: dataInicio };
    } else if (dataFim) {
      cumpridoWhere.cumpridoDate = { [Op.lte]: dataFim };
    } else {
      cumpridoWhere.cumpridoDate = { [Op.gte]: dataLimite };
    }

    // Filtros de prazo usando coluna indexada prazo_vencimento
    const today = new Date().toISOString().split('T')[0];
    const in10d = new Date();
    in10d.setDate(in10d.getDate() + 10);
    const in11d = new Date();
    in11d.setDate(in11d.getDate() + 11);
    const in30d = new Date();
    in30d.setDate(in30d.getDate() + 30);

    const vencidoWhere = { ...pendingWhere, prazo_vencimento: { [Op.lt]: today } };
    const p10dWhere = { ...pendingWhere, prazo_vencimento: { [Op.between]: [today, in10d.toISOString().split('T')[0]] } };
    const p30dWhere = { ...pendingWhere, prazo_vencimento: { [Op.between]: [in11d.toISOString().split('T')[0], in30d.toISOString().split('T')[0]] } };

    const assuntosChave = ['Homicídio', 'Roubo', 'Furto', 'Estelionato', 'Tráfico'];
    const assuntoQueries = assuntosChave.map(assunto =>
      Process.count({ where: { ...pendingWhere, assunto_principal: { [Op.like]: `%${assunto}%` } } })
    );

    const [
      totalPendentes,
      byUser,
      byPrazo_vencidos,
      byPrazo_p10d,
      byPrazo_p30d,
      cumpridos30d,
      ...assuntoCounts
    ] = await Promise.all([
      Process.count({ where: pendingWhere }),

      Process.findAll({
        where: pendingWhere,
        group: ['userId', 'User.id', 'User.nome'],
        attributes: ['userId', [sequelize.fn('COUNT', 'id'), 'count']],
        include: [{ model: User, attributes: ['nome'] }],
        order: [[sequelize.fn('COUNT', 'id'), 'DESC']],
        limit: 11
      }),

      Process.count({ where: vencidoWhere }),
      Process.count({ where: p10dWhere }),
      Process.count({ where: p30dWhere }),

      Process.findAll({
        where: cumpridoWhere,
        group: ['userId', 'User.id', 'User.nome'],
        attributes: ['userId', [sequelize.fn('COUNT', 'id'), 'count']],
        include: [{ model: User, attributes: ['nome'] }],
        order: [[sequelize.fn('COUNT', 'id'), 'DESC']]
      }),

      ...assuntoQueries
    ]);

    const byUserFormatted = byUser.map(item => ({
      nome: item.User ? item.User.nome : 'N.A.',
      count: item.get('count')
    }));

    const cumpridos30dFormatted = cumpridos30d.map(item => ({
      nome: item.User ? item.User.nome : 'N.A.',
      count: item.get('count')
    }));

    const byAssuntoFormatted = assuntosChave.map((assunto, index) => ({
      nome: assunto,
      count: assuntoCounts[index]
    }));

    res.json({
      totalPendentes,
      byUser: byUserFormatted,
      byPrazo: {
        vencidos: byPrazo_vencidos,
        p10d: byPrazo_p10d,
        p30d: byPrazo_p30d
      },
      byAssunto: byAssuntoFormatted,
      cumpridos30d: cumpridos30dFormatted
    });

  } catch (error) {
    logger.error('Erro ao buscar estatísticas do dashboard', {
      error: error.message,
      stack: error.stack,
      userId: req.userId,
      ip: getRealIP(req)
    });
    res.status(500).json({ error: 'Erro interno do servidor', details: error.message });
  }
};

// Valores únicos para os filtros do dashboard (classe, assunto, tarjas)
exports.getFilterOptions = async (req, res) => {
  try {
    const [classes, assuntos, tarjas] = await Promise.all([
      Process.findAll({
        attributes: [[sequelize.fn('DISTINCT', sequelize.col('classe_principal')), 'value']],
        where: { classe_principal: { [Op.ne]: null, [Op.ne]: '' } },
        raw: true
      }),
      Process.findAll({
        attributes: [[sequelize.fn('DISTINCT', sequelize.col('assunto_principal')), 'value']],
        where: { assunto_principal: { [Op.ne]: null, [Op.ne]: '' } },
        raw: true
      }),
      Process.findAll({
        attributes: [[sequelize.fn('DISTINCT', sequelize.col('tarjas')), 'value']],
        where: { tarjas: { [Op.ne]: null, [Op.ne]: '' } },
        raw: true
      })
    ]);

    const tarjasSet = new Set();
    tarjas.forEach(({ value }) => {
      value.split(',').map(t => t.trim()).filter(t => t).forEach(t => tarjasSet.add(t));
    });

    res.json({
      classes: classes.map(r => r.value).sort(),
      assuntos: assuntos.map(r => r.value).sort(),
      tarjas: Array.from(tarjasSet).sort()
    });
  } catch (error) {
    logger.error('Erro ao buscar opções de filtros', { error: error.message });
    res.status(500).json({ error: 'Erro ao buscar opções de filtros' });
  }
};
