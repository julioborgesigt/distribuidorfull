// /utils/pjeParser.js
//
// Funções PURAS de parsing/mapeamento das respostas do MNI (PJe/TJCE) para o
// formato dos campos do modelo Process. Sem I/O — fáceis de testar.
//
// As respostas do MNI vêm como SOAP/MTOM; aqui trabalhamos apenas com a parte
// XML (texto). Os campos que nos interessam estão todos em atributos/elementos
// simples, então usamos extração direcionada por regex (a saída do Apache CXF é
// regular e estável). Veja tests/unit/pjeParser.test.js para amostras reais.

// Extrai o valor de um atributo XML (ex.: attr(bloco, 'numero')).
function attr(xml, name) {
  const m = xml.match(new RegExp(`\\b${name}="([^"]*)"`));
  return m ? m[1] : null;
}

// Extrai o conteúdo de um elemento, ignorando prefixo de namespace
// (ex.: el(bloco, 'dataDisponibilizacao')).
function el(xml, name) {
  const m = xml.match(new RegExp(`<(?:\\w+:)?${name}>([^<]*)</(?:\\w+:)?${name}>`));
  return m ? m[1] : null;
}

// Formata um número CNJ de 20 dígitos (sem máscara) no padrão
// NNNNNNN-DD.AAAA.J.TR.OOOO. Se não tiver 20 dígitos, devolve como veio.
function formatNumeroCNJ(numero) {
  const d = String(numero || '').replace(/\D/g, '');
  if (d.length !== 20) return String(numero || '').trim();
  return `${d.slice(0, 7)}-${d.slice(7, 9)}.${d.slice(9, 13)}.${d.slice(13, 14)}.${d.slice(14, 16)}.${d.slice(16, 20)}`;
}

// Converte data/hora do MNI ("AAAAMMDDHHMMSS" ou "AAAAMMDD") para 'YYYY-MM-DD'.
// Devolve null se inválida.
function mniDateToISO(s) {
  const v = String(s || '').trim();
  if (v.length < 8) return null;
  const ano = v.slice(0, 4);
  const mes = v.slice(4, 6);
  const dia = v.slice(6, 8);
  if (!/^\d{4}$/.test(ano) || !/^\d{2}$/.test(mes) || !/^\d{2}$/.test(dia)) return null;
  return `${ano}-${mes}-${dia}`;
}

// Diferença em dias (inteiro) entre duas datas 'YYYY-MM-DD' (date-only, UTC).
function daysBetween(isoStart, isoEnd) {
  if (!isoStart || !isoEnd) return null;
  const a = Date.parse(`${isoStart}T00:00:00Z`);
  const b = Date.parse(`${isoEnd}T00:00:00Z`);
  if (Number.isNaN(a) || Number.isNaN(b)) return null;
  return Math.round((b - a) / 86400000);
}

// Idade (em dias) de uma intimação a partir da dataDisponibilizacao do MNI.
// Usado para decidir se já vale a pena tomar ciência (abrir o teor), aproveitando
// a janela de 10 dias corridos para ciência. Devolve null se a data for inválida.
function diasDesdeDisponibilizacao(dataDisponibilizacaoMni, hojeISO) {
  const dispoISO = mniDateToISO(dataDisponibilizacaoMni);
  if (!dispoISO) return null;
  const hoje = hojeISO || new Date().toISOString().slice(0, 10);
  return daysBetween(dispoISO, hoje);
}

// Decide se o teor deve ser aberto (= tomar ciência) para um aviso, dado o
// limiar mínimo de dias. minDias <= 0 significa "abrir sempre".
function deveAbrirTeor(dataDisponibilizacaoMni, minDias, hojeISO) {
  if (!minDias || minDias <= 0) return true;
  const idade = diasDesdeDisponibilizacao(dataDisponibilizacaoMni, hojeISO);
  return idade != null && idade >= minDias;
}

// Quebra a resposta de consultarAvisosPendentes em uma lista de objetos com os
// campos relevantes de cada <aviso>. Não traz prazo (isso só vem no teor).
function parseAvisos(xml) {
  const texto = String(xml || '');
  const avisos = [];
  const re = /<(?:\w+:)?aviso\b([\s\S]*?)<\/(?:\w+:)?aviso>/g;
  let m;
  while ((m = re.exec(texto)) !== null) {
    const bloco = m[0];
    const processoBloco =
      (bloco.match(/<(?:\w+:)?processo\b[\s\S]*?<\/(?:\w+:)?processo>/) || [bloco])[0];
    const destinatarioBloco =
      (bloco.match(/<(?:\w+:)?destinatario\b[\s\S]*?<\/(?:\w+:)?destinatario>/) || [''])[0];

    avisos.push({
      idAviso: attr(bloco, 'idAviso'),
      tipoComunicacao: attr(bloco, 'tipoComunicacao'),
      numeroProcesso: attr(processoBloco, 'numero'),
      classeProcessual: attr(processoBloco, 'classeProcessual'),
      // assunto principal: primeiro <codigoNacional> dentro do processo
      assuntoCodigo: el(processoBloco, 'codigoNacional'),
      nivelSigilo: attr(processoBloco, 'nivelSigilo'),
      orgaoJulgador: attr(processoBloco, 'nomeOrgao'),
      dataDisponibilizacao: el(bloco, 'dataDisponibilizacao'),
      // Vinculação: nome do destinatário do aviso, normalizado em maiúsculas
      // (o MNI devolve capitalização inconsistente entre órgãos).
      vinculacao: vinculacaoFromDestinatario(destinatarioBloco),
    });
  }
  return avisos;
}

// Extrai e normaliza o nome do destinatário (<pessoa nome="...">) de um bloco
// <destinatario>. Devolve null se não houver nome.
function vinculacaoFromDestinatario(destinatarioBloco) {
  const nome = attr(destinatarioBloco, 'nome');
  return nome ? nome.trim().toUpperCase() : null;
}

// Extrai do XML de consultarTeorComunicacao os dados de prazo (estruturados nos
// atributos da <comunicacao>) — sem precisar do HTML/anexo do documento.
function parseTeor(xml) {
  const texto = String(xml || '');
  const comunicacao =
    (texto.match(/<(?:\w+:)?comunicacao\b[\s\S]*?>/) || [''])[0];
  const dataInicioParam =
    (texto.match(/dataHoraInicioPrazo:(\d+)/) || [])[1] || null;
  const documento =
    (texto.match(/<(?:\w+:)?documento\b[\s\S]*?>/) || [''])[0];

  return {
    tipoPrazo: attr(comunicacao, 'tipoPrazo'),
    dataReferencia: attr(comunicacao, 'dataReferencia'),
    prazoDias: attr(comunicacao, 'prazo'),
    dataHoraInicioPrazo: dataInicioParam,
    descricaoDocumento: attr(documento, 'descricao'),
  };
}

// Combina aviso + teor e calcula os campos prazo_processual / prazo_vencimento.
// Regra:
//  - tipoPrazo "DATA_CERTA": o vencimento é dataReferencia; o nº de dias é a
//    diferença entre a intimação e o vencimento (mantém o hook do model coerente).
//  - caso contrário, usa o atributo prazo (dias) e deixa o vencimento para o hook.
function computePrazo({ dataIntimacaoISO, tipoPrazo, dataReferencia, prazoDias }) {
  const out = { prazo_processual: '', prazo_vencimento: null };

  if (tipoPrazo === 'DATA_CERTA' && dataReferencia) {
    const venc = mniDateToISO(dataReferencia);
    out.prazo_vencimento = venc;
    const dias = daysBetween(dataIntimacaoISO, venc);
    out.prazo_processual = dias != null && dias >= 0 ? String(dias) : '';
    return out;
  }

  const dias = parseInt(prazoDias, 10);
  if (!Number.isNaN(dias) && dias > 0) {
    out.prazo_processual = String(dias);
    if (dataIntimacaoISO) {
      const base = Date.parse(`${dataIntimacaoISO}T00:00:00Z`);
      if (!Number.isNaN(base)) {
        out.prazo_vencimento = new Date(base + dias * 86400000)
          .toISOString()
          .slice(0, 10);
      }
    }
  }
  return out;
}

// "Polícia Civil do Ceará" é a vinculação "guarda-chuva" do órgão — aparece
// junto da delegacia/vara real na maioria dos avisos, por equívoco no
// cadastro das partes ou na intimação do fórum, e não representa uma unidade
// específica adicional. É ignorada na contagem de unidades distintas (sem
// isso, praticamente nenhuma credencial passaria na checagem de "unidade
// única", mesmo gerenciando uma só delegacia).
const VINCULACAO_GENERICA = 'POLICIA CIVIL DO CEARA';

// Compara ignorando maiúsculas/minúsculas e acentos (sensitivity: 'base'),
// já que o MNI não é consistente na acentuação do nome do destinatário.
function ehVinculacaoGenerica(v) {
  return String(v || '').trim().localeCompare(VINCULACAO_GENERICA, 'pt', { sensitivity: 'base' }) === 0;
}

// Lista as vinculações distintas (não vazias, exceto a genérica acima) entre
// uma lista de avisos — usado para checar se uma credencial/consulta abrange
// mais de uma unidade representativa específica. Best-effort: só enxerga
// unidades com avisos PENDENTES no momento da consulta (o MNI não lista
// unidades sem avisos pendentes).
function vinculacoesDistintas(avisos) {
  const todas = [...new Set((avisos || []).map(a => a.vinculacao).filter(Boolean))];
  return todas.filter(v => !ehVinculacaoGenerica(v));
}

// Compara dois nomes de vinculação/unidade ignorando caixa e acentos — o MNI
// não é consistente na acentuação. Usado pela TRAVA DE IMPORTAÇÃO para conferir
// se os avisos retornados pertencem à unidade esperada (unidade.nome_pje).
function mesmaVinculacao(a, b) {
  if (!a || !b) return false;
  return String(a).trim().localeCompare(String(b).trim(), 'pt', { sensitivity: 'base' }) === 0;
}

module.exports = {
  attr,
  el,
  formatNumeroCNJ,
  mniDateToISO,
  daysBetween,
  diasDesdeDisponibilizacao,
  deveAbrirTeor,
  parseAvisos,
  parseTeor,
  computePrazo,
  vinculacaoFromDestinatario,
  vinculacoesDistintas,
  mesmaVinculacao,
};
