/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */

// Composables
import { createRouter, createWebHistory } from 'vue-router'
import { setupLayouts } from 'virtual:generated-layouts'
import { routes } from 'vue-router/auto-routes'
import { useAuthStore } from '@/stores/auth'

// Adiciona rota de redirect da raiz para /login
const customRoutes = [
  {
    path: '/',
    redirect: '/login'
  },
  ...setupLayouts(routes)
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: customRoutes,
})

// --- 2. ADICIONE A GUARDA DE ROTA (O "SEGURANÇA") ---
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();

  // CENÁRIO ESPECIAL: Acesso à raiz "/"
  if (to.path === '/') {
    // Se estiver logado, vai para dashboard
    if (authStore.isLoggedIn) {
      return next('/dashboard');
    }
    // Se não estiver logado, deixa o redirect padrão para /login acontecer
    return next();
  }

  // Lista de rotas que NÃO precisam de login
  const publicPages = ['/login', '/primeiro-login'];
  // Verifica se a rota que o usuário quer acessar (to.path) é pública
  const authRequired = !publicPages.includes(to.path);

  // CENÁRIO 1: Rota de admin E usuário NÃO está logado
  if (authRequired && !authStore.isLoggedIn) {
    // Manda ele para o login
    return next('/login');
  }

  // CENÁRIO 2: Rota pública (ex: /login) E usuário JÁ está logado
  if (!authRequired && authStore.isLoggedIn) {
    // Manda ele para o dashboard
    return next('/dashboard');
  }

  // CENÁRIO 3: Tudo certo, pode passar
  next();
});
// --- FIM DA GUARDA DE ROTA ---

// Workaround for https://github.com/vitejs/vite/issues/11804
router.onError((err, to) => {
  if (err?.message?.includes?.('Failed to fetch dynamically imported module')) {
    if (localStorage.getItem('vuetify:dynamic-reload')) {
      console.error('Dynamic import error, reloading page did not fix it', err)
    } else {
      console.log('Reloading page to fix dynamic import error')
      localStorage.setItem('vuetify:dynamic-reload', 'true')
      location.assign(to.fullPath)
    }
  } else {
    console.error(err)
  }
})

router.isReady().then(() => {
  localStorage.removeItem('vuetify:dynamic-reload')
})

export default router
