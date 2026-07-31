import { b as block0 } from "./route-block-mFfs_uHM.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
import { V as VMain } from "./VMain-BjY1bGxs.js";
import { V as VContainer, a as VResponsive } from "./VContainer-CkSzbdeb.js";
import { V as VApp } from "./index-DiwlK7xx.js";
import { T as createBlock, R as resolveComponent, S as openBlock, U as withCtx, n as createVNode } from "./vendor-vue-GTicgduU.js";
import "./vendor-vuetify-aQIaOcnC.js";
import "./dimensions-E8hH3RXf.js";
import "./vendor-pdf-CmxC7yeP.js";
import "./vendor-utils-CFUEZWKK.js";
const _sfc_main = {};
function _sfc_render(_ctx, _cache) {
  const _component_router_view = resolveComponent("router-view");
  return openBlock(), createBlock(VApp, null, {
    default: withCtx(() => [
      createVNode(VMain, null, {
        default: withCtx(() => [
          createVNode(VContainer, { class: "fill-height" }, {
            default: withCtx(() => [
              createVNode(VResponsive, { class: "d-flex align-center text-center fill-height" }, {
                default: withCtx(() => [
                  createVNode(_component_router_view)
                ]),
                _: 1
              })
            ]),
            _: 1
          })
        ]),
        _: 1
      })
    ]),
    _: 1
  });
}
if (typeof block0 === "function") block0(_sfc_main);
const login = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export {
  login as default
};
