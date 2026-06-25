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

## Configuração (.env do backend)

```env
PJE_CPF=00000000000            # CPF do consultante (só números)
PJE_SENHA=suaSenhaDoPje        # senha do PJe
PJE_MNI_ENDPOINT=https://pje.tjce.jus.br/pje1grau/intercomunicacao   # opcional (default)
PJE_MNI_TIMEOUT=30000          # opcional, ms
PJE_CRON_ABRIR_TEOR=true       # opcional; false = não dá ciência no cron
```

As credenciais ficam **apenas em variável de ambiente** — nunca no código ou no
banco.

## Migration

A coluna `fonte` é criada por migration idempotente (registros existentes ficam
como `esaj`):

```bash
npm run db:migrate
```

## Uso

- **Manual:** botão **"Importar do PJe"** no menu lateral do painel.
- **Automático (cron):** agende o script, por exemplo todo dia às 6h:

  ```cron
  0 6 * * *  cd /caminho/para/backend && /usr/bin/node scripts/import-pje-cron.js >> logs/cron-pje.log 2>&1
  ```

## Tradução de classe/assunto (TPU)

O MNI devolve **códigos** (ex.: classe `279`). O `utils/tpu.js` traduz para nome
(ex.: `Inquérito Policial`), com fallback legível (`Classe 279`) quando o código
não está na tabela. Para popular a tabela completa do CNJ, crie/atualize
`utils/tpu-data.json` no formato:

```json
{ "classes": { "279": "Inquérito Policial" }, "assuntos": { "3546": "..." } }
```

## Diagnóstico

`scripts/test-pje-mni.js` testa o endpoint, a autenticação e o formato das
respostas (ver comentários no topo do arquivo). Requer `npm install soap`.
