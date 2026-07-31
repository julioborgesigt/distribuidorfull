const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/default-CPbtp_rs.js","assets/vendor-vue-GTicgduU.js","assets/VSelect-B_ZkDoet.js","assets/VContainer-CkSzbdeb.js","assets/vendor-vuetify-aQIaOcnC.js","assets/dimensions-E8hH3RXf.js","assets/VContainer-Ci82SO7_.css","assets/VTextField-FT1AuBdP.js","assets/VTextField-D1q3VXUf.css","assets/VSelectionControl-Cl2TmmDO.js","assets/VSelectionControl-AttTt76l.css","assets/VSelect-BNVhW6-w.css","assets/VMain-BjY1bGxs.js","assets/VMain-s4Ta4w-G.css","assets/vendor-pdf-CmxC7yeP.js","assets/vendor-utils-CFUEZWKK.js","assets/default-DJ4AVFQr.css","assets/login-Doh3rzkj.js","assets/route-block-mFfs_uHM.js","assets/_plugin-vue_export-helper-1tPrXgE0.js","assets/dashboard-CtNAhuIS.js","assets/vendor-charts-Crm6Eam_.js","assets/VSheet-sW1CD2v1.js","assets/VSheet-Cv2nt18A.css","assets/VRadioGroup-DM1vROFK.js","assets/VRadioGroup-T7OuSIxr.css","assets/dashboard-CgsH-Rz4.css","assets/login-BEwVBRQZ.js","assets/primeiro-login-BB9msbtg.js"])))=>i.map(i=>d[i]);
import { M as defineStore, N as createRouter, O as createWebHistory, P as createPinia, y as createBaseVNode, Q as normalizeStyle, q as normalizeClass, R as resolveComponent, S as openBlock, T as createBlock, U as withCtx, n as createVNode, V as createApp } from "./vendor-vue-GTicgduU.js";
import { _ as __vitePreload } from "./vendor-pdf-CmxC7yeP.js";
import { a as axios } from "./vendor-utils-CFUEZWKK.js";
import { c as createVuetify, g as genericComponent, p as provideTheme, a as createLayout, u as useRtl, b as useRender, d as propsFactory, m as makeThemeProps, o as omit, e as makeLayoutProps, f as makeComponentProps } from "./vendor-vuetify-aQIaOcnC.js";
(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) return;
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) processPreload(link);
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") continue;
      for (const node of mutation.addedNodes) if (node.tagName === "LINK" && node.rel === "modulepreload") processPreload(node);
    }
  }).observe(document, {
    childList: true,
    subtree: true
  });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity) fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials") fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
    else fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep) return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
const setupLayouts = (routes2) => {
  const layouts = {};
  const modules = /* @__PURE__ */ Object.assign({ "/src/layouts/default.vue": () => __vitePreload(() => import("./default-CPbtp_rs.js"), true ? __vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16]) : void 0), "/src/layouts/login.vue": () => __vitePreload(() => import("./login-Doh3rzkj.js"), true ? __vite__mapDeps([17,18,19,12,4,1,5,3,6,13,14,15]) : void 0) });
  Object.entries(modules).forEach(([name, module]) => {
    let key = name.replace("/src/layouts/", "").replace(".vue", "");
    layouts[key] = module;
  });
  function deepSetupLayout(routes3, top = true) {
    return routes3.map((route) => {
      if (route.children?.length > 0) {
        route.children = deepSetupLayout(route.children, false);
      }
      if (top) {
        const skipLayout = !route.component && route.children?.find((r) => (r.path === "" || r.path === "/") && r.meta?.isLayout);
        if (skipLayout) {
          return route;
        }
        if (route.meta?.layout !== false) {
          return {
            path: route.path,
            component: layouts[route.meta?.layout || "default"],
            children: route.path === "/" ? [route] : [{ ...route, path: "" }],
            meta: {
              isLayout: true
            }
          };
        }
      }
      if (route.meta?.layout) {
        return {
          path: route.path,
          component: layouts[route.meta?.layout],
          children: [{ ...route, path: "" }],
          meta: {
            isLayout: true
          }
        };
      }
      return route;
    });
  }
  return deepSetupLayout(routes2);
};
const routes = [
  {
    path: "/dashboard",
    name: "/dashboard",
    component: () => __vitePreload(() => import("./dashboard-CtNAhuIS.js"), true ? __vite__mapDeps([20,1,2,3,4,5,6,7,8,9,10,11,14,15,21,22,23,19,24,25,26]) : void 0)
    /* no children */
  },
  {
    path: "/login",
    name: "/login",
    component: () => __vitePreload(() => import("./login-BEwVBRQZ.js"), true ? __vite__mapDeps([27,1,18,22,4,7,5,8,23,24,9,10,25,14,15]) : void 0),
    /* no children */
    meta: {
      "layout": "login"
    }
  },
  {
    path: "/primeiro-login",
    name: "/primeiro-login",
    component: () => __vitePreload(() => import("./primeiro-login-BB9msbtg.js"), true ? __vite__mapDeps([28,1,18,22,4,7,5,8,23,14,15]) : void 0),
    /* no children */
    meta: {
      "layout": "login"
    }
  }
];
const baseURL = "/api";
const apiClient = axios.create({
  baseURL,
  withCredentials: true
  // Envia cookies httpOnly automaticamente
});
let isLoggingOut = false;
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && !isLoggingOut) {
      const authStore = useAuthStore();
      if (authStore.isLoggedIn) {
        isLoggingOut = true;
        authStore.logout().finally(() => {
          isLoggingOut = false;
        });
      }
    }
    return Promise.reject(error);
  }
);
const useAuthStore = defineStore("auth", {
  // STATE
  // O token JWT agora é armazenado em cookie httpOnly pelo backend.
  // Apenas os dados do usuário ficam no localStorage (não é dado sensível).
  state: () => ({
    user: JSON.parse(localStorage.getItem("user")) || null,
    firstLoginData: JSON.parse(sessionStorage.getItem("firstLoginData")) || null
  }),
  // GETTERS
  getters: {
    isLoggedIn: (state) => !!state.user,
    isAdminSuper: (state) => state.user?.admin_super,
    // Super global (papel real do usuário, cross-unidade).
    isSuper: (state) => state.user?.role === "super" && !!state.user?.admin_super,
    // Gestor: super OU admin da unidade (enxergam além dos próprios processos e
    // acessam o menu de administração).
    isGestor: (state) => !!state.user?.admin_super || state.user?.role === "admin_unidade",
    unidadeNome: (state) => state.user?.unidade_nome || null,
    role: (state) => state.user?.role || null
  },
  // ACTIONS
  actions: {
    /**
     * Ação de Login principal
     */
    async login(matricula, senha, modo) {
      const { data } = await apiClient.post("/auth/login", {
        matricula,
        senha,
        modo
      });
      if (data.firstLogin) {
        this.firstLoginData = { firstLoginToken: data.firstLoginToken };
        sessionStorage.setItem("firstLoginData", JSON.stringify(this.firstLoginData));
        router.push("/primeiro-login");
        return;
      }
      this.setUser(data.user);
      router.push("/dashboard");
    },
    /**
     * Ação para completar o primeiro login
     */
    async completeFirstLogin(novaSenha) {
      if (!this.firstLoginData) {
        router.push("/login");
        return;
      }
      const { firstLoginToken } = this.firstLoginData;
      const { data } = await apiClient.post("/auth/primeiro-login", {
        firstLoginToken,
        novaSenha
      });
      this.setUser(data.user);
      this.firstLoginData = null;
      sessionStorage.removeItem("firstLoginData");
      router.push("/dashboard");
    },
    /**
     * Ação de Logout
     */
    async logout() {
      try {
        await apiClient.post("/auth/logout");
      } catch {
      }
      this.user = null;
      localStorage.removeItem("user");
      sessionStorage.removeItem("firstLoginData");
      router.push("/login");
    },
    /**
     * Função auxiliar para salvar dados do usuário
     */
    setUser(user) {
      this.user = user;
      localStorage.setItem("user", JSON.stringify(user));
    }
  }
});
const customRoutes = [
  {
    path: "/",
    redirect: "/login"
  },
  ...setupLayouts(routes)
];
const router = createRouter({
  history: createWebHistory("/"),
  routes: customRoutes
});
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  if (to.path === "/") {
    if (authStore.isLoggedIn) {
      return next("/dashboard");
    }
    return next();
  }
  const publicPages = ["/login", "/primeiro-login"];
  const authRequired = !publicPages.includes(to.path);
  if (authRequired && !authStore.isLoggedIn) {
    return next("/login");
  }
  if (!authRequired && authStore.isLoggedIn) {
    return next("/dashboard");
  }
  next();
});
router.onError((err, to) => {
  if (err?.message?.includes?.("Failed to fetch dynamically imported module")) {
    if (localStorage.getItem("vuetify:dynamic-reload")) {
      console.error("Dynamic import error, reloading page did not fix it", err);
    } else {
      console.log("Reloading page to fix dynamic import error");
      localStorage.setItem("vuetify:dynamic-reload", "true");
      location.assign(to.fullPath);
    }
  } else {
    console.error(err);
  }
});
router.isReady().then(() => {
  localStorage.removeItem("vuetify:dynamic-reload");
});
const pinia = createPinia();
const vuetify = createVuetify({
  theme: {
    defaultTheme: "system"
  }
});
function registerPlugins(app2) {
  app2.use(vuetify).use(router).use(pinia);
}
const makeVAppProps = propsFactory({
  ...makeComponentProps(),
  ...omit(makeLayoutProps(), ["fullHeight"]),
  ...makeThemeProps()
}, "VApp");
const VApp = genericComponent()({
  name: "VApp",
  props: makeVAppProps(),
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    const theme = provideTheme(props);
    const {
      layoutClasses,
      getLayoutItem,
      items,
      layoutRef
    } = createLayout({
      ...props,
      fullHeight: true
    });
    const {
      rtlClasses
    } = useRtl();
    useRender(() => createBaseVNode("div", {
      "ref": layoutRef,
      "class": normalizeClass(["v-application", theme.themeClasses.value, layoutClasses.value, rtlClasses.value, props.class]),
      "style": normalizeStyle([props.style])
    }, [createBaseVNode("div", {
      "class": "v-application__wrap"
    }, [slots.default?.()])]));
    return {
      getLayoutItem,
      items,
      theme
    };
  }
});
const _sfc_main = {
  __name: "App",
  setup(__props) {
    return (_ctx, _cache) => {
      const _component_router_view = resolveComponent("router-view");
      return openBlock(), createBlock(VApp, null, {
        default: withCtx(() => [
          createVNode(_component_router_view)
        ]),
        _: 1
      });
    };
  }
};
const app = createApp(_sfc_main);
registerPlugins(app);
app.mount("#app");
export {
  VApp as V,
  apiClient as a,
  useAuthStore as u
};
