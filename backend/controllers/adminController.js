// /controllers/adminController.js
// Hub de re-exportação — mantém compatibilidade com routes/admin.js
// A lógica real foi dividida em controllers especializados:
//   - processController.js  (CRUD de processos, CSV, operações em massa)
//   - userController.js     (CRUD de usuários, reset de senha)
//   - statsController.js    (estatísticas do dashboard, opções de filtro)

const processController = require('./processController');
const userController = require('./userController');
const statsController = require('./statsController');

module.exports = {
  // Processos
  uploadCSV: processController.uploadCSV,
  importPje: processController.importPje,
  importPjeStatus: processController.importPjeStatus,
  importPjeLogs: processController.importPjeLogs,
  listProcesses: processController.listProcesses,
  manualAssignProcess: processController.manualAssignProcess,
  updateObservacoes: processController.updateObservacoes,
  markAsCumprido: processController.markAsCumprido,
  unmarkAsCumprido: processController.unmarkAsCumprido,
  getUnassignedCount: processController.getUnassignedCount,
  bulkAssign: processController.bulkAssign,
  bulkDelete: processController.bulkDelete,
  bulkCumprido: processController.bulkCumprido,
  updateIntim: processController.updateIntim,

  // Usuários
  listUsers: userController.listUsers,
  preCadastro: userController.preCadastro,
  resetPassword: userController.resetPassword,
  deleteMatricula: userController.deleteMatricula,

  // Estatísticas
  getDashboardStats: statsController.getDashboardStats,
  getFilterOptions: statsController.getFilterOptions,
};
