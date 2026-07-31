import { h as ref, S as openBlock, T as createBlock, U as withCtx, y as createBaseVNode, X as createTextVNode, _ as toDisplayString, Y as createCommentVNode, n as createVNode, a1 as withModifiers } from "./vendor-vue-GTicgduU.js";
import { u as useAuthStore } from "./index-DiwlK7xx.js";
import { b as block0 } from "./route-block-mFfs_uHM.js";
import { V as VAlert, a as VForm, b as VSheet } from "./VSheet-sW1CD2v1.js";
import { y as VTextField, g as VBtn } from "./VTextField-FT1AuBdP.js";
import "./vendor-pdf-CmxC7yeP.js";
import "./vendor-utils-CFUEZWKK.js";
import "./vendor-vuetify-aQIaOcnC.js";
import "./dimensions-E8hH3RXf.js";
const _sfc_main = {
  __name: "primeiro-login",
  setup(__props) {
    const novaSenha = ref("");
    const loading = ref(false);
    const error = ref(null);
    const authStore = useAuthStore();
    const senhaRules = [
      (v) => !!v || "A nova senha é obrigatória",
      (v) => v && v.length >= 8 || "Mínimo de 8 caracteres",
      (v) => /[A-Z]/.test(v) || "Deve conter ao menos uma letra maiúscula",
      (v) => /[a-z]/.test(v) || "Deve conter ao menos uma letra minúscula",
      (v) => /[0-9]/.test(v) || "Deve conter ao menos um número"
    ];
    async function handleFirstLogin() {
      if (!novaSenha.value || senhaRules.some((rule) => rule(novaSenha.value) !== true)) {
        error.value = "Por favor, preencha a senha seguindo os requisitos.";
        return;
      }
      loading.value = true;
      error.value = null;
      try {
        await authStore.completeFirstLogin(novaSenha.value);
      } catch (error_) {
        loading.value = false;
        error.value = error_.response && error_.response.data ? error_.response.data.error || "Erro desconhecido" : "Não foi possível conectar ao servidor.";
      }
    }
    return (_ctx, _cache) => {
      return openBlock(), createBlock(VSheet, {
        border: "",
        class: "mx-auto pa-6",
        rounded: "",
        width: "400"
      }, {
        default: withCtx(() => [
          _cache[2] || (_cache[2] = createBaseVNode("h2", { class: "mb-4" }, "Primeiro Acesso", -1)),
          _cache[3] || (_cache[3] = createBaseVNode("p", { class: "mb-4" }, "Por favor, crie uma nova senha para continuar.", -1)),
          error.value ? (openBlock(), createBlock(VAlert, {
            key: 0,
            class: "mb-4",
            type: "error",
            variant: "tonal"
          }, {
            default: withCtx(() => [
              createTextVNode(toDisplayString(error.value), 1)
            ]),
            _: 1
          })) : createCommentVNode("", true),
          createVNode(VForm, {
            onSubmit: withModifiers(handleFirstLogin, ["prevent"])
          }, {
            default: withCtx(() => [
              createVNode(VTextField, {
                modelValue: novaSenha.value,
                "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => novaSenha.value = $event),
                hint: "Mínimo 8 caracteres, com maiúscula, minúscula e número",
                label: "Nova Senha",
                "persistent-hint": "",
                rules: senhaRules,
                type: "password",
                variant: "outlined"
              }, null, 8, ["modelValue"]),
              createVNode(VBtn, {
                block: "",
                class: "mt-2",
                color: "primary",
                loading: loading.value,
                size: "large",
                type: "submit"
              }, {
                default: withCtx(() => [..._cache[1] || (_cache[1] = [
                  createTextVNode(" Definir Senha e Entrar ", -1)
                ])]),
                _: 1
              }, 8, ["loading"])
            ]),
            _: 1
          })
        ]),
        _: 1
      });
    };
  }
};
if (typeof block0 === "function") block0(_sfc_main);
export {
  _sfc_main as default
};
