// /controllers/processController.js
// Gerencia operações CRUD de processos

const fs = require('fs');
const fsPromises = require('fs').promises;
const csvParser = require('csv-parser');
const { sequelize, User, Process } = require('../models');
const { Op, literal } = require('sequelize');
const iconv = require('iconv-lite');
const logger = require('../utils/logger');
const { getRealIP, parseArrayFilter, processScopeWhere } = require('../utils/helpers');

// Upload e importação de CSV
exports.uploadCSV = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Nenhum arquivo foi enviado.' });
  }

  const filePath = req.file.path;
  const results = [];

  const parseDate = (dateStr) => {
    if (!dateStr) return null;
    const parts = dateStr.split('/');
    if (parts.length !== 3) return null;
    const [day, month, year] = parts;
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  };

  const normalizeHeader = (header) => {
    let norm = header.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    norm = norm.replace(/\uFFFD/g, 'u');
    return norm.trim();
  };

  fs.createReadStream(filePath)
    .pipe(iconv.decodeStream('latin1'))
    .pipe(iconv.encodeStream('utf8'))
    .pipe(csvParser({
      separator: ';',
      mapHeaders: ({ header }) => normalizeHeader(header)
    }))
    .on('data', (data) => {
        const numeroProcesso = data['Numero do processo'] ? data['Numero do processo'].trim() : '';
        if (numeroProcesso !== '') {
            results.push({
                numero_processo: numeroProcesso,
                prazo_processual: data['Prazo processual'] ? data['Prazo processual'].trim() : '',
                classe_principal: data['Classe principal'] ? data['Classe principal'].trim() : '',
                assunto_principal: data['Assunto principal'] ? data['Assunto principal'].trim() : '',
                tarjas: data['Tarjas'] ? data['Tarjas'].trim() : '',
                data_intimacao: parseDate(data['Data da intimacao'])
            });
        }
    })
    .on('end', async () => {
      try {
        const latestProcessesMap = new Map();

        for (const currentRow of results) {
          const numeroProcesso = currentRow.numero_processo;

          if (!latestProcessesMap.has(numeroProcesso)) {
            latestProcessesMap.set(numeroProcesso, currentRow);
          } else {
            const existingRow = latestProcessesMap.get(numeroProcesso);
            const existingDate = new Date(existingRow.data_intimacao);
            const currentDate = new Date(currentRow.data_intimacao);

            if (currentDate > existingDate) {
              latestProcessesMap.set(numeroProcesso, currentRow);
            }
          }
        }

        // Otimização: busca todos os processos existentes em uma única query
        const allNumeros = Array.from(latestProcessesMap.keys());
        const existingProcesses = await Process.findAll({
          where: { numero_processo: { [Op.in]: allNumeros } }
        });
        const existingMap = new Map(existingProcesses.map(p => [p.numero_processo, p]));

        // Separa novos registros dos que precisam de atualização
        const newRows = [];
        const updateFns = []; // Funções lazy — só executam dentro da transaction

        for (const row of latestProcessesMap.values()) {
          const existing = existingMap.get(row.numero_processo);

          if (existing) {
            const updateData = {};
            if (row.prazo_processual !== existing.prazo_processual) {
              updateData.prazo_processual = row.prazo_processual;
            }
            if (row.classe_principal !== existing.classe_principal) {
              updateData.classe_principal = row.classe_principal;
            }
            if (row.assunto_principal !== existing.assunto_principal) {
              updateData.assunto_principal = row.assunto_principal;
            }
            if (row.tarjas !== existing.tarjas) {
              updateData.tarjas = row.tarjas;
            }
            if (row.data_intimacao !== existing.data_intimacao) {
              const newDate = new Date(row.data_intimacao);
              const storedDate = new Date(existing.data_intimacao);
              if (newDate > storedDate) {
                updateData.data_intimacao = row.data_intimacao;
                updateData.cumprido = false;
                updateData.reiteracoes = (existing.cumprido === false ? (existing.reiteracoes || 0) + 1 : 1);
              }
            }
            if (Object.keys(updateData).length > 0) {
              updateFns.push((t) => existing.update(updateData, { transaction: t }));
            }
          } else {
            newRows.push(row);
          }
        }

        // Executa tudo dentro de uma única transaction atômica.
        // Updates são processados em lotes de 50 para não sobrecarregar
        // o pool de conexões com CSVs de até 10 mil linhas.
        const CHUNK_SIZE = 50;
        await sequelize.transaction(async (t) => {
          if (newRows.length > 0) {
            await Process.bulkCreate(newRows, { individualHooks: true, transaction: t });
          }
          for (let i = 0; i < updateFns.length; i += CHUNK_SIZE) {
            const chunk = updateFns.slice(i, i + CHUNK_SIZE);
            await Promise.all(chunk.map(fn => fn(t)));
          }
        });

        await fsPromises.unlink(filePath);
        logger.info('CSV importado com sucesso', {
          totalRows: latestProcessesMap.size,
          userId: req.userId
        });
        res.json({ message: 'CSV importado com sucesso. Registros mais recentes foram processados.', totalRows: latestProcessesMap.size });

      } catch (error) {
        logger.error('Erro ao salvar dados do CSV', {
          error: error.message,
          stack: error.stack,
          userId: req.userId,
          ip: getRealIP(req)
        });
        res.status(500).json({ error: 'Erro ao salvar dados do CSV.' });
      }
    })
    .on('error', (error) => {
      logger.error('Erro ao ler o arquivo CSV', {
        error: error.message,
        stack: error.stack,
        userId: req.userId,
        ip: getRealIP(req)
      });
      res.status(500).json({ error: 'Erro ao ler o arquivo CSV.' });
    });
};

// Lista processos com paginação, filtros e ordenação do lado do servidor
exports.listProcesses = async (req, res) => {
  try {
    const {
      page = 1,
      itemsPerPage = 10,
      sortBy = '[]',
      search,
      classe,
      assunto,
      tarjas,
      userId,
      prazo,
      cumprido,
      dataInicio,
      dataFim
    } = req.query;

    const limit = parseInt(itemsPerPage, 10);
    const isAll = limit === -1;
    const offset = (parseInt(page, 10) - 1) * limit;

    let options = {
      where: {},
      include: [{
        model: User,
        attributes: ['id', 'nome']
      }],
      offset: isAll ? undefined : offset,
      limit: isAll ? undefined : limit,
      order: []
    };

    if (search) {
      // Busca por prefixo usa o índice UNIQUE (muito mais rápido que %search%)
      options.where.numero_processo = { [Op.like]: `${search}%` };
    }

    if (cumprido && cumprido !== 'null') {
      options.where.cumprido = (cumprido === 'true');
    }

    if (dataInicio && dataFim) {
      options.where.cumpridoDate = { [Op.between]: [dataInicio, dataFim] };
    } else if (dataInicio) {
      options.where.cumpridoDate = { [Op.gte]: dataInicio };
    } else if (dataFim) {
      options.where.cumpridoDate = { [Op.lte]: dataFim };
    }

    const classeFilter = parseArrayFilter(classe);
    if (classeFilter) {
      options.where.classe_principal = { [Op.in]: classeFilter };
    }

    const assuntoFilter = parseArrayFilter(assunto);
    if (assuntoFilter) {
      options.where.assunto_principal = { [Op.in]: assuntoFilter };
    }

    const tarjasFilter = parseArrayFilter(tarjas);
    if (tarjasFilter) {
      options.where.tarjas = { [Op.in]: tarjasFilter };
    }

    const userIdFilter = parseArrayFilter(userId);
    const shouldIncludeNA = (req.query.includeNA === 'true');

    if (req.loginType !== 'admin_super') {
      options.where.userId = req.userId;
    } else {
      let userWhereClause = null;

      if (userIdFilter && userIdFilter.length > 0) {
        userWhereClause = { [Op.in]: userIdFilter };
      }

      if (shouldIncludeNA) {
        if (userWhereClause) {
          options.where.userId = {
            [Op.or]: [ userWhereClause, null ]
          };
        } else {
          options.where.userId = null;
        }
      } else if (userWhereClause) {
        options.where.userId = userWhereClause;
      }
    }

    if (prazo) {
      const today = new Date().toISOString().split('T')[0];

      if (prazo === 'vencido') {
        options.where.prazo_vencimento = { [Op.lt]: today };
      } else if (prazo === 'a_vencer') {
        options.where.prazo_vencimento = { [Op.gte]: today };
      } else {
        options.where.prazo_vencimento = { [Op.not]: null };
      }
    }

    // Whitelist de colunas ordenáveis — evita erro 500 (ou exposição de schema)
    // a partir de uma `key` arbitrária vinda do cliente.
    const SORTABLE_COLUMNS = new Set([
      'numero_processo', 'prazo_processual', 'classe_principal',
      'assunto_principal', 'tarjas', 'data_intimacao', 'prazo_vencimento',
      'cumprido', 'reiteracoes', 'cumpridoDate', 'observacoes'
    ]);

    let sortConfig = [];
    try {
      const parsed = JSON.parse(sortBy);
      if (Array.isArray(parsed)) sortConfig = parsed;
    } catch {
      sortConfig = [];
    }

    const normalizeOrder = (order) => (String(order).toUpperCase() === 'ASC' ? 'ASC' : 'DESC');

    const safeOrder = sortConfig.reduce((acc, s) => {
      const order = normalizeOrder(s.order);
      if (s.key === 'user') {
        acc.push([User, 'nome', order]);
      } else if (s.key === 'prazoRestanteNum') {
        // Ordena pelo prazo calculado (data_intimacao + prazo_processual em dias),
        // igual ao cálculo exibido no frontend — ignora prazo_vencimento armazenado.
        acc.push([literal(`DATE_ADD(data_intimacao, INTERVAL CAST(prazo_processual AS UNSIGNED) DAY)`), order]);
      } else if (SORTABLE_COLUMNS.has(s.key)) {
        acc.push([s.key, order]);
      }
      // keys desconhecidas são silenciosamente ignoradas
      return acc;
    }, []);

    options.order = safeOrder.length > 0 ? safeOrder : [['data_intimacao', 'DESC']];

    const { count, rows } = await Process.findAndCountAll(options);

    res.json({
      items: rows,
      totalItems: count
    });

  } catch (error) {
    logger.error('Erro ao buscar processos com paginação', {
      error: error.message,
      stack: error.stack,
      userId: req.userId,
      ip: getRealIP(req)
    });
    res.status(500).json({ error: 'Erro interno do servidor', details: error.message });
  }
};

// Atribuição automática de processos
exports.assignProcesses = async (req, res) => {
  res.status(501).json({ error: 'Atribuição automática não implementada.' });
};

// Atribuição manual de um processo
exports.manualAssignProcess = async (req, res) => {
  const { numeroProcesso, matricula } = req.body;
  logger.info('Atribuição manual de processo', {
    numeroProcesso,
    matricula,
    userId: req.userId,
    ip: getRealIP(req)
  });

  try {
    const user = await User.findOne({ where: { matricula } });
    if (!user) {
      logger.warn('Usuário não encontrado para atribuição', {
        matricula,
        userId: req.userId
      });
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    const numero = numeroProcesso.trim();

    const process = await Process.findOne({ where: { numero_processo: numero, ...processScopeWhere(req) } });
    if (!process) {
      logger.warn('Processo não encontrado para atribuição', {
        numeroProcesso: numero,
        userId: req.userId
      });
      return res.status(404).json({ error: 'Processo não encontrado.' });
    }

    process.userId = user.id;
    await process.save();

    logger.info('Processo atribuído com sucesso', {
      processId: process.id,
      numeroProcesso: process.numero_processo,
      assignedTo: user.id,
      assignedBy: req.userId
    });
    res.json({ message: 'Processo atribuído com sucesso.' });
  } catch (error) {
    logger.error('Erro ao atribuir processo', {
      error: error.message,
      stack: error.stack,
      userId: req.userId,
      ip: getRealIP(req)
    });
    res.status(500).json({ error: 'Erro ao atribuir processo.' });
  }
};

// Atualiza observações de um processo
exports.updateObservacoes = async (req, res) => {
  try {
    const { id } = req.params;
    const { observacoes } = req.body;

    const processo = await Process.findOne({ where: { id, ...processScopeWhere(req) } });

    if (!processo) {
      return res.status(404).json({ error: 'Processo não encontrado' });
    }

    processo.observacoes = observacoes || '';
    await processo.save();

    res.status(200).json(processo);

  } catch (error) {
    logger.error('Erro ao salvar observação', {
      error: error.message,
      stack: error.stack,
      processId: req.params.id,
      userId: req.userId,
      ip: getRealIP(req)
    });
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

// Marca como cumprido
exports.markAsCumprido = async (req, res) => {
  try {
    const { id } = req.params;
    const processo = await Process.findOne({ where: { id, ...processScopeWhere(req) } });

    if (!processo) {
      return res.status(404).json({ error: 'Processo não encontrado' });
    }

    processo.cumprido = true;
    processo.cumpridoDate = new Date();
    await processo.save();

    const processoAtualizado = await Process.findByPk(id, {
      include: [{ model: User, attributes: ['nome'] }]
    });

    res.status(200).json(processoAtualizado);

  } catch (error) {
    logger.error('Erro ao marcar como cumprido', {
      error: error.message,
      stack: error.stack,
      processId: req.params.id,
      userId: req.userId,
      ip: getRealIP(req)
    });
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

// Desmarca como cumprido
exports.unmarkAsCumprido = async (req, res) => {
  try {
    const { id } = req.params;
    const processo = await Process.findOne({ where: { id, ...processScopeWhere(req) } });

    if (!processo) {
      return res.status(404).json({ error: 'Processo não encontrado' });
    }

    processo.cumprido = false;
    processo.cumpridoDate = null;
    await processo.save();

    const processoAtualizado = await Process.findByPk(id, {
      include: [{ model: User, attributes: ['nome'] }]
    });

    res.status(200).json(processoAtualizado);

  } catch (error) {
    logger.error('Erro ao desmarcar como cumprido', {
      error: error.message,
      stack: error.stack,
      processId: req.params.id,
      userId: req.userId,
      ip: getRealIP(req)
    });
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

// Contagem de processos não atribuídos
exports.getUnassignedCount = async (req, res) => {
  try {
    const count = await Process.count({
      where: {
        userId: null,
        cumprido: false
      }
    });

    res.status(200).json({ count });

  } catch (error) {
    logger.error('Erro ao contar processos não atribuídos', {
      error: error.message,
      stack: error.stack,
      userId: req.userId,
      ip: getRealIP(req)
    });
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

// Atribuição em Massa
exports.bulkAssign = async (req, res) => {
  try {
    const { processIds, matricula } = req.body;
    const user = await User.findOne({ where: { matricula } });
    if (!user) {
      return res.status(404).json({ error: 'Usuário destino não encontrado.' });
    }
    // admin_padrao só pode reatribuir processos que já são dele
    const [affected] = await Process.update({ userId: user.id }, {
      where: { id: processIds, ...processScopeWhere(req) }
    });
    logger.info('Atribuição em massa realizada', {
      requested: processIds.length,
      affected,
      assignedTo: user.id,
      matricula,
      assignedBy: req.userId,
      ip: getRealIP(req)
    });
    res.json({ message: 'Atribuição em massa realizada com sucesso.', count: affected });
  } catch (error) {
    logger.error('Erro ao realizar atribuição em massa', {
      error: error.message,
      stack: error.stack,
      userId: req.userId,
      ip: getRealIP(req)
    });
    res.status(500).json({ error: 'Erro ao realizar atribuição em massa.' });
  }
};

// Exclusão em Massa
exports.bulkDelete = async (req, res) => {
  try {
    const { processIds } = req.body;
    const affected = await Process.destroy({
      where: { id: processIds, ...processScopeWhere(req) }
    });
    logger.info('Exclusão em massa realizada', {
      requested: processIds.length,
      affected,
      deletedBy: req.userId,
      ip: getRealIP(req)
    });
    res.json({ message: 'Exclusão em massa realizada com sucesso.', count: affected });
  } catch (error) {
    logger.error('Erro ao realizar exclusão em massa', {
      error: error.message,
      stack: error.stack,
      userId: req.userId,
      ip: getRealIP(req)
    });
    res.status(500).json({ error: 'Erro ao realizar exclusão em massa.' });
  }
};

// Marcar como Cumprido em Massa
exports.bulkCumprido = async (req, res) => {
  try {
    const { processIds } = req.body;
    const [affected] = await Process.update({ cumprido: true, reiteracoes: 0, cumpridoDate: new Date() }, {
      where: { id: processIds, ...processScopeWhere(req) }
    });
    logger.info('Processos marcados como cumpridos em massa', {
      requested: processIds.length,
      affected,
      markedBy: req.userId,
      ip: getRealIP(req)
    });
    res.json({ message: 'Processos marcados como cumpridos com sucesso.', count: affected });
  } catch (error) {
    logger.error('Erro ao atualizar status em massa', {
      error: error.message,
      stack: error.stack,
      userId: req.userId,
      ip: getRealIP(req)
    });
    res.status(500).json({ error: 'Erro ao atualizar status em massa.' });
  }
};

// Atualiza o número de reiterações
exports.updateIntim = async (req, res) => {
  const { processId, reiteracoes } = req.body;
  try {
    const process = await Process.findOne({ where: { id: processId, ...processScopeWhere(req) } });
    if (!process) {
      return res.status(404).json({ error: 'Processo não encontrado.' });
    }
    process.reiteracoes = reiteracoes;
    await process.save();
    logger.info('Número de reiterações atualizado', {
      processId,
      reiteracoes,
      updatedBy: req.userId
    });
    res.json({ message: 'Número de intim atualizado com sucesso.' });
  } catch (error) {
    logger.error('Erro ao atualizar número de intim', {
      error: error.message,
      stack: error.stack,
      processId,
      userId: req.userId,
      ip: getRealIP(req)
    });
    res.status(500).json({ error: 'Erro ao atualizar número de intim.' });
  }
};
