# Integração com o PJe (TJCE) via webservice MNI

Importa os **avisos pendentes** (intimações) do PJe direto do webservice MNI
2.2.2 do TJCE, complementando a importação por CSV do eSAJ. Cada processo passa
a ter uma **fonte** (`esaj` ou `pje`), exibida como badge e filtrável no painel.

## Como funciona

1. `consultarAvisosPendentes` lista a fila de intimações do consultante
   (NÃO registra ciência).
2. Para cada aviso, `consultarTeorComunicacao` obtém o **prazo estruturado**
   (`tipoPrazo` / `dataReferencia` / `prazo`). **Esta chamada REGISTRA CIÊNCIA
   e INICIA O PRAZO** do aviso no PJe.
3. Os dados são mapeados para o model `Process` e gravados pelo mesmo pipeline
   de upsert do CSV (com `fonte = 'pje'`).

> ⚠️ **Ciência automática:** abrir o teor é o comportamento padrão (decisão do
> projeto) porque é a única forma de capturar o prazo. Para importar apenas a
> fila **sem dar ciência**, use `abrirTeor=false` (rota) ou
> `PJE_CRON_ABRIR_TEOR=false` (cron).

## Precedência de fonte (eSAJ x PJe)

Cada processo é uma única linha (`numero_processo` é único). Quando o mesmo
processo existe nas duas origens, o **PJe prevalece** por ser a informação mais
atual:

- Um import do **PJe assume** o processo (badge e dados passam a ser do PJe).
- Um import do **eSAJ NÃO sobrescreve** um processo que já é do PJe.
- Processos que só existem no eSAJ continuam normais.

## Configuração (.env do backend)

```env
PJE_CPF=00000000000            # CPF do consultante (só números)
PJE_SENHA=suaSenhaDoPje        # senha do PJe
PJE_MNI_ENDPOINT=https://pje.tjce.jus.br/pje1grau/intercomunicacao   # opcional (default)
PJE_MNI_TIMEOUT=30000          # opcional, ms
PJE_CRON_ABRIR_TEOR=true       # opcional; false = não dá ciência no cron
PJE_CIENCIA_MIN_DIAS=5         # opcional; só toma ciência de avisos com N+ dias
```

### Tomar ciência só perto do fim da janela (`PJE_CIENCIA_MIN_DIAS`)

A ciência só pode ser tomada uma vez e inicia o prazo. Para **aproveitar parte da
janela de 10 dias corridos** de ciência, defina `PJE_CIENCIA_MIN_DIAS=5`: só são
abertas (= ciência) as intimações com 5+ dias desde a disponibilização. As mais
novas entram no painel **sem prazo** e recebem o prazo num import futuro, quando
amadurecem.

> Como a ciência ficta cai no 10º dia, quanto MENOR o limiar, maior a margem de
> segurança caso o cron falhe em algum dia: com `5` sobram ~5 dias de folga até a
> ficta. Valores maiores (8, 9) aproveitam mais a janela, mas exigem cron diário
> sem falhas. `0` (ou ausente) = toma ciência de todos imediatamente.
>
> Observação: por que o prazo só vem na ciência? Testes no MNI do TJCE mostraram
> que `consultarProcesso` não expõe o prazo e que reler o teor de uma intimação
> já ciente retorna erro — ou seja, o prazo só é capturável no momento da ciência.
> Por isso não há um modo "passivo" (ler prazo sem tomar ciência).

As credenciais ficam **apenas em variável de ambiente** — nunca no código ou no
banco.

## Migration

A coluna `fonte` é criada por migration idempotente (registros existentes ficam
como `esaj`):

```bash
npm run db:migrate
```

## Histórico de importações

Cada importação (manual ou cron) grava um registro na tabela `pje_import_logs`
com: data, quem disparou (nome do usuário ou "Cron automático"), avisos
encontrados, processos criados/atualizados, com prazo, sem prazo, falhas ao
abrir teor, duração e status (ok/erro). A migration cria a tabela
automaticamente (`npm run db:migrate`).

No painel, o item **"Logs do PJe"** (abaixo de "Importar do PJe") abre o
histórico. Endpoint: `GET /api/admin/import-pje/logs?limit=30`.

## Uso

- **Manual:** botão **"Importar do PJe"** no menu lateral do painel.
- **Automático (cron):** agende o script, por exemplo todo dia às 6h:

  ```cron
  0 6 * * *  cd /caminho/para/backend && /usr/bin/node scripts/import-pje-cron.js >> logs/cron-pje.log 2>&1
  ```

## Tradução de classe/assunto (TPU)

O MNI devolve **códigos** (ex.: classe `279`). O `utils/tpu.js` traduz para nome
(ex.: `Inquérito Policial`), com fallback legível (`Classe 279`) quando o código
não está na tabela.

### Atualização automática pelo SGT/CNJ

Rode o script abaixo (no servidor, que tem acesso à internet). Ele descobre os
códigos ainda não traduzidos a partir dos próprios processos, busca os nomes no
**webservice público do SGT** (`pesquisarItemPublicoWS`), grava em
`utils/tpu-data.json` **e corrige os processos já importados**:

```bash
cd backend && node scripts/atualizar-tpu.js
# opcional: SGT_ENDPOINT=https://wwwh.cnj.jus.br/sgt/sgt_ws.php (homologação)
```

Rode de novo sempre que aparecerem códigos novos no painel. Após rodar, reinicie
o app (`touch tmp/restart.txt`) para as próximas importações já usarem os nomes.

Também é possível editar `utils/tpu-data.json` à mão:

```json
{ "classes": { "279": "Inquérito Policial" }, "assuntos": { "3546": "..." } }
```

## Diagnóstico

`scripts/test-pje-mni.js` testa o endpoint, a autenticação e o formato das
respostas (ver comentários no topo do arquivo). Requer `npm install soap`.
