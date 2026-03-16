# Relatório de Auditoria de Código - DistribuidorVue

**Data:** 2025-11-04
**Projeto:** DistribuidorVue (Frontend)
**Tecnologias:** Vue 3 + Vuetify 3 + Pinia + Vite

---

## Sumário Executivo

Esta auditoria identificou **26 problemas** categorizados em:
- **5 Vulnerabilidades de Segurança** (Críticas e Altas)
- **4 Bugs** (Médios) - ✅ 1 corrigido
- **10 Dependências Desatualizadas** (Baixas) - ✅ 1 removida
- **12 Melhorias Recomendadas** (Diversas prioridades)

**Status de Vulnerabilidades NPM:** ✅ 0 vulnerabilidades encontradas (npm audit)

### ✅ Correções Aplicadas
- **Bug de Preload de Fontes** - Removido `unplugin-fonts` e migrado para `@fontsource/roboto` (mais estável)

---

## 🔴 1. Vulnerabilidades de Segurança

### 1.1 Armazenamento Inseguro de Tokens JWT no localStorage
**Severidade:** CRÍTICA
**Arquivo:** `src/stores/auth.js:11, 102`
**Descrição:**
Tokens JWT e dados de usuário estão sendo armazenados no `localStorage`, tornando-os vulneráveis a ataques XSS (Cross-Site Scripting).

```javascript
// Linha 11
token: localStorage.getItem('token') || null,
user: JSON.parse(localStorage.getItem('user')) || null,

// Linha 102
localStorage.setItem('token', token);
localStorage.setItem('user', JSON.stringify(user));
```

**Impacto:**
Se um atacante conseguir injetar código JavaScript malicioso na aplicação, ele pode facilmente acessar `localStorage` e roubar o token de autenticação.

**Recomendação:**
1. Utilizar **httpOnly cookies** para armazenar tokens JWT (não acessíveis via JavaScript)
2. Implementar **SameSite cookie** attribute para proteção contra CSRF
3. Usar **Secure flag** em cookies (apenas HTTPS)
4. Alternativa: Implementar **refresh token rotation** com tokens de curta duração

---

### 1.2 Falta de Validação de Força de Senha
**Severidade:** ALTA
**Arquivo:** `src/pages/primeiro-login.vue:21`
**Descrição:**
A validação de senha apenas verifica se o campo está preenchido, sem requisitos de complexidade.

```javascript
:rules="[v => !!v || 'A nova senha é obrigatória']"
```

**Impacto:**
Usuários podem definir senhas fracas como "123456" ou "senha", facilitando ataques de força bruta.

**Recomendação:**
```javascript
const senhaRules = [
  v => !!v || 'A senha é obrigatória',
  v => v.length >= 8 || 'Senha deve ter no mínimo 8 caracteres',
  v => /[A-Z]/.test(v) || 'Senha deve conter pelo menos uma letra maiúscula',
  v => /[a-z]/.test(v) || 'Senha deve conter pelo menos uma letra minúscula',
  v => /[0-9]/.test(v) || 'Senha deve conter pelo menos um número',
  v => /[!@#$%^&*]/.test(v) || 'Senha deve conter pelo menos um caractere especial'
];
```

---

### 1.3 Falta de Interceptor de Resposta para Tokens Expirados
**Severidade:** ALTA
**Arquivo:** `src/api/axios.js`
**Descrição:**
Não há tratamento automático para tokens expirados (erro 401), forçando o usuário a permanecer na aplicação mesmo sem autorização válida.

**Impacto:**
Usuários com tokens expirados podem permanecer na interface sem perceber que suas requisições estão falhando.

**Recomendação:**
```javascript
// Adicionar interceptor de resposta
apiClient.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      const authStore = useAuthStore();
      authStore.logout();
      // Opcionalmente, mostrar mensagem: "Sessão expirada"
    }
    return Promise.reject(error);
  }
);
```

---

### 1.4 Uso de confirm() Nativo do Navegador
**Severidade:** MÉDIA
**Arquivo:** `src/pages/dashboard.vue:957`
**Descrição:**
Uso de `confirm()` nativo pode ser explorado em alguns ataques de phishing e não oferece controle sobre UI.

```javascript
const confirmar = confirm(`Deseja realmente...`);
```

**Recomendação:**
Substituir por diálogos do Vuetify (`v-dialog`) para melhor controle e segurança.

---

### 1.5 HTTPS Não Forçado no Desenvolvimento
**Severidade:** BAIXA
**Arquivo:** `vite.config.mjs:81`
**Descrição:**
Servidor de desenvolvimento roda apenas em HTTP, expondo dados sensíveis durante desenvolvimento.

**Recomendação:**
```javascript
server: {
  port: 3001,
  https: true, // Adicionar HTTPS
  proxy: { /* ... */ }
}
```

---

## 🟡 2. Bugs Identificados

### ✅ 2.0 Avisos de Preload de Fontes no Console (CORRIGIDO)
**Severidade:** MÉDIA
**Arquivos:** `vite.config.mjs`, `src/main.js`, `package.json`
**Descrição:**
O plugin `unplugin-fonts` estava gerando tags `<link rel="preload">` com valores de `type` não suportados, causando avisos no console:

```
<link rel=preload> has an unsupported `type` value
The resource was preloaded using link preload but not used within a few seconds...
```

Isso ocorria porque:
1. O plugin tentava fazer preload de fontes do Google Fonts
2. As fontes Material Design Icons (@mdi/font) eram carregadas separadamente
3. O arquivo `unfonts.css` gerado automaticamente conflitava com as fontes instaladas via npm

**Solução Aplicada:**
✅ Removido o plugin `unplugin-fonts` do `vite.config.mjs`
✅ Removida a dependência `unplugin-fonts` do `package.json`
✅ Migrado para importação direta das fontes `@fontsource/roboto` no `main.js`
✅ Removido o import de `unfonts.css`

**Código Após Correção:**
```javascript
// src/main.js
import '@fontsource/roboto/100.css'
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import '@fontsource/roboto/900.css'
```

**Benefícios:**
- ✅ Elimina avisos de preload no console
- ✅ Melhor controle sobre quais pesos de fonte são carregados
- ✅ Fontes servidas localmente (melhor performance offline)
- ✅ Reduz dependências desnecessárias

---

### 2.1 Falta de Feedback ao Usuário em Erro de "Marcar Cumprido"
**Severidade:** MÉDIA
**Arquivo:** `src/pages/dashboard.vue:952-966`
**Descrição:**
Quando ocorre erro ao marcar processo como cumprido, o erro é apenas logado no console sem feedback visual ao usuário.

```javascript
} catch (error) {
  console.error(`Erro ao ${acao} processo:`, error);
}
```

**Recomendação:**
```javascript
} catch (error) {
  console.error(`Erro ao ${acao} processo:`, error);
  snackbarText.value = 'Erro ao atualizar status do processo.';
  snackbarColor.value = 'error';
  snackbar.value = true;
}
```

---

### 2.2 Loading State Não é Resetado Após Login Bem-Sucedido
**Severidade:** BAIXA
**Arquivo:** `src/pages/login.vue:69-80`
**Descrição:**
O `loading.value` não é resetado em caso de sucesso, o que pode causar comportamento inesperado se o componente não for destruído.

**Recomendação:**
```javascript
try {
  await authStore.login(matricula.value, senha.value, loginType.value);
  // Resetar loading após sucesso
  loading.value = false;
} catch (err) {
  loading.value = false;
  // ...
}
```

---

### 2.3 Inconsistência na Formatação de Prazo
**Arquivo:** `src/pages/dashboard.vue:802-806`
**Descrição:**
A função `formatarPrazo` retorna strings 'N/A' ou 'Erro' em vez de valores consistentes.

**Recomendação:**
Padronizar retorno sempre como string formatada ou usar símbolo/ícone específico.

---

## 📦 3. Dependências Desatualizadas

As seguintes dependências possuem atualizações disponíveis:

| Pacote | Versão Atual | Versão Disponível | Tipo |
|--------|--------------|-------------------|------|
| `axios` | 1.13.1 | 1.13.2 | patch |
| `@fontsource/roboto` | 5.2.7 | 5.2.8 | patch |
| `sass-embedded` | 1.93.2 | 1.93.3 | patch |
| `eslint` | 9.38.0 | 9.39.1 | minor |
| `vue-chartjs` | 5.3.2 | 5.3.3 | patch |
| `vite-plugin-vue-layouts-next` | 1.1.1 | 1.2.0 | minor |
| `unplugin-auto-import` | 19.3.0 | 20.2.0 | major |
| `unplugin-vue-components` | 29.2.0 | 30.0.0 | major |
| `unplugin-vue-router` | 0.15.0 | 0.16.1 | minor |
| `eslint-config-vuetify` | 4.2.0 | 4.2.1-beta.1 | patch (beta) |

**Comando para atualizar:**
```bash
npm update
# Para major versions:
npm install unplugin-auto-import@latest unplugin-vue-components@latest
```

---

## ⚡ 4. Melhorias Recomendadas

### 4.1 Implementar Debounce na Busca
**Prioridade:** ALTA
**Arquivo:** `src/pages/dashboard.vue:605`
**Descrição:**
Cada caractere digitado no campo de busca dispara uma requisição ao servidor.

**Recomendação:**
```javascript
import { ref, watch } from 'vue';
import { debounce } from 'lodash-es'; // ou implementar próprio

const search = ref('');
const debouncedSearch = ref('');

const debouncedUpdate = debounce((value) => {
  debouncedSearch.value = value;
}, 300);

watch(search, (newValue) => {
  debouncedUpdate(newValue);
});

// Usar debouncedSearch nos watchers em vez de search
```

---

### 4.2 Implementar Lazy Loading nos Componentes
**Prioridade:** MÉDIA
**Arquivo:** `src/pages/dashboard.vue:584-586`
**Descrição:**
Componentes estão sendo importados estaticamente, aumentando o bundle inicial.

**Recomendação:**
```javascript
// De:
import TabelaProcessos from '../components/TabelaProcessos.vue';

// Para:
const TabelaProcessos = defineAsyncComponent(() =>
  import('../components/TabelaProcessos.vue')
);
```

---

### 4.3 Remover Senha Hardcoded
**Prioridade:** ALTA
**Arquivo:** `src/pages/dashboard.vue:398, 1094`
**Descrição:**
Senha padrão "12345678" está hardcoded no código.

**Recomendação:**
```javascript
// Criar arquivo src/config/constants.js
export const DEFAULT_RESET_PASSWORD = import.meta.env.VITE_DEFAULT_PASSWORD || '12345678';

// Usar no código
import { DEFAULT_RESET_PASSWORD } from '@/config/constants';
```

---

### 4.4 Adicionar Internacionalização (i18n)
**Prioridade:** MÉDIA
**Descrição:**
Todas as strings estão hardcoded, dificultando manutenção e tradução.

**Recomendação:**
```bash
npm install vue-i18n@9
```

---

### 4.5 Implementar Testes Unitários
**Prioridade:** ALTA
**Descrição:**
Nenhum arquivo de teste foi encontrado no projeto.

**Recomendação:**
```bash
npm install -D vitest @vue/test-utils @testing-library/vue happy-dom
```

Criar `vitest.config.js`:
```javascript
import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'happy-dom',
    globals: true
  }
});
```

---

### 4.6 Migrar para TypeScript
**Prioridade:** MÉDIA
**Descrição:**
Projeto usa JavaScript puro, perdendo benefícios de type safety.

**Recomendação:**
Migração gradual:
1. Renomear `.js` → `.ts` progressivamente
2. Adicionar tipos aos stores Pinia
3. Tipar props e emits dos componentes

---

### 4.7 Remover console.log/console.error em Produção
**Prioridade:** BAIXA
**Descrição:**
Múltiplos `console.log` e `console.error` em código de produção.

**Recomendação:**
```javascript
// vite.config.mjs
export default defineConfig({
  esbuild: {
    drop: process.env.NODE_ENV === 'production' ? ['console', 'debugger'] : []
  }
});
```

---

### 4.8 Criar Store de UI Global
**Prioridade:** BAIXA
**Descrição:**
Cada componente gerencia seu próprio loading state.

**Recomendação:**
```javascript
// src/stores/ui.js
export const useUIStore = defineStore('ui', {
  state: () => ({
    loading: false,
    snackbar: { show: false, text: '', color: 'info' }
  }),
  actions: {
    showSnackbar(text, color = 'info') {
      this.snackbar = { show: true, text, color };
    }
  }
});
```

---

### 4.9 Criar Composables para Lógica Reutilizável
**Prioridade:** MÉDIA
**Descrição:**
Lógica de formatação de data está duplicada em múltiplos componentes.

**Recomendação:**
```javascript
// src/composables/useDateFormat.js
import { format, parseISO } from 'date-fns';

export function useDateFormat() {
  const formatarDataHora = (dataISO) => {
    if (!dataISO) return '';
    try {
      return format(parseISO(dataISO), 'dd/MM/yyyy HH:mm');
    } catch (e) {
      return 'Data inválida';
    }
  };

  return { formatarDataHora };
}
```

---

### 4.10 Implementar Limite para Exportação de PDF
**Prioridade:** MÉDIA
**Arquivo:** `src/pages/dashboard.vue:979`
**Descrição:**
Exportar PDF de muitos registros pode travar o navegador.

**Recomendação:**
```javascript
const MAX_EXPORT_RECORDS = 1000;

const downloadPDF = (dataToExport) => {
  if (dataToExport.length > MAX_EXPORT_RECORDS) {
    snackbarText.value = `Limite de ${MAX_EXPORT_RECORDS} registros excedido. Por favor, filtre os dados.`;
    snackbarColor.value = 'warning';
    snackbar.value = true;
    return;
  }
  // ... resto do código
};
```

---

### 4.11 Adicionar Loading Skeleton
**Prioridade:** BAIXA
**Descrição:**
Tabelas e gráficos mostram apenas "loading spinner".

**Recomendação:**
Implementar skeleton screens para melhor UX durante carregamento.

---

### 4.12 Implementar Service Worker / PWA
**Prioridade:** BAIXA
**Descrição:**
Aplicação pode se beneficiar de funcionalidades PWA.

**Recomendação:**
```bash
npm install -D vite-plugin-pwa
```

---

## 📊 5. Pontos Positivos

✅ **Arquitetura bem organizada** com separação clara de responsabilidades
✅ **Uso de Pinia** para gerenciamento de estado
✅ **Componentização adequada** com componentes reutilizáveis
✅ **Uso de Composition API** (Vue 3)
✅ **ESLint configurado** com regras do Vuetify
✅ **Paginação server-side** implementada corretamente
✅ **Responsividade** bem implementada com Vuetify
✅ **0 vulnerabilidades** detectadas pelo npm audit

---

## 🎯 6. Recomendações Prioritárias

### Curto Prazo (1-2 semanas)
1. ✅ **Implementar interceptor de resposta para 401** (Segurança)
2. ✅ **Adicionar validação de senha forte** (Segurança)
3. ✅ **Atualizar dependências** (Manutenção)
4. ✅ **Implementar debounce na busca** (Performance)
5. ✅ **Adicionar feedback de erro em operações críticas** (UX)

### Médio Prazo (1 mês)
6. ⚠️ **Migrar tokens para httpOnly cookies** (Segurança - requer mudança no backend)
7. ⚠️ **Implementar testes unitários básicos** (Qualidade)
8. ⚠️ **Criar composables para lógica reutilizável** (Manutenção)
9. ⚠️ **Remover senhas hardcoded** (Segurança)

### Longo Prazo (3+ meses)
10. 📋 **Migrar para TypeScript** (Qualidade)
11. 📋 **Implementar i18n** (Escalabilidade)
12. 📋 **Adicionar PWA** (UX)

---

## 📝 7. Conclusão

O projeto **DistribuidorVue** apresenta uma base sólida com arquitetura bem estruturada e boas práticas do Vue 3. No entanto, **foram identificadas vulnerabilidades de segurança críticas** relacionadas ao armazenamento de tokens JWT que devem ser tratadas com prioridade máxima.

As dependências estão relativamente atualizadas e não há vulnerabilidades conhecidas (npm audit clean), mas recomenda-se manter um processo de atualização regular.

A implementação de testes unitários e melhorias de performance (debounce, lazy loading) aumentarão significativamente a qualidade e manutenibilidade do código.

---

**Auditoria realizada por:** Claude Code Assistant
**Data:** 2025-11-04
