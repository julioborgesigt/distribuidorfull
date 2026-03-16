# Auditoria Completa para Produção - DistribuidorFull

**Data:** 2026-03-16
**Versão:** 1.2.0
**Auditor:** Dev Senior (Automated Audit)

---

## Resumo Executivo

| Categoria | Nota | Status |
|-----------|------|--------|
| Segurança | 7.5/10 | Bom (com ressalvas críticas) |
| Qualidade de Código | 7/10 | Bom |
| Performance | 6.5/10 | Adequado |
| Observabilidade | 8/10 | Muito Bom |
| Resiliência | 7/10 | Bom |
| Testes | 3/10 | Insuficiente |
| CI/CD | 1/10 | Crítico |
| Documentação | 9/10 | Excelente |
| **Nota Geral** | **6.2/10** | **Precisa de melhorias antes de produção** |

---

## 1. SEGURANÇA (7.5/10)

### 1.1 Problemas CRÍTICOS

#### 1.1.1 Credenciais expostas no histórico do Git
- **Severidade:** CRÍTICA
- **Arquivo:** Documentado em `SECURITY_ALERT.md`
- **Problema:** Senhas de banco de dados e JWT_SECRET foram commitados no histórico do Git.
- **Ação Imediata:**
  1. Rotacionar **TODAS** as credenciais (DB_PASS, JWT_SECRET)
  2. Usar `git filter-branch` ou BFG Repo Cleaner para remover do histórico
  3. Forçar re-autenticação de todos os usuários após trocar o JWT_SECRET

#### 1.1.2 Senha padrão hardcoded "12345678"
- **Severidade:** ALTA
- **Arquivos:** `userController.js:72`, `userController.js:125`
- **Problema:** A senha de reset/atualização é hardcoded como `"12345678"` e **exibida em texto puro na resposta HTTP**.
  ```javascript
  // userController.js:72
  existingUser.senha = await bcryptjs.hash('12345678', 10);
  // ...
  return res.send('Usuário atualizado com sucesso. Senha: 12345678');

  // userController.js:125
  user.senha = await bcryptjs.hash('12345678', 10);
  // ...
  res.send('Senha resetada com sucesso para "12345678".');
  ```
- **Recomendação:** Gerar senha aleatória temporária e enviar por canal seguro, ou usar link de reset por e-mail com token único.

#### 1.1.3 Endpoint firstLogin sem autenticação adequada
- **Severidade:** ALTA
- **Arquivo:** `authcontroller.js:98-149`
- **Problema:** O endpoint `POST /api/auth/primeiro-login` aceita `userId` diretamente no body sem verificar se o requisitante é realmente o dono daquele userId. Um atacante poderia enviar qualquer `userId` e trocar a senha de outro usuário.
- **Recomendação:** Exigir a senha antiga ou um token temporário vinculado ao userId para validar a identidade.

#### 1.1.4 `trust proxy` configurado como `true`
- **Severidade:** MÉDIA-ALTA
- **Arquivo:** `server.js:39`
- **Problema:** `app.set('trust proxy', true)` confia em **qualquer** proxy. Em produção, deve-se especificar quantos proxies existem (ex: `1`, `2`) ou o IP do proxy reverso.
- **Recomendação:** `app.set('trust proxy', 1)` ou especificar IPs confiáveis.

### 1.2 Pontos Positivos de Segurança

- Helmet configurado com CSP, HSTS, X-Frame-Options
- Rate limiting no login (5/15min) e primeiro login (3/15min)
- JWT armazenado em cookie httpOnly + Secure + SameSite
- Sanitização de input com XSS library
- Validação de entrada com express-validator
- Proteção contra SQL Injection via Sequelize ORM (sem raw queries)
- CORS configurado com whitelist de origens
- Logging de eventos de segurança
- Graceful shutdown implementado
- Validação de variáveis de ambiente obrigatórias na inicialização

### 1.3 Melhorias Recomendadas

| Item | Prioridade |
|------|------------|
| Implementar 2FA para admins super | Alta |
| Adicionar account lockout após N tentativas | Alta |
| Implementar refresh tokens (JWT de curta duração + refresh) | Média |
| Adicionar CSP nonces ao invés de `'unsafe-inline'` | Média |
| Remover Swagger UI em produção (`/api-docs`) | Alta |
| Adicionar auditoria de ações administrativas em tabela separada | Média |

---

## 2. QUALIDADE DE CÓDIGO (7/10)

### 2.1 Problemas Encontrados

#### 2.1.1 Respostas HTTP inconsistentes
- **Severidade:** MÉDIA
- **Problema:** Alguns endpoints retornam `res.send(string)` e outros `res.json(object)`. Isso força o frontend a tratar dois formatos diferentes.
- **Locais:**
  - `processController.js:115` - `res.send('CSV importado com sucesso...')`
  - `processController.js:298-321` - `res.status(404).send('Usuário não encontrado.')`
  - `processController.js:455-467` - `res.send("Atribuição em massa...")`
  - `userController.js:77` - `res.send('Usuário atualizado...')`
  - `userController.js:98` - `res.send('Pré-cadastro realizado...')`
- **Recomendação:** Padronizar TODAS as respostas como JSON:
  ```javascript
  // Ao invés de:
  res.send('CSV importado com sucesso.');
  // Usar:
  res.status(200).json({ message: 'CSV importado com sucesso.' });
  ```

#### 2.1.2 Código morto / não implementado
- **Severidade:** BAIXA
- **Arquivo:** `processController.js:277-279`
  ```javascript
  exports.assignProcesses = async (req, res) => {
    res.send('Atribuição automática simulada (lógica não implementada).');
  };
  ```
- **Recomendação:** Remover ou implementar. Código morto gera confusão.

#### 2.1.3 Status HTTP 201 não utilizado
- **Severidade:** BAIXA
- **Problema:** Endpoints de criação (POST) retornam 200 ao invés de 201 Created.
- **Recomendação:** Usar `res.status(201).json(...)` em criações bem-sucedidas.

#### 2.1.4 Duplicação de lógica de verificação de permissão
- **Severidade:** BAIXA
- **Arquivo:** `processController.js:171` e `processController.js:210`
- **Problema:** `options.where.userId = req.userId` é definido duas vezes no mesmo método `listProcesses`.

### 2.2 Pontos Positivos

- Boa separação de responsabilidades (controllers, routes, middlewares, models, utils)
- Naming consistente em português
- Uso adequado de async/await
- Tratamento de erros com try/catch em todos os controllers
- Logger estruturado com contexto relevante
- Hooks do Sequelize para cálculos automáticos (prazo_vencimento)

---

## 3. PERFORMANCE (6.5/10)

### 3.1 Problemas Encontrados

#### 3.1.1 N+1 Query no upload CSV
- **Severidade:** ALTA
- **Arquivo:** `processController.js:76-108`
- **Problema:** Para cada linha do CSV, faz um `findOne` + `update/create` sequencial. Com 1000 registros, são 2000+ queries.
  ```javascript
  for (let row of latestProcessesMap.values()) {
    const existing = await Process.findOne({ where: { numero_processo: row.numero_processo } });
    // ...individual update/create
  }
  ```
- **Recomendação:** Usar `bulkCreate` com `updateOnDuplicate` do Sequelize ou fazer batch processing:
  ```javascript
  await Process.bulkCreate(rows, {
    updateOnDuplicate: ['prazo_processual', 'classe_principal', ...],
  });
  ```

#### 3.1.2 Sem cache de aplicação
- **Severidade:** MÉDIA
- **Problema:** Não há caching para dados frequentemente acessados (opções de filtro, stats do dashboard). Cada requisição gera queries ao banco.
- **Recomendação:** Implementar cache em memória (node-cache) ou Redis para:
  - Opções de filtro (DISTINCT queries)
  - Estatísticas do dashboard (TTL de 1-5 minutos)
  - Lista de usuários

#### 3.1.3 Sem limite de payload no body parser
- **Severidade:** MÉDIA
- **Arquivo:** `server.js:123`
- **Problema:** `express.json()` sem `{ limit: '1mb' }` usa default de 100kb, mas operações bulk podem precisar de mais. Definir explicitamente.
- **Recomendação:** `app.use(express.json({ limit: '1mb' }))` - definir limite explícito.

#### 3.1.4 Paginação com default alto
- **Severidade:** BAIXA
- **Arquivo:** `userController.js:12`
- **Problema:** `const { limit = 1000 } = req.query` - Default de 1000 registros é excessivo.
- **Recomendação:** Reduzir para 50-100 e implementar paginação cursor-based para grandes volumes.

### 3.2 Pontos Positivos

- Compressão HTTP (gzip) habilitada
- Cache de assets estáticos com hash (1 year)
- index.html com no-cache (correto para SPA)
- Connection pooling do Sequelize configurado
- Code splitting no Vite (manual chunks)
- Paginação server-side com `findAndCountAll`

---

## 4. OBSERVABILIDADE (8/10)

### 4.1 Pontos Positivos

- Winston com logging estruturado (JSON em produção)
- Logs separados: `error.log` e `combined.log`
- Rotação de logs (5MB, 5 arquivos)
- Campos de contexto em todos os logs (userId, IP, processId)
- Redação de campos sensíveis (senha, token)
- Health check endpoint com status do banco
- Métricas de memória no healthcheck
- HTTP request logging (método, status, tempo de resposta)

### 4.2 O que Falta

| Item | Prioridade |
|------|------------|
| APM (Application Performance Monitoring) - ex: New Relic, Datadog | Alta |
| Métricas de negócio (processos/dia, tempo médio de cumprimento) | Média |
| Alertas automáticos (erro rate > threshold) | Alta |
| Request ID / Correlation ID para rastreamento | Média |
| Métricas de latência por endpoint | Média |
| Dashboard de monitoramento (Grafana/similar) | Média |

---

## 5. RESILIÊNCIA (7/10)

### 5.1 Pontos Positivos

- Graceful shutdown com timeout de 10s
- Tratamento de `uncaughtException` e `unhandledRejection`
- Healthcheck com verificação de banco
- Connection pool com retry
- Validação de variáveis de ambiente na inicialização
- Limpeza de arquivo CSV após upload (`fsPromises.unlink`)

### 5.2 O que Falta

| Item | Prioridade |
|------|------------|
| Circuit breaker para dependências externas | Média |
| Retry logic para queries de banco transientes | Média |
| Graceful degradation quando DB está lento | Média |
| Backup automático do banco | CRÍTICA |
| Disaster recovery plan documentado | Alta |
| Timeout nos requests ao banco (query timeout) | Média |

---

## 6. TESTES (3/10) - INSUFICIENTE

### 6.1 Estado Atual

- **4 arquivos de teste** apenas (3 unitários + 1 integração)
- **Coverage threshold:** 5% (extremamente baixo)
- **Sem testes para:**
  - Controllers (authcontroller, processController, userController)
  - Middlewares de autenticação
  - Rotas de API completas (integration tests)
  - Upload de CSV
  - Operações bulk
  - Frontend (zero testes)

### 6.2 Cobertura Necessária para Produção

| Área | Cobertura Atual | Mínimo Recomendado |
|------|----------------|-------------------|
| Controllers | 0% | 70% |
| Middlewares | 0% | 80% |
| Models/Hooks | 0% | 60% |
| Helpers/Utils | ~30% | 80% |
| Integração (API) | ~10% | 60% |
| Frontend | 0% | 40% |
| **Global** | **~5%** | **60%** |

### 6.3 Testes Prioritários a Implementar

1. **Autenticação:** Login, primeiro login, logout, token expirado, permissões
2. **CRUD Processos:** Criar, listar, atualizar, deletar, bulk operations
3. **Upload CSV:** Arquivo válido, inválido, duplicatas, encoding
4. **Autorização:** Admin super vs admin padrão, acesso negado
5. **Validação:** Inputs inválidos em todos os endpoints

---

## 7. CI/CD (1/10) - CRÍTICO

### 7.1 Estado Atual

- **Nenhum pipeline de CI/CD configurado**
- Sem GitHub Actions, GitLab CI, ou qualquer automação
- Deploy manual via DomCloud

### 7.2 Pipeline Mínimo Recomendado

```yaml
# .github/workflows/ci.yml (Sugerido)
name: CI/CD Pipeline

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - Checkout
      - Setup Node.js LTS
      - Install dependencies
      - Run linting (ESLint)
      - Run backend tests with coverage
      - Check coverage threshold (mínimo 60%)

  security:
    runs-on: ubuntu-latest
    steps:
      - npm audit --production
      - Check for secrets in code (gitleaks/truffleHog)

  build:
    runs-on: ubuntu-latest
    needs: [test, security]
    steps:
      - Build frontend
      - Verify build output

  deploy:
    runs-on: ubuntu-latest
    needs: [build]
    if: github.ref == 'refs/heads/main'
    steps:
      - Deploy to DomCloud (or target platform)
```

---

## 8. BANCO DE DADOS (6/10)

### 8.1 Problemas

| Problema | Severidade |
|----------|-----------|
| Sem sistema de migrations (usa `sequelize.sync()`) | ALTA |
| Sem backup automatizado | CRÍTICA |
| `SEQUELIZE_ALTER=true` pode causar perda de dados | ALTA |
| Sem índices de performance explícitos (além do UNIQUE) | MÉDIA |
| Sem procedure de disaster recovery | ALTA |

### 8.2 Recomendações

1. **Implementar Sequelize Migrations:**
   ```bash
   npx sequelize-cli init
   npx sequelize-cli migration:generate --name create-users
   npx sequelize-cli migration:generate --name create-processes
   ```

2. **Adicionar índices de performance:**
   ```sql
   CREATE INDEX idx_processos_userId ON processos(userId);
   CREATE INDEX idx_processos_cumprido ON processos(cumprido);
   CREATE INDEX idx_processos_prazo_vencimento ON processos(prazo_vencimento);
   CREATE INDEX idx_processos_data_intimacao ON processos(data_intimacao);
   CREATE INDEX idx_usuarios_matricula ON usuarios(matricula);
   ```

3. **Backup automático:** Configurar `mysqldump` diário com retenção de 30 dias.

---

## 9. CONFIGURAÇÃO DE PRODUÇÃO

### 9.1 Checklist de Deploy

| Item | Status | Ação |
|------|--------|------|
| `NODE_ENV=production` | Verificar | Garantir que está definido |
| JWT_SECRET forte (64+ chars) | Verificar | Gerar novo com `crypto.randomBytes(64)` |
| CORS com domínio correto | Verificar | Remover localhost das origens |
| Swagger UI desabilitado | Faltando | Condicionar ao NODE_ENV |
| HTTPS forçado | DomCloud gerencia | Verificar SSL |
| Rate limiting adequado | OK | Já implementado |
| Logs em nível adequado | OK | `info` em produção |
| Compressão habilitada | OK | gzip ativo |
| Helmet configurado | OK | Headers de segurança ativos |
| Connection pool adequado | OK | max:10, min:2 |
| Graceful shutdown | OK | SIGTERM/SIGINT handlers |

### 9.2 Itens Faltando para Produção

1. **Desabilitar Swagger em produção:**
   ```javascript
   if (process.env.NODE_ENV !== 'production') {
     app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
   }
   ```

2. **Remover localhost do CORS em produção:**
   ```javascript
   const allowedOrigins = process.env.NODE_ENV === 'production'
     ? [process.env.FRONTEND_URL].filter(Boolean)
     : ['http://localhost:3000', 'http://localhost:3001', process.env.FRONTEND_URL].filter(Boolean);
   ```

3. **Limitar stack trace em erros de produção:**
   ```javascript
   // Não expor stack traces ao cliente
   if (process.env.NODE_ENV === 'production') {
     delete error.stack;
   }
   ```

---

## 10. FRONTEND (Análise Resumida)

### 10.1 Pontos Positivos
- Vue 3 + Composition API
- State management com Pinia
- Vuetify 3 para UI consistente
- Code splitting configurado (vendor chunks)
- Axios com interceptor de 401 (auto-logout)
- Proxy de API configurado no dev

### 10.2 Problemas
- **Zero testes** no frontend
- **Sem tratamento offline** (sem service worker ou cache de dados)
- **Sem lazy loading de rotas** explícito (verificar se o router faz automaticamente)
- **Sem error boundary** global para componentes Vue

---

## 11. DEPENDÊNCIAS

### 11.1 Vulnerabilidades Conhecidas

Execute regularmente:
```bash
cd backend && npm audit --production
cd frontend && npm audit --production
```

### 11.2 Dependências a Revisar

| Pacote | Versão | Observação |
|--------|--------|-----------|
| `express` | ^4.18.2 | Express 5 está disponível - avaliar migração |
| `sequelize` | ^6.31.1 | Sequelize 7 em beta - manter v6 por estabilidade |
| `moment-timezone` | ^0.5.47 | Considerar substituir por `date-fns-tz` (já usa date-fns no front) |
| `swagger-jsdoc` | ^6.2.8 | OK para dev, mas desabilitar em produção |

---

## 12. PLANO DE AÇÃO PRIORITÁRIO

### Fase 1 - Antes de ir para Produção (URGENTE)

1. Rotacionar TODAS as credenciais (DB_PASS, JWT_SECRET)
2. Corrigir endpoint `primeiro-login` (validar identidade do requisitante)
3. Desabilitar Swagger UI em produção
4. Remover localhost das origens CORS em produção
5. Configurar `trust proxy` com valor específico (não `true`)
6. Padronizar respostas HTTP como JSON
7. Configurar backup automático do banco de dados

### Fase 2 - Primeiras Semanas (ALTA PRIORIDADE)

8. Implementar CI/CD básico (GitHub Actions)
9. Aumentar cobertura de testes para 40%+
10. Implementar Sequelize Migrations
11. Adicionar índices de performance no banco
12. Implementar rate limiting em mais endpoints
13. Gerar senha aleatória no reset (não hardcoded)

### Fase 3 - Melhoria Contínua (MÉDIA PRIORIDADE)

14. Implementar caching (Redis ou node-cache)
15. Adicionar APM/monitoramento
16. Implementar 2FA para admin_super
17. Otimizar import CSV com bulkCreate
18. Adicionar testes no frontend
19. Implementar refresh tokens
20. Migrar de moment-timezone para date-fns-tz

---

## Conclusão

O projeto possui uma **base sólida de segurança** (Helmet, rate limiting, validação, JWT httpOnly) e **boa organização de código**. No entanto, apresenta **lacunas críticas** que devem ser resolvidas antes do deploy em produção:

1. **Credenciais expostas** no histórico Git precisam ser rotacionadas imediatamente
2. **Endpoint primeiro-login** possui vulnerabilidade de troca de senha arbitrária
3. **Ausência de CI/CD** e **cobertura de testes extremamente baixa** aumentam o risco de regressões
4. **Sem backup automático** do banco de dados representa risco de perda de dados

Recomendo completar pelo menos a **Fase 1** do plano de ação antes de considerar o sistema pronto para produção.
