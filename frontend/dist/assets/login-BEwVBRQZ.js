import { h as ref, S as openBlock, T as createBlock, U as withCtx, y as createBaseVNode, X as createTextVNode, _ as toDisplayString, Y as createCommentVNode, n as createVNode, a1 as withModifiers } from "./vendor-vue-GTicgduU.js";
import { u as useAuthStore } from "./index-DiwlK7xx.js";
import { b as block0 } from "./route-block-mFfs_uHM.js";
import { V as VAlert, a as VForm, b as VSheet } from "./VSheet-sW1CD2v1.js";
import { y as VTextField, g as VBtn } from "./VTextField-FT1AuBdP.js";
import { V as VRadioGroup, a as VRadio } from "./VRadioGroup-DM1vROFK.js";
import "./vendor-pdf-CmxC7yeP.js";
import "./vendor-utils-CFUEZWKK.js";
import "./vendor-vuetify-aQIaOcnC.js";
import "./dimensions-E8hH3RXf.js";
import "./VSelectionControl-Cl2TmmDO.js";
const _sfc_main = {
  __name: "login",
  setup(__props) {
    const matricula = ref("");
    const senha = ref("");
    const modo = ref("usuario");
    const loading = ref(false);
    const error = ref(null);
    const authStore = useAuthStore();
    async function handleLogin() {
      if (!matricula.value || !senha.value) {
        error.value = "Preencha todos os campos.";
        return;
      }
      loading.value = true;
      error.value = null;
      try {
        await authStore.login(matricula.value, senha.value, modo.value);
      } catch (error_) {
        loading.value = false;
        error.value = error_.response && error_.response.data ? error_.response.data.error || "Erro desconhecido" : "Não foi possível conectar ao servidor.";
      }
    }
    return (_ctx, _cache) => {
      return openBlock(), createBlock(VSheet, {
        border: "",
        class: "mx-auto pa-6",
        "max-width": "400",
        rounded: "",
        width: "100%"
      }, {
        default: withCtx(() => [
          _cache[5] || (_cache[5] = createBaseVNode("h2", { class: "mb-4" }, "Painel de Admin", -1)),
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
            onSubmit: withModifiers(handleLogin, ["prevent"])
          }, {
            default: withCtx(() => [
              createVNode(VTextField, {
                modelValue: matricula.value,
                "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => matricula.value = $event),
                label: "Matrícula",
                variant: "outlined"
              }, null, 8, ["modelValue"]),
              createVNode(VTextField, {
                modelValue: senha.value,
                "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => senha.value = $event),
                label: "Senha",
                type: "password",
                variant: "outlined"
              }, null, 8, ["modelValue"]),
              createVNode(VRadioGroup, {
                modelValue: modo.value,
                "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => modo.value = $event),
                inline: "",
                label: "Modo de acesso"
              }, {
                default: withCtx(() => [
                  createVNode(VRadio, {
                    label: "Usuário",
                    value: "usuario"
                  }),
                  createVNode(VRadio, {
                    label: "Adm Unidade",
                    value: "unidade"
                  })
                ]),
                _: 1
              }, 8, ["modelValue"]),
              _cache[4] || (_cache[4] = createBaseVNode("div", { class: "text-caption text-medium-emphasis mb-2" }, [
                createBaseVNode("div", null, [
                  createBaseVNode("strong", null, "Usuário"),
                  createTextVNode(": vê apenas os processos atribuídos a você.")
                ]),
                createBaseVNode("div", null, [
                  createBaseVNode("strong", null, "Adm Unidade"),
                  createTextVNode(": consegue ver e distribuir todos os processos da sua unidade.")
                ])
              ], -1)),
              createVNode(VBtn, {
                block: "",
                class: "mt-2",
                color: "primary",
                loading: loading.value,
                size: "large",
                type: "submit"
              }, {
                default: withCtx(() => [..._cache[3] || (_cache[3] = [
                  createTextVNode(" Entrar ", -1)
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
