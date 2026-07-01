# Proteção CSRF — Análise e Implementação

## Contexto: autenticação via cookie httpOnly

A autenticação primária desta API é via **cookie JWT `httpOnly`** (ver
`utils/cookieHelper.js` e `middlewares/autenticarAdmin.js`). O header
`Authorization: Bearer <token>` existe apenas como *fallback* — a maior parte
do tráfego real (o frontend Vue via `axios`, com `withCredentials: true`) usa
o cookie.

Isso importa porque **cookies são enviados automaticamente pelo navegador em
requisições cross-site** — é exatamente esse comportamento que um ataque CSRF
explora. Diferente de uma API que autentica só por header (onde o atacante
não consegue forçar o navegador da vítima a incluir um header customizado),
aqui CSRF é uma preocupação real, e a proteção vem de camadas explícitas, não
da arquitetura "de graça".

## Camadas de proteção implementadas

### 1. `SameSite=Strict` no cookie (produção)

`utils/cookieHelper.js` define o cookie `token` com `sameSite: 'strict'` em
produção. Isso é a defesa principal: o navegador **não envia o cookie** em
nenhuma requisição que se origine de outro site (nem form POST, nem fetch,
nem link clicado) — sem o cookie, `autenticarAdmin` rejeita a requisição antes
de qualquer lógica de negócio rodar.

Em desenvolvimento é `sameSite: 'lax'` (para não atrapalhar fluxos locais de
teste) — `Lax` ainda bloqueia CSRF via POST/PUT/PATCH/DELETE cross-site,
relaxando só a navegação GET de top-level.

### 2. Allowlist estrita de Origin no CORS (`server.js`)

O middleware `cors` (montado globalmente via `app.use(cors(...))`, portanto
aplicado a toda requisição, não só a preflights) verifica o header `Origin`
contra uma lista fixa (`FRONTEND_URL`, `FRONTEND_URL_2`, `FRONTEND_URL_3`, e
`localhost` em dev). Uma origem fora da lista recebe erro 403 antes de chegar
nas rotas — `middlewares/errorHandler.js` respeita `error.statusCode`, então o
erro do CORS realmente interrompe a requisição.

Requisições sem header `Origin` são permitidas (necessário para clientes
não-navegador: curl, Postman, apps mobile) — navegadores modernos incluem
`Origin` em toda requisição cross-site com método "unsafe" (POST/PUT/PATCH/
DELETE), então esse caso não cobre o cenário típico de CSRF via navegador.

### 3. Validação de Origin/Referer para operações críticas (`validateOriginForCriticalOps`)

Defesa em profundidade adicional, redundante com a camada 2 por design — só
importa se as camadas 1 ou 2 forem enfraquecidas por engano no futuro (ex.:
alguém relaxa `SameSite` para resolver um problema de embed e esquece do
impacto). Cobre as rotas mais sensíveis do sistema:

```javascript
const criticalPaths = [
  '/api/admin/delete-matricula',
  '/api/admin/bulk-delete',
  '/api/admin/reset-password',
  '/api/admin/pre-cadastro',       // cria conta, inclusive admin_super
  '/api/admin/pje-auth/salvar',    // troca as credenciais do PJe
  '/api/admin/pje-auth'            // remove as credenciais do PJe
];
```

### 4. Rate limiting

Já implementado nas operações sensíveis (login, primeiro login, operações em
massa, importação do PJe, salvar credenciais do PJe) — não impede CSRF por si
só, mas limita o dano de tentativas repetidas/automatizadas.

### 5. Headers de segurança (`addSecurityHeaders`)

```javascript
X-Frame-Options: DENY              // Previne Clickjacking
X-Content-Type-Options: nosniff    // Previne MIME sniffing
```

(O Helmet, montado em `server.js`, cobre CSP, HSTS e os demais headers padrão.)

## Testando as proteções

```bash
# Teste 1: Requisição sem cookie/token (deve falhar com 401)
curl -X POST http://localhost:3000/api/admin/delete-matricula \
  -H "Content-Type: application/json" \
  -d '{"matricula":"12345"}'

# Teste 2: Origem não permitida (deve falhar com 403 — bloqueado pelo CORS
# global antes mesmo de chegar na rota)
curl -X POST http://localhost:3000/api/admin/delete-matricula \
  -H "Content-Type: application/json" \
  -H "Cookie: token=<jwt_valido>" \
  -H "Origin: http://malicious-site.com" \
  -d '{"matricula":"12345"}'

# Teste 3: Requisição válida (origem permitida + cookie válido)
curl -X POST http://localhost:3000/api/admin/delete-matricula \
  -H "Content-Type: application/json" \
  -H "Cookie: token=<jwt_valido>" \
  -H "Origin: http://localhost:3001" \
  -d '{"matricula":"12345"}'
```

## Referências

- [OWASP CSRF Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html)
- [MDN: SameSite cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie/SameSite)
- [REST Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/REST_Security_Cheat_Sheet.html)

## Conclusão

**Status:** protegido contra CSRF por múltiplas camadas independentes
(`SameSite=Strict` + CORS por allowlist de Origin são as que efetivamente
bloqueiam a requisição; a validação de Origin nas rotas críticas e o rate
limiting são reforço, não a defesa primária).
