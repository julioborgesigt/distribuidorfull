import { n as createVNode, y as createBaseVNode, Q as normalizeStyle, q as normalizeClass, s as shallowRef, f as computed, h as ref, w as watch, D as onMounted, A as onBeforeUnmount, t as toRef, v as mergeProps, a as watchEffect, W as storeToRefs, T as createBlock, U as withCtx, u as unref, R as resolveComponent, S as openBlock, X as createTextVNode, Y as createCommentVNode, Z as withDirectives, _ as toDisplayString, $ as vShow } from "./vendor-vue-GTicgduU.js";
import { V as VImg, u as useUnidadeAtivaStore, D as DRAWER_WIDTH, a as useDrawer, b as VSpacer, c as VSelect, d as VChip } from "./VSelect-B_ZkDoet.js";
import { u as useAuthStore, V as VApp } from "./index-DiwlK7xx.js";
import { g as genericComponent, b as useRender, d as propsFactory, f as makeComponentProps, p as provideTheme, u as useRtl, h as provideDefaults, m as makeThemeProps, i as convertToUnit, j as clamp, k as useProxiedModel, l as useToggleScope, n as useLayoutItem, q as makeLayoutItemProps, r as useTheme, s as useDisplay } from "./vendor-vuetify-aQIaOcnC.js";
import { m as makeTagProps } from "./dimensions-E8hH3RXf.js";
import { u as useBackgroundColor, a as useBorder, b as useElevation, c as useRounded, m as makeRoundedProps, d as makeElevationProps, e as makeBorderProps, V as VDefaultsProvider, f as VExpandTransition, g as VBtn, h as VIcon } from "./VTextField-FT1AuBdP.js";
import { u as useSsrBoot, V as VContainer } from "./VContainer-CkSzbdeb.js";
import { V as VMain } from "./VMain-BjY1bGxs.js";
import "./VSelectionControl-Cl2TmmDO.js";
import "./vendor-pdf-CmxC7yeP.js";
import "./vendor-utils-CFUEZWKK.js";
const makeVToolbarTitleProps = propsFactory({
  text: String,
  ...makeComponentProps(),
  ...makeTagProps()
}, "VToolbarTitle");
const VToolbarTitle = genericComponent()({
  name: "VToolbarTitle",
  props: makeVToolbarTitleProps(),
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    useRender(() => {
      const hasText = !!(slots.default || slots.text || props.text);
      return createVNode(props.tag, {
        "class": normalizeClass(["v-toolbar-title", props.class]),
        "style": normalizeStyle(props.style)
      }, {
        default: () => [hasText && createBaseVNode("div", {
          "class": "v-toolbar-title__placeholder"
        }, [slots.text ? slots.text() : props.text, slots.default?.()])]
      });
    });
    return {};
  }
});
const allowedDensities = [null, "prominent", "default", "comfortable", "compact"];
const makeVToolbarProps = propsFactory({
  absolute: Boolean,
  collapse: Boolean,
  color: String,
  density: {
    type: String,
    default: "default",
    validator: (v) => allowedDensities.includes(v)
  },
  extended: {
    type: Boolean,
    default: null
  },
  extensionHeight: {
    type: [Number, String],
    default: 48
  },
  flat: Boolean,
  floating: Boolean,
  height: {
    type: [Number, String],
    default: 64
  },
  image: String,
  title: String,
  ...makeBorderProps(),
  ...makeComponentProps(),
  ...makeElevationProps(),
  ...makeRoundedProps(),
  ...makeTagProps({
    tag: "header"
  }),
  ...makeThemeProps()
}, "VToolbar");
const VToolbar = genericComponent()({
  name: "VToolbar",
  props: makeVToolbarProps(),
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    const {
      backgroundColorClasses,
      backgroundColorStyles
    } = useBackgroundColor(() => props.color);
    const {
      borderClasses
    } = useBorder(props);
    const {
      elevationClasses
    } = useElevation(props);
    const {
      roundedClasses
    } = useRounded(props);
    const {
      themeClasses
    } = provideTheme(props);
    const {
      rtlClasses
    } = useRtl();
    const isExtended = shallowRef(props.extended === null ? !!slots.extension?.() : props.extended);
    const contentHeight = computed(() => parseInt(Number(props.height) + (props.density === "prominent" ? Number(props.height) : 0) - (props.density === "comfortable" ? 8 : 0) - (props.density === "compact" ? 16 : 0), 10));
    const extensionHeight = computed(() => isExtended.value ? parseInt(Number(props.extensionHeight) + (props.density === "prominent" ? Number(props.extensionHeight) : 0) - (props.density === "comfortable" ? 4 : 0) - (props.density === "compact" ? 8 : 0), 10) : 0);
    provideDefaults({
      VBtn: {
        variant: "text"
      }
    });
    useRender(() => {
      const hasTitle = !!(props.title || slots.title);
      const hasImage = !!(slots.image || props.image);
      const extension = slots.extension?.();
      isExtended.value = props.extended === null ? !!extension : props.extended;
      return createVNode(props.tag, {
        "class": normalizeClass(["v-toolbar", {
          "v-toolbar--absolute": props.absolute,
          "v-toolbar--collapse": props.collapse,
          "v-toolbar--flat": props.flat,
          "v-toolbar--floating": props.floating,
          [`v-toolbar--density-${props.density}`]: true
        }, backgroundColorClasses.value, borderClasses.value, elevationClasses.value, roundedClasses.value, themeClasses.value, rtlClasses.value, props.class]),
        "style": normalizeStyle([backgroundColorStyles.value, props.style])
      }, {
        default: () => [hasImage && createBaseVNode("div", {
          "key": "image",
          "class": "v-toolbar__image"
        }, [!slots.image ? createVNode(VImg, {
          "key": "image-img",
          "cover": true,
          "src": props.image
        }, null) : createVNode(VDefaultsProvider, {
          "key": "image-defaults",
          "disabled": !props.image,
          "defaults": {
            VImg: {
              cover: true,
              src: props.image
            }
          }
        }, slots.image)]), createVNode(VDefaultsProvider, {
          "defaults": {
            VTabs: {
              height: convertToUnit(contentHeight.value)
            }
          }
        }, {
          default: () => [createBaseVNode("div", {
            "class": "v-toolbar__content",
            "style": {
              height: convertToUnit(contentHeight.value)
            }
          }, [slots.prepend && createBaseVNode("div", {
            "class": "v-toolbar__prepend"
          }, [slots.prepend?.()]), hasTitle && createVNode(VToolbarTitle, {
            "key": "title",
            "text": props.title
          }, {
            text: slots.title
          }), slots.default?.(), slots.append && createBaseVNode("div", {
            "class": "v-toolbar__append"
          }, [slots.append?.()])])]
        }), createVNode(VDefaultsProvider, {
          "defaults": {
            VTabs: {
              height: convertToUnit(extensionHeight.value)
            }
          }
        }, {
          default: () => [createVNode(VExpandTransition, null, {
            default: () => [isExtended.value && createBaseVNode("div", {
              "class": "v-toolbar__extension",
              "style": {
                height: convertToUnit(extensionHeight.value)
              }
            }, [extension])]
          })]
        })]
      });
    });
    return {
      contentHeight,
      extensionHeight
    };
  }
});
const makeScrollProps = propsFactory({
  scrollTarget: {
    type: String
  },
  scrollThreshold: {
    type: [String, Number],
    default: 300
  }
}, "scroll");
function useScroll(props) {
  let args = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
  const {
    canScroll
  } = args;
  let previousScroll = 0;
  let previousScrollHeight = 0;
  const target = ref(null);
  const currentScroll = shallowRef(0);
  const savedScroll = shallowRef(0);
  const currentThreshold = shallowRef(0);
  const isScrollActive = shallowRef(false);
  const isScrollingUp = shallowRef(false);
  const scrollThreshold = computed(() => {
    return Number(props.scrollThreshold);
  });
  const scrollRatio = computed(() => {
    return clamp((scrollThreshold.value - currentScroll.value) / scrollThreshold.value || 0);
  });
  const onScroll = () => {
    const targetEl = target.value;
    if (!targetEl || canScroll && !canScroll.value) return;
    previousScroll = currentScroll.value;
    currentScroll.value = "window" in targetEl ? targetEl.pageYOffset : targetEl.scrollTop;
    const currentScrollHeight = targetEl instanceof Window ? document.documentElement.scrollHeight : targetEl.scrollHeight;
    if (previousScrollHeight !== currentScrollHeight) {
      previousScrollHeight = currentScrollHeight;
      return;
    }
    isScrollingUp.value = currentScroll.value < previousScroll;
    currentThreshold.value = Math.abs(currentScroll.value - scrollThreshold.value);
  };
  watch(isScrollingUp, () => {
    savedScroll.value = savedScroll.value || currentScroll.value;
  });
  watch(isScrollActive, () => {
    savedScroll.value = 0;
  });
  onMounted(() => {
    watch(() => props.scrollTarget, (scrollTarget) => {
      const newTarget = scrollTarget ? document.querySelector(scrollTarget) : window;
      if (!newTarget) {
        return;
      }
      if (newTarget === target.value) return;
      target.value?.removeEventListener("scroll", onScroll);
      target.value = newTarget;
      target.value.addEventListener("scroll", onScroll, {
        passive: true
      });
    }, {
      immediate: true
    });
  });
  onBeforeUnmount(() => {
    target.value?.removeEventListener("scroll", onScroll);
  });
  canScroll && watch(canScroll, onScroll, {
    immediate: true
  });
  return {
    scrollThreshold,
    currentScroll,
    currentThreshold,
    isScrollActive,
    scrollRatio,
    // required only for testing
    // probably can be removed
    // later (2 chars chlng)
    isScrollingUp,
    savedScroll
  };
}
const makeVAppBarProps = propsFactory({
  scrollBehavior: String,
  modelValue: {
    type: Boolean,
    default: true
  },
  location: {
    type: String,
    default: "top",
    validator: (value) => ["top", "bottom"].includes(value)
  },
  ...makeVToolbarProps(),
  ...makeLayoutItemProps(),
  ...makeScrollProps(),
  height: {
    type: [Number, String],
    default: 64
  }
}, "VAppBar");
const VAppBar = genericComponent()({
  name: "VAppBar",
  props: makeVAppBarProps(),
  emits: {
    "update:modelValue": (value) => true
  },
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    const vToolbarRef = ref();
    const isActive = useProxiedModel(props, "modelValue");
    const scrollBehavior = computed(() => {
      const behavior = new Set(props.scrollBehavior?.split(" ") ?? []);
      return {
        hide: behavior.has("hide"),
        fullyHide: behavior.has("fully-hide"),
        inverted: behavior.has("inverted"),
        collapse: behavior.has("collapse"),
        elevate: behavior.has("elevate"),
        fadeImage: behavior.has("fade-image")
        // shrink: behavior.has('shrink'),
      };
    });
    const canScroll = computed(() => {
      const behavior = scrollBehavior.value;
      return behavior.hide || behavior.fullyHide || behavior.inverted || behavior.collapse || behavior.elevate || behavior.fadeImage || // behavior.shrink ||
      !isActive.value;
    });
    const {
      currentScroll,
      scrollThreshold,
      isScrollingUp,
      scrollRatio
    } = useScroll(props, {
      canScroll
    });
    const canHide = toRef(() => scrollBehavior.value.hide || scrollBehavior.value.fullyHide);
    const isCollapsed = computed(() => props.collapse || scrollBehavior.value.collapse && (scrollBehavior.value.inverted ? scrollRatio.value > 0 : scrollRatio.value === 0));
    const isFlat = computed(() => props.flat || scrollBehavior.value.fullyHide && !isActive.value || scrollBehavior.value.elevate && (scrollBehavior.value.inverted ? currentScroll.value > 0 : currentScroll.value === 0));
    const opacity = computed(() => scrollBehavior.value.fadeImage ? scrollBehavior.value.inverted ? 1 - scrollRatio.value : scrollRatio.value : void 0);
    const height = computed(() => {
      if (scrollBehavior.value.hide && scrollBehavior.value.inverted) return 0;
      const height2 = vToolbarRef.value?.contentHeight ?? 0;
      const extensionHeight = vToolbarRef.value?.extensionHeight ?? 0;
      if (!canHide.value) return height2 + extensionHeight;
      return currentScroll.value < scrollThreshold.value || scrollBehavior.value.fullyHide ? height2 + extensionHeight : height2;
    });
    useToggleScope(() => !!props.scrollBehavior, () => {
      watchEffect(() => {
        if (canHide.value) {
          if (scrollBehavior.value.inverted) {
            isActive.value = currentScroll.value > scrollThreshold.value;
          } else {
            isActive.value = isScrollingUp.value || currentScroll.value < scrollThreshold.value;
          }
        } else {
          isActive.value = true;
        }
      });
    });
    const {
      ssrBootStyles
    } = useSsrBoot();
    const {
      layoutItemStyles
    } = useLayoutItem({
      id: props.name,
      order: computed(() => parseInt(props.order, 10)),
      position: toRef(() => props.location),
      layoutSize: height,
      elementSize: shallowRef(void 0),
      active: isActive,
      absolute: toRef(() => props.absolute)
    });
    useRender(() => {
      const toolbarProps = VToolbar.filterProps(props);
      return createVNode(VToolbar, mergeProps({
        "ref": vToolbarRef,
        "class": ["v-app-bar", {
          "v-app-bar--bottom": props.location === "bottom"
        }, props.class],
        "style": [{
          ...layoutItemStyles.value,
          "--v-toolbar-image-opacity": opacity.value,
          height: void 0,
          ...ssrBootStyles.value
        }, props.style]
      }, toolbarProps, {
        "collapse": isCollapsed.value,
        "flat": isFlat.value
      }), slots);
    });
    return {};
  }
});
const _sfc_main = {
  __name: "default",
  setup(__props) {
    const theme = useTheme();
    const { width } = useDisplay();
    const isWide = computed(() => width.value >= 1660);
    const authStore = useAuthStore();
    const { user } = storeToRefs(authStore);
    const unidadeAtiva = useUnidadeAtivaStore();
    const { drawerOpen } = useDrawer();
    function carregarUnidadesSeSuper() {
      if (authStore.isSuper && !unidadeAtiva.carregada) unidadeAtiva.carregar();
    }
    onMounted(carregarUnidadesSeSuper);
    watch(() => authStore.isSuper, carregarUnidadesSeSuper);
    const appBarShift = computed(() => drawerOpen.value && isWide.value ? DRAWER_WIDTH / 2 : 0);
    return (_ctx, _cache) => {
      const _component_router_view = resolveComponent("router-view");
      return openBlock(), createBlock(VApp, {
        theme: unref(theme).global.name.value
      }, {
        default: withCtx(() => [
          createVNode(VAppBar, {
            app: "",
            class: "container-estreito app-bar-modern rounded-lg",
            color: "surface",
            density: "comfortable",
            flat: "",
            style: normalizeStyle({ "--drawer-shift": appBarShift.value + "px" })
          }, {
            default: withCtx(() => [
              createVNode(VBtn, {
                "aria-label": "Abrir menu",
                class: "ml-1",
                icon: "",
                onClick: _cache[0] || (_cache[0] = ($event) => drawerOpen.value = !unref(drawerOpen))
              }, {
                default: withCtx(() => [
                  createVNode(VIcon, null, {
                    default: withCtx(() => [..._cache[2] || (_cache[2] = [
                      createTextVNode("mdi-menu", -1)
                    ])]),
                    _: 1
                  })
                ]),
                _: 1
              }),
              createVNode(VIcon, {
                class: "ms-1 me-2 text-primary",
                size: "22"
              }, {
                default: withCtx(() => [..._cache[3] || (_cache[3] = [
                  createTextVNode("mdi-scale-balance", -1)
                ])]),
                _: 1
              }),
              _cache[4] || (_cache[4] = createBaseVNode("span", { class: "text-subtitle-1 font-weight-bold app-bar-title d-none d-sm-inline" }, "Distribuidor", -1)),
              createVNode(VSpacer),
              unref(authStore).isSuper ? (openBlock(), createBlock(VSelect, {
                key: 0,
                modelValue: unref(unidadeAtiva).selectedId,
                "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => unref(unidadeAtiva).selectedId = $event),
                class: "unidade-select me-2",
                clearable: "",
                density: "compact",
                "hide-details": "",
                "item-title": "nome",
                "item-value": "id",
                items: unref(unidadeAtiva).unidades,
                label: "Unidade ativa",
                placeholder: "Todas as unidades",
                "prepend-inner-icon": "mdi-office-building-marker-outline",
                rounded: "lg",
                variant: "solo-filled"
              }, null, 8, ["modelValue", "items"])) : createCommentVNode("", true),
              unref(user) ? withDirectives((openBlock(), createBlock(VChip, {
                key: 1,
                class: "me-2 font-weight-medium",
                color: "primary",
                "prepend-icon": "mdi-account-circle",
                variant: "tonal"
              }, {
                default: withCtx(() => [
                  createTextVNode(toDisplayString(unref(user)?.nome), 1)
                ]),
                _: 1
              }, 512)), [
                [vShow, isWide.value || !unref(drawerOpen)]
              ]) : createCommentVNode("", true)
            ]),
            _: 1
          }, 8, ["style"]),
          createVNode(VMain, null, {
            default: withCtx(() => [
              createVNode(VContainer, { class: "container-estreito py-6" }, {
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
      }, 8, ["theme"]);
    };
  }
};
export {
  _sfc_main as default
};
