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
3. As intimações cujo teor volta **sem prazo** são descartadas (ver
   [Intimações sem prazo](#intimações-sem-prazo-pje_ignorar_sem_prazo)).
4. Os dados são mapeados para o model `Process` e gravados pelo mesmo pipeline
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

## Vinculação

Cada aviso do PJe traz o `<destinatario><pessoa nome="...">` — o órgão a quem a
intimação foi endereçada (ex.: `DELEGACIA DE POLICIA CIVIL DE IGUATU` ou
`POLICIA CIVIL DO CEARA`). Esse nome é capturado em `parseAvisos`, normalizado
em **maiúsculas** (o MNI devolve capitalização inconsistente entre órgãos) e
gravado no campo `vinculacao` do processo. É filtrável no painel (autocomplete,
já que pode haver dezenas de vinculações distintas). Processos do eSAJ não têm
vinculação (`null`) — o CSV não traz essa informação.

## Configuração (.env do backend)

```env
PJE_CPF=00000000000            # CPF do consultante (só números) — fallback se não usar o modal
PJE_SENHA=suaSenhaDoPje        # senha do PJe — fallback se não usar o modal
PJE_MNI_ENDPOINT=https://pje.tjce.jus.br/pje1grau/intercomunicacao   # opcional (default)
PJE_MNI_TIMEOUT=30000          # opcional, ms
PJE_CRON_ABRIR_TEOR=true       # opcional; false = não dá ciência no cron
PJE_CIENCIA_MIN_DIAS=5         # opcional; só toma ciência de avisos com N+ dias
PJE_IGNORAR_SEM_PRAZO=true     # opcional (padrão); false = importa também as sem prazo

# Chave de criptografia para as credenciais PJe salvas via painel (AES-256-GCM).
# Gere com: openssl rand -base64 32
# OBRIGATÓRIA se você usar o botão "Autenticação PJe" do painel.
# Deve ficar SOMENTE em backend/.env — nunca no banco nem no env_var_list do DomCloud.
PJE_CRED_ENC_KEY=SUBSTITUA_AQUI
```

## Credenciais pelo painel (recomendado)

> ⚠️ **Requisito do usuário no PJe (lição do caso Jaguaribe, jul/2026):** o
> usuário da credencial deve ter **apenas o papel "Procurador/Gestor"** na
> Procuradoria da delegacia. Se ele também tiver o papel **"Assistente de
> Representante Processual"**, o MNI consulta nesse contexto (que não enxerga
> os expedientes) e retorna **0 avisos** — a credencial autentica, a importação
> "funciona", mas vem sempre vazia, mesmo com o painel web mostrando dezenas de
> expedientes no modo Procurador/Gestor. O MNI não tem parâmetro para escolher
> o papel; a solução é **excluir o papel de Assistente** no cadastro do PJe.
> Sintoma no sistema: modal de resultado com "Avisos retornados pelo MNI: 0" no
> diagnóstico, e aviso amarelo ao salvar a credencial.

O botão **"Autenticação PJe"** no menu lateral (visível apenas para admin_super)
abre um modal que salva CPF + senha **criptografados** no banco, sem precisar
editar `.env` no servidor após o deploy inicial. Fluxo:

1. Admin informa CPF e senha no modal.
2. O backend valida as credenciais contra o MNI (`consultarAvisosPendentes` — não
   registra ciência) antes de persistir.
3. **Checagem de unidade única:** o backend conta as vinculações distintas
   (destinatários) entre os avisos pendentes retornados nesse teste. Se houver
   mais de uma, a credencial é **recusada** (não salva) com a lista das
   unidades encontradas.
   - A vinculação genérica **"Polícia Civil do Ceará"** (o órgão "guarda-chuva")
     é **ignorada** nessa contagem — ela aparece junto da delegacia/vara real na
     maioria dos avisos, por equívoco no cadastro das partes ou na intimação do
     fórum, e não representa uma unidade própria adicional. Sem essa exclusão,
     praticamente nenhuma credencial passaria na checagem, mesmo gerenciando
     uma só delegacia. Ver `pjeParser.vinculacoesDistintas`.
   - Limitação: como o MNI só lista avisos *pendentes*, uma unidade sem avisos
     pendentes no momento do teste não é detectada — a checagem é best-effort,
     não uma garantia absoluta de unidade única.
4. Se válidas (e de unidade única, conforme acima), salva criptografado
   (AES-256-GCM, chave em `PJE_CRED_ENC_KEY`).
5. A importação passa a usar as credenciais do banco (fallback para env vars se o
   banco não tiver nenhuma salva).

**A checagem de unidade única é reforçada a cada importação** (manual ou cron),
não só no momento de salvar — `pjeImportService.coletarRows` repete a mesma
contagem sobre os avisos pendentes daquela execução e **cancela a importação
inteira** (nenhum processo é gravado) se detectar mais de uma unidade. Isso
cobre o caso em que uma segunda unidade não tinha avisos pendentes quando a
credencial foi salva, mas passou a ter depois. A mesma limitação best-effort
se aplica aqui.

**Segurança:**
- A senha nunca trafega de/para o frontend após o POST de salvamento.
- O banco armazena apenas o texto cifrado; sem a chave, é inútil.
- A chave (`PJE_CRED_ENC_KEY`) deve estar em `backend/.env`, **não** no
  `env_var_list` do DomCloud (o shell do Passenger interpreta `$` e pode
  truncar ou corromper valores).
- Acesso ao modal exige `admin_super`; endpoints têm rate limit (10 req/5 min).
- Remoção do registro (botão "Remover") reverte ao comportamento de env vars.

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

### Intimações sem prazo (`PJE_IGNORAR_SEM_PRAZO`)

Boa parte dos expedientes do PJe chega **sem prazo** (o painel do PJe mostra
`Prazo: sem prazo`): são atos enviados de praxe, automaticamente, pelo sistema
do emitente, sem nada a cumprir. Por padrão essas intimações **não entram no
painel** — a importação as descarta após ler o teor.

- O critério é o resultado de `computePrazo`: sem nº de dias **e** sem data de
  vencimento (`pjeParser.semPrazoEstruturado`).
- **A ciência é registrada assim mesmo** — ela acontece ao abrir o teor, que é a
  única forma de saber se há prazo, e é irreversível. O filtro evita apenas a
  gravação da linha no painel, não a ciência.
- Avisos cujo teor **falhou** ao abrir continuam sendo importados: sem o teor não
  dá para afirmar que não há prazo.
- Para voltar a importar tudo: `PJE_IGNORAR_SEM_PRAZO=false` no `.env` (vale para
  painel e cron) ou `?ignorarSemPrazo=false` na rota manual.
- O modal de resultado e o histórico (`pje_import_logs.ignoradosSemPrazo`) mostram
  quantas foram ignoradas em cada importação. Requer `npm run db:migrate`.

> Processos sem prazo importados **antes** desta mudança continuam no painel —
> o filtro só vale para importações novas.

Quando as credenciais estão salvas via painel, os env vars `PJE_CPF`/`PJE_SENHA`
são ignorados (banco tem prioridade). Quando não há registro no banco, o sistema
usa os env vars como fallback.

## Migration

As colunas `fonte` e `vinculacao` são criadas por migrations idempotentes
(registros existentes ficam com `fonte = 'esaj'` e `vinculacao = null`):

```bash
npm run db:migrate
```

## Histórico de importações

Cada importação (manual ou cron) grava um registro na tabela `pje_import_logs`
com: data, quem disparou (nome do usuário ou "Cron automático"), avisos
encontrados, processos criados/atualizados, com prazo, sem prazo, ignorados por
não terem prazo, falhas ao abrir teor, duração e status (ok/erro). A migration cria a tabela
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
