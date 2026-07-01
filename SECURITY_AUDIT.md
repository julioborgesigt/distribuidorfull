# Auditoria de Segurança — distribuidorfull

**Data:** 01/07/2026
**Escopo:** backend (Node.js/Express/Sequelize), frontend (Vue 3/Vuetify), configuração de deploy (DomCloud/GitHub Actions) e dependências.

---

## Resumo executivo

O projeto tem uma postura de segurança **madura** — visivelmente resultado de revisões anteriores. Autenticação, autorização, validação de entrada, proteção CSRF em camadas e criptografia de credenciais estão bem implementadas. **Não foi encontrada nenhuma vulnerabilidade crítica ou de alta severidade.**

Foram identificados **3 achados de severidade média** (dependência vulnerável, vazamento de mensagens de erro internas, limites de segurança em memória por processo) e **8 de baixa severidade / hardening**, detalhados abaixo.

| Severidade | Quantidade |
|------------|-----------|
| Crítica    | 0 |
| Alta       | 0 |
| Média      | 3 |
| Baixa      | 8 |

---

## O que está bem implementado ✅

- **Autenticação:** JWT em cookie `httpOnly` + `Secure` + `SameSite=Strict` (produção); bcrypt para senhas; claim `pwv` invalida sessões antigas quando a senha muda (`autenticarAdmin.js`).
- **Anti-enumeração de usuários:** mensagem única de erro + `bcrypt.compare` com `DUMMY_HASH` para equalizar tempo de resposta (`authController.js`).
- **Força bruta:** rate limit por IP no login (5/15min) + lockout por `ip:matricula` (5 tentativas → 15 min).
- **Autorização:** `autenticarAdmin` revalida o usuário no banco a cada requisição; `requireSuperAdmin` respeita o princípio de menor privilégio (checa o `loginType` da sessão, não o flag do usuário); `processScopeWhere` aplicado consistentemente em todas as operações individuais e em massa.
- **Injeção:** nenhum SQL cru com interpolação (Sequelize parametrizado; o único `literal()` é estático); whitelist de colunas ordenáveis em `listProcesses`; escape de XML nos clientes SOAP (`pjeClient`, `sgtClient`).
- **XSS:** nenhum uso de `v-html`/`innerHTML` no frontend; CSP via Helmet sem `unsafe-inline` para scripts em produção.
- **Upload:** limite de 5MB, 1 arquivo, validação de MIME/extensão **e** inspeção de magic bytes do conteúdo real (`looksLikeBinaryFile`).
- **Credenciais PJe:** AES-256-GCM com chave exclusivamente em variável de ambiente; senha nunca retorna ao painel (só CPF mascarado); teste das credenciais antes de salvar.
- **Segredos:** nenhuma credencial hardcoded no repositório; `.env` corretamente ignorado; deploy injeta segredos via painel do DomCloud.
- **Logs:** redação de campos sensíveis por padrão de substring (senha/token/cpf/cnpj) no error handler; eventos de segurança logados com IP e usuário.
- **Superfície:** Swagger UI desabilitado em produção; CORS com allowlist estrita (sem localhost em produção); `trust proxy` limitado a 1 hop (IP não forjável via `X-Forwarded-For`).
- **Dependências frontend:** 0 vulnerabilidades no `npm audit` (jspdf já atualizado para a v4, corrigindo CVE anterior).

---

## Achados

### M1 — Dependência vulnerável: `uuid` < 11.1.1 (via `sequelize`) — MÉDIA

`npm audit` no backend reporta 2 vulnerabilidades *moderate*: o `sequelize` depende de versão do `uuid` afetada pelo [GHSA-w5hq-g745-h8pq](https://github.com/advisories/GHSA-w5hq-g745-h8pq) (falta de verificação de limites de buffer em v3/v5/v6 quando `buf` é fornecido).

- **Exploitabilidade real: baixa** — o Sequelize usa `uuid.v4()`/`v1()`, não os modos afetados.
- **Atenção:** o `npm audit fix --force` sugere **downgrade para sequelize@3.30.0 — NÃO aplicar**, isso é um falso "fix" destrutivo.

**Recomendação:** atualizar o `sequelize` para a última versão da linha 6.x e, se o alerta persistir, forçar a versão corrigida com `overrides` no `backend/package.json`:

```json
"overrides": { "uuid": "^11.1.1" }
```

### M2 — Mensagens de erro internas vazam ao cliente em produção — MÉDIA

`backend/middlewares/errorHandler.js:50` retorna `err.message` para **qualquer** erro, inclusive 500. O stack trace só vaza em desenvolvimento (correto), mas mensagens de erro do Sequelize/MySQL ou de bibliotecas podem expor detalhes internos (nomes de tabelas/colunas, caminhos) a um cliente não autenticado.

**Recomendação:** em produção, retornar mensagem genérica quando `statusCode >= 500`:

```js
const isServerError = statusCode >= 500;
const response = {
  error: (isServerError && process.env.NODE_ENV === 'production')
    ? 'Erro interno do servidor'
    : err.message,
  status: statusCode,
};
```

### M3 — Rate limit, lockout e guardas de concorrência em memória (por processo) — MÉDIA

Três mecanismos de proteção vivem na memória do processo Node:

1. `express-rate-limit` (login, bulk, PJe) — `routes/auth.js`, `routes/admin.js`;
2. o `Map` de lockout de login — `authController.js:22`;
3. os guards `pjeImportStatus`/`tpuStatus` que impedem importações concorrentes — `processController.js:237`.

O Passenger (DomCloud) pode manter **múltiplos processos** da aplicação: os limites efetivos são multiplicados pelo número de processos, zeram a cada restart, e duas importações do PJe podem rodar em paralelo em processos diferentes — o que, no caso do PJe, pode **registrar ciência duplicada** (impacto de negócio, não só técnico).

Adicionalmente, o lockout é chaveado por `ip:matricula` — um atacante distribuído (muitos IPs) contorna tanto o rate limit quanto o lockout para uma mesma matrícula.

**Recomendação:**
- Garantir instância única no Passenger (`passenger_min_instances 1` / pool de 1 processo) **ou** mover esses estados para um store compartilhado (banco ou Redis) — para a importação PJe, um lock em tabela é simples e resolve;
- Considerar um contador de lockout adicional **por matrícula** (com limiar mais alto, ex. 20 tentativas, para não facilitar DoS contra usuários legítimos).

### B1 — Validação de Origin para operações críticas é contornável — BAIXA

Em `backend/middlewares/csrfProtection.js`:

- **(a)** requisições **sem** `Origin`/`Referer` são permitidas (apenas logadas) — linha 54;
- **(b)** `http://localhost:3000/3001` ficam na allowlist **mesmo em produção** — linha 46 (diferente do CORS em `server.js`, que os remove);
- **(c)** o fallback `origin.includes(allowed)` (linha 71) compara por **substring** quando o parse de URL falha — um header não-parseável contendo a URL permitida passaria.

A exploitabilidade prática é quase nula porque as defesas primárias (cookie `SameSite=Strict` + CORS com allowlist) seguram o ataque — mas esta camada existe justamente para o caso de as primárias serem enfraquecidas, e hoje ela não cumpriria o papel.

**Recomendação:** excluir localhost em produção (mesma lógica do `server.js`), remover o fallback por substring (falhou o parse → nega) e, idealmente, rejeitar requisições críticas sem `Origin` em produção.

### B2 — `/health` público expõe detalhes internos — BAIXA

`backend/server.js:192` retorna, sem autenticação: ambiente, versão da aplicação, uso de memória, status do banco e **a mensagem de erro do banco** em caso de falha (linha 218).

**Recomendação:** manter público apenas `{ status: 'ok' | 'error' }` e mover os detalhes (memória, versão, mensagem de erro) para resposta autenticada ou log.

### B3 — `getFilterOptions` não aplica escopo por usuário — BAIXA

`backend/controllers/statsController.js:183`: um `admin_padrao` recebe os valores DISTINCT de classes, assuntos, tarjas e **vinculações de todos os processos do sistema**, incluindo os que não são dele — enquanto `listProcesses` e `getDashboardStats` são corretamente escopados. Vazamento de metadados de baixo impacto, mas inconsistente com a regra de escopo do resto do sistema.

**Recomendação:** aplicar `processScopeWhere(req)` ao `where` das quatro consultas.

### B4 — Arquivo de upload não é removido em caso de falha — BAIXA

Em `processController.uploadCSV`, o arquivo em `uploads/` só é apagado no fluxo de sucesso (linha 204) e na rejeição por conteúdo binário. Se `upsertProcessos` lançar erro (catch da linha 211) ou o stream falhar (linha 221), o CSV — que contém dados de processos judiciais — permanece no disco indefinidamente.

**Recomendação:** `await fsPromises.unlink(filePath).catch(() => {})` também nos dois caminhos de erro.

### B5 — Redação de logs é rasa (só primeiro nível) — BAIXA

`sanitizeBodyForLog` (`errorHandler.js:19`) redige apenas chaves do primeiro nível do body. Um payload aninhado (ex. `{ user: { senha } }`) vazaria para os logs. Hoje todos os bodies da API são planos — é hardening preventivo.

**Recomendação:** tornar a sanitização recursiva.

### B6 — `listUsers` sem validação/teto de paginação — BAIXA

`userController.js:12`: `limit`/`offset` passam por `parseInt` sem tratamento de `NaN` (gera erro 500) e sem teto máximo. Rota autenticada, impacto baixo.

**Recomendação:** `Math.min(parseInt(limit, 10) || 1000, 1000)` e `parseInt(offset, 10) || 0` (mesmo padrão já usado em `importPjeLogs`).

### B7 — Hardening do cookie e do segredo JWT — BAIXA

- O cookie de sessão poderia usar o prefixo **`__Host-`** em produção (`__Host-token`), que faz o navegador exigir `Secure`, `Path=/` e proibir `Domain` — impede sobrescrita por subdomínios.
- `JWT_SECRET` é validado apenas quanto à **presença** (`server.js:28`), não quanto ao tamanho. Um segredo curto configurado por engano enfraquece toda a autenticação.

**Recomendação:** no boot, exigir `JWT_SECRET.length >= 32`; adotar o prefixo `__Host-` no `cookieHelper.js`.

### B8 — Deploy: variáveis ausentes e instalação sem lockfile — BAIXA

Em `.domcloud.yml`:
- O `backend/.env` gerado no deploy inclui apenas JWT/DB/FRONTEND_URL. Se `PJE_CRED_ENC_KEY` (necessária para a tela "Autenticação PJe"), `PJE_CPF`/`PJE_SENHA` (cron) ou `JWT_EXPIRATION` forem usados em produção, precisam ser adicionados ao `env_var_list` e ao bloco `cat > backend/.env` — sem a chave de criptografia, as credenciais salvas no banco ficam indecifráveis.
- O backend instala com `npm install --omit=dev`; usar **`npm ci --omit=dev`** garante que produção use exatamente as versões auditadas do `package-lock.json`.

---

## Observações informativas (sem ação obrigatória)

- **Logout não revoga o JWT** — o cookie é limpo, mas um token capturado segue válido até expirar (2h). O claim `pwv` já cobre o cenário mais importante (troca/reset de senha). Com TTL curto, o risco residual é aceitável; uma blacklist só se justifica se o requisito de compliance exigir.
- **CSP:** `styleSrc 'unsafe-inline'` é exigido pelo Vuetify e `imgSrc https:` é amplo — ambos de baixo risco no contexto (sem conteúdo HTML de terceiros).
- **Parsing por regex das respostas SOAP** (`pjeParser`, `sgtClient`): a fonte é serviço governamental sobre HTTPS — fronteira de confiança razoável; regexes analisadas não apresentam padrões clássicos de ReDoS catastrófico.
- **GitHub Actions:** permissões mínimas necessárias (`contents: write` para publicar a branch `deploy`), sem exposição de segredos.

---

## Prioridade sugerida de correção

1. **M2** — mensagem genérica para erros 5xx em produção (mudança de 5 linhas, elimina vazamento de informação a não autenticados).
2. **M1** — atualizar sequelize / override do uuid.
3. **M3** — garantir instância única no Passenger ou lock compartilhado (especialmente pelo risco de ciência duplicada no PJe).
4. **B1, B2, B4** — hardening rápido (origin, health, unlink).
5. **B3, B5–B8** — na próxima janela de manutenção.
