// /controllers/processController.js
// Gerencia operações CRUD de processos

const fs = require('fs');
const fsPromises = require('fs').promises;
const csvParser = require('csv-parser');
const { sequelize, User, Process } = require('../models');
const { Op, literal } = require('sequelize');
const iconv = require('iconv-lite');
const logger = require('../utils/logger');
const { getRealIP, parseArrayFilter } = require('../utils/helpers');

// Upload e importação de CSV
exports.uploadCSV = (req, res) => {
  if (!req.file) {
    return res.status(400).send('Nenhum arquivo foi enviado.');
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

        for (let row of latestProcessesMap.values()) {
          const existing = await Process.findOne({ where: { numero_processo: row.numero_processo } });

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
              await existing.update(updateData);
            }
          } else {
            await Process.create(row);
          }
        }

        await fsPromises.unlink(filePath);
        logger.info('CSV importado com sucesso', {
          totalRows: latestProcessesMap.size,
          userId: req.userId
        });
        res.send('CSV importado com sucesso. Registros mais recentes foram processados.');

      } catch (error) {
        logger.error('Erro ao salvar dados do CSV', {
          error: error.message,
          stack: error.stack,
          userId: req.userId,
          ip: getRealIP(req)
        });
        res.status(500).send('Erro ao salvar dados do CSV.');
      }
    })
    .on('error', (error) => {
      logger.error('Erro ao ler o arquivo CSV', {
        error: error.message,
        stack: error.stack,
        userId: req.userId,
        ip: getRealIP(req)
      });
      res.status(500).send('Erro ao ler o arquivo CSV.');
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

    if (req.loginType !== 'admin_super') {
      options.where.userId = req.userId;
    }

    if (search) {
      options.where.numero_processo = { [Op.like]: `%${search}%` };
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
      const prazoQuery = `DATE_ADD(data_intimacao, INTERVAL CAST(prazo_processual AS UNSIGNED) DAY)`;
      options.where.data_intimacao = { [Op.not]: null };
      options.where[Op.and] = (options.where[Op.and] || []);

      if (prazo === 'vencido') {
        options.where[Op.and].push(literal(`${prazoQuery} < CURDATE()`));
      } else if (prazo === 'a_vencer') {
        options.where[Op.and].push(literal(`${prazoQuery} >= CURDATE()`));
      }
    }

    const sortConfig = JSON.parse(sortBy);
    if (sortConfig.length > 0) {
      options.order = sortConfig.map(s => {
        if (s.key === 'user') {
          return [User, 'nome', s.order];
        }
        if (s.key === 'prazoRestanteNum') {
          const prazoQuery = `DATE_ADD(data_intimacao, INTERVAL CAST(prazo_processual AS UNSIGNED) DAY)`;
          return [literal(prazoQuery), s.order];
        }
        return [s.key, s.order];
      });
    } else {
      options.order = [['data_intimacao', 'DESC']];
    }

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
  res.send('Atribuição automática simulada (lógica não implementada).');
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
      return res.status(404).send('Usuário não encontrado.');
    }

    const numero = numeroProcesso.trim();

    const process = await Process.findOne({ where: { numero_processo: numero } });
    if (!process) {
      logger.warn('Processo não encontrado para atribuição', {
        numeroProcesso: numero,
        userId: req.userId
      });
      return res.status(404).send('Processo não encontrado.');
    }

    process.userId = user.id;
    await process.save();

    logger.info('Processo atribuído com sucesso', {
      processId: process.id,
      numeroProcesso: process.numero_processo,
      assignedTo: user.id,
      assignedBy: req.userId
    });
    res.send('Processo atribuído com sucesso.');
  } catch (error) {
    logger.error('Erro ao atribuir processo', {
      error: error.message,
      stack: error.stack,
      userId: req.userId,
      ip: getRealIP(req)
    });
    res.status(500).send('Erro ao atribuir processo.');
  }
};

// Atualiza observações de um processo
exports.updateObservacoes = async (req, res) => {
  try {
    const { id } = req.params;
    const { observacoes } = req.body;

    const processo = await Process.findByPk(id);

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
    const processo = await Process.findByPk(id);

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
    const processo = await Process.findByPk(id);

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
      return res.status(404).send("Usuário destino não encontrado.");
    }
    await Process.update({ userId: user.id }, {
      where: { id: processIds }
    });
    logger.info('Atribuição em massa realizada', {
      processCount: processIds.length,
      assignedTo: user.id,
      matricula,
      assignedBy: req.userId,
      ip: getRealIP(req)
    });
    res.send("Atribuição em massa realizada com sucesso.");
  } catch (error) {
    logger.error('Erro ao realizar atribuição em massa', {
      error: error.message,
      stack: error.stack,
      userId: req.userId,
      ip: getRealIP(req)
    });
    res.status(500).send("Erro ao realizar atribuição em massa.");
  }
};

// Exclusão em Massa
exports.bulkDelete = async (req, res) => {
  try {
    const { processIds } = req.body;
    await Process.destroy({
      where: { id: processIds }
    });
    logger.info('Exclusão em massa realizada', {
      processCount: processIds.length,
      deletedBy: req.userId,
      ip: getRealIP(req)
    });
    res.send("Exclusão em massa realizada com sucesso.");
  } catch (error) {
    logger.error('Erro ao realizar exclusão em massa', {
      error: error.message,
      stack: error.stack,
      userId: req.userId,
      ip: getRealIP(req)
    });
    res.status(500).send("Erro ao realizar exclusão em massa.");
  }
};

// Marcar como Cumprido em Massa
exports.bulkCumprido = async (req, res) => {
  try {
    const { processIds } = req.body;
    await Process.update({ cumprido: true, reiteracoes: 0 }, {
      where: { id: processIds }
    });
    logger.info('Processos marcados como cumpridos em massa', {
      processCount: processIds.length,
      markedBy: req.userId,
      ip: getRealIP(req)
    });
    res.send("Processos marcados como cumpridos com sucesso.");
  } catch (error) {
    logger.error('Erro ao atualizar status em massa', {
      error: error.message,
      stack: error.stack,
      userId: req.userId,
      ip: getRealIP(req)
    });
    res.status(500).send("Erro ao atualizar status em massa.");
  }
};

// Atualiza o número de reiterações
exports.updateIntim = async (req, res) => {
  const { processId, reiteracoes } = req.body;
  try {
    const process = await Process.findByPk(processId);
    if (!process) {
      return res.status(404).send('Processo não encontrado.');
    }
    process.reiteracoes = reiteracoes;
    await process.save();
    logger.info('Número de reiterações atualizado', {
      processId,
      reiteracoes,
      updatedBy: req.userId
    });
    res.send('Número de intim atualizado com sucesso.');
  } catch (error) {
    logger.error('Erro ao atualizar número de intim', {
      error: error.message,
      stack: error.stack,
      processId,
      userId: req.userId,
      ip: getRealIP(req)
    });
    res.status(500).send('Erro ao atualizar número de intim.');
  }
};
