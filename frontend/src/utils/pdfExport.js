// /frontend/src/utils/pdfExport.js
// Geração do relatório PDF de processos (jsPDF carregado sob demanda)

import { format } from 'date-fns'

function getValue (obj, path) {
  if (path === 'user') {
    return obj.User?.nome
  }
  return path.split('.').reduce((acc, part) => acc && acc[part], obj)
}

export function sortProcesses (processList, sortState) {
  if (!sortState || sortState.length === 0) {
    return processList
  }
  const { key, order } = sortState[0]
  if (!key) {
    return processList
  }
  return processList.toSorted((a, b) => {
    let valA = getValue(a, key)
    let valB = getValue(b, key)
    if (valA == null) {
      return 1
    }
    if (valB == null) {
      return -1
    }
    if (typeof valA === 'string') {
      valA = valA.toLowerCase()
      valB = valB.toLowerCase()
    }
    if (valA < valB) {
      return order === 'asc' ? -1 : 1
    }
    if (valA > valB) {
      return order === 'asc' ? 1 : -1
    }
    return 0
  })
}

/**
 * Gera e baixa o PDF de processos.
 * @param {Array} processes - Processos a exportar (já enriquecidos com prazoRestanteStr)
 * @param {Array} sortState - options.sortBy da tabela (ordenação aplicada ao PDF)
 * @param {string[]} filtrosAtivos - Descrições dos filtros aplicados (para o cabeçalho)
 */
export async function exportProcessesPDF (processes, sortState, filtrosAtivos) {
  let processesToExport = [...processes]
  if (sortState && sortState.length > 0) {
    processesToExport = sortProcesses(processesToExport, sortState)
  }

  // jsPDF e autoTable são carregados sob demanda (lazy) para não aumentar o bundle inicial
  const [{ default: jsPDF }, { default: autoTable }] = await Promise.all([
    import('jspdf'),
    import('jspdf-autotable'),
  ])
  const doc = new jsPDF('l', 'mm', 'a4')

  // --- CABEÇALHO DO PDF ---
  doc.setFontSize(16)
  doc.setFont(undefined, 'bold')
  doc.text('Relatório de Processos', 15, 15)

  doc.setFontSize(10)
  doc.setFont(undefined, 'normal')
  const dataAtual = format(new Date(), 'dd/MM/yyyy HH:mm')
  doc.text(`Data de Impressão: ${dataAtual}`, 15, 22)
  doc.text(`Total de Processos: ${processesToExport.length}`, 15, 28)

  let yPosition = 34
  if (filtrosAtivos.length > 0) {
    doc.setFont(undefined, 'bold')
    doc.text('Filtros Aplicados:', 15, yPosition)
    doc.setFont(undefined, 'normal')
    yPosition += 6

    for (const filtro of filtrosAtivos) {
      // Se o texto for muito longo, quebra em múltiplas linhas
      const maxWidth = 267 // Largura da página A4 landscape menos margens
      const linhas = doc.splitTextToSize(filtro, maxWidth)
      for (const linha of linhas) {
        doc.text(`  • ${linha}`, 15, yPosition)
        yPosition += 5
      }
    }
  } else {
    doc.text('Filtros: Nenhum filtro aplicado', 15, yPosition)
    yPosition += 6
  }

  // Linha separadora
  doc.setLineWidth(0.5)
  doc.line(15, yPosition + 2, 282, yPosition + 2)
  // --- FIM DO CABEÇALHO ---

  const columns = [
    { header: 'Nº Processo', dataKey: 'numero_processo' },
    { header: 'Atribuído a', dataKey: 'user' },
    { header: 'Classe', dataKey: 'classe_principal' },
    { header: 'Assunto', dataKey: 'assunto_principal' },
    { header: 'Tarjas', dataKey: 'tarjas' },
    { header: 'Prazo', dataKey: 'prazoRestanteStr' },
    { header: 'Reiterações', dataKey: 'reiteracoes' },
    { header: 'Obs', dataKey: 'observacoes' },
  ]
  const rows = processesToExport.map(proc => ({
    numero_processo: proc.numero_processo || '',
    user: proc.User?.nome || 'N.A.',
    classe_principal: proc.classe_principal || '',
    assunto_principal: proc.assunto_principal || '',
    tarjas: proc.tarjas || '',
    prazoRestanteStr: proc.prazoRestanteStr || 'N/A',
    reiteracoes: proc.reiteracoes || 0,
    observacoes: proc.observacoes || '',
  }))

  autoTable(doc, {
    columns,
    body: rows,
    startY: yPosition + 8,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [66, 139, 202], fontStyle: 'bold' },
  })

  doc.save('processos.pdf')
}
