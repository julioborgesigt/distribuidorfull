// /frontend/src/utils/prazo.js
// Helpers puros de cálculo/formatação de prazo processual

import { differenceInDays, startOfToday } from 'date-fns';

// Converte "YYYY-MM-DD" para Date em horário local (evita erro de UTC no fuso Brasil)
export const parseDateLocal = (str) => {
  const [y, m, d] = str.split('-').map(Number);
  return new Date(y, m - 1, d);
};

// Calcula prazo sempre a partir de data_intimacao + prazo_processual,
// igual ao sistema antigo — ignora prazo_vencimento armazenado, que pode estar desatualizado.
// Usa prazo_vencimento apenas como último recurso (sem os outros campos).
export const getPrazoRestanteNum = (proc) => {
  let dataVencimento = null;

  if (proc.data_intimacao && proc.prazo_processual) {
    const dias = parseInt(proc.prazo_processual, 10) || 0;
    dataVencimento = parseDateLocal(proc.data_intimacao);
    dataVencimento.setDate(dataVencimento.getDate() + dias);
  } else if (proc.prazo_vencimento) {
    dataVencimento = parseDateLocal(proc.prazo_vencimento);
  }

  if (!dataVencimento) return null;
  try {
    return differenceInDays(dataVencimento, startOfToday());
  } catch {
    return null;
  }
};

export const formatarPrazo = (dias) => {
  if (dias === null) return 'N/A';
  if (dias < 0) return `Vencido há ${Math.abs(dias)} dias`;
  if (dias === 0) return 'Vence hoje';
  return `Vence em ${dias} dias`;
};

export const getCorPrazo = (dias) => {
  if (dias === null) return 'grey';
  if (dias < 0) return 'red';
  if (dias <= 5) return 'orange';
  return 'green';
};
