import { f as computed, k as h, c as capitalize, h as ref, y as createBaseVNode, v as mergeProps, F as Fragment, q as normalizeClass, S as openBlock, a0 as createElementBlock, T as createBlock, u as unref, n as createVNode, Q as normalizeStyle, _ as toDisplayString, Z as withDirectives, A as onBeforeUnmount, w as watch, I as nextTick, r as reactive, U as withCtx, X as createTextVNode, Y as createCommentVNode, a1 as withModifiers, a2 as onBeforeUpdate, s as shallowRef, t as toRef, a3 as renderList, d as inject, p as provide, a as watchEffect, x as toValue, l as toRaw, m as toRefs, D as onMounted, a4 as vModelText, E as useId, $ as vShow, o as onScopeDispose, B as readonly, a5 as Transition, W as storeToRefs, a6 as isRef, a7 as Teleport } from "./vendor-vue-GTicgduU.js";
import { a as apiClient, u as useAuthStore } from "./index-DiwlK7xx.js";
import { e as VAvatar, V as VImg, f as useScopeId, g as VOverlay, m as makeVOverlayProps, h as VDialogTransition, b as VSpacer, c as VSelect, d as VChip, i as VCheckboxBtn, j as VDivider, k as useItems, l as useMenuActivator, n as useScrolling, o as VMenu, p as VList, q as VListItem, r as VVirtualScroll, s as VListSubheader, t as makeSelectProps, v as useLazy, w as makeLazyProps, x as useDelay, y as makeDelayProps, u as useUnidadeAtivaStore, z as VListGroup, D as DRAWER_WIDTH, A as VListItemTitle, a as useDrawer } from "./VSelect-B_ZkDoet.js";
import { _ as __vitePreload } from "./vendor-pdf-CmxC7yeP.js";
import { f as format, d as differenceInDays, s as startOfToday, p as parseISO } from "./vendor-utils-CFUEZWKK.js";
import { C as Chart, p as plugin_title, a as plugin_tooltip, b as plugin_legend, B as BarElement, c as CategoryScale, L as LinearScale, d as Bar } from "./vendor-charts-Crm6Eam_.js";
import { u as useBackgroundColor, b as useElevation, d as makeElevationProps, h as VIcon, V as VDefaultsProvider, i as makeDensityProps, R as Ripple, a as useBorder, j as useVariant, k as useDensity, l as useLoader, n as useLocation, o as usePosition, c as useRounded, p as useLink, L as LoaderSlot, q as genOverlays, r as makeVariantProps, s as makeRouterProps, m as makeRoundedProps, t as makePositionProps, v as makeLocationProps, w as makeLoaderProps, e as makeBorderProps, x as forwardRefs, g as VBtn, y as VTextField, z as makeSizeProps, A as VBtnToggle, B as VProgressCircular, I as Intersect, C as useFocus, D as useAutocomplete, E as VInput, F as VField, G as VCounter, H as useAutofocus, J as makeVFieldProps, K as makeVInputProps, M as makeAutocompleteProps, N as VScaleTransition, O as useTextColor, P as useForm, Q as makeVTextFieldProps, S as MaybeTransition, T as VFadeTransition, f as VExpandTransition, U as useGroupItem, W as makeGroupItemProps, X as useGroup, Y as makeGroupProps, Z as useRouter, _ as VProgressLinear } from "./VTextField-FT1AuBdP.js";
import { m as makeTagProps, u as useDimension, a as makeDimensionProps } from "./dimensions-E8hH3RXf.js";
import { g as genericComponent, d as propsFactory, f as makeComponentProps, v as breakpoints, p as provideTheme, w as useLocale, x as wrapInArray, b as useRender, m as makeThemeProps, h as provideDefaults, y as createSimpleFunctional, I as IconValue, k as useProxiedModel, z as IN_BROWSER, A as focusableChildren, u as useRtl, s as useDisplay, B as useResizeObserver, C as createRange, D as keyValues, E as getCurrentInstance, j as clamp, F as defineFunctionalComponent, i as convertToUnit, G as consoleError, H as isPrimitive, J as deepEqual, K as getObjectValueByPath, L as isEmpty, M as makeDisplayProps, N as EventProp, O as pick, P as getPrefixedEventHandlers, Q as getPropertyFromItem, R as filterInputAttrs, S as callEvent, o as omit, T as SUPPORTS_MATCH_MEDIA, U as noop, V as ensureValidVNode, W as checkPrintable, X as matchesSelector, Y as humanReadableFileSize, Z as useDate, _ as createDateRange, $ as templateRef, a0 as daysDiff, a1 as CircularBuffer, l as useToggleScope, a2 as toPhysical, n as useLayoutItem, q as makeLayoutItemProps, a3 as VuetifyLayoutKey, a4 as refElement, t as useLayout, r as useTheme } from "./vendor-vuetify-aQIaOcnC.js";
import { V as VAlert, a as VForm, b as VSheet, m as makeVSheetProps } from "./VSheet-sW1CD2v1.js";
import { V as VContainer, u as useSsrBoot } from "./VContainer-CkSzbdeb.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
import { V as VSelectionControl, m as makeVSelectionControlProps } from "./VSelectionControl-Cl2TmmDO.js";
import { V as VRadioGroup, a as VRadio } from "./VRadioGroup-DM1vROFK.js";
const breakpointProps = (() => {
  return breakpoints.reduce((props, val) => {
    props[val] = {
      type: [Boolean, String, Number],
      default: false
    };
    return props;
  }, {});
})();
const offsetProps = (() => {
  return breakpoints.reduce((props, val) => {
    const offsetKey = "offset" + capitalize(val);
    props[offsetKey] = {
      type: [String, Number],
      default: null
    };
    return props;
  }, {});
})();
const orderProps = (() => {
  return breakpoints.reduce((props, val) => {
    const orderKey = "order" + capitalize(val);
    props[orderKey] = {
      type: [String, Number],
      default: null
    };
    return props;
  }, {});
})();
const propMap$1 = {
  col: Object.keys(breakpointProps),
  offset: Object.keys(offsetProps),
  order: Object.keys(orderProps)
};
function breakpointClass$1(type, prop, val) {
  let className = type;
  if (val == null || val === false) {
    return void 0;
  }
  if (prop) {
    const breakpoint = prop.replace(type, "");
    className += `-${breakpoint}`;
  }
  if (type === "col") {
    className = "v-" + className;
  }
  if (type === "col" && (val === "" || val === true)) {
    return className.toLowerCase();
  }
  className += `-${val}`;
  return className.toLowerCase();
}
const ALIGN_SELF_VALUES = ["auto", "start", "end", "center", "baseline", "stretch"];
const makeVColProps = propsFactory({
  cols: {
    type: [Boolean, String, Number],
    default: false
  },
  ...breakpointProps,
  offset: {
    type: [String, Number],
    default: null
  },
  ...offsetProps,
  order: {
    type: [String, Number],
    default: null
  },
  ...orderProps,
  alignSelf: {
    type: String,
    default: null,
    validator: (str) => ALIGN_SELF_VALUES.includes(str)
  },
  ...makeComponentProps(),
  ...makeTagProps()
}, "VCol");
const VCol = genericComponent()({
  name: "VCol",
  props: makeVColProps(),
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    const classes = computed(() => {
      const classList = [];
      let type;
      for (type in propMap$1) {
        propMap$1[type].forEach((prop) => {
          const value = props[prop];
          const className = breakpointClass$1(type, prop, value);
          if (className) classList.push(className);
        });
      }
      const hasColClasses = classList.some((className) => className.startsWith("v-col-"));
      classList.push({
        // Default to .v-col if no other col-{bp}-* classes generated nor `cols` specified.
        "v-col": !hasColClasses || !props.cols,
        [`v-col-${props.cols}`]: props.cols,
        [`offset-${props.offset}`]: props.offset,
        [`order-${props.order}`]: props.order,
        [`align-self-${props.alignSelf}`]: props.alignSelf
      });
      return classList;
    });
    return () => h(props.tag, {
      class: [classes.value, props.class],
      style: props.style
    }, slots.default?.());
  }
});
const ALIGNMENT = ["start", "end", "center"];
const SPACE = ["space-between", "space-around", "space-evenly"];
function makeRowProps(prefix, def) {
  return breakpoints.reduce((props, val) => {
    const prefixKey = prefix + capitalize(val);
    props[prefixKey] = def();
    return props;
  }, {});
}
const ALIGN_VALUES = [...ALIGNMENT, "baseline", "stretch"];
const alignValidator = (str) => ALIGN_VALUES.includes(str);
const alignProps = makeRowProps("align", () => ({
  type: String,
  default: null,
  validator: alignValidator
}));
const JUSTIFY_VALUES = [...ALIGNMENT, ...SPACE];
const justifyValidator = (str) => JUSTIFY_VALUES.includes(str);
const justifyProps = makeRowProps("justify", () => ({
  type: String,
  default: null,
  validator: justifyValidator
}));
const ALIGN_CONTENT_VALUES = [...ALIGNMENT, ...SPACE, "stretch"];
const alignContentValidator = (str) => ALIGN_CONTENT_VALUES.includes(str);
const alignContentProps = makeRowProps("alignContent", () => ({
  type: String,
  default: null,
  validator: alignContentValidator
}));
const propMap = {
  align: Object.keys(alignProps),
  justify: Object.keys(justifyProps),
  alignContent: Object.keys(alignContentProps)
};
const classMap = {
  align: "align",
  justify: "justify",
  alignContent: "align-content"
};
function breakpointClass(type, prop, val) {
  let className = classMap[type];
  if (val == null) {
    return void 0;
  }
  if (prop) {
    const breakpoint = prop.replace(type, "");
    className += `-${breakpoint}`;
  }
  className += `-${val}`;
  return className.toLowerCase();
}
const makeVRowProps = propsFactory({
  dense: Boolean,
  noGutters: Boolean,
  align: {
    type: String,
    default: null,
    validator: alignValidator
  },
  ...alignProps,
  justify: {
    type: String,
    default: null,
    validator: justifyValidator
  },
  ...justifyProps,
  alignContent: {
    type: String,
    default: null,
    validator: alignContentValidator
  },
  ...alignContentProps,
  ...makeComponentProps(),
  ...makeTagProps()
}, "VRow");
const VRow = genericComponent()({
  name: "VRow",
  props: makeVRowProps(),
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    const classes = computed(() => {
      const classList = [];
      let type;
      for (type in propMap) {
        propMap[type].forEach((prop) => {
          const value = props[prop];
          const className = breakpointClass(type, prop, value);
          if (className) classList.push(className);
        });
      }
      classList.push({
        "v-row--no-gutters": props.noGutters,
        "v-row--dense": props.dense,
        [`align-${props.align}`]: props.align,
        [`justify-${props.justify}`]: props.justify,
        [`align-content-${props.alignContent}`]: props.alignContent
      });
      return classList;
    });
    return () => h(props.tag, {
      class: ["v-row", classes.value, props.class],
      style: props.style
    }, slots.default?.());
  }
});
const DEFAULT_TIMEOUT = 3e3;
const DEFAULT_ERROR_TIMEOUT = 9e3;
function useSnackbar() {
  const snackbar = ref(false);
  const snackbarText = ref("");
  const snackbarColor = ref("success");
  const snackbarTimeout = ref(DEFAULT_TIMEOUT);
  const snackbarProgress = ref(100);
  const snackbarIndeterminate = ref(false);
  let progressTimer = null;
  let closeTimer = null;
  function clearTimers() {
    if (progressTimer) {
      clearInterval(progressTimer);
      progressTimer = null;
    }
    if (closeTimer) {
      clearTimeout(closeTimer);
      closeTimer = null;
    }
  }
  const notify = (text, color = "success", timeout, opts = {}) => {
    clearTimers();
    snackbarText.value = text;
    snackbarColor.value = color;
    snackbar.value = true;
    if (timeout == null) {
      timeout = color === "error" || color === "warning" ? DEFAULT_ERROR_TIMEOUT : DEFAULT_TIMEOUT;
    }
    if (opts.persistent) {
      snackbarIndeterminate.value = true;
      snackbarProgress.value = 100;
      snackbarTimeout.value = -1;
      return;
    }
    snackbarIndeterminate.value = false;
    snackbarTimeout.value = timeout;
    snackbarProgress.value = 100;
    const interval = 50;
    const decrement = 100 / (timeout / interval);
    progressTimer = setInterval(() => {
      snackbarProgress.value = Math.max(0, snackbarProgress.value - decrement);
      if (snackbarProgress.value <= 0) {
        clearInterval(progressTimer);
        progressTimer = null;
      }
    }, interval);
    closeTimer = setTimeout(() => {
      snackbar.value = false;
    }, timeout);
  };
  const onSnackbarToggle = (val) => {
    if (!val) {
      clearTimers();
      snackbarIndeterminate.value = false;
      snackbarProgress.value = 100;
      snackbarTimeout.value = DEFAULT_TIMEOUT;
    }
  };
  return {
    snackbar,
    snackbarText,
    snackbarColor,
    snackbarTimeout,
    snackbarProgress,
    snackbarIndeterminate,
    notify,
    onSnackbarToggle
  };
}
function getValue(obj, path) {
  if (path === "user") {
    return obj.User?.nome;
  }
  return path.split(".").reduce((acc, part) => acc && acc[part], obj);
}
function sortProcesses(processList, sortState) {
  if (!sortState || sortState.length === 0) {
    return processList;
  }
  const { key, order } = sortState[0];
  if (!key) {
    return processList;
  }
  return processList.toSorted((a, b) => {
    let valA = getValue(a, key);
    let valB = getValue(b, key);
    if (valA == null) {
      return 1;
    }
    if (valB == null) {
      return -1;
    }
    if (typeof valA === "string") {
      valA = valA.toLowerCase();
      valB = valB.toLowerCase();
    }
    if (valA < valB) {
      return order === "asc" ? -1 : 1;
    }
    if (valA > valB) {
      return order === "asc" ? 1 : -1;
    }
    return 0;
  });
}
async function exportProcessesPDF(processes, sortState, filtrosAtivos) {
  let processesToExport = [...processes];
  if (sortState && sortState.length > 0) {
    processesToExport = sortProcesses(processesToExport, sortState);
  }
  const [{ default: jsPDF }, { default: autoTable }] = await Promise.all([
    __vitePreload(() => import("./vendor-pdf-CmxC7yeP.js").then((n) => n.j), true ? [] : void 0),
    __vitePreload(() => import("./vendor-pdf-CmxC7yeP.js").then((n) => n.b), true ? [] : void 0)
  ]);
  const doc = new jsPDF("l", "mm", "a4");
  doc.setFontSize(16);
  doc.setFont(void 0, "bold");
  doc.text("Relatório de Processos", 15, 15);
  doc.setFontSize(10);
  doc.setFont(void 0, "normal");
  const dataAtual = format(/* @__PURE__ */ new Date(), "dd/MM/yyyy HH:mm");
  doc.text(`Data de Impressão: ${dataAtual}`, 15, 22);
  doc.text(`Total de Processos: ${processesToExport.length}`, 15, 28);
  let yPosition = 34;
  if (filtrosAtivos.length > 0) {
    doc.setFont(void 0, "bold");
    doc.text("Filtros Aplicados:", 15, yPosition);
    doc.setFont(void 0, "normal");
    yPosition += 6;
    for (const filtro of filtrosAtivos) {
      const maxWidth = 267;
      const linhas = doc.splitTextToSize(filtro, maxWidth);
      for (const linha of linhas) {
        doc.text(`  • ${linha}`, 15, yPosition);
        yPosition += 5;
      }
    }
  } else {
    doc.text("Filtros: Nenhum filtro aplicado", 15, yPosition);
    yPosition += 6;
  }
  doc.setLineWidth(0.5);
  doc.line(15, yPosition + 2, 282, yPosition + 2);
  const columns = [
    { header: "Nº Processo", dataKey: "numero_processo" },
    { header: "Atribuído a", dataKey: "user" },
    { header: "Classe", dataKey: "classe_principal" },
    { header: "Assunto", dataKey: "assunto_principal" },
    { header: "Tarjas", dataKey: "tarjas" },
    { header: "Prazo", dataKey: "prazoRestanteStr" },
    { header: "Reiterações", dataKey: "reiteracoes" },
    { header: "Obs", dataKey: "observacoes" }
  ];
  const rows = processesToExport.map((proc) => ({
    numero_processo: proc.numero_processo || "",
    user: proc.User?.nome || "N.A.",
    classe_principal: proc.classe_principal || "",
    assunto_principal: proc.assunto_principal || "",
    tarjas: proc.tarjas || "",
    prazoRestanteStr: proc.prazoRestanteStr || "N/A",
    reiteracoes: proc.reiteracoes || 0,
    observacoes: proc.observacoes || ""
  }));
  autoTable(doc, {
    columns,
    body: rows,
    startY: yPosition + 8,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [66, 139, 202], fontStyle: "bold" }
  });
  doc.save("processos.pdf");
}
function parseDateLocal(str) {
  const [y, m, d] = str.split("-").map(Number);
  return new Date(y, m - 1, d);
}
function getPrazoRestanteNum(proc) {
  let dataVencimento = null;
  if (proc.data_intimacao && proc.prazo_processual) {
    const dias = Number.parseInt(proc.prazo_processual, 10) || 0;
    dataVencimento = parseDateLocal(proc.data_intimacao);
    dataVencimento.setDate(dataVencimento.getDate() + dias);
  } else if (proc.prazo_vencimento) {
    dataVencimento = parseDateLocal(proc.prazo_vencimento);
  }
  if (!dataVencimento) {
    return null;
  }
  try {
    return differenceInDays(dataVencimento, startOfToday());
  } catch {
    return null;
  }
}
function formatarPrazo(dias) {
  if (dias === null) {
    return "N/A";
  }
  if (dias < 0) {
    return `Vencido há ${Math.abs(dias)} dias`;
  }
  if (dias === 0) {
    return "Vence hoje";
  }
  return `Vence em ${dias} dias`;
}
function getCorPrazo(dias) {
  if (dias === null) {
    return "grey";
  }
  if (dias < 0) {
    return "red";
  }
  if (dias <= 5) {
    return "orange";
  }
  return "green";
}
const CACHE_TTL = 5 * 60 * 1e3;
function getCache(key) {
  try {
    const raw = sessionStorage.getItem(key);
    if (!raw) {
      return null;
    }
    const { data, ts } = JSON.parse(raw);
    if (Date.now() - ts > CACHE_TTL) {
      sessionStorage.removeItem(key);
      return null;
    }
    return data;
  } catch {
    return null;
  }
}
function setCache(key, data) {
  sessionStorage.setItem(key, JSON.stringify({ data, ts: Date.now() }));
}
function clearCache(key) {
  sessionStorage.removeItem(key);
}
const rootTypes = {
  actions: "button@2",
  article: "heading, paragraph",
  avatar: "avatar",
  button: "button",
  card: "image, heading",
  "card-avatar": "image, list-item-avatar",
  chip: "chip",
  "date-picker": "list-item, heading, divider, date-picker-options, date-picker-days, actions",
  "date-picker-options": "text, avatar@2",
  "date-picker-days": "avatar@28",
  divider: "divider",
  heading: "heading",
  image: "image",
  "list-item": "text",
  "list-item-avatar": "avatar, text",
  "list-item-two-line": "sentences",
  "list-item-avatar-two-line": "avatar, sentences",
  "list-item-three-line": "paragraph",
  "list-item-avatar-three-line": "avatar, paragraph",
  ossein: "ossein",
  paragraph: "text@3",
  sentences: "text@2",
  subtitle: "text",
  table: "table-heading, table-thead, table-tbody, table-tfoot",
  "table-heading": "chip, text",
  "table-thead": "heading@6",
  "table-tbody": "table-row-divider@6",
  "table-row-divider": "table-row, divider",
  "table-row": "text@6",
  "table-tfoot": "text@2, avatar@2",
  text: "text"
};
function genBone(type) {
  let children = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : [];
  return createBaseVNode("div", {
    "class": normalizeClass(["v-skeleton-loader__bone", `v-skeleton-loader__${type}`])
  }, [children]);
}
function genBones(bone) {
  const [type, length] = bone.split("@");
  return Array.from({
    length
  }).map(() => genStructure(type));
}
function genStructure(type) {
  let children = [];
  if (!type) return children;
  const bone = rootTypes[type];
  if (type === bone) ;
  else if (type.includes(",")) return mapBones(type);
  else if (type.includes("@")) return genBones(type);
  else if (bone.includes(",")) children = mapBones(bone);
  else if (bone.includes("@")) children = genBones(bone);
  else if (bone) children.push(genStructure(bone));
  return [genBone(type, children)];
}
function mapBones(bones) {
  return bones.replace(/\s/g, "").split(",").map(genStructure);
}
const makeVSkeletonLoaderProps = propsFactory({
  boilerplate: Boolean,
  color: String,
  loading: Boolean,
  loadingText: {
    type: String,
    default: "$vuetify.loading"
  },
  type: {
    type: [String, Array],
    default: "ossein"
  },
  ...makeDimensionProps(),
  ...makeElevationProps(),
  ...makeThemeProps()
}, "VSkeletonLoader");
const VSkeletonLoader = genericComponent()({
  name: "VSkeletonLoader",
  inheritAttrs: false,
  props: makeVSkeletonLoaderProps(),
  setup(props, _ref) {
    let {
      attrs,
      slots
    } = _ref;
    const {
      backgroundColorClasses,
      backgroundColorStyles
    } = useBackgroundColor(() => props.color);
    const {
      dimensionStyles
    } = useDimension(props);
    const {
      elevationClasses
    } = useElevation(props);
    const {
      themeClasses
    } = provideTheme(props);
    const {
      t
    } = useLocale();
    const items = computed(() => genStructure(wrapInArray(props.type).join(",")));
    useRender(() => {
      const isLoading = !slots.default || props.loading;
      const loadingProps = props.boilerplate || !isLoading ? {} : {
        ariaLive: "polite",
        ariaLabel: t(props.loadingText),
        role: "alert"
      };
      return isLoading ? createBaseVNode("div", mergeProps({
        "class": ["v-skeleton-loader", {
          "v-skeleton-loader--boilerplate": props.boilerplate
        }, themeClasses.value, backgroundColorClasses.value, elevationClasses.value],
        "style": [backgroundColorStyles.value, dimensionStyles.value]
      }, loadingProps, attrs), [items.value]) : createBaseVNode(Fragment, null, [slots.default?.()]);
    });
    return {};
  }
});
const _sfc_main$6 = {
  __name: "CumpridosChart",
  props: {
    chartData: {
      type: Object,
      required: true
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  setup(__props) {
    Chart.register(
      plugin_title,
      plugin_tooltip,
      plugin_legend,
      BarElement,
      CategoryScale,
      LinearScale
    );
    const chartOptions = {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            precision: 0
          }
        }
      }
    };
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", null, [
        __props.loading ? (openBlock(), createBlock(VSkeletonLoader, {
          key: 0,
          height: "200",
          type: "image"
        })) : (openBlock(), createBlock(unref(Bar), {
          key: 1,
          data: __props.chartData,
          options: chartOptions
        }, null, 8, ["data"]))
      ]);
    };
  }
};
const makeVCardActionsProps = propsFactory({
  ...makeComponentProps(),
  ...makeTagProps()
}, "VCardActions");
const VCardActions = genericComponent()({
  name: "VCardActions",
  props: makeVCardActionsProps(),
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    provideDefaults({
      VBtn: {
        slim: true,
        variant: "text"
      }
    });
    useRender(() => createVNode(props.tag, {
      "class": normalizeClass(["v-card-actions", props.class]),
      "style": normalizeStyle(props.style)
    }, slots));
    return {};
  }
});
const makeVCardSubtitleProps = propsFactory({
  opacity: [Number, String],
  ...makeComponentProps(),
  ...makeTagProps()
}, "VCardSubtitle");
const VCardSubtitle = genericComponent()({
  name: "VCardSubtitle",
  props: makeVCardSubtitleProps(),
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    useRender(() => createVNode(props.tag, {
      "class": normalizeClass(["v-card-subtitle", props.class]),
      "style": normalizeStyle([{
        "--v-card-subtitle-opacity": props.opacity
      }, props.style])
    }, slots));
    return {};
  }
});
const VCardTitle = createSimpleFunctional("v-card-title");
const makeCardItemProps = propsFactory({
  appendAvatar: String,
  appendIcon: IconValue,
  prependAvatar: String,
  prependIcon: IconValue,
  subtitle: {
    type: [String, Number, Boolean],
    default: void 0
  },
  title: {
    type: [String, Number, Boolean],
    default: void 0
  },
  ...makeComponentProps(),
  ...makeDensityProps(),
  ...makeTagProps()
}, "VCardItem");
const VCardItem = genericComponent()({
  name: "VCardItem",
  props: makeCardItemProps(),
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    useRender(() => {
      const hasPrependMedia = !!(props.prependAvatar || props.prependIcon);
      const hasPrepend = !!(hasPrependMedia || slots.prepend);
      const hasAppendMedia = !!(props.appendAvatar || props.appendIcon);
      const hasAppend = !!(hasAppendMedia || slots.append);
      const hasTitle = !!(props.title != null || slots.title);
      const hasSubtitle = !!(props.subtitle != null || slots.subtitle);
      return createVNode(props.tag, {
        "class": normalizeClass(["v-card-item", props.class]),
        "style": normalizeStyle(props.style)
      }, {
        default: () => [hasPrepend && createBaseVNode("div", {
          "key": "prepend",
          "class": "v-card-item__prepend"
        }, [!slots.prepend ? createBaseVNode(Fragment, null, [props.prependAvatar && createVNode(VAvatar, {
          "key": "prepend-avatar",
          "density": props.density,
          "image": props.prependAvatar
        }, null), props.prependIcon && createVNode(VIcon, {
          "key": "prepend-icon",
          "density": props.density,
          "icon": props.prependIcon
        }, null)]) : createVNode(VDefaultsProvider, {
          "key": "prepend-defaults",
          "disabled": !hasPrependMedia,
          "defaults": {
            VAvatar: {
              density: props.density,
              image: props.prependAvatar
            },
            VIcon: {
              density: props.density,
              icon: props.prependIcon
            }
          }
        }, slots.prepend)]), createBaseVNode("div", {
          "class": "v-card-item__content"
        }, [hasTitle && createVNode(VCardTitle, {
          "key": "title"
        }, {
          default: () => [slots.title?.() ?? toDisplayString(props.title)]
        }), hasSubtitle && createVNode(VCardSubtitle, {
          "key": "subtitle"
        }, {
          default: () => [slots.subtitle?.() ?? toDisplayString(props.subtitle)]
        }), slots.default?.()]), hasAppend && createBaseVNode("div", {
          "key": "append",
          "class": "v-card-item__append"
        }, [!slots.append ? createBaseVNode(Fragment, null, [props.appendIcon && createVNode(VIcon, {
          "key": "append-icon",
          "density": props.density,
          "icon": props.appendIcon
        }, null), props.appendAvatar && createVNode(VAvatar, {
          "key": "append-avatar",
          "density": props.density,
          "image": props.appendAvatar
        }, null)]) : createVNode(VDefaultsProvider, {
          "key": "append-defaults",
          "disabled": !hasAppendMedia,
          "defaults": {
            VAvatar: {
              density: props.density,
              image: props.appendAvatar
            },
            VIcon: {
              density: props.density,
              icon: props.appendIcon
            }
          }
        }, slots.append)])]
      });
    });
    return {};
  }
});
const makeVCardTextProps = propsFactory({
  opacity: [Number, String],
  ...makeComponentProps(),
  ...makeTagProps()
}, "VCardText");
const VCardText = genericComponent()({
  name: "VCardText",
  props: makeVCardTextProps(),
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    useRender(() => createVNode(props.tag, {
      "class": normalizeClass(["v-card-text", props.class]),
      "style": normalizeStyle([{
        "--v-card-text-opacity": props.opacity
      }, props.style])
    }, slots));
    return {};
  }
});
const makeVCardProps = propsFactory({
  appendAvatar: String,
  appendIcon: IconValue,
  disabled: Boolean,
  flat: Boolean,
  hover: Boolean,
  image: String,
  link: {
    type: Boolean,
    default: void 0
  },
  prependAvatar: String,
  prependIcon: IconValue,
  ripple: {
    type: [Boolean, Object],
    default: true
  },
  subtitle: {
    type: [String, Number, Boolean],
    default: void 0
  },
  text: {
    type: [String, Number, Boolean],
    default: void 0
  },
  title: {
    type: [String, Number, Boolean],
    default: void 0
  },
  ...makeBorderProps(),
  ...makeComponentProps(),
  ...makeDensityProps(),
  ...makeDimensionProps(),
  ...makeElevationProps(),
  ...makeLoaderProps(),
  ...makeLocationProps(),
  ...makePositionProps(),
  ...makeRoundedProps(),
  ...makeRouterProps(),
  ...makeTagProps(),
  ...makeThemeProps(),
  ...makeVariantProps({
    variant: "elevated"
  })
}, "VCard");
const VCard = genericComponent()({
  name: "VCard",
  directives: {
    vRipple: Ripple
  },
  props: makeVCardProps(),
  setup(props, _ref) {
    let {
      attrs,
      slots
    } = _ref;
    const {
      themeClasses
    } = provideTheme(props);
    const {
      borderClasses
    } = useBorder(props);
    const {
      colorClasses,
      colorStyles,
      variantClasses
    } = useVariant(props);
    const {
      densityClasses
    } = useDensity(props);
    const {
      dimensionStyles
    } = useDimension(props);
    const {
      elevationClasses
    } = useElevation(props);
    const {
      loaderClasses
    } = useLoader(props);
    const {
      locationStyles
    } = useLocation(props);
    const {
      positionClasses
    } = usePosition(props);
    const {
      roundedClasses
    } = useRounded(props);
    const link = useLink(props, attrs);
    useRender(() => {
      const isLink = props.link !== false && link.isLink.value;
      const isClickable = !props.disabled && props.link !== false && (props.link || link.isClickable.value);
      const Tag = isLink ? "a" : props.tag;
      const hasTitle = !!(slots.title || props.title != null);
      const hasSubtitle = !!(slots.subtitle || props.subtitle != null);
      const hasHeader = hasTitle || hasSubtitle;
      const hasAppend = !!(slots.append || props.appendAvatar || props.appendIcon);
      const hasPrepend = !!(slots.prepend || props.prependAvatar || props.prependIcon);
      const hasImage = !!(slots.image || props.image);
      const hasCardItem = hasHeader || hasPrepend || hasAppend;
      const hasText = !!(slots.text || props.text != null);
      return withDirectives(createVNode(Tag, mergeProps(link.linkProps, {
        "class": ["v-card", {
          "v-card--disabled": props.disabled,
          "v-card--flat": props.flat,
          "v-card--hover": props.hover && !(props.disabled || props.flat),
          "v-card--link": isClickable
        }, themeClasses.value, borderClasses.value, colorClasses.value, densityClasses.value, elevationClasses.value, loaderClasses.value, positionClasses.value, roundedClasses.value, variantClasses.value, props.class],
        "style": [colorStyles.value, dimensionStyles.value, locationStyles.value, props.style],
        "onClick": isClickable && link.navigate,
        "tabindex": props.disabled ? -1 : void 0
      }), {
        default: () => [hasImage && createBaseVNode("div", {
          "key": "image",
          "class": "v-card__image"
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
        }, slots.image)]), createVNode(LoaderSlot, {
          "name": "v-card",
          "active": !!props.loading,
          "color": typeof props.loading === "boolean" ? void 0 : props.loading
        }, {
          default: slots.loader
        }), hasCardItem && createVNode(VCardItem, {
          "key": "item",
          "prependAvatar": props.prependAvatar,
          "prependIcon": props.prependIcon,
          "title": props.title,
          "subtitle": props.subtitle,
          "appendAvatar": props.appendAvatar,
          "appendIcon": props.appendIcon
        }, {
          default: slots.item,
          prepend: slots.prepend,
          title: slots.title,
          subtitle: slots.subtitle,
          append: slots.append
        }), hasText && createVNode(VCardText, {
          "key": "text"
        }, {
          default: () => [slots.text?.() ?? props.text]
        }), slots.default?.(), slots.actions && createVNode(VCardActions, null, {
          default: slots.actions
        }), genOverlays(isClickable, "v-card")]
      }), [[Ripple, isClickable && props.ripple]]);
    });
    return {};
  }
});
const makeVDialogProps = propsFactory({
  fullscreen: Boolean,
  retainFocus: {
    type: Boolean,
    default: true
  },
  scrollable: Boolean,
  ...makeVOverlayProps({
    origin: "center center",
    scrollStrategy: "block",
    transition: {
      component: VDialogTransition
    },
    zIndex: 2400
  })
}, "VDialog");
const VDialog = genericComponent()({
  name: "VDialog",
  props: makeVDialogProps(),
  emits: {
    "update:modelValue": (value) => true,
    afterEnter: () => true,
    afterLeave: () => true
  },
  setup(props, _ref) {
    let {
      emit,
      slots
    } = _ref;
    const isActive = useProxiedModel(props, "modelValue");
    const {
      scopeId
    } = useScopeId();
    const overlay = ref();
    async function onFocusin(e) {
      const before = e.relatedTarget;
      const after = e.target;
      await nextTick();
      if (isActive.value && before !== after && overlay.value?.contentEl && // We're the topmost dialog
      overlay.value?.globalTop && // It isn't the document or the dialog body
      ![document, overlay.value.contentEl].includes(after) && // It isn't inside the dialog body
      !overlay.value.contentEl.contains(after)) {
        const focusable = focusableChildren(overlay.value.contentEl);
        focusable[0]?.focus();
      }
    }
    function onKeydown(e) {
      if (e.key !== "Tab" || !overlay.value?.contentEl) return;
      const focusable = focusableChildren(overlay.value.contentEl);
      if (!focusable.length) return;
      const firstElement = focusable[0];
      const lastElement = focusable[focusable.length - 1];
      const active = document.activeElement;
      if (e.shiftKey && active === firstElement) {
        e.preventDefault();
        lastElement.focus();
      } else if (!e.shiftKey && active === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
    onBeforeUnmount(() => {
      document.removeEventListener("focusin", onFocusin);
      document.removeEventListener("keydown", onKeydown);
    });
    if (IN_BROWSER) {
      watch(() => isActive.value && props.retainFocus, (val) => {
        if (val) {
          document.addEventListener("focusin", onFocusin, {
            once: true
          });
          document.addEventListener("keydown", onKeydown);
        } else {
          document.removeEventListener("focusin", onFocusin);
          document.removeEventListener("keydown", onKeydown);
        }
      }, {
        immediate: true
      });
    }
    function onAfterEnter() {
      emit("afterEnter");
      if ((props.scrim || props.retainFocus) && overlay.value?.contentEl && !overlay.value.contentEl.contains(document.activeElement)) {
        overlay.value.contentEl.focus({
          preventScroll: true
        });
      }
    }
    function onAfterLeave() {
      emit("afterLeave");
    }
    watch(isActive, async (val) => {
      if (!val) {
        await nextTick();
        overlay.value.activatorEl?.focus({
          preventScroll: true
        });
      }
    });
    useRender(() => {
      const overlayProps = VOverlay.filterProps(props);
      const activatorProps = mergeProps({
        "aria-haspopup": "dialog"
      }, props.activatorProps);
      const contentProps = mergeProps({
        tabindex: -1
      }, props.contentProps);
      return createVNode(VOverlay, mergeProps({
        "ref": overlay,
        "class": ["v-dialog", {
          "v-dialog--fullscreen": props.fullscreen,
          "v-dialog--scrollable": props.scrollable
        }, props.class],
        "style": props.style
      }, overlayProps, {
        "modelValue": isActive.value,
        "onUpdate:modelValue": ($event) => isActive.value = $event,
        "aria-modal": "true",
        "activatorProps": activatorProps,
        "contentProps": contentProps,
        "height": !props.fullscreen ? props.height : void 0,
        "width": !props.fullscreen ? props.width : void 0,
        "maxHeight": !props.fullscreen ? props.maxHeight : void 0,
        "maxWidth": !props.fullscreen ? props.maxWidth : void 0,
        "role": "dialog",
        "onAfterEnter": onAfterEnter,
        "onAfterLeave": onAfterLeave
      }, scopeId), {
        activator: slots.activator,
        default: function() {
          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }
          return createVNode(VDefaultsProvider, {
            "root": "VDialog"
          }, {
            default: () => [slots.default?.(...args)]
          });
        }
      });
    });
    return forwardRefs({}, overlay);
  }
});
const _hoisted_1$3 = {
  key: 0,
  class: "text-caption"
};
const _hoisted_2$3 = { key: 0 };
const _hoisted_3$3 = {
  key: 4,
  class: "text-body-2 text-medium-emphasis"
};
const _sfc_main$5 = {
  __name: "PjeAuthDialog",
  emits: ["notify"],
  setup(__props, { expose: __expose, emit: __emit }) {
    const emit = __emit;
    const dialog = ref(false);
    const formRef = ref(null);
    const salvando = ref(false);
    const removendo = ref(false);
    const mostrarSenha = ref(false);
    const status = reactive({ configured: false, cpfDisplay: null, atualizadoEm: null, atualizadoPorNome: null });
    const form = reactive({ cpf: "", senha: "" });
    const unidadeId = ref(null);
    const unidadeNome = ref(null);
    function comUnidade(extra = {}) {
      return unidadeId.value ? { ...extra, unidadeId: unidadeId.value } : extra;
    }
    function cpfRule(v) {
      const digits = String(v || "").replace(/\D/g, "");
      return digits.length === 11 || "CPF deve ter 11 dígitos";
    }
    const senhaRule = (v) => v && String(v).trim().length > 0 || "Senha obrigatória";
    function mascararCpf() {
      const digits = form.cpf.replace(/\D/g, "").slice(0, 11);
      if (digits.length <= 3) {
        form.cpf = digits;
      } else if (digits.length <= 6) {
        form.cpf = `${digits.slice(0, 3)}.${digits.slice(3)}`;
      } else if (digits.length <= 9) {
        form.cpf = `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
      } else {
        form.cpf = `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9, 11)}`;
      }
    }
    function formatarData(iso) {
      try {
        return format(parseISO(iso), "dd/MM/yyyy HH:mm");
      } catch {
        return iso;
      }
    }
    async function carregarStatus() {
      try {
        const { data } = await apiClient.get("/admin/pje-auth/status", { params: comUnidade() });
        Object.assign(status, { configured: false, cpfDisplay: null, atualizadoEm: null, atualizadoPorNome: null }, data);
      } catch {
      }
    }
    async function abrir(opts = {}) {
      unidadeId.value = opts.unidadeId || null;
      unidadeNome.value = opts.unidadeNome || null;
      form.cpf = "";
      form.senha = "";
      mostrarSenha.value = false;
      formRef.value?.resetValidation();
      await carregarStatus();
      dialog.value = true;
    }
    function fechar() {
      dialog.value = false;
    }
    async function salvar() {
      const { valid } = await formRef.value.validate();
      if (!valid) return;
      salvando.value = true;
      try {
        const cpfDigits = form.cpf.replace(/\D/g, "");
        const { data } = await apiClient.post("/admin/pje-auth/salvar", comUnidade({ cpf: cpfDigits, senha: form.senha }));
        Object.assign(status, data);
        form.cpf = "";
        form.senha = "";
        formRef.value?.resetValidation();
        if (data.aviso) {
          emit("notify", data.aviso, "warning", 15e3);
        } else {
          emit("notify", "Credenciais do PJe salvas e testadas com sucesso!", "success");
        }
      } catch (error) {
        emit("notify", error.response?.data?.error || "Erro ao salvar credenciais.", "error");
      } finally {
        salvando.value = false;
      }
    }
    async function remover() {
      if (!window.confirm("Remover as credenciais salvas desta unidade?")) return;
      removendo.value = true;
      try {
        await apiClient.delete("/admin/pje-auth", { params: comUnidade() });
        Object.assign(status, { configured: false, cpfDisplay: null, atualizadoEm: null, atualizadoPorNome: null });
        form.cpf = "";
        form.senha = "";
        formRef.value?.resetValidation();
        emit("notify", "Credenciais removidas.", "success");
      } catch (error) {
        emit("notify", error.response?.data?.error || "Erro ao remover credenciais.", "error");
      } finally {
        removendo.value = false;
      }
    }
    __expose({ abrir });
    return (_ctx, _cache) => {
      return openBlock(), createBlock(VDialog, {
        modelValue: dialog.value,
        "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => dialog.value = $event),
        "max-width": "520px",
        persistent: ""
      }, {
        default: withCtx(() => [
          createVNode(VCard, null, {
            default: withCtx(() => [
              createVNode(VCardTitle, { class: "d-flex align-center" }, {
                default: withCtx(() => [
                  createVNode(VIcon, { start: "" }, {
                    default: withCtx(() => [..._cache[4] || (_cache[4] = [
                      createTextVNode("mdi-shield-key-outline", -1)
                    ])]),
                    _: 1
                  }),
                  _cache[5] || (_cache[5] = createTextVNode(" Autenticação PJe ", -1)),
                  createVNode(VSpacer),
                  createVNode(VBtn, {
                    icon: "mdi-close",
                    variant: "text",
                    onClick: fechar
                  })
                ]),
                _: 1
              }),
              createVNode(VCardText, null, {
                default: withCtx(() => [
                  unidadeNome.value ? (openBlock(), createBlock(VAlert, {
                    key: 0,
                    border: "start",
                    class: "mb-4",
                    density: "compact",
                    type: "info",
                    variant: "tonal"
                  }, {
                    default: withCtx(() => [
                      _cache[6] || (_cache[6] = createTextVNode(" Unidade: ", -1)),
                      createBaseVNode("strong", null, toDisplayString(unidadeNome.value), 1)
                    ]),
                    _: 1
                  })) : createCommentVNode("", true),
                  status.configured ? (openBlock(), createBlock(VAlert, {
                    key: 1,
                    border: "start",
                    class: "mb-4",
                    density: "compact",
                    type: "success",
                    variant: "tonal"
                  }, {
                    default: withCtx(() => [
                      createBaseVNode("div", null, [
                        _cache[7] || (_cache[7] = createTextVNode("Credenciais configuradas: CPF ", -1)),
                        createBaseVNode("strong", null, toDisplayString(status.cpfDisplay), 1)
                      ]),
                      status.atualizadoPorNome ? (openBlock(), createElementBlock("div", _hoisted_1$3, [
                        createTextVNode(" Salvo por " + toDisplayString(status.atualizadoPorNome) + " ", 1),
                        status.atualizadoEm ? (openBlock(), createElementBlock("span", _hoisted_2$3, " em " + toDisplayString(formatarData(status.atualizadoEm)), 1)) : createCommentVNode("", true)
                      ])) : createCommentVNode("", true)
                    ]),
                    _: 1
                  })) : (openBlock(), createBlock(VAlert, {
                    key: 2,
                    border: "start",
                    class: "mb-4",
                    density: "compact",
                    type: "info",
                    variant: "tonal"
                  }, {
                    default: withCtx(() => [..._cache[8] || (_cache[8] = [
                      createTextVNode(" Nenhuma credencial salva atualmente. ", -1)
                    ])]),
                    _: 1
                  })),
                  createVNode(VAlert, {
                    border: "start",
                    class: "mb-4",
                    density: "compact",
                    type: "warning",
                    variant: "tonal"
                  }, {
                    default: withCtx(() => [..._cache[9] || (_cache[9] = [
                      createBaseVNode("strong", null, "Atenção:", -1),
                      createTextVNode(" estas credenciais dão acesso às intimações PJe da unidade que o usuário tem acesso. ", -1)
                    ])]),
                    _: 1
                  }),
                  !status.configured ? (openBlock(), createElementBlock(Fragment, { key: 3 }, [
                    createVNode(VAlert, {
                      border: "start",
                      class: "mb-4",
                      density: "compact",
                      type: "error",
                      variant: "tonal"
                    }, {
                      default: withCtx(() => [..._cache[10] || (_cache[10] = [
                        createBaseVNode("strong", null, "Atenção!!!:", -1),
                        createTextVNode(" Não é aceito credenciais de usuários com cadastro em mais de uma delegacia. Use as credenciais de um usuário do PJe vinculado a essa única unidade representativa. ", -1),
                        createBaseVNode("br", null, null, -1),
                        createTextVNode(" O usuário também deve ter ", -1),
                        createBaseVNode("strong", null, "apenas", -1),
                        createTextVNode(" o papel ", -1),
                        createBaseVNode("strong", null, '"Procurador/Gestor"', -1),
                        createTextVNode(' na Procuradoria da delegacia — se também for "Assistente de Representante Processual", a consulta automática retorna vazia (exclua o papel de Assistente no PJe). ', -1)
                      ])]),
                      _: 1
                    }),
                    createVNode(VForm, {
                      ref_key: "formRef",
                      ref: formRef,
                      onSubmit: withModifiers(salvar, ["prevent"])
                    }, {
                      default: withCtx(() => [
                        createVNode(VRow, { dense: "" }, {
                          default: withCtx(() => [
                            createVNode(VCol, { cols: "12" }, {
                              default: withCtx(() => [
                                createVNode(VTextField, {
                                  modelValue: form.cpf,
                                  "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => form.cpf = $event),
                                  density: "compact",
                                  hint: "Somente números, 11 dígitos (CPF do usuário do PJe)",
                                  label: "CPF",
                                  maxlength: "14",
                                  rules: [cpfRule],
                                  variant: "outlined",
                                  onInput: mascararCpf
                                }, null, 8, ["modelValue", "rules"])
                              ]),
                              _: 1
                            }),
                            createVNode(VCol, { cols: "12" }, {
                              default: withCtx(() => [
                                createVNode(VTextField, {
                                  modelValue: form.senha,
                                  "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => form.senha = $event),
                                  autocomplete: "new-password",
                                  density: "compact",
                                  label: "Senha do PJe",
                                  rules: [senhaRule],
                                  type: mostrarSenha.value ? "text" : "password",
                                  variant: "outlined"
                                }, {
                                  "append-inner": withCtx(() => [
                                    createVNode(VIcon, {
                                      icon: mostrarSenha.value ? "mdi-eye-off" : "mdi-eye",
                                      style: { "cursor": "pointer" },
                                      onClick: _cache[1] || (_cache[1] = ($event) => mostrarSenha.value = !mostrarSenha.value)
                                    }, null, 8, ["icon"])
                                  ]),
                                  _: 1
                                }, 8, ["modelValue", "rules", "type"])
                              ]),
                              _: 1
                            })
                          ]),
                          _: 1
                        }),
                        _cache[11] || (_cache[11] = createBaseVNode("div", { class: "text-caption text-medium-emphasis mb-1" }, " As credenciais são validadas antes de serem salvas e ficam armazenadas de forma segura, criptografadas, no banco de dados. ", -1))
                      ]),
                      _: 1
                    }, 512)
                  ], 64)) : (openBlock(), createElementBlock("div", _hoisted_3$3, " Para alterar as credenciais, remova as atuais e informe as novas. "))
                ]),
                _: 1
              }),
              createVNode(VCardActions, null, {
                default: withCtx(() => [
                  status.configured ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [
                    createVNode(VBtn, {
                      color: "red",
                      loading: removendo.value,
                      "prepend-icon": "mdi-delete-outline",
                      variant: "tonal",
                      onClick: remover
                    }, {
                      default: withCtx(() => [..._cache[12] || (_cache[12] = [
                        createTextVNode(" Remover ", -1)
                      ])]),
                      _: 1
                    }, 8, ["loading"]),
                    createVNode(VSpacer),
                    createVNode(VBtn, {
                      disabled: removendo.value,
                      variant: "text",
                      onClick: fechar
                    }, {
                      default: withCtx(() => [..._cache[13] || (_cache[13] = [
                        createTextVNode("Fechar", -1)
                      ])]),
                      _: 1
                    }, 8, ["disabled"])
                  ], 64)) : (openBlock(), createElementBlock(Fragment, { key: 1 }, [
                    createVNode(VSpacer),
                    createVNode(VBtn, {
                      disabled: salvando.value,
                      variant: "text",
                      onClick: fechar
                    }, {
                      default: withCtx(() => [..._cache[14] || (_cache[14] = [
                        createTextVNode("Cancelar", -1)
                      ])]),
                      _: 1
                    }, 8, ["disabled"]),
                    createVNode(VBtn, {
                      color: "primary",
                      loading: salvando.value,
                      "prepend-icon": "mdi-content-save",
                      onClick: salvar
                    }, {
                      default: withCtx(() => [..._cache[15] || (_cache[15] = [
                        createTextVNode(" Salvar e Testar ", -1)
                      ])]),
                      _: 1
                    }, 8, ["loading"])
                  ], 64))
                ]),
                _: 1
              })
            ]),
            _: 1
          })
        ]),
        _: 1
      }, 8, ["modelValue"]);
    };
  }
};
function useRefs() {
  const refs = ref([]);
  onBeforeUpdate(() => refs.value = []);
  function updateRef(e, i) {
    refs.value[i] = e;
  }
  return {
    refs,
    updateRef
  };
}
const makeVPaginationProps = propsFactory({
  activeColor: String,
  start: {
    type: [Number, String],
    default: 1
  },
  modelValue: {
    type: Number,
    default: (props) => props.start
  },
  disabled: Boolean,
  length: {
    type: [Number, String],
    default: 1,
    validator: (val) => val % 1 === 0
  },
  totalVisible: [Number, String],
  firstIcon: {
    type: IconValue,
    default: "$first"
  },
  prevIcon: {
    type: IconValue,
    default: "$prev"
  },
  nextIcon: {
    type: IconValue,
    default: "$next"
  },
  lastIcon: {
    type: IconValue,
    default: "$last"
  },
  ariaLabel: {
    type: String,
    default: "$vuetify.pagination.ariaLabel.root"
  },
  pageAriaLabel: {
    type: String,
    default: "$vuetify.pagination.ariaLabel.page"
  },
  currentPageAriaLabel: {
    type: String,
    default: "$vuetify.pagination.ariaLabel.currentPage"
  },
  firstAriaLabel: {
    type: String,
    default: "$vuetify.pagination.ariaLabel.first"
  },
  previousAriaLabel: {
    type: String,
    default: "$vuetify.pagination.ariaLabel.previous"
  },
  nextAriaLabel: {
    type: String,
    default: "$vuetify.pagination.ariaLabel.next"
  },
  lastAriaLabel: {
    type: String,
    default: "$vuetify.pagination.ariaLabel.last"
  },
  ellipsis: {
    type: String,
    default: "..."
  },
  showFirstLastPage: Boolean,
  ...makeBorderProps(),
  ...makeComponentProps(),
  ...makeDensityProps(),
  ...makeElevationProps(),
  ...makeRoundedProps(),
  ...makeSizeProps(),
  ...makeTagProps({
    tag: "nav"
  }),
  ...makeThemeProps(),
  ...makeVariantProps({
    variant: "text"
  })
}, "VPagination");
const VPagination = genericComponent()({
  name: "VPagination",
  props: makeVPaginationProps(),
  emits: {
    "update:modelValue": (value) => true,
    first: (value) => true,
    prev: (value) => true,
    next: (value) => true,
    last: (value) => true
  },
  setup(props, _ref) {
    let {
      slots,
      emit
    } = _ref;
    const page = useProxiedModel(props, "modelValue");
    const {
      t,
      n
    } = useLocale();
    const {
      isRtl
    } = useRtl();
    const {
      themeClasses
    } = provideTheme(props);
    const {
      width
    } = useDisplay();
    const maxButtons = shallowRef(-1);
    provideDefaults(void 0, {
      scoped: true
    });
    const {
      resizeRef
    } = useResizeObserver((entries) => {
      if (!entries.length) return;
      const {
        target,
        contentRect
      } = entries[0];
      const firstItem = target.querySelector(".v-pagination__list > *");
      if (!firstItem) return;
      const totalWidth = contentRect.width;
      const itemWidth = firstItem.offsetWidth + parseFloat(getComputedStyle(firstItem).marginRight) * 2;
      maxButtons.value = getMax(totalWidth, itemWidth);
    });
    const length = computed(() => parseInt(props.length, 10));
    const start = computed(() => parseInt(props.start, 10));
    const totalVisible = computed(() => {
      if (props.totalVisible != null) return parseInt(props.totalVisible, 10);
      else if (maxButtons.value >= 0) return maxButtons.value;
      return getMax(width.value, 58);
    });
    function getMax(totalWidth, itemWidth) {
      const minButtons = props.showFirstLastPage ? 5 : 3;
      return Math.max(0, Math.floor(
        // Round to two decimal places to avoid floating point errors
        Number(((totalWidth - itemWidth * minButtons) / itemWidth).toFixed(2))
      ));
    }
    const range = computed(() => {
      if (length.value <= 0 || isNaN(length.value) || length.value > Number.MAX_SAFE_INTEGER) return [];
      if (totalVisible.value <= 0) return [];
      else if (totalVisible.value === 1) return [page.value];
      if (length.value <= totalVisible.value) {
        return createRange(length.value, start.value);
      }
      const even = totalVisible.value % 2 === 0;
      const middle = even ? totalVisible.value / 2 : Math.floor(totalVisible.value / 2);
      const left = even ? middle : middle + 1;
      const right = length.value - middle;
      if (left - page.value >= 0) {
        return [...createRange(Math.max(1, totalVisible.value - 1), start.value), props.ellipsis, length.value];
      } else if (page.value - right >= (even ? 1 : 0)) {
        const rangeLength = totalVisible.value - 1;
        const rangeStart = length.value - rangeLength + start.value;
        return [start.value, props.ellipsis, ...createRange(rangeLength, rangeStart)];
      } else {
        const rangeLength = Math.max(1, totalVisible.value - 2);
        const rangeStart = rangeLength === 1 ? page.value : page.value - Math.ceil(rangeLength / 2) + start.value;
        return [start.value, props.ellipsis, ...createRange(rangeLength, rangeStart), props.ellipsis, length.value];
      }
    });
    function setValue(e, value, event) {
      e.preventDefault();
      page.value = value;
      event && emit(event, value);
    }
    const {
      refs,
      updateRef
    } = useRefs();
    provideDefaults({
      VPaginationBtn: {
        color: toRef(() => props.color),
        border: toRef(() => props.border),
        density: toRef(() => props.density),
        size: toRef(() => props.size),
        variant: toRef(() => props.variant),
        rounded: toRef(() => props.rounded),
        elevation: toRef(() => props.elevation)
      }
    });
    const items = computed(() => {
      return range.value.map((item, index) => {
        const ref2 = (e) => updateRef(e, index);
        if (typeof item === "string") {
          return {
            isActive: false,
            key: `ellipsis-${index}`,
            page: item,
            props: {
              ref: ref2,
              ellipsis: true,
              icon: true,
              disabled: true
            }
          };
        } else {
          const isActive = item === page.value;
          return {
            isActive,
            key: item,
            page: n(item),
            props: {
              ref: ref2,
              ellipsis: false,
              icon: true,
              disabled: !!props.disabled || Number(props.length) < 2,
              color: isActive ? props.activeColor : props.color,
              "aria-current": isActive,
              "aria-label": t(isActive ? props.currentPageAriaLabel : props.pageAriaLabel, item),
              onClick: (e) => setValue(e, item)
            }
          };
        }
      });
    });
    const controls = computed(() => {
      const prevDisabled = !!props.disabled || page.value <= start.value;
      const nextDisabled = !!props.disabled || page.value >= start.value + length.value - 1;
      return {
        first: props.showFirstLastPage ? {
          icon: isRtl.value ? props.lastIcon : props.firstIcon,
          onClick: (e) => setValue(e, start.value, "first"),
          disabled: prevDisabled,
          "aria-label": t(props.firstAriaLabel),
          "aria-disabled": prevDisabled
        } : void 0,
        prev: {
          icon: isRtl.value ? props.nextIcon : props.prevIcon,
          onClick: (e) => setValue(e, page.value - 1, "prev"),
          disabled: prevDisabled,
          "aria-label": t(props.previousAriaLabel),
          "aria-disabled": prevDisabled
        },
        next: {
          icon: isRtl.value ? props.prevIcon : props.nextIcon,
          onClick: (e) => setValue(e, page.value + 1, "next"),
          disabled: nextDisabled,
          "aria-label": t(props.nextAriaLabel),
          "aria-disabled": nextDisabled
        },
        last: props.showFirstLastPage ? {
          icon: isRtl.value ? props.firstIcon : props.lastIcon,
          onClick: (e) => setValue(e, start.value + length.value - 1, "last"),
          disabled: nextDisabled,
          "aria-label": t(props.lastAriaLabel),
          "aria-disabled": nextDisabled
        } : void 0
      };
    });
    function updateFocus() {
      const currentIndex = page.value - start.value;
      refs.value[currentIndex]?.$el.focus();
    }
    function onKeydown(e) {
      if (e.key === keyValues.left && !props.disabled && page.value > Number(props.start)) {
        page.value = page.value - 1;
        nextTick(updateFocus);
      } else if (e.key === keyValues.right && !props.disabled && page.value < start.value + length.value - 1) {
        page.value = page.value + 1;
        nextTick(updateFocus);
      }
    }
    useRender(() => createVNode(props.tag, {
      "ref": resizeRef,
      "class": normalizeClass(["v-pagination", themeClasses.value, props.class]),
      "style": normalizeStyle(props.style),
      "role": "navigation",
      "aria-label": t(props.ariaLabel),
      "onKeydown": onKeydown,
      "data-test": "v-pagination-root"
    }, {
      default: () => [createBaseVNode("ul", {
        "class": "v-pagination__list"
      }, [props.showFirstLastPage && createBaseVNode("li", {
        "key": "first",
        "class": "v-pagination__first",
        "data-test": "v-pagination-first"
      }, [slots.first ? slots.first(controls.value.first) : createVNode(VBtn, mergeProps({
        "_as": "VPaginationBtn"
      }, controls.value.first), null)]), createBaseVNode("li", {
        "key": "prev",
        "class": "v-pagination__prev",
        "data-test": "v-pagination-prev"
      }, [slots.prev ? slots.prev(controls.value.prev) : createVNode(VBtn, mergeProps({
        "_as": "VPaginationBtn"
      }, controls.value.prev), null)]), items.value.map((item, index) => createBaseVNode("li", {
        "key": item.key,
        "class": normalizeClass(["v-pagination__item", {
          "v-pagination__item--is-active": item.isActive
        }]),
        "data-test": "v-pagination-item"
      }, [slots.item ? slots.item(item) : createVNode(VBtn, mergeProps({
        "_as": "VPaginationBtn"
      }, item.props), {
        default: () => [item.page]
      })])), createBaseVNode("li", {
        "key": "next",
        "class": "v-pagination__next",
        "data-test": "v-pagination-next"
      }, [slots.next ? slots.next(controls.value.next) : createVNode(VBtn, mergeProps({
        "_as": "VPaginationBtn"
      }, controls.value.next), null)]), props.showFirstLastPage && createBaseVNode("li", {
        "key": "last",
        "class": "v-pagination__last",
        "data-test": "v-pagination-last"
      }, [slots.last ? slots.last(controls.value.last) : createVNode(VBtn, mergeProps({
        "_as": "VPaginationBtn"
      }, controls.value.last), null)])])]
    }));
    return {};
  }
});
const _hoisted_1$2 = { key: 0 };
const _hoisted_2$2 = { class: "d-flex flex-column align-center ga-2 pa-1" };
const _hoisted_3$2 = {
  key: 1,
  class: "text-center text-grey"
};
const _hoisted_4$2 = { key: 3 };
const _hoisted_5$2 = { class: "text-caption" };
const _hoisted_6$2 = { key: 4 };
const _hoisted_7$1 = { class: "text-caption" };
const _hoisted_8$1 = { class: "text-caption" };
const itemsPerPage = 11;
const _sfc_main$4 = {
  __name: "StatsGrid",
  props: {
    stats: {
      type: Object,
      default: () => ({ total: 0, byUser: [], byPrazo: [], byAssunto: [] })
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  setup(__props) {
    const props = __props;
    const currentView = ref("users");
    const userPage = ref(1);
    const totalUserPages = computed(() => {
      if (props.stats.byUser.length <= itemsPerPage) return 1;
      return Math.ceil(props.stats.byUser.length / itemsPerPage);
    });
    watch(totalUserPages, (total) => {
      if (userPage.value > total) {
        userPage.value = 1;
      }
    });
    const paginatedUsers = computed(() => {
      const start = (userPage.value - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      return props.stats.byUser.slice(start, end);
    });
    const { name: breakpointName } = useDisplay();
    const circleSize = computed(() => {
      switch (breakpointName.value) {
        case "xs": {
          return 60;
        }
        // Celulares
        case "sm": {
          return 75;
        }
        // Tablets
        default: {
          return 85;
        }
      }
    });
    const circleWidth = computed(() => {
      switch (breakpointName.value) {
        case "xs": {
          return 6;
        }
        case "sm": {
          return 7;
        }
        default: {
          return 8;
        }
      }
    });
    return (_ctx, _cache) => {
      return openBlock(), createBlock(VCardText, null, {
        default: withCtx(() => [
          __props.loading ? (openBlock(), createElementBlock("div", _hoisted_1$2, [
            createVNode(VRow, {
              class: "mb-6",
              dense: "",
              justify: "center"
            }, {
              default: withCtx(() => [
                createVNode(VSkeletonLoader, {
                  type: "button",
                  width: "240"
                })
              ]),
              _: 1
            }),
            createVNode(VRow, { dense: "" }, {
              default: withCtx(() => [
                (openBlock(), createElementBlock(Fragment, null, renderList(6, (n) => {
                  return createVNode(VCol, {
                    key: n,
                    cols: "4",
                    md: "2",
                    sm: "2"
                  }, {
                    default: withCtx(() => [
                      createBaseVNode("div", _hoisted_2$2, [
                        createVNode(VSkeletonLoader, {
                          size: 85,
                          type: "avatar"
                        }),
                        createVNode(VSkeletonLoader, {
                          type: "text",
                          width: "60"
                        })
                      ])
                    ]),
                    _: 1
                  });
                }), 64))
              ]),
              _: 1
            })
          ])) : __props.stats.total === 0 ? (openBlock(), createElementBlock("div", _hoisted_3$2, " Nenhum dado para exibir com os filtros atuais. ")) : !__props.loading ? (openBlock(), createBlock(VRow, {
            key: 2,
            class: "mb-4 mt-0",
            dense: "",
            justify: "center"
          }, {
            default: withCtx(() => [
              createVNode(VBtnToggle, {
                modelValue: currentView.value,
                "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => currentView.value = $event),
                class: "d-flex flex-column flex-sm-row mb-6",
                color: "primary",
                mandatory: "",
                variant: "outlined"
              }, {
                default: withCtx(() => [
                  createVNode(VBtn, {
                    class: "w-100 w-sm-auto mb-2 mb-sm-0",
                    value: "users"
                  }, {
                    default: withCtx(() => [..._cache[2] || (_cache[2] = [
                      createTextVNode(" Pendentes por Usuário ", -1)
                    ])]),
                    _: 1
                  }),
                  createVNode(VBtn, {
                    class: "w-100 w-sm-auto",
                    value: "details"
                  }, {
                    default: withCtx(() => [..._cache[3] || (_cache[3] = [
                      createTextVNode(" Por Prazo/Assunto ", -1)
                    ])]),
                    _: 1
                  })
                ]),
                _: 1
              }, 8, ["modelValue"])
            ]),
            _: 1
          })) : createCommentVNode("", true),
          !__props.loading && __props.stats.total > 0 && currentView.value === "users" ? (openBlock(), createElementBlock("div", _hoisted_4$2, [
            createVNode(VRow, { dense: "" }, {
              default: withCtx(() => [
                createVNode(VCol, {
                  cols: "4",
                  md: "2",
                  sm: "2"
                }, {
                  default: withCtx(() => [
                    createVNode(VCard, {
                      class: "text-center",
                      variant: "text"
                    }, {
                      default: withCtx(() => [
                        createVNode(VProgressCircular, {
                          color: "primary",
                          "model-value": 100,
                          size: circleSize.value,
                          width: circleWidth.value
                        }, {
                          default: withCtx(() => [
                            createBaseVNode("strong", null, toDisplayString(__props.stats.total), 1)
                          ]),
                          _: 1
                        }, 8, ["size", "width"]),
                        createVNode(VCardText, { class: "text-primary font-weight-bold pa-1" }, {
                          default: withCtx(() => [..._cache[4] || (_cache[4] = [
                            createTextVNode(" Total ", -1)
                          ])]),
                          _: 1
                        })
                      ]),
                      _: 1
                    })
                  ]),
                  _: 1
                }),
                (openBlock(true), createElementBlock(Fragment, null, renderList(paginatedUsers.value, (user) => {
                  return openBlock(), createBlock(VCol, {
                    key: user.nome,
                    cols: "4",
                    md: "2",
                    sm: "2"
                  }, {
                    default: withCtx(() => [
                      createVNode(VCard, {
                        class: "text-center",
                        variant: "text"
                      }, {
                        default: withCtx(() => [
                          createVNode(VProgressCircular, {
                            color: "primary",
                            "model-value": user.percent,
                            size: circleSize.value,
                            width: circleWidth.value
                          }, {
                            default: withCtx(() => [
                              createBaseVNode("strong", null, toDisplayString(user.count), 1)
                            ]),
                            _: 2
                          }, 1032, ["model-value", "size", "width"]),
                          createVNode(VCardText, { class: "pa-1" }, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(user.nome), 1),
                              _cache[5] || (_cache[5] = createBaseVNode("br", null, null, -1)),
                              createBaseVNode("span", _hoisted_5$2, "(" + toDisplayString(user.percent.toFixed(0)) + "%)", 1)
                            ]),
                            _: 2
                          }, 1024)
                        ]),
                        _: 2
                      }, 1024)
                    ]),
                    _: 2
                  }, 1024);
                }), 128))
              ]),
              _: 1
            }),
            totalUserPages.value > 1 ? (openBlock(), createBlock(VRow, {
              key: 0,
              class: "mt-2",
              justify: "center"
            }, {
              default: withCtx(() => [
                createVNode(VPagination, {
                  modelValue: userPage.value,
                  "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => userPage.value = $event),
                  density: "compact",
                  length: totalUserPages.value,
                  size: "small"
                }, null, 8, ["modelValue", "length"])
              ]),
              _: 1
            })) : createCommentVNode("", true)
          ])) : !__props.loading && __props.stats.total > 0 && currentView.value === "details" ? (openBlock(), createElementBlock("div", _hoisted_6$2, [
            createVNode(VRow, { dense: "" }, {
              default: withCtx(() => [
                (openBlock(true), createElementBlock(Fragment, null, renderList(__props.stats.byPrazo, (prazo) => {
                  return openBlock(), createBlock(VCol, {
                    key: prazo.nome,
                    cols: "6",
                    md: "2",
                    sm: "4"
                  }, {
                    default: withCtx(() => [
                      createVNode(VCard, {
                        class: "text-center",
                        variant: "text"
                      }, {
                        default: withCtx(() => [
                          createVNode(VProgressCircular, {
                            color: "orange",
                            "model-value": prazo.percent,
                            size: circleSize.value,
                            width: circleWidth.value
                          }, {
                            default: withCtx(() => [
                              createBaseVNode("strong", null, toDisplayString(prazo.count), 1)
                            ]),
                            _: 2
                          }, 1032, ["model-value", "size", "width"]),
                          createVNode(VCardText, { class: "pa-1" }, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(prazo.nome), 1),
                              _cache[6] || (_cache[6] = createBaseVNode("br", null, null, -1)),
                              createBaseVNode("span", _hoisted_7$1, "(" + toDisplayString(prazo.percent.toFixed(0)) + "%)", 1)
                            ]),
                            _: 2
                          }, 1024)
                        ]),
                        _: 2
                      }, 1024)
                    ]),
                    _: 2
                  }, 1024);
                }), 128)),
                (openBlock(true), createElementBlock(Fragment, null, renderList(__props.stats.byAssunto, (assunto) => {
                  return openBlock(), createBlock(VCol, {
                    key: assunto.nome,
                    cols: "6",
                    md: "2",
                    sm: "4"
                  }, {
                    default: withCtx(() => [
                      createVNode(VCard, {
                        class: "text-center",
                        variant: "text"
                      }, {
                        default: withCtx(() => [
                          createVNode(VProgressCircular, {
                            color: "blue",
                            "model-value": assunto.percent,
                            size: circleSize.value,
                            width: circleWidth.value
                          }, {
                            default: withCtx(() => [
                              createBaseVNode("strong", null, toDisplayString(assunto.count), 1)
                            ]),
                            _: 2
                          }, 1032, ["model-value", "size", "width"]),
                          createVNode(VCardText, { class: "pa-1" }, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(assunto.nome), 1),
                              _cache[7] || (_cache[7] = createBaseVNode("br", null, null, -1)),
                              createBaseVNode("span", _hoisted_8$1, "(" + toDisplayString(assunto.percent.toFixed(0)) + "%)", 1)
                            ]),
                            _: 2
                          }, 1024)
                        ]),
                        _: 2
                      }, 1024)
                    ]),
                    _: 2
                  }, 1024);
                }), 128))
              ]),
              _: 1
            })
          ])) : createCommentVNode("", true)
        ]),
        _: 1
      });
    };
  }
};
const makeDataTablePaginateProps = propsFactory({
  page: {
    type: [Number, String],
    default: 1
  },
  itemsPerPage: {
    type: [Number, String],
    default: 10
  }
}, "DataTable-paginate");
const VDataTablePaginationSymbol = /* @__PURE__ */ Symbol.for("vuetify:data-table-pagination");
function createPagination(props) {
  const page = useProxiedModel(props, "page", void 0, (value) => Number(value ?? 1));
  const itemsPerPage2 = useProxiedModel(props, "itemsPerPage", void 0, (value) => Number(value ?? 10));
  return {
    page,
    itemsPerPage: itemsPerPage2
  };
}
function providePagination(options) {
  const {
    page,
    itemsPerPage: itemsPerPage2,
    itemsLength
  } = options;
  const startIndex = computed(() => {
    if (itemsPerPage2.value === -1) return 0;
    return itemsPerPage2.value * (page.value - 1);
  });
  const stopIndex = computed(() => {
    if (itemsPerPage2.value === -1) return itemsLength.value;
    return Math.min(itemsLength.value, startIndex.value + itemsPerPage2.value);
  });
  const pageCount = computed(() => {
    if (itemsPerPage2.value === -1 || itemsLength.value === 0) return 1;
    return Math.ceil(itemsLength.value / itemsPerPage2.value);
  });
  watch([page, pageCount], () => {
    if (page.value > pageCount.value) {
      page.value = pageCount.value;
    }
  });
  function setItemsPerPage(value) {
    itemsPerPage2.value = value;
    page.value = 1;
  }
  function nextPage() {
    page.value = clamp(page.value + 1, 1, pageCount.value);
  }
  function prevPage() {
    page.value = clamp(page.value - 1, 1, pageCount.value);
  }
  function setPage(value) {
    page.value = clamp(value, 1, pageCount.value);
  }
  const data = {
    page,
    itemsPerPage: itemsPerPage2,
    startIndex,
    stopIndex,
    pageCount,
    itemsLength,
    nextPage,
    prevPage,
    setPage,
    setItemsPerPage
  };
  provide(VDataTablePaginationSymbol, data);
  return data;
}
function usePagination() {
  const data = inject(VDataTablePaginationSymbol);
  if (!data) throw new Error("Missing pagination!");
  return data;
}
function usePaginatedItems(options) {
  const vm = getCurrentInstance("usePaginatedItems");
  const {
    items,
    startIndex,
    stopIndex,
    itemsPerPage: itemsPerPage2
  } = options;
  const paginatedItems = computed(() => {
    if (itemsPerPage2.value <= 0) return items.value;
    return items.value.slice(startIndex.value, stopIndex.value);
  });
  watch(paginatedItems, (val) => {
    vm.emit("update:currentItems", val);
  }, {
    immediate: true
  });
  return {
    paginatedItems
  };
}
const makeVDataTableFooterProps = propsFactory({
  prevIcon: {
    type: IconValue,
    default: "$prev"
  },
  nextIcon: {
    type: IconValue,
    default: "$next"
  },
  firstIcon: {
    type: IconValue,
    default: "$first"
  },
  lastIcon: {
    type: IconValue,
    default: "$last"
  },
  itemsPerPageText: {
    type: String,
    default: "$vuetify.dataFooter.itemsPerPageText"
  },
  pageText: {
    type: String,
    default: "$vuetify.dataFooter.pageText"
  },
  firstPageLabel: {
    type: String,
    default: "$vuetify.dataFooter.firstPage"
  },
  prevPageLabel: {
    type: String,
    default: "$vuetify.dataFooter.prevPage"
  },
  nextPageLabel: {
    type: String,
    default: "$vuetify.dataFooter.nextPage"
  },
  lastPageLabel: {
    type: String,
    default: "$vuetify.dataFooter.lastPage"
  },
  itemsPerPageOptions: {
    type: Array,
    default: () => [{
      value: 10,
      title: "10"
    }, {
      value: 25,
      title: "25"
    }, {
      value: 50,
      title: "50"
    }, {
      value: 100,
      title: "100"
    }, {
      value: -1,
      title: "$vuetify.dataFooter.itemsPerPageAll"
    }]
  },
  showCurrentPage: Boolean
}, "VDataTableFooter");
const VDataTableFooter = genericComponent()({
  name: "VDataTableFooter",
  props: makeVDataTableFooterProps(),
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    const {
      t
    } = useLocale();
    const {
      page,
      pageCount,
      startIndex,
      stopIndex,
      itemsLength,
      itemsPerPage: itemsPerPage2,
      setItemsPerPage
    } = usePagination();
    const itemsPerPageOptions = computed(() => props.itemsPerPageOptions.map((option) => {
      if (typeof option === "number") {
        return {
          value: option,
          title: option === -1 ? t("$vuetify.dataFooter.itemsPerPageAll") : String(option)
        };
      }
      return {
        ...option,
        title: !isNaN(Number(option.title)) ? option.title : t(option.title)
      };
    }));
    useRender(() => {
      const paginationProps = VPagination.filterProps(props);
      return createBaseVNode("div", {
        "class": "v-data-table-footer"
      }, [slots.prepend?.(), createBaseVNode("div", {
        "class": "v-data-table-footer__items-per-page"
      }, [createBaseVNode("span", {
        "aria-label": t(props.itemsPerPageText)
      }, [t(props.itemsPerPageText)]), createVNode(VSelect, {
        "items": itemsPerPageOptions.value,
        "modelValue": itemsPerPage2.value,
        "onUpdate:modelValue": (v) => setItemsPerPage(Number(v)),
        "density": "compact",
        "variant": "outlined",
        "hideDetails": true
      }, null)]), createBaseVNode("div", {
        "class": "v-data-table-footer__info"
      }, [createBaseVNode("div", null, [t(props.pageText, !itemsLength.value ? 0 : startIndex.value + 1, stopIndex.value, itemsLength.value)])]), createBaseVNode("div", {
        "class": "v-data-table-footer__pagination"
      }, [createVNode(VPagination, mergeProps({
        "modelValue": page.value,
        "onUpdate:modelValue": ($event) => page.value = $event,
        "density": "comfortable",
        "firstAriaLabel": props.firstPageLabel,
        "lastAriaLabel": props.lastPageLabel,
        "length": pageCount.value,
        "nextAriaLabel": props.nextPageLabel,
        "previousAriaLabel": props.prevPageLabel,
        "rounded": true,
        "showFirstLastPage": true,
        "totalVisible": props.showCurrentPage ? 1 : 0,
        "variant": "plain"
      }, paginationProps), null)])]);
    });
    return {};
  }
});
const VDataTableColumn = defineFunctionalComponent({
  align: {
    type: String,
    default: "start"
  },
  fixed: {
    type: [Boolean, String],
    default: false
  },
  fixedOffset: [Number, String],
  fixedEndOffset: [Number, String],
  height: [Number, String],
  lastFixed: Boolean,
  firstFixedEnd: Boolean,
  noPadding: Boolean,
  indent: [Number, String],
  empty: Boolean,
  tag: String,
  width: [Number, String],
  maxWidth: [Number, String],
  nowrap: Boolean
}, (props, _ref) => {
  let {
    slots
  } = _ref;
  const Tag = props.tag ?? "td";
  const fixedSide = typeof props.fixed === "string" ? props.fixed : props.fixed ? "start" : "none";
  return createVNode(Tag, {
    "class": normalizeClass(["v-data-table__td", {
      "v-data-table-column--fixed": fixedSide === "start",
      "v-data-table-column--fixed-end": fixedSide === "end",
      "v-data-table-column--last-fixed": props.lastFixed,
      "v-data-table-column--first-fixed-end": props.firstFixedEnd,
      "v-data-table-column--no-padding": props.noPadding,
      "v-data-table-column--nowrap": props.nowrap,
      "v-data-table-column--empty": props.empty
    }, `v-data-table-column--align-${props.align}`]),
    "style": {
      height: convertToUnit(props.height),
      width: convertToUnit(props.width),
      maxWidth: convertToUnit(props.maxWidth),
      left: fixedSide === "start" ? convertToUnit(props.fixedOffset || null) : void 0,
      right: fixedSide === "end" ? convertToUnit(props.fixedEndOffset || null) : void 0,
      paddingInlineStart: props.indent ? convertToUnit(props.indent) : void 0
    }
  }, {
    default: () => [slots.default?.()]
  });
});
const makeDataTableHeaderProps = propsFactory({
  headers: Array
}, "DataTable-header");
const VDataTableHeadersSymbol = /* @__PURE__ */ Symbol.for("vuetify:data-table-headers");
const defaultHeader = {
  title: "",
  sortable: false
};
const defaultActionHeader = {
  ...defaultHeader,
  width: 48
};
function priorityQueue() {
  let arr = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [];
  const queue = arr.map((element) => ({
    element,
    priority: 0
  }));
  return {
    enqueue: (element, priority) => {
      let added = false;
      for (let i = 0; i < queue.length; i++) {
        const item = queue[i];
        if (item.priority > priority) {
          queue.splice(i, 0, {
            element,
            priority
          });
          added = true;
          break;
        }
      }
      if (!added) queue.push({
        element,
        priority
      });
    },
    size: () => queue.length,
    count: () => {
      let count = 0;
      if (!queue.length) return 0;
      const whole = Math.floor(queue[0].priority);
      for (let i = 0; i < queue.length; i++) {
        if (Math.floor(queue[i].priority) === whole) count += 1;
      }
      return count;
    },
    dequeue: () => {
      return queue.shift();
    }
  };
}
function extractLeaves(item) {
  let columns = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : [];
  if (!item.children) {
    columns.push(item);
  } else {
    for (const child of item.children) {
      extractLeaves(child, columns);
    }
  }
  return columns;
}
function extractKeys(headers) {
  let keys = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : /* @__PURE__ */ new Set();
  for (const item of headers) {
    if (item.key) keys.add(item.key);
    if (item.children) {
      extractKeys(item.children, keys);
    }
  }
  return keys;
}
function getDefaultItem(item) {
  if (!item.key) return void 0;
  if (item.key === "data-table-group") return defaultHeader;
  if (["data-table-expand", "data-table-select"].includes(item.key)) return defaultActionHeader;
  return void 0;
}
function getDepth(item) {
  let depth = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0;
  if (!item.children) return depth;
  return Math.max(depth, ...item.children.map((child) => getDepth(child, depth + 1)));
}
function parseFixedColumns(items) {
  let seenFixed = false;
  function setFixed(item, side) {
    let parentFixedSide = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : "none";
    if (!item) return;
    if (parentFixedSide !== "none") {
      item.fixed = parentFixedSide;
    }
    if (item.fixed === true) {
      item.fixed = "start";
    }
    if (item.fixed === side) {
      if (item.children) {
        if (side === "start") {
          for (let i = item.children.length - 1; i >= 0; i--) {
            setFixed(item.children[i], side, side);
          }
        } else {
          for (let i = 0; i < item.children.length; i++) {
            setFixed(item.children[i], side, side);
          }
        }
      } else {
        if (!seenFixed && side === "start") {
          item.lastFixed = true;
        } else if (!seenFixed && side === "end") {
          item.firstFixedEnd = true;
        } else if (isNaN(Number(item.width))) {
          consoleError(`Multiple fixed columns should have a static width (key: ${item.key})`);
        } else {
          item.minWidth = Math.max(Number(item.width) || 0, Number(item.minWidth) || 0);
        }
        seenFixed = true;
      }
    } else {
      if (item.children) {
        if (side === "start") {
          for (let i = item.children.length - 1; i >= 0; i--) {
            setFixed(item.children[i], side);
          }
        } else {
          for (let i = 0; i < item.children.length; i++) {
            setFixed(item.children[i], side);
          }
        }
      } else {
        seenFixed = false;
      }
    }
  }
  for (let i = items.length - 1; i >= 0; i--) {
    setFixed(items[i], "start");
  }
  for (let i = 0; i < items.length; i++) {
    setFixed(items[i], "end");
  }
  let fixedOffset = 0;
  for (let i = 0; i < items.length; i++) {
    fixedOffset = setFixedOffset(items[i], fixedOffset);
  }
  let fixedEndOffset = 0;
  for (let i = items.length - 1; i >= 0; i--) {
    fixedEndOffset = setFixedEndOffset(items[i], fixedEndOffset);
  }
}
function setFixedOffset(item) {
  let offset = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0;
  if (!item) return offset;
  if (item.children) {
    item.fixedOffset = offset;
    for (const child of item.children) {
      offset = setFixedOffset(child, offset);
    }
  } else if (item.fixed && item.fixed !== "end") {
    item.fixedOffset = offset;
    offset += parseFloat(item.width || "0") || 0;
  }
  return offset;
}
function setFixedEndOffset(item) {
  let offset = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0;
  if (!item) return offset;
  if (item.children) {
    item.fixedEndOffset = offset;
    for (const child of item.children) {
      offset = setFixedEndOffset(child, offset);
    }
  } else if (item.fixed === "end") {
    item.fixedEndOffset = offset;
    offset += parseFloat(item.width || "0") || 0;
  }
  return offset;
}
function parse(items, maxDepth) {
  const headers = [];
  let currentDepth = 0;
  const queue = priorityQueue(items);
  while (queue.size() > 0) {
    let rowSize = queue.count();
    const row = [];
    let fraction = 1;
    while (rowSize > 0) {
      const {
        element: item,
        priority
      } = queue.dequeue();
      const diff = maxDepth - currentDepth - getDepth(item);
      row.push({
        ...item,
        rowspan: diff ?? 1,
        colspan: item.children ? extractLeaves(item).length : 1
      });
      if (item.children) {
        for (const child of item.children) {
          const sort = priority % 1 + fraction / Math.pow(10, currentDepth + 2);
          queue.enqueue(child, currentDepth + diff + sort);
        }
      }
      fraction += 1;
      rowSize -= 1;
    }
    currentDepth += 1;
    headers.push(row);
  }
  const columns = items.map((item) => extractLeaves(item)).flat();
  return {
    columns,
    headers
  };
}
function convertToInternalHeaders(items) {
  const internalHeaders = [];
  for (const item of items) {
    const defaultItem = {
      ...getDefaultItem(item),
      ...item
    };
    const key = defaultItem.key ?? (typeof defaultItem.value === "string" ? defaultItem.value : null);
    const value = defaultItem.value ?? key ?? null;
    const internalItem = {
      ...defaultItem,
      key,
      value,
      sortable: defaultItem.sortable ?? (defaultItem.key != null || !!defaultItem.sort),
      children: defaultItem.children ? convertToInternalHeaders(defaultItem.children) : void 0
    };
    internalHeaders.push(internalItem);
  }
  return internalHeaders;
}
function createHeaders(props, options) {
  const headers = ref([]);
  const columns = ref([]);
  const sortFunctions = ref({});
  const sortRawFunctions = ref({});
  const filterFunctions = ref({});
  watchEffect(() => {
    const _headers = props.headers || Object.keys(props.items[0] ?? {}).map((key) => ({
      key,
      title: capitalize(key)
    }));
    const items = _headers.slice();
    const keys = extractKeys(items);
    if (options?.groupBy?.value.length && !keys.has("data-table-group")) {
      items.unshift({
        key: "data-table-group",
        title: "Group"
      });
    }
    if (options?.showSelect?.value && !keys.has("data-table-select")) {
      items.unshift({
        key: "data-table-select"
      });
    }
    if (options?.showExpand?.value && !keys.has("data-table-expand")) {
      items.push({
        key: "data-table-expand"
      });
    }
    const internalHeaders = convertToInternalHeaders(items);
    parseFixedColumns(internalHeaders);
    const maxDepth = Math.max(...internalHeaders.map((item) => getDepth(item))) + 1;
    const parsed = parse(internalHeaders, maxDepth);
    headers.value = parsed.headers;
    columns.value = parsed.columns;
    const flatHeaders = parsed.headers.flat(1);
    for (const header of flatHeaders) {
      if (!header.key) continue;
      if (header.sortable) {
        if (header.sort) {
          sortFunctions.value[header.key] = header.sort;
        }
        if (header.sortRaw) {
          sortRawFunctions.value[header.key] = header.sortRaw;
        }
      }
      if (header.filter) {
        filterFunctions.value[header.key] = header.filter;
      }
    }
  });
  const data = {
    headers,
    columns,
    sortFunctions,
    sortRawFunctions,
    filterFunctions
  };
  provide(VDataTableHeadersSymbol, data);
  return data;
}
function useHeaders() {
  const data = inject(VDataTableHeadersSymbol);
  if (!data) throw new Error("Missing headers!");
  return data;
}
const singleSelectStrategy = {
  showSelectAll: false,
  allSelected: () => [],
  select: (_ref) => {
    let {
      items,
      value
    } = _ref;
    return new Set(value ? [items[0]?.value] : []);
  },
  selectAll: (_ref2) => {
    let {
      selected
    } = _ref2;
    return selected;
  }
};
const pageSelectStrategy = {
  showSelectAll: true,
  allSelected: (_ref3) => {
    let {
      currentPage
    } = _ref3;
    return currentPage;
  },
  select: (_ref4) => {
    let {
      items,
      value,
      selected
    } = _ref4;
    for (const item of items) {
      if (value) selected.add(item.value);
      else selected.delete(item.value);
    }
    return selected;
  },
  selectAll: (_ref5) => {
    let {
      value,
      currentPage,
      selected
    } = _ref5;
    return pageSelectStrategy.select({
      items: currentPage,
      value,
      selected
    });
  }
};
const allSelectStrategy = {
  showSelectAll: true,
  allSelected: (_ref6) => {
    let {
      allItems
    } = _ref6;
    return allItems;
  },
  select: (_ref7) => {
    let {
      items,
      value,
      selected
    } = _ref7;
    for (const item of items) {
      if (value) selected.add(item.value);
      else selected.delete(item.value);
    }
    return selected;
  },
  selectAll: (_ref8) => {
    let {
      value,
      allItems
    } = _ref8;
    return new Set(value ? allItems.map((item) => item.value) : []);
  }
};
const makeDataTableSelectProps = propsFactory({
  showSelect: Boolean,
  selectStrategy: {
    type: [String, Object],
    default: "page"
  },
  modelValue: {
    type: Array,
    default: () => []
  },
  valueComparator: Function
}, "DataTable-select");
const VDataTableSelectionSymbol = /* @__PURE__ */ Symbol.for("vuetify:data-table-selection");
function provideSelection(props, _ref9) {
  let {
    allItems,
    currentPage
  } = _ref9;
  const selected = useProxiedModel(props, "modelValue", props.modelValue, (v) => {
    const customComparator = props.valueComparator;
    if (customComparator) {
      return new Set(wrapInArray(v).map((v2) => {
        return allItems.value.find((item) => customComparator(v2, item.value))?.value ?? v2;
      }));
    }
    return new Set(wrapInArray(v).map((v2) => {
      return isPrimitive(v2) ? allItems.value.find((item) => v2 === item.value)?.value ?? v2 : allItems.value.find((item) => deepEqual(v2, item.value))?.value ?? v2;
    }));
  }, (v) => {
    return [...v.values()];
  });
  const allSelectable = computed(() => allItems.value.filter((item) => item.selectable));
  const currentPageSelectable = computed(() => currentPage.value.filter((item) => item.selectable));
  const selectStrategy = computed(() => {
    if (typeof props.selectStrategy === "object") return props.selectStrategy;
    switch (props.selectStrategy) {
      case "single":
        return singleSelectStrategy;
      case "all":
        return allSelectStrategy;
      case "page":
      default:
        return pageSelectStrategy;
    }
  });
  const lastSelectedIndex = shallowRef(null);
  function isSelected(items) {
    return wrapInArray(items).every((item) => selected.value.has(item.value));
  }
  function isSomeSelected(items) {
    return wrapInArray(items).some((item) => selected.value.has(item.value));
  }
  function select(items, value) {
    const newSelected = selectStrategy.value.select({
      items,
      value,
      selected: new Set(selected.value)
    });
    selected.value = newSelected;
  }
  function toggleSelect(item, index, event) {
    const items = [];
    index = index ?? currentPage.value.findIndex((i) => i.value === item.value);
    if (props.selectStrategy !== "single" && event?.shiftKey && lastSelectedIndex.value !== null) {
      const [start, end] = [lastSelectedIndex.value, index].sort((a, b) => a - b);
      items.push(...currentPage.value.slice(start, end + 1).filter((item2) => item2.selectable));
    } else {
      items.push(item);
      lastSelectedIndex.value = index;
    }
    select(items, !isSelected([item]));
  }
  function selectAll(value) {
    const newSelected = selectStrategy.value.selectAll({
      value,
      allItems: allSelectable.value,
      currentPage: currentPageSelectable.value,
      selected: new Set(selected.value)
    });
    selected.value = newSelected;
  }
  const someSelected = computed(() => selected.value.size > 0);
  const allSelected = computed(() => {
    const items = selectStrategy.value.allSelected({
      allItems: allSelectable.value,
      currentPage: currentPageSelectable.value
    });
    return !!items.length && isSelected(items);
  });
  const showSelectAll = toRef(() => selectStrategy.value.showSelectAll);
  const data = {
    toggleSelect,
    select,
    selectAll,
    isSelected,
    isSomeSelected,
    someSelected,
    allSelected,
    showSelectAll,
    lastSelectedIndex,
    selectStrategy
  };
  provide(VDataTableSelectionSymbol, data);
  return data;
}
function useSelection() {
  const data = inject(VDataTableSelectionSymbol);
  if (!data) throw new Error("Missing selection!");
  return data;
}
const makeDataTableSortProps = propsFactory({
  sortBy: {
    type: Array,
    default: () => []
  },
  customKeySort: Object,
  multiSort: Boolean,
  mustSort: Boolean
}, "DataTable-sort");
const VDataTableSortSymbol = /* @__PURE__ */ Symbol.for("vuetify:data-table-sort");
function createSort(props) {
  const sortBy = useProxiedModel(props, "sortBy");
  const mustSort = toRef(() => props.mustSort);
  const multiSort = toRef(() => props.multiSort);
  return {
    sortBy,
    mustSort,
    multiSort
  };
}
function provideSort(options) {
  const {
    sortBy,
    mustSort,
    multiSort,
    page
  } = options;
  const toggleSort = (column) => {
    if (column.key == null) return;
    let newSortBy = sortBy.value.map((x) => ({
      ...x
    })) ?? [];
    const item = newSortBy.find((x) => x.key === column.key);
    if (!item) {
      if (multiSort.value) {
        newSortBy.push({
          key: column.key,
          order: "asc"
        });
      } else {
        newSortBy = [{
          key: column.key,
          order: "asc"
        }];
      }
    } else if (item.order === "desc") {
      if (mustSort.value && newSortBy.length === 1) {
        item.order = "asc";
      } else {
        newSortBy = newSortBy.filter((x) => x.key !== column.key);
      }
    } else {
      item.order = "desc";
    }
    sortBy.value = newSortBy;
    if (page) page.value = 1;
  };
  function isSorted(column) {
    return !!sortBy.value.find((item) => item.key === column.key);
  }
  const data = {
    sortBy,
    toggleSort,
    isSorted
  };
  provide(VDataTableSortSymbol, data);
  return data;
}
function useSort() {
  const data = inject(VDataTableSortSymbol);
  if (!data) throw new Error("Missing sort!");
  return data;
}
function useSortedItems(props, items, sortBy, options) {
  const locale = useLocale();
  const sortedItems = computed(() => {
    if (!sortBy.value.length) return items.value;
    return sortItems(items.value, sortBy.value, locale.current.value, {
      transform: options?.transform,
      sortFunctions: {
        ...props.customKeySort,
        ...options?.sortFunctions?.value
      },
      sortRawFunctions: options?.sortRawFunctions?.value
    });
  });
  return {
    sortedItems
  };
}
function sortItems(items, sortByItems, locale, options) {
  const stringCollator = new Intl.Collator(locale, {
    sensitivity: "accent",
    usage: "sort"
  });
  const transformedItems = items.map((item) => [item, options?.transform ? options.transform(item) : item]);
  return transformedItems.sort((a, b) => {
    for (let i = 0; i < sortByItems.length; i++) {
      let hasCustomResult = false;
      const sortKey = sortByItems[i].key;
      const sortOrder = sortByItems[i].order ?? "asc";
      if (sortOrder === false) continue;
      let sortA = getObjectValueByPath(a[1], sortKey);
      let sortB = getObjectValueByPath(b[1], sortKey);
      let sortARaw = a[0].raw;
      let sortBRaw = b[0].raw;
      if (sortOrder === "desc") {
        [sortA, sortB] = [sortB, sortA];
        [sortARaw, sortBRaw] = [sortBRaw, sortARaw];
      }
      if (options?.sortRawFunctions?.[sortKey]) {
        const customResult = options.sortRawFunctions[sortKey](sortARaw, sortBRaw);
        if (customResult == null) continue;
        hasCustomResult = true;
        if (customResult) return customResult;
      }
      if (options?.sortFunctions?.[sortKey]) {
        const customResult = options.sortFunctions[sortKey](sortA, sortB);
        if (customResult == null) continue;
        hasCustomResult = true;
        if (customResult) return customResult;
      }
      if (hasCustomResult) continue;
      if (sortA instanceof Date && sortB instanceof Date) {
        sortA = sortA.getTime();
        sortB = sortB.getTime();
      }
      [sortA, sortB] = [sortA, sortB].map((s) => s != null ? s.toString().toLocaleLowerCase() : s);
      if (sortA !== sortB) {
        if (isEmpty(sortA) && isEmpty(sortB)) return 0;
        if (isEmpty(sortA)) return -1;
        if (isEmpty(sortB)) return 1;
        if (!isNaN(sortA) && !isNaN(sortB)) return Number(sortA) - Number(sortB);
        return stringCollator.compare(sortA, sortB);
      }
    }
    return 0;
  }).map((_ref) => {
    let [item] = _ref;
    return item;
  });
}
const makeVDataTableHeadersProps = propsFactory({
  color: String,
  disableSort: Boolean,
  fixedHeader: Boolean,
  multiSort: Boolean,
  sortAscIcon: {
    type: IconValue,
    default: "$sortAsc"
  },
  sortDescIcon: {
    type: IconValue,
    default: "$sortDesc"
  },
  headerProps: {
    type: Object
  },
  /** @deprecated */
  sticky: Boolean,
  ...makeDensityProps(),
  ...makeDisplayProps(),
  ...makeLoaderProps()
}, "VDataTableHeaders");
const VDataTableHeaders = genericComponent()({
  name: "VDataTableHeaders",
  props: makeVDataTableHeadersProps(),
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    const {
      t
    } = useLocale();
    const {
      toggleSort,
      sortBy,
      isSorted
    } = useSort();
    const {
      someSelected,
      allSelected,
      selectAll,
      showSelectAll
    } = useSelection();
    const {
      columns,
      headers
    } = useHeaders();
    const {
      loaderClasses
    } = useLoader(props);
    function getFixedStyles(column, y) {
      if (!(props.sticky || props.fixedHeader) && !column.fixed) return void 0;
      const fixedSide = typeof column.fixed === "string" ? column.fixed : column.fixed ? "start" : "none";
      return {
        position: "sticky",
        left: fixedSide === "start" ? convertToUnit(column.fixedOffset) : void 0,
        right: fixedSide === "end" ? convertToUnit(column.fixedEndOffset) : void 0,
        top: props.sticky || props.fixedHeader ? `calc(var(--v-table-header-height) * ${y})` : void 0
      };
    }
    function handleEnterKeyPress(event, column) {
      if (event.key === "Enter" && !props.disableSort) {
        toggleSort(column);
      }
    }
    function getSortIcon(column) {
      const item = sortBy.value.find((item2) => item2.key === column.key);
      if (!item) return props.sortAscIcon;
      return item.order === "asc" ? props.sortAscIcon : props.sortDescIcon;
    }
    const {
      backgroundColorClasses,
      backgroundColorStyles
    } = useBackgroundColor(() => props.color);
    const {
      displayClasses,
      mobile
    } = useDisplay(props);
    const slotProps = computed(() => ({
      headers: headers.value,
      columns: columns.value,
      toggleSort,
      isSorted,
      sortBy: sortBy.value,
      someSelected: someSelected.value,
      allSelected: allSelected.value,
      selectAll,
      getSortIcon
    }));
    const headerCellClasses = computed(() => ["v-data-table__th", {
      "v-data-table__th--sticky": props.sticky || props.fixedHeader
    }, displayClasses.value, loaderClasses.value]);
    const VDataTableHeaderCell = (_ref2) => {
      let {
        column,
        x,
        y
      } = _ref2;
      const noPadding = column.key === "data-table-select" || column.key === "data-table-expand";
      const isEmpty2 = column.key === "data-table-group" && column.width === 0 && !column.title;
      const headerProps = mergeProps(props.headerProps ?? {}, column.headerProps ?? {});
      return createVNode(VDataTableColumn, mergeProps({
        "tag": "th",
        "align": column.align,
        "class": [{
          "v-data-table__th--sortable": column.sortable && !props.disableSort,
          "v-data-table__th--sorted": isSorted(column),
          "v-data-table__th--fixed": column.fixed
        }, ...headerCellClasses.value],
        "style": {
          width: convertToUnit(column.width),
          minWidth: convertToUnit(column.minWidth),
          maxWidth: convertToUnit(column.maxWidth),
          ...getFixedStyles(column, y)
        },
        "colspan": column.colspan,
        "rowspan": column.rowspan,
        "fixed": column.fixed,
        "nowrap": column.nowrap,
        "lastFixed": column.lastFixed,
        "firstFixedEnd": column.firstFixedEnd,
        "noPadding": noPadding,
        "empty": isEmpty2,
        "tabindex": column.sortable ? 0 : void 0,
        "onClick": column.sortable ? () => toggleSort(column) : void 0,
        "onKeydown": column.sortable ? (event) => handleEnterKeyPress(event, column) : void 0
      }, headerProps), {
        default: () => {
          const columnSlotName = `header.${column.key}`;
          const columnSlotProps = {
            column,
            selectAll,
            isSorted,
            toggleSort,
            sortBy: sortBy.value,
            someSelected: someSelected.value,
            allSelected: allSelected.value,
            getSortIcon
          };
          if (slots[columnSlotName]) return slots[columnSlotName](columnSlotProps);
          if (isEmpty2) return "";
          if (column.key === "data-table-select") {
            return slots["header.data-table-select"]?.(columnSlotProps) ?? (showSelectAll.value && createVNode(VCheckboxBtn, {
              "density": props.density,
              "modelValue": allSelected.value,
              "indeterminate": someSelected.value && !allSelected.value,
              "onUpdate:modelValue": selectAll
            }, null));
          }
          return createBaseVNode("div", {
            "class": "v-data-table-header__content"
          }, [createBaseVNode("span", null, [column.title]), column.sortable && !props.disableSort && createVNode(VIcon, {
            "key": "icon",
            "class": "v-data-table-header__sort-icon",
            "icon": getSortIcon(column)
          }, null), props.multiSort && isSorted(column) && createBaseVNode("div", {
            "key": "badge",
            "class": normalizeClass(["v-data-table-header__sort-badge", ...backgroundColorClasses.value]),
            "style": normalizeStyle(backgroundColorStyles.value)
          }, [sortBy.value.findIndex((x2) => x2.key === column.key) + 1])]);
        }
      });
    };
    const VDataTableMobileHeaderCell = () => {
      const displayItems = computed(() => {
        return columns.value.filter((column) => column?.sortable && !props.disableSort);
      });
      const appendIcon = computed(() => {
        const showSelectColumn = columns.value.find((column) => column.key === "data-table-select");
        if (showSelectColumn == null) return;
        return allSelected.value ? "$checkboxOn" : someSelected.value ? "$checkboxIndeterminate" : "$checkboxOff";
      });
      return createVNode(VDataTableColumn, mergeProps({
        "tag": "th",
        "class": [...headerCellClasses.value],
        "colspan": headers.value.length + 1
      }, props.headerProps), {
        default: () => [createBaseVNode("div", {
          "class": "v-data-table-header__content"
        }, [createVNode(VSelect, {
          "chips": true,
          "class": "v-data-table__td-sort-select",
          "clearable": true,
          "density": "default",
          "items": displayItems.value,
          "label": t("$vuetify.dataTable.sortBy"),
          "multiple": props.multiSort,
          "variant": "underlined",
          "onClick:clear": () => sortBy.value = [],
          "appendIcon": appendIcon.value,
          "onClick:append": () => selectAll(!allSelected.value)
        }, {
          chip: (props2) => createVNode(VChip, {
            "onClick": props2.item.raw?.sortable ? () => toggleSort(props2.item.raw) : void 0,
            "onMousedown": (e) => {
              e.preventDefault();
              e.stopPropagation();
            }
          }, {
            default: () => [props2.item.title, createVNode(VIcon, {
              "class": normalizeClass(["v-data-table__td-sort-icon", isSorted(props2.item.raw) && "v-data-table__td-sort-icon-active"]),
              "icon": getSortIcon(props2.item.raw),
              "size": "small"
            }, null)]
          })
        })])]
      });
    };
    useRender(() => {
      return mobile.value ? createBaseVNode("tr", null, [createVNode(VDataTableMobileHeaderCell, null, null)]) : createBaseVNode(Fragment, null, [slots.headers ? slots.headers(slotProps.value) : headers.value.map((row, y) => createBaseVNode("tr", null, [row.map((column, x) => createVNode(VDataTableHeaderCell, {
        "column": column,
        "x": x,
        "y": y
      }, null))])), props.loading && createBaseVNode("tr", {
        "class": "v-data-table-progress"
      }, [createBaseVNode("th", {
        "colspan": columns.value.length
      }, [createVNode(LoaderSlot, {
        "name": "v-data-table-progress",
        "absolute": true,
        "active": true,
        "color": typeof props.loading === "boolean" ? void 0 : props.loading,
        "indeterminate": true
      }, {
        default: slots.loader
      })])])]);
    });
  }
});
const makeDataTableGroupProps = propsFactory({
  groupBy: {
    type: Array,
    default: () => []
  }
}, "DataTable-group");
const VDataTableGroupSymbol = /* @__PURE__ */ Symbol.for("vuetify:data-table-group");
function createGroupBy(props) {
  const groupBy = useProxiedModel(props, "groupBy");
  return {
    groupBy
  };
}
function provideGroupBy(options) {
  const {
    disableSort,
    groupBy,
    sortBy
  } = options;
  const opened = ref(/* @__PURE__ */ new Set());
  const sortByWithGroups = computed(() => {
    return groupBy.value.map((val) => ({
      ...val,
      order: val.order ?? false
    })).concat(disableSort?.value ? [] : sortBy.value);
  });
  function isGroupOpen(group) {
    return opened.value.has(group.id);
  }
  function toggleGroup(group) {
    const newOpened = new Set(opened.value);
    if (!isGroupOpen(group)) newOpened.add(group.id);
    else newOpened.delete(group.id);
    opened.value = newOpened;
  }
  function extractRows(items) {
    function dive(group) {
      const arr = [];
      for (const item of group.items) {
        if ("type" in item && item.type === "group") {
          arr.push(...dive(item));
        } else {
          arr.push(item);
        }
      }
      return [...new Set(arr)];
    }
    return dive({
      items
    });
  }
  const data = {
    sortByWithGroups,
    toggleGroup,
    opened,
    groupBy,
    extractRows,
    isGroupOpen
  };
  provide(VDataTableGroupSymbol, data);
  return data;
}
function useGroupBy() {
  const data = inject(VDataTableGroupSymbol);
  if (!data) throw new Error("Missing group!");
  return data;
}
function groupItemsByProperty(items, groupBy) {
  if (!items.length) return [];
  const groups = /* @__PURE__ */ new Map();
  for (const item of items) {
    const value = getObjectValueByPath(item.raw, groupBy);
    if (!groups.has(value)) {
      groups.set(value, []);
    }
    groups.get(value).push(item);
  }
  return groups;
}
function groupItems(items, groupBy) {
  let depth = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : 0;
  let prefix = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : "root";
  if (!groupBy.length) return [];
  const groupedItems = groupItemsByProperty(items, groupBy[0]);
  const groups = [];
  const rest = groupBy.slice(1);
  groupedItems.forEach((items2, value) => {
    const key = groupBy[0];
    const id = `${prefix}_${key}_${value}`;
    groups.push({
      depth,
      id,
      key,
      value,
      items: rest.length ? groupItems(items2, rest, depth + 1, id) : items2,
      type: "group"
    });
  });
  return groups;
}
function flattenItems(items, opened, hasSummary) {
  const flatItems = [];
  for (const item of items) {
    if ("type" in item && item.type === "group") {
      if (item.value != null) {
        flatItems.push(item);
      }
      if (opened.has(item.id) || item.value == null) {
        flatItems.push(...flattenItems(item.items, opened, hasSummary));
        if (hasSummary) {
          flatItems.push({
            ...item,
            type: "group-summary"
          });
        }
      }
    } else {
      flatItems.push(item);
    }
  }
  return flatItems;
}
function useGroupedItems(items, groupBy, opened, hasSummary) {
  const flatItems = computed(() => {
    if (!groupBy.value.length) return items.value;
    const groupedItems = groupItems(items.value, groupBy.value.map((item) => item.key));
    return flattenItems(groupedItems, opened.value, toValue(hasSummary));
  });
  return {
    flatItems
  };
}
const makeVDataTableGroupHeaderRowProps = propsFactory({
  item: {
    type: Object,
    required: true
  },
  groupCollapseIcon: {
    type: IconValue,
    default: "$tableGroupCollapse"
  },
  groupExpandIcon: {
    type: IconValue,
    default: "$tableGroupExpand"
  },
  ...makeDensityProps()
}, "VDataTableGroupHeaderRow");
const VDataTableGroupHeaderRow = genericComponent()({
  name: "VDataTableGroupHeaderRow",
  props: makeVDataTableGroupHeaderRowProps(),
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    const {
      isGroupOpen,
      toggleGroup,
      extractRows
    } = useGroupBy();
    const {
      isSelected,
      isSomeSelected,
      select
    } = useSelection();
    const {
      columns
    } = useHeaders();
    const rows = computed(() => {
      return extractRows([props.item]);
    });
    const colspan = toRef(() => columns.value.length - (columns.value.some((c) => c.key === "data-table-select") ? 1 : 0));
    return () => createBaseVNode("tr", {
      "class": "v-data-table-group-header-row",
      "style": {
        "--v-data-table-group-header-row-depth": props.item.depth
      }
    }, [columns.value.map((column) => {
      if (column.key === "data-table-group") {
        const icon = isGroupOpen(props.item) ? props.groupCollapseIcon : props.groupExpandIcon;
        const onClick = () => toggleGroup(props.item);
        return slots["data-table-group"]?.({
          item: props.item,
          count: rows.value.length,
          props: {
            icon,
            onClick
          }
        }) ?? createVNode(VDataTableColumn, {
          "class": "v-data-table-group-header-row__column",
          "colspan": colspan.value
        }, {
          default: () => [createVNode(VBtn, {
            "size": "small",
            "variant": "text",
            "icon": icon,
            "onClick": onClick
          }, null), createBaseVNode("span", null, [props.item.value]), createBaseVNode("span", null, [createTextVNode("("), rows.value.length, createTextVNode(")")])]
        });
      } else if (column.key === "data-table-select") {
        const modelValue = isSelected(rows.value);
        const indeterminate = isSomeSelected(rows.value) && !modelValue;
        const selectGroup = (v) => select(rows.value, v);
        return slots["data-table-select"]?.({
          props: {
            modelValue,
            indeterminate,
            "onUpdate:modelValue": selectGroup
          }
        }) ?? createVNode(VDataTableColumn, {
          "class": "v-data-table__td--select-row",
          "noPadding": true
        }, {
          default: () => [createVNode(VCheckboxBtn, {
            "density": props.density,
            "modelValue": modelValue,
            "indeterminate": indeterminate,
            "onUpdate:modelValue": selectGroup
          }, null)]
        });
      }
      return "";
    })]);
  }
});
const makeDataTableExpandProps = propsFactory({
  expandOnClick: Boolean,
  showExpand: Boolean,
  expanded: {
    type: Array,
    default: () => []
  }
}, "DataTable-expand");
const VDataTableExpandedKey = /* @__PURE__ */ Symbol.for("vuetify:datatable:expanded");
function provideExpanded(props) {
  const expandOnClick = toRef(() => props.expandOnClick);
  const expanded = useProxiedModel(props, "expanded", props.expanded, (v) => {
    return new Set(v);
  }, (v) => {
    return [...v.values()];
  });
  function expand(item, value) {
    const newExpanded = new Set(expanded.value);
    const rawValue = toRaw(item.value);
    if (!value) {
      const item2 = [...expanded.value].find((x) => toRaw(x) === rawValue);
      newExpanded.delete(item2);
    } else {
      newExpanded.add(rawValue);
    }
    expanded.value = newExpanded;
  }
  function isExpanded(item) {
    const rawValue = toRaw(item.value);
    return [...expanded.value].some((x) => toRaw(x) === rawValue);
  }
  function toggleExpand(item) {
    expand(item, !isExpanded(item));
  }
  const data = {
    expand,
    expanded,
    expandOnClick,
    isExpanded,
    toggleExpand
  };
  provide(VDataTableExpandedKey, data);
  return data;
}
function useExpanded() {
  const data = inject(VDataTableExpandedKey);
  if (!data) throw new Error("foo");
  return data;
}
const makeVDataTableRowProps = propsFactory({
  index: Number,
  item: Object,
  cellProps: [Object, Function],
  collapseIcon: {
    type: IconValue,
    default: "$collapse"
  },
  expandIcon: {
    type: IconValue,
    default: "$expand"
  },
  onClick: EventProp(),
  onContextmenu: EventProp(),
  onDblclick: EventProp(),
  ...makeDensityProps(),
  ...makeDisplayProps()
}, "VDataTableRow");
const VDataTableRow = genericComponent()({
  name: "VDataTableRow",
  props: makeVDataTableRowProps(),
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    const {
      displayClasses,
      mobile
    } = useDisplay(props, "v-data-table__tr");
    const {
      isSelected,
      toggleSelect,
      someSelected,
      allSelected,
      selectAll
    } = useSelection();
    const {
      isExpanded,
      toggleExpand
    } = useExpanded();
    const {
      toggleSort,
      sortBy,
      isSorted
    } = useSort();
    const {
      columns
    } = useHeaders();
    useRender(() => createBaseVNode("tr", {
      "class": normalizeClass(["v-data-table__tr", {
        "v-data-table__tr--clickable": !!(props.onClick || props.onContextmenu || props.onDblclick)
      }, displayClasses.value]),
      "onClick": props.onClick,
      "onContextmenu": props.onContextmenu,
      "onDblclick": props.onDblclick
    }, [props.item && columns.value.map((column, i) => {
      const item = props.item;
      const slotName = `item.${column.key}`;
      const headerSlotName = `header.${column.key}`;
      const slotProps = {
        index: props.index,
        item: item.raw,
        internalItem: item,
        value: getObjectValueByPath(item.columns, column.key),
        column,
        isSelected,
        toggleSelect,
        isExpanded,
        toggleExpand
      };
      const columnSlotProps = {
        column,
        selectAll,
        isSorted,
        toggleSort,
        sortBy: sortBy.value,
        someSelected: someSelected.value,
        allSelected: allSelected.value,
        getSortIcon: () => ""
      };
      const cellProps = typeof props.cellProps === "function" ? props.cellProps({
        index: slotProps.index,
        item: slotProps.item,
        internalItem: slotProps.internalItem,
        value: slotProps.value,
        column
      }) : props.cellProps;
      const columnCellProps = typeof column.cellProps === "function" ? column.cellProps({
        index: slotProps.index,
        item: slotProps.item,
        internalItem: slotProps.internalItem,
        value: slotProps.value
      }) : column.cellProps;
      const noPadding = column.key === "data-table-select" || column.key === "data-table-expand";
      const isEmpty2 = column.key === "data-table-group" && column.width === 0 && !column.title;
      return createVNode(VDataTableColumn, mergeProps({
        "align": column.align,
        "indent": column.intent,
        "class": {
          "v-data-table__td--expanded-row": column.key === "data-table-expand",
          "v-data-table__td--select-row": column.key === "data-table-select"
        },
        "fixed": column.fixed,
        "fixedOffset": column.fixedOffset,
        "fixedEndOffset": column.fixedEndOffset,
        "lastFixed": column.lastFixed,
        "firstFixedEnd": column.firstFixedEnd,
        "maxWidth": !mobile.value ? column.maxWidth : void 0,
        "noPadding": noPadding,
        "empty": isEmpty2,
        "nowrap": column.nowrap,
        "width": !mobile.value ? column.width : void 0
      }, cellProps, columnCellProps), {
        default: () => {
          if (column.key === "data-table-select") {
            return slots["item.data-table-select"]?.({
              ...slotProps,
              props: {
                disabled: !item.selectable,
                modelValue: isSelected([item]),
                onClick: withModifiers(() => toggleSelect(item), ["stop"])
              }
            }) ?? createVNode(VCheckboxBtn, {
              "disabled": !item.selectable,
              "density": props.density,
              "modelValue": isSelected([item]),
              "onClick": withModifiers((event) => toggleSelect(item, props.index, event), ["stop"])
            }, null);
          }
          if (column.key === "data-table-expand") {
            return slots["item.data-table-expand"]?.({
              ...slotProps,
              props: {
                icon: isExpanded(item) ? props.collapseIcon : props.expandIcon,
                size: "small",
                variant: "text",
                onClick: withModifiers(() => toggleExpand(item), ["stop"])
              }
            }) ?? createVNode(VBtn, {
              "icon": isExpanded(item) ? props.collapseIcon : props.expandIcon,
              "size": "small",
              "variant": "text",
              "onClick": withModifiers(() => toggleExpand(item), ["stop"])
            }, null);
          }
          if (slots[slotName] && !mobile.value) return slots[slotName](slotProps);
          const displayValue = toDisplayString(slotProps.value);
          return !mobile.value ? displayValue : createBaseVNode(Fragment, null, [createBaseVNode("div", {
            "class": "v-data-table__td-title"
          }, [slots[headerSlotName]?.(columnSlotProps) ?? column.title]), createBaseVNode("div", {
            "class": "v-data-table__td-value"
          }, [slots[slotName]?.(slotProps) ?? displayValue])]);
        }
      });
    })]));
  }
});
const makeVDataTableRowsProps = propsFactory({
  loading: [Boolean, String],
  loadingText: {
    type: String,
    default: "$vuetify.dataIterator.loadingText"
  },
  hideNoData: Boolean,
  items: {
    type: Array,
    default: () => []
  },
  noDataText: {
    type: String,
    default: "$vuetify.noDataText"
  },
  rowProps: [Object, Function],
  cellProps: [Object, Function],
  ...pick(makeVDataTableRowProps(), ["collapseIcon", "expandIcon", "density"]),
  ...pick(makeVDataTableGroupHeaderRowProps(), ["groupCollapseIcon", "groupExpandIcon", "density"]),
  ...makeDisplayProps()
}, "VDataTableRows");
const VDataTableRows = genericComponent()({
  name: "VDataTableRows",
  inheritAttrs: false,
  props: makeVDataTableRowsProps(),
  setup(props, _ref) {
    let {
      attrs,
      slots
    } = _ref;
    const {
      columns
    } = useHeaders();
    const {
      expandOnClick,
      toggleExpand,
      isExpanded
    } = useExpanded();
    const {
      isSelected,
      toggleSelect
    } = useSelection();
    const {
      toggleGroup,
      isGroupOpen
    } = useGroupBy();
    const {
      t
    } = useLocale();
    const {
      mobile
    } = useDisplay(props);
    useRender(() => {
      const groupHeaderRowProps = pick(props, ["groupCollapseIcon", "groupExpandIcon", "density"]);
      if (props.loading && (!props.items.length || slots.loading)) {
        return createBaseVNode("tr", {
          "class": "v-data-table-rows-loading",
          "key": "loading"
        }, [createBaseVNode("td", {
          "colspan": columns.value.length
        }, [slots.loading?.() ?? t(props.loadingText)])]);
      }
      if (!props.loading && !props.items.length && !props.hideNoData) {
        return createBaseVNode("tr", {
          "class": "v-data-table-rows-no-data",
          "key": "no-data"
        }, [createBaseVNode("td", {
          "colspan": columns.value.length
        }, [slots["no-data"]?.() ?? t(props.noDataText)])]);
      }
      return createBaseVNode(Fragment, null, [props.items.map((item, index) => {
        if (item.type === "group") {
          const slotProps2 = {
            index,
            item,
            columns: columns.value,
            isExpanded,
            toggleExpand,
            isSelected,
            toggleSelect,
            toggleGroup,
            isGroupOpen
          };
          return slots["group-header"] ? slots["group-header"](slotProps2) : createVNode(VDataTableGroupHeaderRow, mergeProps({
            "key": `group-header_${item.id}`,
            "item": item
          }, getPrefixedEventHandlers(attrs, ":groupHeader", () => slotProps2), groupHeaderRowProps), slots);
        }
        if (item.type === "group-summary") {
          const slotProps2 = {
            index,
            item,
            columns: columns.value,
            toggleGroup
          };
          return slots["group-summary"]?.(slotProps2) ?? "";
        }
        const slotProps = {
          index,
          item: item.raw,
          internalItem: item,
          columns: columns.value,
          isExpanded,
          toggleExpand,
          isSelected,
          toggleSelect
        };
        const itemSlotProps = {
          ...slotProps,
          props: mergeProps({
            key: `item_${item.key ?? item.index}`,
            onClick: expandOnClick.value ? () => {
              toggleExpand(item);
            } : void 0,
            index,
            item,
            cellProps: props.cellProps,
            collapseIcon: props.collapseIcon,
            expandIcon: props.expandIcon,
            density: props.density,
            mobile: mobile.value
          }, getPrefixedEventHandlers(attrs, ":row", () => slotProps), typeof props.rowProps === "function" ? props.rowProps({
            item: slotProps.item,
            index: slotProps.index,
            internalItem: slotProps.internalItem
          }) : props.rowProps)
        };
        return createBaseVNode(Fragment, {
          "key": itemSlotProps.props.key
        }, [slots.item ? slots.item(itemSlotProps) : createVNode(VDataTableRow, itemSlotProps.props, slots), isExpanded(item) && slots["expanded-row"]?.(slotProps)]);
      })]);
    });
    return {};
  }
});
const makeVTableProps = propsFactory({
  fixedHeader: Boolean,
  fixedFooter: Boolean,
  height: [Number, String],
  hover: Boolean,
  striped: {
    type: String,
    default: null,
    validator: (v) => ["even", "odd"].includes(v)
  },
  ...makeComponentProps(),
  ...makeDensityProps(),
  ...makeTagProps(),
  ...makeThemeProps()
}, "VTable");
const VTable = genericComponent()({
  name: "VTable",
  props: makeVTableProps(),
  setup(props, _ref) {
    let {
      slots,
      emit
    } = _ref;
    const {
      themeClasses
    } = provideTheme(props);
    const {
      densityClasses
    } = useDensity(props);
    useRender(() => createVNode(props.tag, {
      "class": normalizeClass(["v-table", {
        "v-table--fixed-height": !!props.height,
        "v-table--fixed-header": props.fixedHeader,
        "v-table--fixed-footer": props.fixedFooter,
        "v-table--has-top": !!slots.top,
        "v-table--has-bottom": !!slots.bottom,
        "v-table--hover": props.hover,
        "v-table--striped-even": props.striped === "even",
        "v-table--striped-odd": props.striped === "odd"
      }, themeClasses.value, densityClasses.value, props.class]),
      "style": normalizeStyle(props.style)
    }, {
      default: () => [slots.top?.(), slots.default ? createBaseVNode("div", {
        "class": "v-table__wrapper",
        "style": {
          height: convertToUnit(props.height)
        }
      }, [createBaseVNode("table", null, [slots.default()])]) : slots.wrapper?.(), slots.bottom?.()]
    }));
    return {};
  }
});
const makeDataTableItemsProps = propsFactory({
  items: {
    type: Array,
    default: () => []
  },
  itemValue: {
    type: [String, Array, Function],
    default: "id"
  },
  itemSelectable: {
    type: [String, Array, Function],
    default: null
  },
  rowProps: [Object, Function],
  cellProps: [Object, Function],
  returnObject: Boolean
}, "DataTable-items");
function transformItem(props, item, index, columns) {
  const value = props.returnObject ? item : getPropertyFromItem(item, props.itemValue);
  const selectable = getPropertyFromItem(item, props.itemSelectable, true);
  const itemColumns = columns.reduce((obj, column) => {
    if (column.key != null) obj[column.key] = getPropertyFromItem(item, column.value);
    return obj;
  }, {});
  return {
    type: "item",
    key: props.returnObject ? getPropertyFromItem(item, props.itemValue) : value,
    index,
    value,
    selectable,
    columns: itemColumns,
    raw: item
  };
}
function transformItems(props, items, columns) {
  return items.map((item, index) => transformItem(props, item, index, columns));
}
function useDataTableItems(props, columns) {
  const items = computed(() => transformItems(props, props.items, columns.value));
  return {
    items
  };
}
function useOptions(_ref) {
  let {
    page,
    itemsPerPage: itemsPerPage2,
    sortBy,
    groupBy,
    search
  } = _ref;
  const vm = getCurrentInstance("VDataTable");
  const options = () => ({
    page: page.value,
    itemsPerPage: itemsPerPage2.value,
    sortBy: sortBy.value,
    groupBy: groupBy.value,
    search: search.value
  });
  let oldOptions = null;
  watch(options, (value) => {
    if (deepEqual(oldOptions, value)) return;
    if (oldOptions && oldOptions.search !== value.search) {
      page.value = 1;
    }
    vm.emit("update:options", value);
    oldOptions = value;
  }, {
    deep: true,
    immediate: true
  });
}
const defaultFilter = (value, query, item) => {
  if (value == null || query == null) return -1;
  if (!query.length) return 0;
  value = value.toString().toLocaleLowerCase();
  query = query.toString().toLocaleLowerCase();
  const result = [];
  let idx = value.indexOf(query);
  while (~idx) {
    result.push([idx, idx + query.length]);
    idx = value.indexOf(query, idx + query.length);
  }
  return result.length ? result : -1;
};
function normaliseMatch(match, query) {
  if (match == null || typeof match === "boolean" || match === -1) return;
  if (typeof match === "number") return [[match, match + query.length]];
  if (Array.isArray(match[0])) return match;
  return [match];
}
const makeFilterProps = propsFactory({
  customFilter: Function,
  customKeyFilter: Object,
  filterKeys: [Array, String],
  filterMode: {
    type: String,
    default: "intersection"
  },
  noFilter: Boolean
}, "filter");
function filterItems(items, query, options) {
  const array = [];
  const filter = options?.default ?? defaultFilter;
  const keys = options?.filterKeys ? wrapInArray(options.filterKeys) : false;
  const customFiltersLength = Object.keys(options?.customKeyFilter ?? {}).length;
  if (!items?.length) return array;
  let lookAheadItem = null;
  loop: for (let i = 0; i < items.length; i++) {
    const [item, transformed = item] = wrapInArray(items[i]);
    const customMatches = {};
    const defaultMatches = {};
    let match = -1;
    if ((query || customFiltersLength > 0) && !options?.noFilter) {
      let hasOnlyCustomFilters = false;
      if (typeof item === "object") {
        if (item.type === "divider" || item.type === "subheader") {
          if (lookAheadItem?.type === "divider" && item.type === "subheader") {
            array.push(lookAheadItem);
          }
          lookAheadItem = {
            index: i,
            matches: {},
            type: item.type
          };
          continue;
        }
        const filterKeys = keys || Object.keys(transformed);
        hasOnlyCustomFilters = filterKeys.length === customFiltersLength;
        for (const key of filterKeys) {
          const value = getPropertyFromItem(transformed, key);
          const keyFilter = options?.customKeyFilter?.[key];
          match = keyFilter ? keyFilter(value, query, item) : filter(value, query, item);
          if (match !== -1 && match !== false) {
            if (keyFilter) customMatches[key] = normaliseMatch(match, query);
            else defaultMatches[key] = normaliseMatch(match, query);
          } else if (options?.filterMode === "every") {
            continue loop;
          }
        }
      } else {
        match = filter(item, query, item);
        if (match !== -1 && match !== false) {
          defaultMatches.title = normaliseMatch(match, query);
        }
      }
      const defaultMatchesLength = Object.keys(defaultMatches).length;
      const customMatchesLength = Object.keys(customMatches).length;
      if (!defaultMatchesLength && !customMatchesLength) continue;
      if (options?.filterMode === "union" && customMatchesLength !== customFiltersLength && !defaultMatchesLength) continue;
      if (options?.filterMode === "intersection" && (customMatchesLength !== customFiltersLength || !defaultMatchesLength && customFiltersLength > 0 && !hasOnlyCustomFilters)) continue;
    }
    if (lookAheadItem) {
      array.push(lookAheadItem);
      lookAheadItem = null;
    }
    array.push({
      index: i,
      matches: {
        ...defaultMatches,
        ...customMatches
      }
    });
  }
  return array;
}
function useFilter(props, items, query, options) {
  const filteredItems = shallowRef([]);
  const filteredMatches = shallowRef(/* @__PURE__ */ new Map());
  const transformedItems = computed(() => options?.transform ? unref(items).map((item) => [item, options.transform(item)]) : unref(items));
  watchEffect(() => {
    const _query = typeof query === "function" ? query() : unref(query);
    const strQuery = typeof _query !== "string" && typeof _query !== "number" ? "" : String(_query);
    const results = filterItems(transformedItems.value, strQuery, {
      customKeyFilter: {
        ...props.customKeyFilter,
        ...unref(options?.customKeyFilter)
      },
      default: props.customFilter,
      filterKeys: props.filterKeys,
      filterMode: props.filterMode,
      noFilter: props.noFilter
    });
    const originalItems = unref(items);
    const _filteredItems = [];
    const _filteredMatches = /* @__PURE__ */ new Map();
    results.forEach((_ref) => {
      let {
        index,
        matches
      } = _ref;
      const item = originalItems[index];
      _filteredItems.push(item);
      _filteredMatches.set(item.value, matches);
    });
    filteredItems.value = _filteredItems;
    filteredMatches.value = _filteredMatches;
  });
  function getMatches(item) {
    return filteredMatches.value.get(item.value);
  }
  return {
    filteredItems,
    filteredMatches,
    getMatches
  };
}
function highlightResult(name, text, matches) {
  if (matches == null || !matches.length) return text;
  return matches.map((match, i) => {
    const start = i === 0 ? 0 : matches[i - 1][1];
    const result = [createBaseVNode("span", {
      "class": normalizeClass(`${name}__unmask`)
    }, [text.slice(start, match[0])]), createBaseVNode("span", {
      "class": normalizeClass(`${name}__mask`)
    }, [text.slice(match[0], match[1])])];
    if (i === matches.length - 1) {
      result.push(createBaseVNode("span", {
        "class": normalizeClass(`${name}__unmask`)
      }, [text.slice(match[1])]));
    }
    return createBaseVNode(Fragment, null, [result]);
  });
}
const makeDataTableProps = propsFactory({
  ...makeVDataTableRowsProps(),
  hideDefaultBody: Boolean,
  hideDefaultFooter: Boolean,
  hideDefaultHeader: Boolean,
  width: [String, Number],
  search: String,
  ...makeDataTableExpandProps(),
  ...makeDataTableGroupProps(),
  ...makeDataTableHeaderProps(),
  ...makeDataTableItemsProps(),
  ...makeDataTableSelectProps(),
  ...makeDataTableSortProps(),
  ...makeVDataTableHeadersProps(),
  ...makeVTableProps()
}, "DataTable");
const makeVDataTableProps = propsFactory({
  ...makeDataTablePaginateProps(),
  ...makeDataTableProps(),
  ...makeFilterProps(),
  ...makeVDataTableFooterProps()
}, "VDataTable");
const VDataTable = genericComponent()({
  name: "VDataTable",
  props: makeVDataTableProps(),
  emits: {
    "update:modelValue": (value) => true,
    "update:page": (value) => true,
    "update:itemsPerPage": (value) => true,
    "update:sortBy": (value) => true,
    "update:options": (value) => true,
    "update:groupBy": (value) => true,
    "update:expanded": (value) => true,
    "update:currentItems": (value) => true
  },
  setup(props, _ref) {
    let {
      attrs,
      slots
    } = _ref;
    const {
      groupBy
    } = createGroupBy(props);
    const {
      sortBy,
      multiSort,
      mustSort
    } = createSort(props);
    const {
      page,
      itemsPerPage: itemsPerPage2
    } = createPagination(props);
    const {
      disableSort
    } = toRefs(props);
    const {
      columns,
      headers,
      sortFunctions,
      sortRawFunctions,
      filterFunctions
    } = createHeaders(props, {
      groupBy,
      showSelect: toRef(() => props.showSelect),
      showExpand: toRef(() => props.showExpand)
    });
    const {
      items
    } = useDataTableItems(props, columns);
    const search = toRef(() => props.search);
    const {
      filteredItems
    } = useFilter(props, items, search, {
      transform: (item) => item.columns,
      customKeyFilter: filterFunctions
    });
    const {
      toggleSort
    } = provideSort({
      sortBy,
      multiSort,
      mustSort,
      page
    });
    const {
      sortByWithGroups,
      opened,
      extractRows,
      isGroupOpen,
      toggleGroup
    } = provideGroupBy({
      groupBy,
      sortBy,
      disableSort
    });
    const {
      sortedItems
    } = useSortedItems(props, filteredItems, sortByWithGroups, {
      transform: (item) => ({
        ...item.raw,
        ...item.columns
      }),
      sortFunctions,
      sortRawFunctions
    });
    const {
      flatItems
    } = useGroupedItems(sortedItems, groupBy, opened, () => !!slots["group-summary"]);
    const itemsLength = computed(() => flatItems.value.length);
    const {
      startIndex,
      stopIndex,
      pageCount,
      setItemsPerPage
    } = providePagination({
      page,
      itemsPerPage: itemsPerPage2,
      itemsLength
    });
    const {
      paginatedItems
    } = usePaginatedItems({
      items: flatItems,
      startIndex,
      stopIndex,
      itemsPerPage: itemsPerPage2
    });
    const paginatedItemsWithoutGroups = computed(() => extractRows(paginatedItems.value));
    const {
      isSelected,
      select,
      selectAll,
      toggleSelect,
      someSelected,
      allSelected
    } = provideSelection(props, {
      allItems: items,
      currentPage: paginatedItemsWithoutGroups
    });
    const {
      isExpanded,
      toggleExpand
    } = provideExpanded(props);
    useOptions({
      page,
      itemsPerPage: itemsPerPage2,
      sortBy,
      groupBy,
      search
    });
    provideDefaults({
      VDataTableRows: {
        hideNoData: toRef(() => props.hideNoData),
        noDataText: toRef(() => props.noDataText),
        loading: toRef(() => props.loading),
        loadingText: toRef(() => props.loadingText)
      }
    });
    const slotProps = computed(() => ({
      page: page.value,
      itemsPerPage: itemsPerPage2.value,
      sortBy: sortBy.value,
      pageCount: pageCount.value,
      toggleSort,
      setItemsPerPage,
      someSelected: someSelected.value,
      allSelected: allSelected.value,
      isSelected,
      select,
      selectAll,
      toggleSelect,
      isExpanded,
      toggleExpand,
      isGroupOpen,
      toggleGroup,
      items: paginatedItemsWithoutGroups.value.map((item) => item.raw),
      internalItems: paginatedItemsWithoutGroups.value,
      groupedItems: paginatedItems.value,
      columns: columns.value,
      headers: headers.value
    }));
    useRender(() => {
      const dataTableFooterProps = VDataTableFooter.filterProps(props);
      const dataTableHeadersProps = VDataTableHeaders.filterProps(props);
      const dataTableRowsProps = VDataTableRows.filterProps(props);
      const tableProps = VTable.filterProps(props);
      return createVNode(VTable, mergeProps({
        "class": ["v-data-table", {
          "v-data-table--show-select": props.showSelect,
          "v-data-table--loading": props.loading
        }, props.class],
        "style": props.style
      }, tableProps, {
        "fixedHeader": props.fixedHeader || props.sticky
      }), {
        top: () => slots.top?.(slotProps.value),
        default: () => slots.default ? slots.default(slotProps.value) : createBaseVNode(Fragment, null, [slots.colgroup?.(slotProps.value), !props.hideDefaultHeader && createBaseVNode("thead", {
          "key": "thead"
        }, [createVNode(VDataTableHeaders, dataTableHeadersProps, slots)]), slots.thead?.(slotProps.value), !props.hideDefaultBody && createBaseVNode("tbody", null, [slots["body.prepend"]?.(slotProps.value), slots.body ? slots.body(slotProps.value) : createVNode(VDataTableRows, mergeProps(attrs, dataTableRowsProps, {
          "items": paginatedItems.value
        }), slots), slots["body.append"]?.(slotProps.value)]), slots.tbody?.(slotProps.value), slots.tfoot?.(slotProps.value)]),
        bottom: () => slots.bottom ? slots.bottom(slotProps.value) : !props.hideDefaultFooter && createBaseVNode(Fragment, null, [createVNode(VDivider, null, null), createVNode(VDataTableFooter, dataTableFooterProps, {
          prepend: slots["footer.prepend"]
        })])
      });
    });
    return {};
  }
});
const makeVDataTableServerProps = propsFactory({
  itemsLength: {
    type: [Number, String],
    required: true
  },
  ...makeDataTablePaginateProps(),
  ...makeDataTableProps(),
  ...makeVDataTableFooterProps()
}, "VDataTableServer");
const VDataTableServer = genericComponent()({
  name: "VDataTableServer",
  props: makeVDataTableServerProps(),
  emits: {
    "update:modelValue": (value) => true,
    "update:page": (page) => true,
    "update:itemsPerPage": (page) => true,
    "update:sortBy": (sortBy) => true,
    "update:options": (options) => true,
    "update:expanded": (options) => true,
    "update:groupBy": (value) => true
  },
  setup(props, _ref) {
    let {
      attrs,
      slots
    } = _ref;
    const {
      groupBy
    } = createGroupBy(props);
    const {
      sortBy,
      multiSort,
      mustSort
    } = createSort(props);
    const {
      page,
      itemsPerPage: itemsPerPage2
    } = createPagination(props);
    const {
      disableSort
    } = toRefs(props);
    const itemsLength = computed(() => parseInt(props.itemsLength, 10));
    const {
      columns,
      headers
    } = createHeaders(props, {
      groupBy,
      showSelect: toRef(() => props.showSelect),
      showExpand: toRef(() => props.showExpand)
    });
    const {
      items
    } = useDataTableItems(props, columns);
    const {
      toggleSort
    } = provideSort({
      sortBy,
      multiSort,
      mustSort,
      page
    });
    const {
      opened,
      isGroupOpen,
      toggleGroup,
      extractRows
    } = provideGroupBy({
      groupBy,
      sortBy,
      disableSort
    });
    const {
      pageCount,
      setItemsPerPage
    } = providePagination({
      page,
      itemsPerPage: itemsPerPage2,
      itemsLength
    });
    const {
      flatItems
    } = useGroupedItems(items, groupBy, opened, () => !!slots["group-summary"]);
    const {
      isSelected,
      select,
      selectAll,
      toggleSelect,
      someSelected,
      allSelected
    } = provideSelection(props, {
      allItems: items,
      currentPage: items
    });
    const {
      isExpanded,
      toggleExpand
    } = provideExpanded(props);
    const itemsWithoutGroups = computed(() => extractRows(items.value));
    useOptions({
      page,
      itemsPerPage: itemsPerPage2,
      sortBy,
      groupBy,
      search: toRef(() => props.search)
    });
    provide("v-data-table", {
      toggleSort,
      sortBy
    });
    provideDefaults({
      VDataTableRows: {
        hideNoData: toRef(() => props.hideNoData),
        noDataText: toRef(() => props.noDataText),
        loading: toRef(() => props.loading),
        loadingText: toRef(() => props.loadingText)
      }
    });
    const slotProps = computed(() => ({
      page: page.value,
      itemsPerPage: itemsPerPage2.value,
      sortBy: sortBy.value,
      pageCount: pageCount.value,
      toggleSort,
      setItemsPerPage,
      someSelected: someSelected.value,
      allSelected: allSelected.value,
      isSelected,
      select,
      selectAll,
      toggleSelect,
      isExpanded,
      toggleExpand,
      isGroupOpen,
      toggleGroup,
      items: itemsWithoutGroups.value.map((item) => item.raw),
      internalItems: itemsWithoutGroups.value,
      groupedItems: flatItems.value,
      columns: columns.value,
      headers: headers.value
    }));
    useRender(() => {
      const dataTableFooterProps = VDataTableFooter.filterProps(props);
      const dataTableHeadersProps = VDataTableHeaders.filterProps(props);
      const dataTableRowsProps = VDataTableRows.filterProps(props);
      const tableProps = VTable.filterProps(props);
      return createVNode(VTable, mergeProps({
        "class": ["v-data-table", {
          "v-data-table--loading": props.loading
        }, props.class],
        "style": props.style
      }, tableProps, {
        "fixedHeader": props.fixedHeader || props.sticky
      }), {
        top: () => slots.top?.(slotProps.value),
        default: () => slots.default ? slots.default(slotProps.value) : createBaseVNode(Fragment, null, [slots.colgroup?.(slotProps.value), !props.hideDefaultHeader && createBaseVNode("thead", {
          "key": "thead",
          "class": "v-data-table__thead",
          "role": "rowgroup"
        }, [createVNode(VDataTableHeaders, dataTableHeadersProps, slots)]), slots.thead?.(slotProps.value), !props.hideDefaultBody && createBaseVNode("tbody", {
          "class": "v-data-table__tbody",
          "role": "rowgroup"
        }, [slots["body.prepend"]?.(slotProps.value), slots.body ? slots.body(slotProps.value) : createVNode(VDataTableRows, mergeProps(attrs, dataTableRowsProps, {
          "items": flatItems.value
        }), slots), slots["body.append"]?.(slotProps.value)]), slots.tbody?.(slotProps.value), slots.tfoot?.(slotProps.value)]),
        bottom: () => slots.bottom ? slots.bottom(slotProps.value) : !props.hideDefaultFooter && createBaseVNode(Fragment, null, [createVNode(VDivider, null, null), createVNode(VDataTableFooter, dataTableFooterProps, {
          prepend: slots["footer.prepend"]
        })])
      });
    });
  }
});
const makeVTextareaProps = propsFactory({
  autoGrow: Boolean,
  autofocus: Boolean,
  counter: [Boolean, Number, String],
  counterValue: Function,
  prefix: String,
  placeholder: String,
  persistentPlaceholder: Boolean,
  persistentCounter: Boolean,
  noResize: Boolean,
  rows: {
    type: [Number, String],
    default: 5,
    validator: (v) => !isNaN(parseFloat(v))
  },
  maxRows: {
    type: [Number, String],
    validator: (v) => !isNaN(parseFloat(v))
  },
  suffix: String,
  modelModifiers: Object,
  ...makeAutocompleteProps(),
  ...makeVInputProps(),
  ...makeVFieldProps()
}, "VTextarea");
const VTextarea = genericComponent()({
  name: "VTextarea",
  directives: {
    vIntersect: Intersect
  },
  inheritAttrs: false,
  props: makeVTextareaProps(),
  emits: {
    "click:control": (e) => true,
    "mousedown:control": (e) => true,
    "update:focused": (focused) => true,
    "update:modelValue": (val) => true,
    "update:rows": (rows) => true
  },
  setup(props, _ref) {
    let {
      attrs,
      emit,
      slots
    } = _ref;
    const model = useProxiedModel(props, "modelValue");
    const {
      isFocused,
      focus,
      blur
    } = useFocus(props);
    const {
      onIntersect
    } = useAutofocus(props);
    const counterValue = computed(() => {
      return typeof props.counterValue === "function" ? props.counterValue(model.value) : (model.value || "").toString().length;
    });
    const max = computed(() => {
      if (attrs.maxlength) return attrs.maxlength;
      if (!props.counter || typeof props.counter !== "number" && typeof props.counter !== "string") return void 0;
      return props.counter;
    });
    const vInputRef = ref();
    const vFieldRef = ref();
    const controlHeight = shallowRef("");
    const textareaRef = ref();
    const scrollbarWidth = ref(0);
    const {
      platform
    } = useDisplay();
    const autocomplete = useAutocomplete(props);
    const isActive = computed(() => props.persistentPlaceholder || isFocused.value || props.active);
    function onFocus() {
      if (autocomplete.isSuppressing.value) {
        autocomplete.update();
      }
      if (textareaRef.value !== document.activeElement) {
        textareaRef.value?.focus();
      }
      if (!isFocused.value) focus();
    }
    function onControlClick(e) {
      onFocus();
      emit("click:control", e);
    }
    function onControlMousedown(e) {
      emit("mousedown:control", e);
    }
    function onClear(e) {
      e.stopPropagation();
      onFocus();
      nextTick(() => {
        model.value = "";
        callEvent(props["onClick:clear"], e);
      });
    }
    function onInput(e) {
      const el = e.target;
      model.value = el.value;
      if (props.modelModifiers?.trim) {
        const caretPosition = [el.selectionStart, el.selectionEnd];
        nextTick(() => {
          el.selectionStart = caretPosition[0];
          el.selectionEnd = caretPosition[1];
        });
      }
    }
    const sizerRef = ref();
    const rows = ref(Number(props.rows));
    const isPlainOrUnderlined = computed(() => ["plain", "underlined"].includes(props.variant));
    watchEffect(() => {
      if (!props.autoGrow) rows.value = Number(props.rows);
    });
    function calculateInputHeight() {
      nextTick(() => {
        if (!textareaRef.value) return;
        if (platform.value.firefox) {
          scrollbarWidth.value = 12;
          return;
        }
        const {
          offsetWidth,
          clientWidth
        } = textareaRef.value;
        scrollbarWidth.value = Math.max(0, offsetWidth - clientWidth);
      });
      if (!props.autoGrow) return;
      nextTick(() => {
        if (!sizerRef.value || !vFieldRef.value) return;
        const style = getComputedStyle(sizerRef.value);
        const fieldStyle = getComputedStyle(vFieldRef.value.$el);
        const padding = parseFloat(style.getPropertyValue("--v-field-padding-top")) + parseFloat(style.getPropertyValue("--v-input-padding-top")) + parseFloat(style.getPropertyValue("--v-field-padding-bottom"));
        const height = sizerRef.value.scrollHeight;
        const lineHeight = parseFloat(style.lineHeight);
        const minHeight = Math.max(parseFloat(props.rows) * lineHeight + padding, parseFloat(fieldStyle.getPropertyValue("--v-input-control-height")));
        const maxHeight = parseFloat(props.maxRows) * lineHeight + padding || Infinity;
        const newHeight = clamp(height ?? 0, minHeight, maxHeight);
        rows.value = Math.floor((newHeight - padding) / lineHeight);
        controlHeight.value = convertToUnit(newHeight);
      });
    }
    onMounted(calculateInputHeight);
    watch(model, calculateInputHeight);
    watch(() => props.rows, calculateInputHeight);
    watch(() => props.maxRows, calculateInputHeight);
    watch(() => props.density, calculateInputHeight);
    watch(rows, (val) => {
      emit("update:rows", val);
    });
    let observer;
    watch(sizerRef, (val) => {
      if (val) {
        observer = new ResizeObserver(calculateInputHeight);
        observer.observe(sizerRef.value);
      } else {
        observer?.disconnect();
      }
    });
    onBeforeUnmount(() => {
      observer?.disconnect();
    });
    useRender(() => {
      const hasCounter = !!(slots.counter || props.counter || props.counterValue);
      const hasDetails = !!(hasCounter || slots.details);
      const [rootAttrs, inputAttrs] = filterInputAttrs(attrs);
      const {
        modelValue: _,
        ...inputProps
      } = VInput.filterProps(props);
      const fieldProps = {
        ...VField.filterProps(props),
        "onClick:clear": onClear
      };
      return createVNode(VInput, mergeProps({
        "ref": vInputRef,
        "modelValue": model.value,
        "onUpdate:modelValue": ($event) => model.value = $event,
        "class": ["v-textarea v-text-field", {
          "v-textarea--prefixed": props.prefix,
          "v-textarea--suffixed": props.suffix,
          "v-text-field--prefixed": props.prefix,
          "v-text-field--suffixed": props.suffix,
          "v-textarea--auto-grow": props.autoGrow,
          "v-textarea--no-resize": props.noResize || props.autoGrow,
          "v-input--plain-underlined": isPlainOrUnderlined.value
        }, props.class],
        "style": [{
          "--v-textarea-scroll-bar-width": convertToUnit(scrollbarWidth.value)
        }, props.style]
      }, rootAttrs, inputProps, {
        "centerAffix": rows.value === 1 && !isPlainOrUnderlined.value,
        "focused": isFocused.value
      }), {
        ...slots,
        default: (_ref2) => {
          let {
            id,
            isDisabled,
            isDirty,
            isReadonly,
            isValid,
            hasDetails: hasDetails2
          } = _ref2;
          return createVNode(VField, mergeProps({
            "ref": vFieldRef,
            "style": {
              "--v-textarea-control-height": controlHeight.value
            },
            "onClick": onControlClick,
            "onMousedown": onControlMousedown,
            "onClick:prependInner": props["onClick:prependInner"],
            "onClick:appendInner": props["onClick:appendInner"]
          }, fieldProps, {
            "id": id.value,
            "active": isActive.value || isDirty.value,
            "centerAffix": rows.value === 1 && !isPlainOrUnderlined.value,
            "dirty": isDirty.value || props.dirty,
            "disabled": isDisabled.value,
            "focused": isFocused.value,
            "details": hasDetails2.value,
            "error": isValid.value === false
          }), {
            ...slots,
            default: (_ref3) => {
              let {
                props: {
                  class: fieldClass,
                  ...slotProps
                },
                controlRef
              } = _ref3;
              return createBaseVNode(Fragment, null, [props.prefix && createBaseVNode("span", {
                "class": "v-text-field__prefix"
              }, [props.prefix]), withDirectives(createBaseVNode("textarea", mergeProps({
                "ref": (val) => textareaRef.value = controlRef.value = val,
                "class": fieldClass,
                "value": model.value,
                "onInput": onInput,
                "autofocus": props.autofocus,
                "readonly": isReadonly.value,
                "disabled": isDisabled.value,
                "placeholder": props.placeholder,
                "rows": props.rows,
                "name": autocomplete.fieldName.value,
                "autocomplete": autocomplete.fieldAutocomplete.value,
                "onFocus": onFocus,
                "onBlur": blur
              }, slotProps, inputAttrs), null), [[Intersect, {
                handler: onIntersect
              }, null, {
                once: true
              }]]), props.autoGrow && withDirectives(createBaseVNode("textarea", {
                "class": normalizeClass([fieldClass, "v-textarea__sizer"]),
                "id": `${slotProps.id}-sizer`,
                "onUpdate:modelValue": ($event) => model.value = $event,
                "ref": sizerRef,
                "readonly": true,
                "aria-hidden": "true"
              }, null), [[vModelText, model.value]]), props.suffix && createBaseVNode("span", {
                "class": "v-text-field__suffix"
              }, [props.suffix])]);
            }
          });
        },
        details: hasDetails ? (slotProps) => createBaseVNode(Fragment, null, [slots.details?.(slotProps), hasCounter && createBaseVNode(Fragment, null, [createBaseVNode("span", null, null), createVNode(VCounter, {
          "active": props.persistentCounter || isFocused.value,
          "value": counterValue.value,
          "max": max.value,
          "disabled": props.disabled
        }, slots.counter)])]) : void 0
      });
    });
    return forwardRefs({}, vInputRef, vFieldRef, textareaRef);
  }
});
const makeVTooltipProps = propsFactory({
  id: String,
  interactive: Boolean,
  text: String,
  ...omit(makeVOverlayProps({
    closeOnBack: false,
    location: "end",
    locationStrategy: "connected",
    eager: true,
    minWidth: 0,
    offset: 10,
    openOnClick: false,
    openOnHover: true,
    origin: "auto",
    scrim: false,
    scrollStrategy: "reposition",
    transition: null
  }), ["absolute", "persistent"])
}, "VTooltip");
const VTooltip = genericComponent()({
  name: "VTooltip",
  props: makeVTooltipProps(),
  emits: {
    "update:modelValue": (value) => true
  },
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    const isActive = useProxiedModel(props, "modelValue");
    const {
      scopeId
    } = useScopeId();
    const uid = useId();
    const id = toRef(() => props.id || `v-tooltip-${uid}`);
    const overlay = ref();
    const location = computed(() => {
      return props.location.split(" ").length > 1 ? props.location : props.location + " center";
    });
    const origin = computed(() => {
      return props.origin === "auto" || props.origin === "overlap" || props.origin.split(" ").length > 1 || props.location.split(" ").length > 1 ? props.origin : props.origin + " center";
    });
    const transition = toRef(() => {
      if (props.transition != null) return props.transition;
      return isActive.value ? "scale-transition" : "fade-transition";
    });
    const activatorProps = computed(() => mergeProps({
      "aria-describedby": id.value
    }, props.activatorProps));
    useRender(() => {
      const overlayProps = VOverlay.filterProps(props);
      return createVNode(VOverlay, mergeProps({
        "ref": overlay,
        "class": ["v-tooltip", {
          "v-tooltip--interactive": props.interactive
        }, props.class],
        "style": props.style,
        "id": id.value
      }, overlayProps, {
        "modelValue": isActive.value,
        "onUpdate:modelValue": ($event) => isActive.value = $event,
        "transition": transition.value,
        "absolute": true,
        "location": location.value,
        "origin": origin.value,
        "persistent": true,
        "role": "tooltip",
        "activatorProps": activatorProps.value,
        "_disableGlobalStack": true
      }, scopeId), {
        activator: slots.activator,
        default: function() {
          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }
          return slots.default?.(...args) ?? props.text;
        }
      });
    });
    return forwardRefs({}, overlay);
  }
});
const _hoisted_1$1 = { style: { "width": "100%", "overflow-x": "auto", "position": "relative" } };
const _hoisted_2$1 = { class: "text-center" };
const _hoisted_3$1 = { class: "text-body-1 mt-3 text-white font-weight-medium" };
const _hoisted_4$1 = { class: "pa-8 text-center" };
const _hoisted_5$1 = { key: 0 };
const _hoisted_6$1 = ["onDblclick"];
const _sfc_main$3 = {
  __name: "TabelaProcessos",
  props: {
    items: { type: Array, default: () => [] },
    totalItems: { type: Number, default: 0 },
    loading: { type: Boolean, default: false },
    selected: { type: Array, default: () => [] },
    actionLoading: { type: Boolean, default: false },
    actionLoadingText: { type: String, default: "Processando..." }
  },
  emits: [
    "salvar-obs",
    "marcar-cumprido",
    "update:selected",
    "update:options"
    // NOVO: Evento de paginação/ordenação
  ],
  setup(__props, { emit: __emit }) {
    const authStore = useAuthStore();
    const props = __props;
    const emit = __emit;
    const dialogObs = ref(false);
    const itemEdicao = ref({ id: null, observacoes: "" });
    const headers = computed(() => {
      const base = [
        { title: "Nº Processo", key: "numero_processo", width: "180px" },
        { title: "Fonte", key: "fonte", width: "90px", align: "center" },
        { title: "Atribuído", key: "user", width: "100px" },
        { title: "Classe", key: "classe_principal", width: "120px" },
        { title: "Assunto", key: "assunto_principal", width: "140px" },
        { title: "Tarjas", key: "tarjas", width: "120px" },
        { title: "Prazo", key: "prazoRestanteNum", width: "120px" },
        { title: "Reit.", key: "reiteracoes", width: "70px", align: "center" },
        { title: "Observações", key: "observacoes", width: "165px", sortable: false },
        { title: "Cumprir", key: "acaoCumprido", width: "70px", align: "center", sortable: false }
      ];
      if (authStore.isSuper) {
        base.splice(3, 0, { title: "Unidade", key: "Unidade.nome", width: "160px", sortable: false });
      }
      return base;
    });
    function formatarDataHora(dataISO) {
      if (!dataISO) return "";
      try {
        return format(parseISO(dataISO), "dd/MM/yyyy HH:mm");
      } catch {
        return "Data inválida";
      }
    }
    function abrirModalObs(item) {
      itemEdicao.value = { ...item };
      dialogObs.value = true;
    }
    function emitirEventoSalvarObs() {
      emit("salvar-obs", itemEdicao.value);
      dialogObs.value = false;
    }
    function emitirEventoMarcarCumprido(item) {
      emit("marcar-cumprido", item);
    }
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1$1, [
        createVNode(VOverlay, {
          class: "align-center justify-center",
          contained: "",
          "model-value": props.actionLoading,
          persistent: "",
          scrim: "rgba(0,0,0,0.4)"
        }, {
          default: withCtx(() => [
            createBaseVNode("div", _hoisted_2$1, [
              createVNode(VProgressCircular, {
                color: "primary",
                indeterminate: "",
                size: "48",
                width: "4"
              }),
              createBaseVNode("div", _hoisted_3$1, toDisplayString(props.actionLoadingText || "Processando..."), 1)
            ])
          ]),
          _: 1
        }, 8, ["model-value"]),
        createVNode(VDataTableServer, {
          class: "elevation-1 tabela-processos",
          "fixed-header": "",
          headers: headers.value,
          "item-key": "id",
          items: props.items,
          "items-length": props.totalItems,
          loading: props.loading,
          "loading-text": "Carregando processos...",
          "model-value": props.selected,
          "return-object": "",
          "show-select": "",
          "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => emit("update:selected", $event)),
          "onUpdate:options": _cache[1] || (_cache[1] = ($event) => emit("update:options", $event))
        }, {
          "no-data": withCtx(() => [
            createBaseVNode("div", _hoisted_4$1, [
              createVNode(VIcon, {
                color: "grey-lighten-2",
                size: "64"
              }, {
                default: withCtx(() => [..._cache[5] || (_cache[5] = [
                  createTextVNode(" mdi-magnify-remove-outline ", -1)
                ])]),
                _: 1
              }),
              _cache[6] || (_cache[6] = createBaseVNode("div", { class: "text-h6 text-grey-lighten-1 mt-4" }, " Nenhum processo encontrado ", -1)),
              _cache[7] || (_cache[7] = createBaseVNode("p", { class: "text-body-2 text-grey-lighten-1 mt-1" }, " Tente ajustar ou limpar os filtros de pesquisa. ", -1))
            ])
          ]),
          "item.fonte": withCtx(({ item }) => [
            createVNode(VChip, {
              color: item.fonte === "pje" ? "green" : "blue",
              size: "small",
              variant: "flat"
            }, {
              default: withCtx(() => [
                createTextVNode(toDisplayString(item.fonte === "pje" ? "PJe" : "eSAJ"), 1)
              ]),
              _: 2
            }, 1032, ["color"])
          ]),
          "item.user": withCtx(({ item }) => [
            item.User ? (openBlock(), createElementBlock("span", _hoisted_5$1, toDisplayString(item.User.nome), 1)) : (openBlock(), createBlock(VChip, {
              key: 1,
              size: "small",
              variant: "tonal"
            }, {
              default: withCtx(() => [..._cache[8] || (_cache[8] = [
                createTextVNode("Não Atribuído", -1)
              ])]),
              _: 1
            }))
          ]),
          "item.prazoRestanteNum": withCtx(({ item }) => [
            createVNode(VChip, {
              color: item.prazoRestanteColor,
              size: "small"
            }, {
              default: withCtx(() => [
                createTextVNode(toDisplayString(item.prazoRestanteStr), 1)
              ]),
              _: 2
            }, 1032, ["color"])
          ]),
          "item.observacoes": withCtx(({ item }) => [
            createBaseVNode("div", {
              class: "obs-celula",
              title: "Clique duplo para editar",
              onDblclick: ($event) => abrirModalObs(item)
            }, toDisplayString(item.observacoes || "..."), 41, _hoisted_6$1)
          ]),
          "item.acaoCumprido": withCtx(({ item }) => [
            item.cumprido ? (openBlock(), createBlock(VTooltip, {
              key: 0,
              location: "top"
            }, {
              activator: withCtx(({ props: tooltipProps }) => [
                createVNode(VBtn, mergeProps({ color: "success" }, tooltipProps, {
                  size: "x-small",
                  title: "Desmarcar processo",
                  variant: "text",
                  onClick: ($event) => emitirEventoMarcarCumprido(item)
                }), {
                  default: withCtx(() => [
                    createVNode(VIcon, null, {
                      default: withCtx(() => [..._cache[9] || (_cache[9] = [
                        createTextVNode("mdi-checkbox-marked", -1)
                      ])]),
                      _: 1
                    })
                  ]),
                  _: 1
                }, 16, ["onClick"])
              ]),
              default: withCtx(() => [
                createBaseVNode("span", null, " Cumprido em: " + toDisplayString(formatarDataHora(item.cumpridoDate)), 1)
              ]),
              _: 2
            }, 1024)) : (openBlock(), createBlock(VBtn, {
              key: 1,
              color: "grey-lighten-1",
              size: "x-small",
              title: "Marcar como cumprido",
              variant: "text",
              onClick: ($event) => emitirEventoMarcarCumprido(item)
            }, {
              default: withCtx(() => [
                createVNode(VIcon, null, {
                  default: withCtx(() => [..._cache[10] || (_cache[10] = [
                    createTextVNode("mdi-checkbox-blank-outline", -1)
                  ])]),
                  _: 1
                })
              ]),
              _: 1
            }, 8, ["onClick"]))
          ]),
          _: 1
        }, 8, ["headers", "items", "items-length", "loading", "model-value"]),
        createVNode(VDialog, {
          modelValue: dialogObs.value,
          "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => dialogObs.value = $event),
          "max-width": "600px",
          persistent: ""
        }, {
          default: withCtx(() => [
            createVNode(VCard, null, {
              default: withCtx(() => [
                createVNode(VCardTitle, null, {
                  default: withCtx(() => [..._cache[11] || (_cache[11] = [
                    createBaseVNode("span", { class: "headline" }, "Editar Observações", -1)
                  ])]),
                  _: 1
                }),
                createVNode(VCardText, null, {
                  default: withCtx(() => [
                    createVNode(VTextarea, {
                      modelValue: itemEdicao.value.observacoes,
                      "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => itemEdicao.value.observacoes = $event),
                      "auto-grow": "",
                      counter: "",
                      label: "Observações do Processo",
                      maxlength: "300",
                      rows: "5",
                      rules: [(v) => !v || v.length <= 300 || "Máximo de 300 caracteres"]
                    }, null, 8, ["modelValue", "rules"])
                  ]),
                  _: 1
                }),
                createVNode(VCardActions, null, {
                  default: withCtx(() => [
                    createVNode(VSpacer),
                    createVNode(VBtn, {
                      variant: "text",
                      onClick: _cache[3] || (_cache[3] = ($event) => dialogObs.value = false)
                    }, {
                      default: withCtx(() => [..._cache[12] || (_cache[12] = [
                        createTextVNode("Cancelar", -1)
                      ])]),
                      _: 1
                    }),
                    createVNode(VBtn, {
                      color: "primary",
                      onClick: emitirEventoSalvarObs
                    }, {
                      default: withCtx(() => [..._cache[13] || (_cache[13] = [
                        createTextVNode(" Salvar ", -1)
                      ])]),
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
        }, 8, ["modelValue"])
      ]);
    };
  }
};
const TabelaProcessos = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["__scopeId", "data-v-bb4b1fec"]]);
const makeVSwitchProps = propsFactory({
  indeterminate: Boolean,
  inset: Boolean,
  flat: Boolean,
  loading: {
    type: [Boolean, String],
    default: false
  },
  ...makeVInputProps(),
  ...makeVSelectionControlProps()
}, "VSwitch");
const VSwitch = genericComponent()({
  name: "VSwitch",
  inheritAttrs: false,
  props: makeVSwitchProps(),
  emits: {
    "update:focused": (focused) => true,
    "update:modelValue": (value) => true,
    "update:indeterminate": (value) => true
  },
  setup(props, _ref) {
    let {
      attrs,
      slots
    } = _ref;
    const indeterminate = useProxiedModel(props, "indeterminate");
    const model = useProxiedModel(props, "modelValue");
    const {
      loaderClasses
    } = useLoader(props);
    const {
      isFocused,
      focus,
      blur
    } = useFocus(props);
    const control = ref();
    const inputRef = ref();
    const isForcedColorsModeActive = SUPPORTS_MATCH_MEDIA && window.matchMedia("(forced-colors: active)").matches;
    const loaderColor = toRef(() => {
      return typeof props.loading === "string" && props.loading !== "" ? props.loading : props.color;
    });
    const uid = useId();
    const id = toRef(() => props.id || `switch-${uid}`);
    function onChange() {
      if (indeterminate.value) {
        indeterminate.value = false;
      }
    }
    function onTrackClick(e) {
      e.stopPropagation();
      e.preventDefault();
      control.value?.input?.click();
    }
    useRender(() => {
      const [rootAttrs, controlAttrs] = filterInputAttrs(attrs);
      const inputProps = VInput.filterProps(props);
      const controlProps = VSelectionControl.filterProps(props);
      return createVNode(VInput, mergeProps({
        "ref": inputRef,
        "class": ["v-switch", {
          "v-switch--flat": props.flat
        }, {
          "v-switch--inset": props.inset
        }, {
          "v-switch--indeterminate": indeterminate.value
        }, loaderClasses.value, props.class]
      }, rootAttrs, inputProps, {
        "modelValue": model.value,
        "onUpdate:modelValue": ($event) => model.value = $event,
        "id": id.value,
        "focused": isFocused.value,
        "style": props.style
      }), {
        ...slots,
        default: (_ref2) => {
          let {
            id: id2,
            messagesId,
            isDisabled,
            isReadonly,
            isValid
          } = _ref2;
          const slotProps = {
            model,
            isValid
          };
          return createVNode(VSelectionControl, mergeProps({
            "ref": control
          }, controlProps, {
            "modelValue": model.value,
            "onUpdate:modelValue": [($event) => model.value = $event, onChange],
            "id": id2.value,
            "aria-describedby": messagesId.value,
            "type": "checkbox",
            "aria-checked": indeterminate.value ? "mixed" : void 0,
            "disabled": isDisabled.value,
            "readonly": isReadonly.value,
            "onFocus": focus,
            "onBlur": blur
          }, controlAttrs), {
            ...slots,
            default: (_ref3) => {
              let {
                backgroundColorClasses,
                backgroundColorStyles
              } = _ref3;
              return createBaseVNode("div", {
                "class": normalizeClass(["v-switch__track", !isForcedColorsModeActive ? backgroundColorClasses.value : void 0]),
                "style": normalizeStyle(backgroundColorStyles.value),
                "onClick": onTrackClick
              }, [slots["track-true"] && createBaseVNode("div", {
                "key": "prepend",
                "class": "v-switch__track-true"
              }, [slots["track-true"](slotProps)]), slots["track-false"] && createBaseVNode("div", {
                "key": "append",
                "class": "v-switch__track-false"
              }, [slots["track-false"](slotProps)])]);
            },
            input: (_ref4) => {
              let {
                inputNode,
                icon,
                backgroundColorClasses,
                backgroundColorStyles
              } = _ref4;
              return createBaseVNode(Fragment, null, [inputNode, createBaseVNode("div", {
                "class": normalizeClass(["v-switch__thumb", {
                  "v-switch__thumb--filled": icon || props.loading
                }, props.inset || isForcedColorsModeActive ? void 0 : backgroundColorClasses.value]),
                "style": normalizeStyle(props.inset ? void 0 : backgroundColorStyles.value)
              }, [slots.thumb ? createVNode(VDefaultsProvider, {
                "defaults": {
                  VIcon: {
                    icon,
                    size: "x-small"
                  }
                }
              }, {
                default: () => [slots.thumb({
                  ...slotProps,
                  icon
                })]
              }) : createVNode(VScaleTransition, null, {
                default: () => [!props.loading ? icon && createVNode(VIcon, {
                  "key": String(icon),
                  "icon": icon,
                  "size": "x-small"
                }, null) : createVNode(LoaderSlot, {
                  "name": "v-switch",
                  "active": true,
                  "color": isValid.value === false ? void 0 : loaderColor.value
                }, {
                  default: (slotProps2) => slots.loader ? slots.loader(slotProps2) : createVNode(VProgressCircular, {
                    "active": slotProps2.isActive,
                    "color": slotProps2.color,
                    "indeterminate": true,
                    "size": "16",
                    "width": "2"
                  }, null)
                })]
              })])]);
            }
          });
        }
      });
    });
    return forwardRefs({}, inputRef);
  }
});
const _sfc_main$2 = {
  __name: "UnidadesDialog",
  emits: ["notify", "changed"],
  setup(__props, { expose: __expose, emit: __emit }) {
    const emit = __emit;
    const dialog = ref(false);
    const loading = ref(false);
    const salvando = ref(false);
    const unidades = ref([]);
    const editando = ref(false);
    const formRef = ref(null);
    const form = reactive({ id: null, nome: "", sigla: "", nome_pje: "", ativo: true });
    const requiredRule = (v) => !!v || "Campo obrigatório";
    const headers = [
      { title: "Nome", key: "nome" },
      { title: "Sigla", key: "sigla" },
      { title: "Nome no PJe", key: "nome_pje" },
      { title: "Status", key: "ativo", align: "center" },
      { title: "Ações", key: "acoes", align: "end", sortable: false }
    ];
    async function carregar() {
      loading.value = true;
      try {
        const { data } = await apiClient.get("/admin/unidades");
        unidades.value = data || [];
      } catch {
        emit("notify", "Erro ao carregar unidades.", "error");
      } finally {
        loading.value = false;
      }
    }
    function abrirNova() {
      Object.assign(form, { id: null, nome: "", sigla: "", nome_pje: "", ativo: true });
      editando.value = true;
      formRef.value?.resetValidation();
    }
    function editar(item) {
      Object.assign(form, { id: item.id, nome: item.nome, sigla: item.sigla || "", nome_pje: item.nome_pje || "", ativo: !!item.ativo });
      editando.value = true;
    }
    function cancelarEdicao() {
      editando.value = false;
    }
    async function salvar() {
      const { valid } = await formRef.value.validate();
      if (!valid) return;
      salvando.value = true;
      try {
        const payload = { nome: form.nome, sigla: form.sigla || null, nome_pje: form.nome_pje || null, ativo: form.ativo };
        await (form.id ? apiClient.put(`/admin/unidades/${form.id}`, payload) : apiClient.post("/admin/unidades", payload));
        emit("notify", "Unidade salva com sucesso!", "success");
        editando.value = false;
        await carregar();
        emit("changed");
      } catch (error) {
        emit("notify", error.response?.data?.error || "Erro ao salvar unidade.", "error");
      } finally {
        salvando.value = false;
      }
    }
    async function excluir(item) {
      if (!window.confirm(`Excluir a unidade "${item.nome}"? Só é possível se não houver usuários nem processos vinculados.`)) return;
      try {
        await apiClient.delete(`/admin/unidades/${item.id}`);
        emit("notify", "Unidade excluída.", "success");
        await carregar();
        emit("changed");
      } catch (error) {
        emit("notify", error.response?.data?.error || "Erro ao excluir unidade.", "error");
      }
    }
    async function abrir() {
      editando.value = false;
      dialog.value = true;
      await carregar();
    }
    __expose({ abrir });
    return (_ctx, _cache) => {
      return openBlock(), createBlock(VDialog, {
        modelValue: dialog.value,
        "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => dialog.value = $event),
        "max-width": "820px",
        scrollable: ""
      }, {
        default: withCtx(() => [
          createVNode(VCard, null, {
            default: withCtx(() => [
              createVNode(VCardTitle, { class: "d-flex align-center" }, {
                default: withCtx(() => [
                  createVNode(VIcon, { start: "" }, {
                    default: withCtx(() => [..._cache[6] || (_cache[6] = [
                      createTextVNode("mdi-office-building-outline", -1)
                    ])]),
                    _: 1
                  }),
                  _cache[8] || (_cache[8] = createTextVNode(" Gerenciar Unidades ", -1)),
                  createVNode(VSpacer),
                  createVNode(VBtn, {
                    color: "primary",
                    "prepend-icon": "mdi-plus",
                    size: "small",
                    variant: "flat",
                    onClick: abrirNova
                  }, {
                    default: withCtx(() => [..._cache[7] || (_cache[7] = [
                      createTextVNode(" Nova Unidade ", -1)
                    ])]),
                    _: 1
                  }),
                  createVNode(VBtn, {
                    class: "ml-2",
                    icon: "mdi-close",
                    variant: "text",
                    onClick: _cache[0] || (_cache[0] = ($event) => dialog.value = false)
                  })
                ]),
                _: 1
              }),
              createVNode(VDivider),
              createVNode(VCardText, { style: { "max-height": "70vh" } }, {
                default: withCtx(() => [
                  editando.value ? (openBlock(), createBlock(VForm, {
                    key: 0,
                    ref_key: "formRef",
                    ref: formRef,
                    class: "mb-4",
                    onSubmit: withModifiers(salvar, ["prevent"])
                  }, {
                    default: withCtx(() => [
                      createVNode(VRow, { dense: "" }, {
                        default: withCtx(() => [
                          createVNode(VCol, {
                            cols: "12",
                            sm: "6"
                          }, {
                            default: withCtx(() => [
                              createVNode(VTextField, {
                                modelValue: form.nome,
                                "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => form.nome = $event),
                                density: "compact",
                                label: "Nome da unidade",
                                rules: [requiredRule],
                                variant: "outlined"
                              }, null, 8, ["modelValue", "rules"])
                            ]),
                            _: 1
                          }),
                          createVNode(VCol, {
                            cols: "12",
                            sm: "6"
                          }, {
                            default: withCtx(() => [
                              createVNode(VTextField, {
                                modelValue: form.nome_pje,
                                "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => form.nome_pje = $event),
                                density: "compact",
                                hint: "Nome como o PJe escreve na vinculação do aviso",
                                label: "Nome no PJe (trava de importação)",
                                "persistent-hint": "",
                                variant: "outlined"
                              }, null, 8, ["modelValue"])
                            ]),
                            _: 1
                          }),
                          createVNode(VCol, {
                            cols: "6",
                            sm: "4"
                          }, {
                            default: withCtx(() => [
                              createVNode(VTextField, {
                                modelValue: form.sigla,
                                "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => form.sigla = $event),
                                density: "compact",
                                label: "Sigla (opcional)",
                                variant: "outlined"
                              }, null, 8, ["modelValue"])
                            ]),
                            _: 1
                          }),
                          createVNode(VCol, {
                            class: "d-flex align-center",
                            cols: "6",
                            sm: "4"
                          }, {
                            default: withCtx(() => [
                              createVNode(VSwitch, {
                                modelValue: form.ativo,
                                "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => form.ativo = $event),
                                color: "primary",
                                density: "compact",
                                "hide-details": "",
                                label: form.ativo ? "Ativa" : "Inativa"
                              }, null, 8, ["modelValue", "label"])
                            ]),
                            _: 1
                          }),
                          createVNode(VCol, {
                            class: "d-flex align-center justify-end ga-2",
                            cols: "12",
                            sm: "4"
                          }, {
                            default: withCtx(() => [
                              createVNode(VBtn, {
                                variant: "text",
                                onClick: cancelarEdicao
                              }, {
                                default: withCtx(() => [..._cache[9] || (_cache[9] = [
                                  createTextVNode("Cancelar", -1)
                                ])]),
                                _: 1
                              }),
                              createVNode(VBtn, {
                                color: "primary",
                                loading: salvando.value,
                                type: "submit",
                                variant: "flat"
                              }, {
                                default: withCtx(() => [..._cache[10] || (_cache[10] = [
                                  createTextVNode("Salvar", -1)
                                ])]),
                                _: 1
                              }, 8, ["loading"])
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  }, 512)) : createCommentVNode("", true),
                  createVNode(VDataTable, {
                    density: "compact",
                    headers,
                    items: unidades.value,
                    "items-per-page": -1,
                    loading: loading.value,
                    "no-data-text": "Nenhuma unidade cadastrada."
                  }, {
                    "item.ativo": withCtx(({ item }) => [
                      createVNode(VChip, {
                        color: item.ativo ? "success" : "grey",
                        size: "small"
                      }, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(item.ativo ? "Ativa" : "Inativa"), 1)
                        ]),
                        _: 2
                      }, 1032, ["color"])
                    ]),
                    "item.acoes": withCtx(({ item }) => [
                      createVNode(VBtn, {
                        icon: "mdi-pencil",
                        size: "small",
                        variant: "text",
                        onClick: ($event) => editar(item)
                      }, null, 8, ["onClick"]),
                      createVNode(VBtn, {
                        color: "red",
                        icon: "mdi-delete-outline",
                        size: "small",
                        variant: "text",
                        onClick: ($event) => excluir(item)
                      }, null, 8, ["onClick"])
                    ]),
                    _: 1
                  }, 8, ["items", "loading"])
                ]),
                _: 1
              })
            ]),
            _: 1
          })
        ]),
        _: 1
      }, 8, ["modelValue"]);
    };
  }
};
const makeVAutocompleteProps = propsFactory({
  autoSelectFirst: {
    type: [Boolean, String]
  },
  clearOnSelect: Boolean,
  search: String,
  ...makeFilterProps({
    filterKeys: ["title"]
  }),
  ...makeSelectProps(),
  ...omit(makeVTextFieldProps({
    modelValue: null,
    role: "combobox"
  }), ["validationValue", "dirty", "appendInnerIcon"])
}, "VAutocomplete");
const VAutocomplete = genericComponent()({
  name: "VAutocomplete",
  props: makeVAutocompleteProps(),
  emits: {
    "update:focused": (focused) => true,
    "update:search": (value) => true,
    "update:modelValue": (value) => true,
    "update:menu": (value) => true
  },
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    const {
      t
    } = useLocale();
    const vTextFieldRef = ref();
    const isFocused = shallowRef(false);
    const isPristine = shallowRef(true);
    const listHasFocus = shallowRef(false);
    const vMenuRef = ref();
    const vVirtualScrollRef = ref();
    const selectionIndex = shallowRef(-1);
    const _searchLock = shallowRef(null);
    const {
      items,
      transformIn,
      transformOut
    } = useItems(props);
    const {
      textColorClasses,
      textColorStyles
    } = useTextColor(() => vTextFieldRef.value?.color);
    const search = useProxiedModel(props, "search", "");
    const model = useProxiedModel(props, "modelValue", [], (v) => transformIn(v === null ? [null] : wrapInArray(v)), (v) => {
      const transformed = transformOut(v);
      return props.multiple ? transformed : transformed[0] ?? null;
    });
    const counterValue = computed(() => {
      return typeof props.counterValue === "function" ? props.counterValue(model.value) : typeof props.counterValue === "number" ? props.counterValue : model.value.length;
    });
    const form = useForm(props);
    const {
      filteredItems,
      getMatches
    } = useFilter(props, items, () => _searchLock.value ?? (isPristine.value ? "" : search.value));
    const displayItems = computed(() => {
      if (props.hideSelected && _searchLock.value === null) {
        return filteredItems.value.filter((filteredItem) => !model.value.some((s) => s.value === filteredItem.value));
      }
      return filteredItems.value;
    });
    const hasChips = computed(() => !!(props.chips || slots.chip));
    const hasSelectionSlot = computed(() => hasChips.value || !!slots.selection);
    const selectedValues = computed(() => model.value.map((selection) => selection.props.value));
    const highlightFirst = computed(() => {
      const selectFirst = props.autoSelectFirst === true || props.autoSelectFirst === "exact" && search.value === displayItems.value[0]?.title;
      return selectFirst && displayItems.value.length > 0 && !isPristine.value && !listHasFocus.value;
    });
    const menuDisabled = computed(() => props.hideNoData && !displayItems.value.length || form.isReadonly.value || form.isDisabled.value);
    const _menu = useProxiedModel(props, "menu");
    const menu = computed({
      get: () => _menu.value,
      set: (v) => {
        if (_menu.value && !v && vMenuRef.value?.ΨopenChildren.size) return;
        if (v && menuDisabled.value) return;
        _menu.value = v;
      }
    });
    const {
      menuId,
      ariaExpanded,
      ariaControls,
      ariaLabel
    } = useMenuActivator(props, menu);
    const listRef = ref();
    const listEvents = useScrolling(listRef, vTextFieldRef);
    function onClear(e) {
      if (props.openOnClear) {
        menu.value = true;
      }
      search.value = "";
    }
    function onMousedownControl() {
      if (menuDisabled.value) return;
      menu.value = true;
    }
    function onMousedownMenuIcon(e) {
      if (menuDisabled.value) return;
      if (isFocused.value) {
        e.preventDefault();
        e.stopPropagation();
      }
      menu.value = !menu.value;
    }
    function onListKeydown(e) {
      if (checkPrintable(e) || e.key === "Backspace") {
        vTextFieldRef.value?.focus();
      }
    }
    function onKeydown(e) {
      if (form.isReadonly.value) return;
      const selectionStart = vTextFieldRef.value?.selectionStart;
      const length = model.value.length;
      if (["Enter", "ArrowDown", "ArrowUp"].includes(e.key)) {
        e.preventDefault();
      }
      if (["Enter", "ArrowDown"].includes(e.key)) {
        menu.value = true;
      }
      if (["Escape"].includes(e.key)) {
        menu.value = false;
      }
      if (highlightFirst.value && ["Enter", "Tab"].includes(e.key) && !model.value.some((_ref2) => {
        let {
          value
        } = _ref2;
        return value === displayItems.value[0].value;
      })) {
        select(displayItems.value[0]);
      }
      if (e.key === "ArrowDown" && highlightFirst.value) {
        listRef.value?.focus("next");
      }
      if (["Backspace", "Delete"].includes(e.key)) {
        if (!props.multiple && hasSelectionSlot.value && model.value.length > 0 && !search.value) return select(model.value[0], false);
        if (~selectionIndex.value) {
          e.preventDefault();
          const originalSelectionIndex = selectionIndex.value;
          select(model.value[selectionIndex.value], false);
          selectionIndex.value = originalSelectionIndex >= length - 1 ? length - 2 : originalSelectionIndex;
        } else if (e.key === "Backspace" && !search.value) {
          selectionIndex.value = length - 1;
        }
        return;
      }
      if (!props.multiple) return;
      if (e.key === "ArrowLeft") {
        if (selectionIndex.value < 0 && selectionStart && selectionStart > 0) return;
        const prev = selectionIndex.value > -1 ? selectionIndex.value - 1 : length - 1;
        if (model.value[prev]) {
          selectionIndex.value = prev;
        } else {
          const searchLength = search.value?.length ?? null;
          selectionIndex.value = -1;
          vTextFieldRef.value?.setSelectionRange(searchLength, searchLength);
        }
      } else if (e.key === "ArrowRight") {
        if (selectionIndex.value < 0) return;
        const next = selectionIndex.value + 1;
        if (model.value[next]) {
          selectionIndex.value = next;
        } else {
          selectionIndex.value = -1;
          vTextFieldRef.value?.setSelectionRange(0, 0);
        }
      } else if (~selectionIndex.value && checkPrintable(e)) {
        selectionIndex.value = -1;
      }
    }
    function onChange(e) {
      if (matchesSelector(vTextFieldRef.value, ":autofill") || matchesSelector(vTextFieldRef.value, ":-webkit-autofill")) {
        const item = items.value.find((item2) => item2.title === e.target.value);
        if (item) {
          select(item);
        }
      }
    }
    function onAfterEnter() {
      if (props.eager) {
        vVirtualScrollRef.value?.calculateVisibleItems();
      }
    }
    function onAfterLeave() {
      if (isFocused.value) {
        isPristine.value = true;
        vTextFieldRef.value?.focus();
      }
      _searchLock.value = null;
    }
    function onFocusin(e) {
      isFocused.value = true;
      setTimeout(() => {
        listHasFocus.value = true;
      });
    }
    function onFocusout(e) {
      listHasFocus.value = false;
    }
    function onUpdateModelValue(v) {
      if (v == null || v === "" && !props.multiple && !hasSelectionSlot.value) model.value = [];
    }
    const isSelecting = shallowRef(false);
    function select(item) {
      let set = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : true;
      if (!item || item.props.disabled) return;
      if (props.multiple) {
        const index = model.value.findIndex((selection) => (props.valueComparator || deepEqual)(selection.value, item.value));
        const add = set == null ? !~index : set;
        if (~index) {
          const value = add ? [...model.value, item] : [...model.value];
          value.splice(index, 1);
          model.value = value;
        } else if (add) {
          model.value = [...model.value, item];
        }
        if (props.clearOnSelect) {
          search.value = "";
        }
      } else {
        const add = set !== false;
        model.value = add ? [item] : [];
        _searchLock.value = isPristine.value ? "" : search.value ?? "";
        search.value = add && !hasSelectionSlot.value ? item.title : "";
        nextTick(() => {
          menu.value = false;
          isPristine.value = true;
        });
      }
    }
    watch(isFocused, (val, oldVal) => {
      if (val === oldVal) return;
      if (val) {
        isSelecting.value = true;
        search.value = props.multiple || hasSelectionSlot.value ? "" : String(model.value.at(-1)?.props.title ?? "");
        isPristine.value = true;
        nextTick(() => isSelecting.value = false);
      } else {
        if (!props.multiple && search.value == null) model.value = [];
        menu.value = false;
        if (!isPristine.value && search.value) {
          _searchLock.value = search.value;
        }
        search.value = "";
        selectionIndex.value = -1;
      }
    });
    watch(search, (val) => {
      if (!isFocused.value || isSelecting.value) return;
      if (val) menu.value = true;
      isPristine.value = !val;
    });
    watch(menu, (val) => {
      if (!props.hideSelected && val && model.value.length && isPristine.value) {
        const index = displayItems.value.findIndex((item) => model.value.some((s) => item.value === s.value));
        IN_BROWSER && window.requestAnimationFrame(() => {
          index >= 0 && vVirtualScrollRef.value?.scrollToIndex(index);
        });
      }
      if (val) _searchLock.value = null;
    });
    watch(items, (newVal, oldVal) => {
      if (menu.value) return;
      if (isFocused.value && !oldVal.length && newVal.length) {
        menu.value = true;
      }
    });
    useRender(() => {
      const hasList = !!(!props.hideNoData || displayItems.value.length || slots["prepend-item"] || slots["append-item"] || slots["no-data"]);
      const isDirty = model.value.length > 0;
      const textFieldProps = VTextField.filterProps(props);
      return createVNode(VTextField, mergeProps({
        "ref": vTextFieldRef
      }, textFieldProps, {
        "modelValue": search.value,
        "onUpdate:modelValue": [($event) => search.value = $event, onUpdateModelValue],
        "focused": isFocused.value,
        "onUpdate:focused": ($event) => isFocused.value = $event,
        "validationValue": model.externalValue,
        "counterValue": counterValue.value,
        "dirty": isDirty,
        "onChange": onChange,
        "class": ["v-autocomplete", `v-autocomplete--${props.multiple ? "multiple" : "single"}`, {
          "v-autocomplete--active-menu": menu.value,
          "v-autocomplete--chips": !!props.chips,
          "v-autocomplete--selection-slot": !!hasSelectionSlot.value,
          "v-autocomplete--selecting-index": selectionIndex.value > -1
        }, props.class],
        "style": props.style,
        "readonly": form.isReadonly.value,
        "placeholder": isDirty ? void 0 : props.placeholder,
        "onClick:clear": onClear,
        "onMousedown:control": onMousedownControl,
        "onKeydown": onKeydown,
        "aria-expanded": ariaExpanded.value,
        "aria-controls": ariaControls.value
      }), {
        ...slots,
        default: () => createBaseVNode(Fragment, null, [createVNode(VMenu, mergeProps({
          "id": menuId.value,
          "ref": vMenuRef,
          "modelValue": menu.value,
          "onUpdate:modelValue": ($event) => menu.value = $event,
          "activator": "parent",
          "contentClass": "v-autocomplete__content",
          "disabled": menuDisabled.value,
          "eager": props.eager,
          "maxHeight": 310,
          "openOnClick": false,
          "closeOnContentClick": false,
          "onAfterEnter": onAfterEnter,
          "onAfterLeave": onAfterLeave
        }, props.menuProps), {
          default: () => [hasList && createVNode(VList, mergeProps({
            "ref": listRef,
            "filterable": true,
            "selected": selectedValues.value,
            "selectStrategy": props.multiple ? "independent" : "single-independent",
            "onMousedown": (e) => e.preventDefault(),
            "onKeydown": onListKeydown,
            "onFocusin": onFocusin,
            "onFocusout": onFocusout,
            "tabindex": "-1",
            "selectable": true,
            "aria-live": "polite",
            "color": props.itemColor ?? props.color
          }, listEvents, props.listProps), {
            default: () => [slots["prepend-item"]?.(), !displayItems.value.length && !props.hideNoData && (slots["no-data"]?.() ?? createVNode(VListItem, {
              "key": "no-data",
              "title": t(props.noDataText)
            }, null)), createVNode(VVirtualScroll, {
              "ref": vVirtualScrollRef,
              "renderless": true,
              "items": displayItems.value,
              "itemKey": "value"
            }, {
              default: (_ref3) => {
                let {
                  item,
                  index,
                  itemRef
                } = _ref3;
                const itemProps = mergeProps(item.props, {
                  ref: itemRef,
                  key: item.value,
                  active: highlightFirst.value && index === 0 ? true : void 0,
                  onClick: () => select(item, null)
                });
                if (item.type === "divider") {
                  return slots.divider?.({
                    props: item.raw,
                    index
                  }) ?? createVNode(VDivider, mergeProps(item.props, {
                    "key": `divider-${index}`
                  }), null);
                }
                if (item.type === "subheader") {
                  return slots.subheader?.({
                    props: item.raw,
                    index
                  }) ?? createVNode(VListSubheader, mergeProps(item.props, {
                    "key": `subheader-${index}`
                  }), null);
                }
                return slots.item?.({
                  item,
                  index,
                  props: itemProps
                }) ?? createVNode(VListItem, mergeProps(itemProps, {
                  "role": "option"
                }), {
                  prepend: (_ref4) => {
                    let {
                      isSelected
                    } = _ref4;
                    return createBaseVNode(Fragment, null, [props.multiple && !props.hideSelected ? createVNode(VCheckboxBtn, {
                      "key": item.value,
                      "modelValue": isSelected,
                      "ripple": false,
                      "tabindex": "-1",
                      "onClick": (event) => event.preventDefault()
                    }, null) : void 0, item.props.prependAvatar && createVNode(VAvatar, {
                      "image": item.props.prependAvatar
                    }, null), item.props.prependIcon && createVNode(VIcon, {
                      "icon": item.props.prependIcon
                    }, null)]);
                  },
                  title: () => {
                    return isPristine.value ? item.title : highlightResult("v-autocomplete", item.title, getMatches(item)?.title);
                  }
                });
              }
            }), slots["append-item"]?.()]
          })]
        }), model.value.map((item, index) => {
          function onChipClose(e) {
            e.stopPropagation();
            e.preventDefault();
            select(item, false);
          }
          const slotProps = {
            "onClick:close": onChipClose,
            onKeydown(e) {
              if (e.key !== "Enter" && e.key !== " ") return;
              e.preventDefault();
              e.stopPropagation();
              onChipClose(e);
            },
            onMousedown(e) {
              e.preventDefault();
              e.stopPropagation();
            },
            modelValue: true,
            "onUpdate:modelValue": void 0
          };
          const hasSlot = hasChips.value ? !!slots.chip : !!slots.selection;
          const slotContent = hasSlot ? ensureValidVNode(hasChips.value ? slots.chip({
            item,
            index,
            props: slotProps
          }) : slots.selection({
            item,
            index
          })) : void 0;
          if (hasSlot && !slotContent) return void 0;
          return createBaseVNode("div", {
            "key": item.value,
            "class": normalizeClass(["v-autocomplete__selection", index === selectionIndex.value && ["v-autocomplete__selection--selected", textColorClasses.value]]),
            "style": normalizeStyle(index === selectionIndex.value ? textColorStyles.value : {})
          }, [hasChips.value ? !slots.chip ? createVNode(VChip, mergeProps({
            "key": "chip",
            "closable": props.closableChips,
            "size": "small",
            "text": item.title,
            "disabled": item.props.disabled
          }, slotProps), null) : createVNode(VDefaultsProvider, {
            "key": "chip-defaults",
            "defaults": {
              VChip: {
                closable: props.closableChips,
                size: "small",
                text: item.title
              }
            }
          }, {
            default: () => [slotContent]
          }) : slotContent ?? createBaseVNode("span", {
            "class": "v-autocomplete__selection-text"
          }, [item.title, props.multiple && index < model.value.length - 1 && createBaseVNode("span", {
            "class": "v-autocomplete__selection-comma"
          }, [createTextVNode(",")])])]);
        })]),
        "append-inner": function() {
          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }
          return createBaseVNode(Fragment, null, [slots["append-inner"]?.(...args), props.menuIcon ? createVNode(VIcon, {
            "class": "v-autocomplete__menu-icon",
            "color": vTextFieldRef.value?.fieldIconColor,
            "icon": props.menuIcon,
            "onMousedown": onMousedownMenuIcon,
            "onClick": noop,
            "aria-label": ariaLabel.value,
            "title": ariaLabel.value,
            "tabindex": "-1"
          }, null) : void 0]);
        }
      });
    });
    return forwardRefs({
      isFocused,
      isPristine,
      menu,
      search,
      filteredItems,
      select
    }, vTextFieldRef);
  }
});
function useFileDrop() {
  function hasFilesOrFolders(e) {
    const entries = [...e.dataTransfer?.items ?? []].filter((x) => x.kind === "file").map((x) => x.webkitGetAsEntry()).filter(Boolean);
    return entries.length > 0 || [...e.dataTransfer?.files ?? []].length > 0;
  }
  async function handleDrop(e) {
    const result = [];
    const entries = [...e.dataTransfer?.items ?? []].filter((x) => x.kind === "file").map((x) => x.webkitGetAsEntry()).filter(Boolean);
    if (entries.length) {
      for (const entry of entries) {
        const files = await traverseFileTree(entry, appendIfDirectory(".", entry));
        result.push(...files.map((x) => x.file));
      }
    } else {
      result.push(...[...e.dataTransfer?.files ?? []]);
    }
    return result;
  }
  return {
    handleDrop,
    hasFilesOrFolders
  };
}
function traverseFileTree(item) {
  let path = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "";
  return new Promise((resolve, reject) => {
    if (item.isFile) {
      const fileEntry = item;
      fileEntry.file((file) => resolve([{
        file,
        path
      }]), reject);
    } else if (item.isDirectory) {
      const directoryReader = item.createReader();
      directoryReader.readEntries(async (entries) => {
        const files = [];
        for (const entry of entries) {
          files.push(...await traverseFileTree(entry, appendIfDirectory(path, entry)));
        }
        resolve(files);
      });
    }
  });
}
function appendIfDirectory(path, item) {
  return item.isDirectory ? `${path}/${item.name}` : path;
}
const makeFileFilterProps = propsFactory({
  filterByType: String
}, "file-accept");
function useFileFilter(props) {
  const fileFilter = computed(() => props.filterByType ? createFilter(props.filterByType) : null);
  function filterAccepted(files) {
    if (fileFilter.value) {
      const accepted = files.filter(fileFilter.value);
      return {
        accepted,
        rejected: files.filter((f) => !accepted.includes(f))
      };
    }
    return {
      accepted: files,
      rejected: []
    };
  }
  return {
    filterAccepted
  };
}
function createFilter(v) {
  const types = v.split(",").map((x) => x.trim().toLowerCase());
  const extensionsToMatch = types.filter((x) => x.startsWith("."));
  const wildcards = types.filter((x) => x.endsWith("/*"));
  const typesToMatch = types.filter((x) => !extensionsToMatch.includes(x) && !wildcards.includes(x));
  return (file) => {
    const extension = file.name.split(".").at(-1)?.toLowerCase() ?? "";
    const typeGroup = file.type.split("/").at(0)?.toLowerCase() ?? "";
    return typesToMatch.includes(file.type) || extensionsToMatch.includes(`.${extension}`) || wildcards.includes(`${typeGroup}/*`);
  };
}
const makeVFileInputProps = propsFactory({
  chips: Boolean,
  counter: Boolean,
  counterSizeString: {
    type: String,
    default: "$vuetify.fileInput.counterSize"
  },
  counterString: {
    type: String,
    default: "$vuetify.fileInput.counter"
  },
  hideInput: Boolean,
  multiple: Boolean,
  showSize: {
    type: [Boolean, Number, String],
    default: false,
    validator: (v) => {
      return typeof v === "boolean" || [1e3, 1024].includes(Number(v));
    }
  },
  truncateLength: {
    type: [Number, String],
    default: 22
  },
  ...makeVInputProps({
    prependIcon: "$file"
  }),
  modelValue: {
    type: [Array, Object],
    default: (props) => props.multiple ? [] : null,
    validator: (val) => {
      return wrapInArray(val).every((v) => v != null && typeof v === "object");
    }
  },
  ...makeFileFilterProps(),
  ...makeVFieldProps({
    clearable: true
  })
}, "VFileInput");
const VFileInput = genericComponent()({
  name: "VFileInput",
  inheritAttrs: false,
  props: makeVFileInputProps(),
  emits: {
    "click:control": (e) => true,
    "mousedown:control": (e) => true,
    "update:focused": (focused) => true,
    "update:modelValue": (files) => true,
    rejected: (files) => true
  },
  setup(props, _ref) {
    let {
      attrs,
      emit,
      slots
    } = _ref;
    const {
      t
    } = useLocale();
    const {
      filterAccepted
    } = useFileFilter(props);
    const model = useProxiedModel(props, "modelValue", props.modelValue, (val) => wrapInArray(val), (val) => !props.multiple && Array.isArray(val) ? val[0] : val);
    const {
      isFocused,
      focus,
      blur
    } = useFocus(props);
    const base = computed(() => typeof props.showSize !== "boolean" ? props.showSize : void 0);
    const totalBytes = computed(() => (model.value ?? []).reduce((bytes, _ref2) => {
      let {
        size = 0
      } = _ref2;
      return bytes + size;
    }, 0));
    const totalBytesReadable = computed(() => humanReadableFileSize(totalBytes.value, base.value));
    const fileNames = computed(() => (model.value ?? []).map((file) => {
      const {
        name = "",
        size = 0
      } = file;
      const truncatedText = truncateText(name);
      return !props.showSize ? truncatedText : `${truncatedText} (${humanReadableFileSize(size, base.value)})`;
    }));
    const counterValue = computed(() => {
      const fileCount = model.value?.length ?? 0;
      if (props.showSize) return t(props.counterSizeString, fileCount, totalBytesReadable.value);
      else return t(props.counterString, fileCount);
    });
    const vInputRef = ref();
    const vFieldRef = ref();
    const inputRef = ref();
    const isActive = toRef(() => isFocused.value || props.active);
    const isPlainOrUnderlined = computed(() => ["plain", "underlined"].includes(props.variant));
    const isDragging = shallowRef(false);
    const {
      handleDrop,
      hasFilesOrFolders
    } = useFileDrop();
    function onFocus() {
      if (inputRef.value !== document.activeElement) {
        inputRef.value?.focus();
      }
      if (!isFocused.value) focus();
    }
    function onClickPrepend(e) {
      inputRef.value?.click();
    }
    function onControlMousedown(e) {
      emit("mousedown:control", e);
    }
    function onControlClick(e) {
      inputRef.value?.click();
      emit("click:control", e);
    }
    function onClear(e) {
      e.stopPropagation();
      onFocus();
      nextTick(() => {
        model.value = [];
        callEvent(props["onClick:clear"], e);
      });
    }
    function truncateText(str) {
      if (str.length < Number(props.truncateLength)) return str;
      const charsKeepOneSide = Math.floor((Number(props.truncateLength) - 1) / 2);
      return `${str.slice(0, charsKeepOneSide)}…${str.slice(str.length - charsKeepOneSide)}`;
    }
    function onDragover(e) {
      e.preventDefault();
      e.stopImmediatePropagation();
      isDragging.value = true;
    }
    function onDragleave(e) {
      e.preventDefault();
      isDragging.value = false;
    }
    async function onDrop(e) {
      e.preventDefault();
      e.stopImmediatePropagation();
      isDragging.value = false;
      if (!inputRef.value || !hasFilesOrFolders(e)) return;
      const allDroppedFiles = await handleDrop(e);
      selectAccepted(allDroppedFiles);
    }
    function onFileSelection(e) {
      if (!e.target || e.repack) return;
      if (!props.filterByType) {
        const target = e.target;
        model.value = [...target.files ?? []];
      } else {
        selectAccepted([...e.target.files]);
      }
    }
    function selectAccepted(files) {
      const dataTransfer = new DataTransfer();
      const {
        accepted,
        rejected
      } = filterAccepted(files);
      if (rejected.length) {
        emit("rejected", rejected);
      }
      for (const file of accepted) {
        dataTransfer.items.add(file);
      }
      inputRef.value.files = dataTransfer.files;
      model.value = [...dataTransfer.files];
      const event = new Event("change", {
        bubbles: true
      });
      event.repack = true;
      inputRef.value.dispatchEvent(event);
    }
    watch(model, (newValue) => {
      const hasModelReset = !Array.isArray(newValue) || !newValue.length;
      if (hasModelReset && inputRef.value) {
        inputRef.value.value = "";
      }
    });
    useRender(() => {
      const hasCounter = !!(slots.counter || props.counter);
      const hasDetails = !!(hasCounter || slots.details);
      const [rootAttrs, inputAttrs] = filterInputAttrs(attrs);
      const {
        modelValue: _,
        ...inputProps
      } = VInput.filterProps(props);
      const fieldProps = {
        ...VField.filterProps(props),
        "onClick:clear": onClear
      };
      const expectsDirectory = attrs.webkitdirectory !== void 0 && attrs.webkitdirectory !== false;
      const acceptFallback = attrs.accept ? String(attrs.accept) : void 0;
      const inputAccept = expectsDirectory ? void 0 : props.filterByType ?? acceptFallback;
      return createVNode(VInput, mergeProps({
        "ref": vInputRef,
        "modelValue": props.multiple ? model.value : model.value[0],
        "class": ["v-file-input", {
          "v-file-input--chips": !!props.chips,
          "v-file-input--dragging": isDragging.value,
          "v-file-input--hide": props.hideInput,
          "v-input--plain-underlined": isPlainOrUnderlined.value
        }, props.class],
        "style": props.style,
        "onClick:prepend": onClickPrepend
      }, rootAttrs, inputProps, {
        "centerAffix": !isPlainOrUnderlined.value,
        "focused": isFocused.value
      }), {
        ...slots,
        default: (_ref3) => {
          let {
            id,
            isDisabled,
            isDirty,
            isReadonly,
            isValid,
            hasDetails: hasDetails2
          } = _ref3;
          return createVNode(VField, mergeProps({
            "ref": vFieldRef,
            "prependIcon": props.prependIcon,
            "onMousedown": onControlMousedown,
            "onClick": onControlClick,
            "onClick:prependInner": props["onClick:prependInner"],
            "onClick:appendInner": props["onClick:appendInner"]
          }, fieldProps, {
            "id": id.value,
            "active": isActive.value || isDirty.value,
            "dirty": isDirty.value || props.dirty,
            "disabled": isDisabled.value,
            "focused": isFocused.value,
            "details": hasDetails2.value,
            "error": isValid.value === false,
            "onDragover": onDragover,
            "onDrop": onDrop
          }), {
            ...slots,
            default: (_ref4) => {
              let {
                props: {
                  class: fieldClass,
                  ...slotProps
                },
                controlRef
              } = _ref4;
              return createBaseVNode(Fragment, null, [createBaseVNode("input", mergeProps({
                "ref": (val) => inputRef.value = controlRef.value = val,
                "type": "file",
                "accept": inputAccept,
                "readonly": isReadonly.value,
                "disabled": isDisabled.value,
                "multiple": props.multiple,
                "name": props.name,
                "onClick": (e) => {
                  e.stopPropagation();
                  if (isReadonly.value) e.preventDefault();
                  onFocus();
                },
                "onChange": onFileSelection,
                "onDragleave": onDragleave,
                "onFocus": onFocus,
                "onBlur": blur
              }, slotProps, inputAttrs), null), createBaseVNode("div", {
                "class": normalizeClass(fieldClass)
              }, [!!model.value?.length && !props.hideInput && (slots.selection ? slots.selection({
                fileNames: fileNames.value,
                totalBytes: totalBytes.value,
                totalBytesReadable: totalBytesReadable.value
              }) : props.chips ? fileNames.value.map((text) => createVNode(VChip, {
                "key": text,
                "size": "small",
                "text": text
              }, null)) : fileNames.value.join(", "))])]);
            }
          });
        },
        details: hasDetails ? (slotProps) => createBaseVNode(Fragment, null, [slots.details?.(slotProps), hasCounter && createBaseVNode(Fragment, null, [createBaseVNode("span", null, null), createVNode(VCounter, {
          "active": !!model.value?.length,
          "value": counterValue.value,
          "disabled": props.disabled
        }, slots.counter)])]) : void 0
      });
    });
    return forwardRefs({}, vInputRef, vFieldRef, inputRef);
  }
});
const _sfc_main$1 = {
  __name: "UserAdminDialogs",
  props: {
    // Opções formatadas [{ title, value }] para os autocompletes de usuário
    allUsersOptions: {
      type: Array,
      default: () => []
    },
    // Unidade de destino do upload de CSV (só relevante para o super global;
    // null para admin da unidade, que usa a própria).
    uploadUnidadeId: {
      type: [Number, String],
      default: null
    }
  },
  emits: ["notify", "users-changed", "data-changed"],
  setup(__props, { expose: __expose, emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const authStore = useAuthStore();
    const requiredRule = (v) => !!v || "Campo obrigatório";
    const senhaRule = (v) => v && v.length >= 8 || "Senha deve ter no mínimo 8 caracteres";
    const tipoCadastroOptions = computed(() => {
      const base = [
        { title: "Usuário", value: "servidor" },
        { title: "Admin unidade", value: "admin_unidade" }
      ];
      if (authStore.isSuper) {
        base.push({ title: "Admin global", value: "super" });
      }
      return base;
    });
    const unidades = ref([]);
    async function carregarUnidades() {
      if (!authStore.isSuper) return;
      try {
        const { data } = await apiClient.get("/admin/unidades");
        unidades.value = data || [];
      } catch {
      }
    }
    const dialogCadastro = ref(false);
    const formCadastroRef = ref(null);
    const loadingCadastro = ref(false);
    const novoUsuario = ref({ matricula: "", nome: "", senha: "", tipoCadastro: "servidor", unidadeId: null });
    function abrirModalCadastro() {
      novoUsuario.value = { matricula: "", nome: "", senha: "", tipoCadastro: "servidor", unidadeId: null };
      formCadastroRef.value?.resetValidation();
      carregarUnidades();
      dialogCadastro.value = true;
    }
    function fecharModalCadastro() {
      dialogCadastro.value = false;
    }
    async function handleSalvarCadastro() {
      const { valid } = await formCadastroRef.value.validate();
      if (!valid) return;
      loadingCadastro.value = true;
      try {
        await apiClient.post("/admin/pre-cadastro", novoUsuario.value);
        emit("notify", "Usuário cadastrado com sucesso!", "success");
        fecharModalCadastro();
        emit("users-changed");
      } catch (error) {
        emit("notify", error.response?.data?.error || "Erro ao salvar usuário.", "error");
      } finally {
        loadingCadastro.value = false;
      }
    }
    const dialogEditar = ref(false);
    const formEditarRef = ref(null);
    const loadingEditar = ref(false);
    const editUsersList = ref([]);
    const edicao = ref({ userId: null, role: "servidor", unidadeId: null });
    const editUsersOptions = computed(
      () => editUsersList.value.map((u) => ({
        title: `${u.nome} (${u.matricula})`,
        value: u.id
      }))
    );
    function onSelecionarUsuarioEdicao(id) {
      const u = editUsersList.value.find((x) => x.id === id);
      if (u) {
        edicao.value.role = u.role || "servidor";
        edicao.value.unidadeId = u.unidade_id || null;
      }
    }
    async function abrirModalEditar() {
      edicao.value = { userId: null, role: "servidor", unidadeId: null };
      formEditarRef.value?.resetValidation();
      try {
        const { data } = await apiClient.get("/admin/users");
        editUsersList.value = data || [];
      } catch {
        emit("notify", "Erro ao carregar usuários.", "error");
      }
      carregarUnidades();
      dialogEditar.value = true;
    }
    function fecharModalEditar() {
      dialogEditar.value = false;
    }
    async function handleSalvarEdicao() {
      const { valid } = await formEditarRef.value.validate();
      if (!valid) return;
      loadingEditar.value = true;
      try {
        const payload = { role: edicao.value.role };
        if (edicao.value.role !== "super") payload.unidadeId = edicao.value.unidadeId;
        await apiClient.put(`/admin/users/${edicao.value.userId}`, payload);
        emit("notify", "Usuário atualizado com sucesso!", "success");
        fecharModalEditar();
        emit("users-changed");
        emit("data-changed");
      } catch (error) {
        emit("notify", error.response?.data?.error || "Erro ao editar usuário.", "error");
      } finally {
        loadingEditar.value = false;
      }
    }
    const dialogReset = ref(false);
    const formResetRef = ref(null);
    const loadingReset = ref(false);
    const matriculaParaReset = ref(null);
    function abrirModalReset() {
      matriculaParaReset.value = null;
      formResetRef.value?.resetValidation();
      dialogReset.value = true;
    }
    function fecharModalReset() {
      dialogReset.value = false;
    }
    async function handleResetarSenha() {
      const { valid } = await formResetRef.value.validate();
      if (!valid) return;
      loadingReset.value = true;
      try {
        const { data } = await apiClient.post("/admin/reset-password", { matricula: matriculaParaReset.value });
        emit("notify", `Senha resetada! Nova senha temporária: ${data.senhaTemporaria}`, "success", 15e3);
        fecharModalReset();
      } catch (error) {
        emit("notify", error.response?.data?.error || "Erro ao resetar senha.", "error");
      } finally {
        loadingReset.value = false;
      }
    }
    const dialogDelete = ref(false);
    const formDeleteRef = ref(null);
    const loadingDelete = ref(false);
    const matriculaParaDelete = ref(null);
    function abrirModalDelete() {
      matriculaParaDelete.value = null;
      formDeleteRef.value?.resetValidation();
      dialogDelete.value = true;
    }
    function fecharModalDelete() {
      dialogDelete.value = false;
    }
    async function handleDeleteUser() {
      const { valid } = await formDeleteRef.value.validate();
      if (!valid) return;
      loadingDelete.value = true;
      try {
        await apiClient.post("/admin/delete-matricula", { matricula: matriculaParaDelete.value });
        emit("notify", "Usuário apagado com sucesso!", "success");
        fecharModalDelete();
        emit("users-changed");
        emit("data-changed");
      } catch (error) {
        emit("notify", error.response?.data?.error || "Erro ao apagar usuário.", "error");
      } finally {
        loadingDelete.value = false;
      }
    }
    const dialogUpload = ref(false);
    const loadingUpload = ref(false);
    const csvFile = ref(null);
    const uploadError = ref(null);
    function abrirModalUpload() {
      csvFile.value = null;
      uploadError.value = null;
      dialogUpload.value = true;
    }
    function fecharModalUpload() {
      dialogUpload.value = false;
    }
    function onFileChange(event) {
      const files = event.target.files;
      if (files && files.length > 0) {
        if (files[0].type === "text/csv" || files[0].name.endsWith(".csv")) {
          csvFile.value = files[0];
          uploadError.value = null;
        } else {
          csvFile.value = null;
          uploadError.value = "Formato de arquivo inválido. Por favor, selecione um arquivo .csv";
        }
      }
    }
    async function handleUploadCSV() {
      if (!csvFile.value) {
        uploadError.value = "Nenhum arquivo selecionado.";
        return;
      }
      if (authStore.isSuper && !props.uploadUnidadeId) {
        uploadError.value = "Selecione uma unidade ativa no menu antes de importar o CSV.";
        return;
      }
      loadingUpload.value = true;
      uploadError.value = null;
      const formData = new FormData();
      formData.append("csvFile", csvFile.value);
      try {
        const params = authStore.isSuper && props.uploadUnidadeId ? { unidadeId: props.uploadUnidadeId } : {};
        const response = await apiClient.post("/admin/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
          params
        });
        loadingUpload.value = false;
        fecharModalUpload();
        const message = response.data?.message ? `${response.data.message} (${response.data.totalRows} registros)` : "CSV importado com sucesso!";
        emit("notify", message, "success");
        emit("data-changed");
      } catch (error) {
        loadingUpload.value = false;
        uploadError.value = error.response?.data?.error || "Erro ao importar CSV.";
      }
    }
    __expose({
      abrirModalCadastro,
      abrirModalEditar,
      abrirModalReset,
      abrirModalDelete,
      abrirModalUpload
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock(Fragment, null, [
        createVNode(VDialog, {
          modelValue: dialogCadastro.value,
          "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => dialogCadastro.value = $event),
          "max-width": "600px",
          persistent: ""
        }, {
          default: withCtx(() => [
            createVNode(VCard, null, {
              default: withCtx(() => [
                createVNode(VForm, {
                  ref_key: "formCadastroRef",
                  ref: formCadastroRef,
                  onSubmit: withModifiers(handleSalvarCadastro, ["prevent"])
                }, {
                  default: withCtx(() => [
                    createVNode(VCardTitle, null, {
                      default: withCtx(() => [..._cache[15] || (_cache[15] = [
                        createBaseVNode("span", { class: "text-h5" }, "Cadastrar Novo Usuário", -1)
                      ])]),
                      _: 1
                    }),
                    createVNode(VCardText, null, {
                      default: withCtx(() => [
                        createVNode(VContainer, null, {
                          default: withCtx(() => [
                            createVNode(VRow, null, {
                              default: withCtx(() => [
                                createVNode(VCol, { cols: "12" }, {
                                  default: withCtx(() => [
                                    createVNode(VTextField, {
                                      modelValue: novoUsuario.value.nome,
                                      "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => novoUsuario.value.nome = $event),
                                      density: "compact",
                                      label: "Nome Completo",
                                      rules: [requiredRule],
                                      variant: "outlined"
                                    }, null, 8, ["modelValue", "rules"])
                                  ]),
                                  _: 1
                                }),
                                createVNode(VCol, {
                                  cols: "12",
                                  sm: "6"
                                }, {
                                  default: withCtx(() => [
                                    createVNode(VTextField, {
                                      modelValue: novoUsuario.value.matricula,
                                      "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => novoUsuario.value.matricula = $event),
                                      density: "compact",
                                      label: "Matrícula",
                                      rules: [requiredRule],
                                      variant: "outlined"
                                    }, null, 8, ["modelValue", "rules"])
                                  ]),
                                  _: 1
                                }),
                                createVNode(VCol, {
                                  cols: "12",
                                  sm: "6"
                                }, {
                                  default: withCtx(() => [
                                    createVNode(VTextField, {
                                      modelValue: novoUsuario.value.senha,
                                      "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => novoUsuario.value.senha = $event),
                                      density: "compact",
                                      hint: "Mínimo 8 caracteres",
                                      label: "Senha Provisória",
                                      rules: [requiredRule, senhaRule],
                                      type: "password",
                                      variant: "outlined"
                                    }, null, 8, ["modelValue", "rules"])
                                  ]),
                                  _: 1
                                }),
                                createVNode(VCol, { cols: "12" }, {
                                  default: withCtx(() => [
                                    _cache[16] || (_cache[16] = createBaseVNode("label", { class: "text-body-2" }, "Tipo de Acesso", -1)),
                                    createVNode(VRadioGroup, {
                                      modelValue: novoUsuario.value.tipoCadastro,
                                      "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => novoUsuario.value.tipoCadastro = $event),
                                      inline: ""
                                    }, {
                                      default: withCtx(() => [
                                        (openBlock(true), createElementBlock(Fragment, null, renderList(tipoCadastroOptions.value, (opt) => {
                                          return openBlock(), createBlock(VRadio, {
                                            key: opt.value,
                                            label: opt.title,
                                            value: opt.value
                                          }, null, 8, ["label", "value"]);
                                        }), 128))
                                      ]),
                                      _: 1
                                    }, 8, ["modelValue"])
                                  ]),
                                  _: 1
                                }),
                                unref(authStore).isSuper && novoUsuario.value.tipoCadastro !== "super" ? (openBlock(), createBlock(VCol, {
                                  key: 0,
                                  cols: "12"
                                }, {
                                  default: withCtx(() => [
                                    createVNode(VAutocomplete, {
                                      modelValue: novoUsuario.value.unidadeId,
                                      "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => novoUsuario.value.unidadeId = $event),
                                      density: "compact",
                                      "item-title": "nome",
                                      "item-value": "id",
                                      items: unidades.value,
                                      label: "Unidade (delegacia)",
                                      rules: [requiredRule],
                                      variant: "outlined"
                                    }, null, 8, ["modelValue", "items", "rules"])
                                  ]),
                                  _: 1
                                })) : createCommentVNode("", true)
                              ]),
                              _: 1
                            })
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    }),
                    createVNode(VCardActions, null, {
                      default: withCtx(() => [
                        createVNode(VSpacer),
                        createVNode(VBtn, {
                          variant: "text",
                          onClick: fecharModalCadastro
                        }, {
                          default: withCtx(() => [..._cache[17] || (_cache[17] = [
                            createTextVNode("Cancelar", -1)
                          ])]),
                          _: 1
                        }),
                        createVNode(VBtn, {
                          color: "primary",
                          loading: loadingCadastro.value,
                          type: "submit"
                        }, {
                          default: withCtx(() => [..._cache[18] || (_cache[18] = [
                            createTextVNode(" Salvar ", -1)
                          ])]),
                          _: 1
                        }, 8, ["loading"])
                      ]),
                      _: 1
                    })
                  ]),
                  _: 1
                }, 512)
              ]),
              _: 1
            })
          ]),
          _: 1
        }, 8, ["modelValue"]),
        createVNode(VDialog, {
          modelValue: dialogEditar.value,
          "onUpdate:modelValue": _cache[9] || (_cache[9] = ($event) => dialogEditar.value = $event),
          "max-width": "600px",
          persistent: ""
        }, {
          default: withCtx(() => [
            createVNode(VCard, null, {
              default: withCtx(() => [
                createVNode(VForm, {
                  ref_key: "formEditarRef",
                  ref: formEditarRef,
                  onSubmit: withModifiers(handleSalvarEdicao, ["prevent"])
                }, {
                  default: withCtx(() => [
                    createVNode(VCardTitle, null, {
                      default: withCtx(() => [..._cache[19] || (_cache[19] = [
                        createBaseVNode("span", { class: "text-h5" }, "Editar Usuário", -1)
                      ])]),
                      _: 1
                    }),
                    createVNode(VCardText, null, {
                      default: withCtx(() => [
                        createVNode(VContainer, null, {
                          default: withCtx(() => [
                            createVNode(VRow, null, {
                              default: withCtx(() => [
                                createVNode(VCol, { cols: "12" }, {
                                  default: withCtx(() => [
                                    createVNode(VAutocomplete, {
                                      modelValue: edicao.value.userId,
                                      "onUpdate:modelValue": [
                                        _cache[6] || (_cache[6] = ($event) => edicao.value.userId = $event),
                                        onSelecionarUsuarioEdicao
                                      ],
                                      density: "compact",
                                      "item-title": "title",
                                      "item-value": "value",
                                      items: editUsersOptions.value,
                                      label: "Selecionar Usuário",
                                      placeholder: "Digite o nome ou matrícula...",
                                      rules: [requiredRule],
                                      variant: "outlined"
                                    }, null, 8, ["modelValue", "items", "rules"])
                                  ]),
                                  _: 1
                                }),
                                createVNode(VCol, { cols: "12" }, {
                                  default: withCtx(() => [
                                    _cache[20] || (_cache[20] = createBaseVNode("label", { class: "text-body-2" }, "Papel", -1)),
                                    createVNode(VRadioGroup, {
                                      modelValue: edicao.value.role,
                                      "onUpdate:modelValue": _cache[7] || (_cache[7] = ($event) => edicao.value.role = $event),
                                      inline: ""
                                    }, {
                                      default: withCtx(() => [
                                        (openBlock(true), createElementBlock(Fragment, null, renderList(tipoCadastroOptions.value, (opt) => {
                                          return openBlock(), createBlock(VRadio, {
                                            key: opt.value,
                                            label: opt.title,
                                            value: opt.value
                                          }, null, 8, ["label", "value"]);
                                        }), 128))
                                      ]),
                                      _: 1
                                    }, 8, ["modelValue"])
                                  ]),
                                  _: 1
                                }),
                                unref(authStore).isSuper && edicao.value.role !== "super" ? (openBlock(), createBlock(VCol, {
                                  key: 0,
                                  cols: "12"
                                }, {
                                  default: withCtx(() => [
                                    createVNode(VAutocomplete, {
                                      modelValue: edicao.value.unidadeId,
                                      "onUpdate:modelValue": _cache[8] || (_cache[8] = ($event) => edicao.value.unidadeId = $event),
                                      density: "compact",
                                      "item-title": "nome",
                                      "item-value": "id",
                                      items: unidades.value,
                                      label: "Unidade (delegacia)",
                                      rules: [requiredRule],
                                      variant: "outlined"
                                    }, null, 8, ["modelValue", "items", "rules"])
                                  ]),
                                  _: 1
                                })) : createCommentVNode("", true)
                              ]),
                              _: 1
                            })
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    }),
                    createVNode(VCardActions, null, {
                      default: withCtx(() => [
                        createVNode(VSpacer),
                        createVNode(VBtn, {
                          variant: "text",
                          onClick: fecharModalEditar
                        }, {
                          default: withCtx(() => [..._cache[21] || (_cache[21] = [
                            createTextVNode("Cancelar", -1)
                          ])]),
                          _: 1
                        }),
                        createVNode(VBtn, {
                          color: "primary",
                          loading: loadingEditar.value,
                          type: "submit"
                        }, {
                          default: withCtx(() => [..._cache[22] || (_cache[22] = [
                            createTextVNode("Salvar", -1)
                          ])]),
                          _: 1
                        }, 8, ["loading"])
                      ]),
                      _: 1
                    })
                  ]),
                  _: 1
                }, 512)
              ]),
              _: 1
            })
          ]),
          _: 1
        }, 8, ["modelValue"]),
        createVNode(VDialog, {
          modelValue: dialogReset.value,
          "onUpdate:modelValue": _cache[11] || (_cache[11] = ($event) => dialogReset.value = $event),
          "max-width": "500px",
          persistent: ""
        }, {
          default: withCtx(() => [
            createVNode(VCard, null, {
              default: withCtx(() => [
                createVNode(VForm, {
                  ref_key: "formResetRef",
                  ref: formResetRef,
                  onSubmit: withModifiers(handleResetarSenha, ["prevent"])
                }, {
                  default: withCtx(() => [
                    createVNode(VCardTitle, null, {
                      default: withCtx(() => [..._cache[23] || (_cache[23] = [
                        createBaseVNode("span", { class: "text-h5" }, "Resetar Senha de Usuário", -1)
                      ])]),
                      _: 1
                    }),
                    createVNode(VCardText, null, {
                      default: withCtx(() => [
                        createVNode(VContainer, null, {
                          default: withCtx(() => [
                            createVNode(VRow, null, {
                              default: withCtx(() => [
                                createVNode(VCol, { cols: "12" }, {
                                  default: withCtx(() => [
                                    createVNode(VAutocomplete, {
                                      modelValue: matriculaParaReset.value,
                                      "onUpdate:modelValue": _cache[10] || (_cache[10] = ($event) => matriculaParaReset.value = $event),
                                      density: "compact",
                                      "item-title": "title",
                                      "item-value": "value",
                                      items: __props.allUsersOptions,
                                      label: "Selecionar Usuário",
                                      placeholder: "Digite o nome ou matrícula...",
                                      rules: [requiredRule],
                                      variant: "outlined"
                                    }, null, 8, ["modelValue", "items", "rules"]),
                                    _cache[24] || (_cache[24] = createBaseVNode("div", { class: "text-caption pa-1" }, " Uma nova senha temporária será gerada automaticamente. ", -1))
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
                    }),
                    createVNode(VCardActions, null, {
                      default: withCtx(() => [
                        createVNode(VSpacer),
                        createVNode(VBtn, {
                          variant: "text",
                          onClick: fecharModalReset
                        }, {
                          default: withCtx(() => [..._cache[25] || (_cache[25] = [
                            createTextVNode("Cancelar", -1)
                          ])]),
                          _: 1
                        }),
                        createVNode(VBtn, {
                          color: "orange",
                          loading: loadingReset.value,
                          type: "submit"
                        }, {
                          default: withCtx(() => [..._cache[26] || (_cache[26] = [
                            createTextVNode(" Resetar Senha ", -1)
                          ])]),
                          _: 1
                        }, 8, ["loading"])
                      ]),
                      _: 1
                    })
                  ]),
                  _: 1
                }, 512)
              ]),
              _: 1
            })
          ]),
          _: 1
        }, 8, ["modelValue"]),
        createVNode(VDialog, {
          modelValue: dialogUpload.value,
          "onUpdate:modelValue": _cache[12] || (_cache[12] = ($event) => dialogUpload.value = $event),
          "max-width": "500px",
          persistent: ""
        }, {
          default: withCtx(() => [
            createVNode(VCard, null, {
              default: withCtx(() => [
                createVNode(VCardTitle, null, {
                  default: withCtx(() => [..._cache[27] || (_cache[27] = [
                    createBaseVNode("span", { class: "text-h5" }, "Importar e Atualizar CSV", -1)
                  ])]),
                  _: 1
                }),
                createVNode(VCardText, null, {
                  default: withCtx(() => [
                    createVNode(VContainer, null, {
                      default: withCtx(() => [
                        createVNode(VRow, null, {
                          default: withCtx(() => [
                            createVNode(VCol, { cols: "12" }, {
                              default: withCtx(() => [
                                createVNode(VFileInput, {
                                  accept: ".csv, text/csv",
                                  density: "compact",
                                  "error-messages": uploadError.value,
                                  label: "Selecionar arquivo CSV",
                                  variant: "outlined",
                                  onChange: onFileChange
                                }, null, 8, ["error-messages"]),
                                _cache[28] || (_cache[28] = createBaseVNode("div", { class: "text-caption pa-1" }, " O arquivo será processado pelo backend. Processos existentes serão atualizados se a data de intimação for mais recente. ", -1))
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
                }),
                createVNode(VCardActions, null, {
                  default: withCtx(() => [
                    createVNode(VSpacer),
                    createVNode(VBtn, {
                      variant: "text",
                      onClick: fecharModalUpload
                    }, {
                      default: withCtx(() => [..._cache[29] || (_cache[29] = [
                        createTextVNode("Cancelar", -1)
                      ])]),
                      _: 1
                    }),
                    createVNode(VBtn, {
                      color: "teal",
                      disabled: !csvFile.value,
                      loading: loadingUpload.value,
                      onClick: handleUploadCSV
                    }, {
                      default: withCtx(() => [..._cache[30] || (_cache[30] = [
                        createTextVNode(" Enviar e Processar ", -1)
                      ])]),
                      _: 1
                    }, 8, ["disabled", "loading"])
                  ]),
                  _: 1
                })
              ]),
              _: 1
            })
          ]),
          _: 1
        }, 8, ["modelValue"]),
        createVNode(VDialog, {
          modelValue: dialogDelete.value,
          "onUpdate:modelValue": _cache[14] || (_cache[14] = ($event) => dialogDelete.value = $event),
          "max-width": "500px",
          persistent: ""
        }, {
          default: withCtx(() => [
            createVNode(VCard, null, {
              default: withCtx(() => [
                createVNode(VForm, {
                  ref_key: "formDeleteRef",
                  ref: formDeleteRef,
                  onSubmit: withModifiers(handleDeleteUser, ["prevent"])
                }, {
                  default: withCtx(() => [
                    createVNode(VCardTitle, null, {
                      default: withCtx(() => [..._cache[31] || (_cache[31] = [
                        createBaseVNode("span", { class: "text-h5" }, "Apagar Usuário", -1)
                      ])]),
                      _: 1
                    }),
                    createVNode(VCardText, null, {
                      default: withCtx(() => [
                        createVNode(VContainer, null, {
                          default: withCtx(() => [
                            createVNode(VAlert, {
                              border: "start",
                              class: "mb-4",
                              prominent: "",
                              type: "error",
                              variant: "tonal"
                            }, {
                              default: withCtx(() => [..._cache[32] || (_cache[32] = [
                                createBaseVNode("strong", null, "Atenção:", -1),
                                createTextVNode(' Esta ação é permanente e não pode ser desfeita. Todos os processos atribuídos a este usuário ficarão "Não Atribuídos". ', -1)
                              ])]),
                              _: 1
                            }),
                            createVNode(VRow, null, {
                              default: withCtx(() => [
                                createVNode(VCol, { cols: "12" }, {
                                  default: withCtx(() => [
                                    createVNode(VAutocomplete, {
                                      modelValue: matriculaParaDelete.value,
                                      "onUpdate:modelValue": _cache[13] || (_cache[13] = ($event) => matriculaParaDelete.value = $event),
                                      density: "compact",
                                      "item-title": "title",
                                      "item-value": "value",
                                      items: __props.allUsersOptions,
                                      label: "Selecionar Usuário para Apagar",
                                      placeholder: "Digite o nome ou matrícula...",
                                      rules: [requiredRule],
                                      variant: "outlined"
                                    }, null, 8, ["modelValue", "items", "rules"])
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
                    }),
                    createVNode(VCardActions, null, {
                      default: withCtx(() => [
                        createVNode(VSpacer),
                        createVNode(VBtn, {
                          variant: "text",
                          onClick: fecharModalDelete
                        }, {
                          default: withCtx(() => [..._cache[33] || (_cache[33] = [
                            createTextVNode("Cancelar", -1)
                          ])]),
                          _: 1
                        }),
                        createVNode(VBtn, {
                          color: "red",
                          loading: loadingDelete.value,
                          type: "submit"
                        }, {
                          default: withCtx(() => [..._cache[34] || (_cache[34] = [
                            createTextVNode(" Apagar Usuário ", -1)
                          ])]),
                          _: 1
                        }, 8, ["loading"])
                      ]),
                      _: 1
                    })
                  ]),
                  _: 1
                }, 512)
              ]),
              _: 1
            })
          ]),
          _: 1
        }, 8, ["modelValue"])
      ], 64);
    };
  }
};
const makeVDatePickerControlsProps = propsFactory({
  active: {
    type: [String, Array],
    default: void 0
  },
  controlHeight: [Number, String],
  disabled: {
    type: [Boolean, String, Array],
    default: null
  },
  nextIcon: {
    type: IconValue,
    default: "$next"
  },
  prevIcon: {
    type: IconValue,
    default: "$prev"
  },
  modeIcon: {
    type: IconValue,
    default: "$subgroup"
  },
  text: String,
  viewMode: {
    type: String,
    default: "month"
  }
}, "VDatePickerControls");
const VDatePickerControls = genericComponent()({
  name: "VDatePickerControls",
  props: makeVDatePickerControlsProps(),
  emits: {
    "click:year": () => true,
    "click:month": () => true,
    "click:prev": () => true,
    "click:next": () => true,
    "click:text": () => true
  },
  setup(props, _ref) {
    let {
      emit
    } = _ref;
    const {
      t
    } = useLocale();
    const disableMonth = computed(() => {
      return Array.isArray(props.disabled) ? props.disabled.includes("text") : !!props.disabled;
    });
    const disableYear = computed(() => {
      return Array.isArray(props.disabled) ? props.disabled.includes("mode") : !!props.disabled;
    });
    const disablePrev = computed(() => {
      return Array.isArray(props.disabled) ? props.disabled.includes("prev") : !!props.disabled;
    });
    const disableNext = computed(() => {
      return Array.isArray(props.disabled) ? props.disabled.includes("next") : !!props.disabled;
    });
    function onClickPrev() {
      emit("click:prev");
    }
    function onClickNext() {
      emit("click:next");
    }
    function onClickYear() {
      emit("click:year");
    }
    function onClickMonth() {
      emit("click:month");
    }
    useRender(() => {
      return createBaseVNode("div", {
        "class": normalizeClass(["v-date-picker-controls"]),
        "style": {
          "--v-date-picker-controls-height": convertToUnit(props.controlHeight)
        }
      }, [createVNode(VBtn, {
        "class": "v-date-picker-controls__month-btn",
        "data-testid": "month-btn",
        "disabled": disableMonth.value,
        "text": props.text,
        "variant": "text",
        "rounded": true,
        "onClick": onClickMonth
      }, null), createVNode(VBtn, {
        "class": "v-date-picker-controls__mode-btn",
        "data-testid": "year-btn",
        "disabled": disableYear.value,
        "density": "comfortable",
        "icon": props.modeIcon,
        "variant": "text",
        "aria-label": t("$vuetify.datePicker.ariaLabel.selectYear"),
        "onClick": onClickYear
      }, null), createVNode(VSpacer, null, null), createBaseVNode("div", {
        "class": "v-date-picker-controls__month"
      }, [createVNode(VBtn, {
        "data-testid": "prev-month",
        "disabled": disablePrev.value,
        "density": "comfortable",
        "icon": props.prevIcon,
        "variant": "text",
        "aria-label": t("$vuetify.datePicker.ariaLabel.previousMonth"),
        "onClick": onClickPrev
      }, null), createVNode(VBtn, {
        "data-testid": "next-month",
        "disabled": disableNext.value,
        "icon": props.nextIcon,
        "density": "comfortable",
        "variant": "text",
        "aria-label": t("$vuetify.datePicker.ariaLabel.nextMonth"),
        "onClick": onClickNext
      }, null)])]);
    });
    return {};
  }
});
const makeVDatePickerHeaderProps = propsFactory({
  appendIcon: IconValue,
  color: String,
  header: String,
  transition: String,
  onClick: EventProp()
}, "VDatePickerHeader");
const VDatePickerHeader = genericComponent()({
  name: "VDatePickerHeader",
  props: makeVDatePickerHeaderProps(),
  emits: {
    click: () => true,
    "click:append": () => true
  },
  setup(props, _ref) {
    let {
      emit,
      slots
    } = _ref;
    const {
      backgroundColorClasses,
      backgroundColorStyles
    } = useBackgroundColor(() => props.color);
    function onClick() {
      emit("click");
    }
    function onClickAppend() {
      emit("click:append");
    }
    useRender(() => {
      const hasContent = !!(slots.default || props.header);
      const hasAppend = !!(slots.append || props.appendIcon);
      return createBaseVNode("div", {
        "class": normalizeClass(["v-date-picker-header", {
          "v-date-picker-header--clickable": !!props.onClick
        }, backgroundColorClasses.value]),
        "style": normalizeStyle(backgroundColorStyles.value),
        "onClick": onClick
      }, [slots.prepend && createBaseVNode("div", {
        "key": "prepend",
        "class": "v-date-picker-header__prepend"
      }, [slots.prepend()]), hasContent && createVNode(MaybeTransition, {
        "key": "content",
        "name": props.transition
      }, {
        default: () => [createBaseVNode("div", {
          "key": props.header,
          "class": "v-date-picker-header__content"
        }, [slots.default?.() ?? props.header])]
      }), hasAppend && createBaseVNode("div", {
        "class": "v-date-picker-header__append"
      }, [!slots.append ? createVNode(VBtn, {
        "key": "append-btn",
        "icon": props.appendIcon,
        "variant": "text",
        "onClick": onClickAppend
      }, null) : createVNode(VDefaultsProvider, {
        "key": "append-defaults",
        "disabled": !props.appendIcon,
        "defaults": {
          VBtn: {
            icon: props.appendIcon,
            variant: "text"
          }
        }
      }, {
        default: () => [slots.append?.()]
      })])]);
    });
    return {};
  }
});
const makeCalendarProps = propsFactory({
  allowedDates: [Array, Function],
  disabled: {
    type: Boolean,
    default: null
  },
  displayValue: null,
  modelValue: Array,
  month: [Number, String],
  max: null,
  min: null,
  showAdjacentMonths: Boolean,
  year: [Number, String],
  weekdays: {
    type: Array,
    default: () => [0, 1, 2, 3, 4, 5, 6]
  },
  weeksInMonth: {
    type: String,
    default: "dynamic"
  },
  firstDayOfWeek: {
    type: [Number, String],
    default: void 0
  },
  firstDayOfYear: {
    type: [Number, String],
    default: void 0
  },
  weekdayFormat: String
}, "calendar");
function useCalendar(props) {
  const adapter = useDate();
  const model = useProxiedModel(props, "modelValue", [], (v) => wrapInArray(v).map((i) => adapter.date(i)));
  const displayValue = computed(() => {
    if (props.displayValue) return adapter.date(props.displayValue);
    if (model.value.length > 0) return adapter.date(model.value[0]);
    if (props.min) return adapter.date(props.min);
    if (Array.isArray(props.allowedDates)) return adapter.date(props.allowedDates[0]);
    return adapter.date();
  });
  const year = useProxiedModel(props, "year", void 0, (v) => {
    const value = v != null ? Number(v) : adapter.getYear(displayValue.value);
    return adapter.startOfYear(adapter.setYear(adapter.date(), value));
  }, (v) => adapter.getYear(v));
  const month = useProxiedModel(props, "month", void 0, (v) => {
    const value = v != null ? Number(v) : adapter.getMonth(displayValue.value);
    const date = adapter.setYear(adapter.startOfMonth(adapter.date()), adapter.getYear(year.value));
    return adapter.setMonth(date, value);
  }, (v) => adapter.getMonth(v));
  const weekdayLabels = computed(() => {
    const firstDayOfWeek = adapter.toJsDate(adapter.startOfWeek(adapter.date(), props.firstDayOfWeek)).getDay();
    return adapter.getWeekdays(props.firstDayOfWeek, props.weekdayFormat).filter((_, i) => props.weekdays.includes((i + firstDayOfWeek) % 7));
  });
  const weeksInMonth = computed(() => {
    const weeks = adapter.getWeekArray(month.value, props.firstDayOfWeek);
    const days = weeks.flat();
    const daysInMonth2 = 6 * 7;
    if (props.weeksInMonth === "static" && days.length < daysInMonth2) {
      const lastDay = days[days.length - 1];
      let week = [];
      for (let day = 1; day <= daysInMonth2 - days.length; day++) {
        week.push(adapter.addDays(lastDay, day));
        if (day % 7 === 0) {
          weeks.push(week);
          week = [];
        }
      }
    }
    return weeks;
  });
  function genDays(days, today) {
    return days.filter((date) => {
      return props.weekdays.includes(adapter.toJsDate(date).getDay());
    }).map((date, index) => {
      const isoDate = adapter.toISO(date);
      const isAdjacent = !adapter.isSameMonth(date, month.value);
      const isStart = adapter.isSameDay(date, adapter.startOfMonth(month.value));
      const isEnd = adapter.isSameDay(date, adapter.endOfMonth(month.value));
      const isSame = adapter.isSameDay(date, month.value);
      const weekdaysCount = props.weekdays.length;
      return {
        date,
        formatted: adapter.format(date, "keyboardDate"),
        isAdjacent,
        isDisabled: isDisabled(date),
        isEnd,
        isHidden: isAdjacent && !props.showAdjacentMonths,
        isSame,
        isSelected: model.value.some((value) => adapter.isSameDay(date, value)),
        isStart,
        isToday: adapter.isSameDay(date, today),
        isWeekEnd: index % weekdaysCount === weekdaysCount - 1,
        isWeekStart: index % weekdaysCount === 0,
        isoDate,
        localized: adapter.format(date, "dayOfMonth"),
        month: adapter.getMonth(date),
        year: adapter.getYear(date)
      };
    });
  }
  const daysInWeek = computed(() => {
    const lastDay = adapter.startOfWeek(displayValue.value, props.firstDayOfWeek);
    const week = [];
    for (let day = 0; day <= 6; day++) {
      week.push(adapter.addDays(lastDay, day));
    }
    const today = adapter.date();
    return genDays(week, today);
  });
  const daysInMonth = computed(() => {
    const days = weeksInMonth.value.flat();
    const today = adapter.date();
    return genDays(days, today);
  });
  const weekNumbers = computed(() => {
    return weeksInMonth.value.map((week) => {
      return week.length ? adapter.getWeek(week[0], props.firstDayOfWeek, props.firstDayOfYear) : null;
    });
  });
  function isDisabled(value) {
    if (props.disabled) return true;
    const date = adapter.date(value);
    if (props.min && adapter.isBefore(adapter.endOfDay(date), adapter.date(props.min))) return true;
    if (props.max && adapter.isAfter(date, adapter.date(props.max))) return true;
    if (Array.isArray(props.allowedDates) && props.allowedDates.length > 0) {
      return !props.allowedDates.some((d) => adapter.isSameDay(adapter.date(d), date));
    }
    if (typeof props.allowedDates === "function") {
      return !props.allowedDates(date);
    }
    return false;
  }
  return {
    displayValue,
    daysInMonth,
    daysInWeek,
    genDays,
    model,
    weeksInMonth,
    weekdayLabels,
    weekNumbers
  };
}
const makeVDatePickerMonthProps = propsFactory({
  color: String,
  hideWeekdays: Boolean,
  multiple: [Boolean, Number, String],
  showWeek: Boolean,
  transition: {
    type: String,
    default: "picker-transition"
  },
  reverseTransition: {
    type: String,
    default: "picker-reverse-transition"
  },
  ...omit(makeCalendarProps(), ["displayValue"])
}, "VDatePickerMonth");
const VDatePickerMonth = genericComponent()({
  name: "VDatePickerMonth",
  props: makeVDatePickerMonthProps(),
  emits: {
    "update:modelValue": (date) => true,
    "update:month": (date) => true,
    "update:year": (date) => true
  },
  setup(props, _ref) {
    let {
      emit,
      slots
    } = _ref;
    const daysRef = ref();
    const {
      t
    } = useLocale();
    const {
      daysInMonth,
      model,
      weekNumbers,
      weekdayLabels
    } = useCalendar(props);
    const adapter = useDate();
    const rangeStart = shallowRef();
    const rangeStop = shallowRef();
    const isReverse = shallowRef(false);
    const transition = toRef(() => {
      return !isReverse.value ? props.transition : props.reverseTransition;
    });
    if (props.multiple === "range" && model.value.length > 0) {
      rangeStart.value = model.value[0];
      if (model.value.length > 1) {
        rangeStop.value = model.value[model.value.length - 1];
      }
    }
    const atMax = computed(() => {
      const max = ["number", "string"].includes(typeof props.multiple) ? Number(props.multiple) : Infinity;
      return model.value.length >= max;
    });
    watch(daysInMonth, (val, oldVal) => {
      if (!oldVal) return;
      isReverse.value = adapter.isBefore(val[0].date, oldVal[0].date);
    });
    function onRangeClick(value) {
      const _value = adapter.startOfDay(value);
      if (model.value.length === 0) {
        rangeStart.value = void 0;
      } else if (model.value.length === 1) {
        rangeStart.value = model.value[0];
        rangeStop.value = void 0;
      }
      if (!rangeStart.value) {
        rangeStart.value = _value;
        model.value = [rangeStart.value];
      } else if (!rangeStop.value) {
        if (adapter.isSameDay(_value, rangeStart.value)) {
          rangeStart.value = void 0;
          model.value = [];
          return;
        } else if (adapter.isBefore(_value, rangeStart.value)) {
          rangeStop.value = adapter.endOfDay(rangeStart.value);
          rangeStart.value = _value;
        } else {
          rangeStop.value = adapter.endOfDay(_value);
        }
        model.value = createDateRange(adapter, rangeStart.value, rangeStop.value);
      } else {
        rangeStart.value = value;
        rangeStop.value = void 0;
        model.value = [rangeStart.value];
      }
    }
    function getDateAriaLabel(item) {
      const fullDate = adapter.format(item.date, "fullDateWithWeekday");
      const localeKey = item.isToday ? "currentDate" : "selectDate";
      return t(`$vuetify.datePicker.ariaLabel.${localeKey}`, fullDate);
    }
    function onMultipleClick(value) {
      const index = model.value.findIndex((selection) => adapter.isSameDay(selection, value));
      if (index === -1) {
        model.value = [...model.value, value];
      } else {
        const value2 = [...model.value];
        value2.splice(index, 1);
        model.value = value2;
      }
    }
    function onClick(value) {
      if (props.multiple === "range") {
        onRangeClick(value);
      } else if (props.multiple) {
        onMultipleClick(value);
      } else {
        model.value = [value];
      }
    }
    useRender(() => createBaseVNode("div", {
      "class": "v-date-picker-month",
      "style": {
        "--v-date-picker-days-in-week": props.weekdays.length
      }
    }, [props.showWeek && createBaseVNode("div", {
      "key": "weeks",
      "class": "v-date-picker-month__weeks"
    }, [!props.hideWeekdays && createBaseVNode("div", {
      "key": "hide-week-days",
      "class": "v-date-picker-month__day"
    }, [createTextVNode(" ")]), weekNumbers.value.map((week) => createBaseVNode("div", {
      "class": normalizeClass(["v-date-picker-month__day", "v-date-picker-month__day--adjacent"])
    }, [week]))]), createVNode(MaybeTransition, {
      "name": transition.value
    }, {
      default: () => [createBaseVNode("div", {
        "ref": daysRef,
        "key": daysInMonth.value[0].date?.toString(),
        "class": "v-date-picker-month__days"
      }, [!props.hideWeekdays && weekdayLabels.value.map((weekDay) => createBaseVNode("div", {
        "class": normalizeClass(["v-date-picker-month__day", "v-date-picker-month__weekday"])
      }, [weekDay])), daysInMonth.value.map((item, i) => {
        const slotProps = {
          props: {
            class: "v-date-picker-month__day-btn",
            color: item.isSelected || item.isToday ? props.color : void 0,
            disabled: item.isDisabled,
            icon: true,
            ripple: false,
            text: item.localized,
            variant: item.isSelected ? "flat" : item.isToday ? "outlined" : "text",
            "aria-label": getDateAriaLabel(item),
            "aria-current": item.isToday ? "date" : void 0,
            onClick: () => onClick(item.date)
          },
          item,
          i
        };
        if (atMax.value && !item.isSelected) {
          item.isDisabled = true;
        }
        return createBaseVNode("div", {
          "class": normalizeClass(["v-date-picker-month__day", {
            "v-date-picker-month__day--adjacent": item.isAdjacent,
            "v-date-picker-month__day--hide-adjacent": item.isHidden,
            "v-date-picker-month__day--selected": item.isSelected,
            "v-date-picker-month__day--week-end": item.isWeekEnd,
            "v-date-picker-month__day--week-start": item.isWeekStart
          }]),
          "data-v-date": !item.isDisabled ? item.isoDate : void 0
        }, [(props.showAdjacentMonths || !item.isAdjacent) && (slots.day?.(slotProps) ?? createVNode(VBtn, slotProps.props, null))]);
      })])]
    })]));
  }
});
const makeVDatePickerMonthsProps = propsFactory({
  color: String,
  height: [String, Number],
  min: null,
  max: null,
  modelValue: Number,
  year: Number,
  allowedMonths: [Array, Function]
}, "VDatePickerMonths");
const VDatePickerMonths = genericComponent()({
  name: "VDatePickerMonths",
  props: makeVDatePickerMonthsProps(),
  emits: {
    "update:modelValue": (date) => true
  },
  setup(props, _ref) {
    let {
      emit,
      slots
    } = _ref;
    const adapter = useDate();
    const model = useProxiedModel(props, "modelValue");
    const months = computed(() => {
      let date = adapter.startOfYear(adapter.date());
      if (props.year) {
        date = adapter.setYear(date, props.year);
      }
      return createRange(12).map((i) => {
        const text = adapter.format(date, "monthShort");
        const label = adapter.format(date, "month");
        const isDisabled = !!(!isMonthAllowed(i) || props.min && adapter.isAfter(adapter.startOfMonth(adapter.date(props.min)), date) || props.max && adapter.isAfter(date, adapter.startOfMonth(adapter.date(props.max))));
        date = adapter.getNextMonth(date);
        return {
          isDisabled,
          text,
          label,
          value: i
        };
      });
    });
    watchEffect(() => {
      model.value = model.value ?? adapter.getMonth(adapter.date());
    });
    function isMonthAllowed(month) {
      if (Array.isArray(props.allowedMonths) && props.allowedMonths.length) {
        return props.allowedMonths.includes(month);
      }
      if (typeof props.allowedMonths === "function") {
        return props.allowedMonths(month);
      }
      return true;
    }
    useRender(() => createBaseVNode("div", {
      "class": "v-date-picker-months",
      "style": {
        height: convertToUnit(props.height)
      }
    }, [createBaseVNode("div", {
      "class": "v-date-picker-months__content"
    }, [months.value.map((month, i) => {
      const btnProps = {
        active: model.value === i,
        ariaLabel: month.label,
        color: model.value === i ? props.color : void 0,
        disabled: month.isDisabled,
        rounded: true,
        text: month.text,
        variant: model.value === month.value ? "flat" : "text",
        onClick: () => onClick(i)
      };
      function onClick(i2) {
        if (model.value === i2) {
          emit("update:modelValue", model.value);
          return;
        }
        model.value = i2;
      }
      return slots.month?.({
        month,
        i,
        props: btnProps
      }) ?? createVNode(VBtn, mergeProps({
        "key": "month"
      }, btnProps), null);
    })])]));
    return {};
  }
});
const makeVDatePickerYearsProps = propsFactory({
  color: String,
  height: [String, Number],
  min: null,
  max: null,
  modelValue: Number,
  allowedYears: [Array, Function]
}, "VDatePickerYears");
const VDatePickerYears = genericComponent()({
  name: "VDatePickerYears",
  props: makeVDatePickerYearsProps(),
  directives: {
    vIntersect: Intersect
  },
  emits: {
    "update:modelValue": (year) => true
  },
  setup(props, _ref) {
    let {
      emit,
      slots
    } = _ref;
    const adapter = useDate();
    const model = useProxiedModel(props, "modelValue");
    const years = computed(() => {
      const year = adapter.getYear(adapter.date());
      let min = year - 100;
      let max = year + 52;
      if (props.min) {
        min = adapter.getYear(adapter.date(props.min));
      }
      if (props.max) {
        max = adapter.getYear(adapter.date(props.max));
      }
      let date = adapter.startOfYear(adapter.date());
      date = adapter.setYear(date, min);
      return createRange(max - min + 1, min).map((i) => {
        const text = adapter.format(date, "year");
        date = adapter.setYear(date, adapter.getYear(date) + 1);
        return {
          text,
          value: i,
          isDisabled: !isYearAllowed(i)
        };
      });
    });
    watchEffect(() => {
      model.value = model.value ?? adapter.getYear(adapter.date());
    });
    const yearRef = templateRef();
    function focusSelectedYear() {
      yearRef.el?.focus();
      yearRef.el?.scrollIntoView({
        block: "center"
      });
    }
    function isYearAllowed(year) {
      if (Array.isArray(props.allowedYears) && props.allowedYears.length) {
        return props.allowedYears.includes(year);
      }
      if (typeof props.allowedYears === "function") {
        return props.allowedYears(year);
      }
      return true;
    }
    useRender(() => withDirectives(createBaseVNode("div", {
      "class": "v-date-picker-years",
      "style": {
        height: convertToUnit(props.height)
      }
    }, [createBaseVNode("div", {
      "class": "v-date-picker-years__content"
    }, [years.value.map((year, i) => {
      const btnProps = {
        ref: model.value === year.value ? yearRef : void 0,
        active: model.value === year.value,
        color: model.value === year.value ? props.color : void 0,
        rounded: true,
        text: year.text,
        disabled: year.isDisabled,
        variant: model.value === year.value ? "flat" : "text",
        onClick: () => {
          if (model.value === year.value) {
            emit("update:modelValue", model.value);
            return;
          }
          model.value = year.value;
        }
      };
      return slots.year?.({
        year,
        i,
        props: btnProps
      }) ?? createVNode(VBtn, mergeProps({
        "key": "month"
      }, btnProps), null);
    })])]), [[Intersect, {
      handler: focusSelectedYear
    }, null, {
      once: true
    }]]));
    return {};
  }
});
const VPickerTitle = createSimpleFunctional("v-picker-title");
const makeVPickerProps = propsFactory({
  bgColor: String,
  divided: Boolean,
  landscape: Boolean,
  title: String,
  hideHeader: Boolean,
  hideTitle: Boolean,
  ...makeVSheetProps()
}, "VPicker");
const VPicker = genericComponent()({
  name: "VPicker",
  props: makeVPickerProps(),
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    const {
      backgroundColorClasses,
      backgroundColorStyles
    } = useBackgroundColor(() => props.color);
    useRender(() => {
      const sheetProps = VSheet.filterProps(props);
      const hasTitle = !props.hideTitle && !!(props.title || slots.title);
      return createVNode(VSheet, mergeProps(sheetProps, {
        "color": props.bgColor,
        "class": ["v-picker", {
          "v-picker--divided": props.divided,
          "v-picker--landscape": props.landscape,
          "v-picker--with-actions": !!slots.actions
        }, props.class],
        "style": props.style
      }), {
        default: () => [!props.hideHeader && createBaseVNode("div", {
          "key": "header",
          "class": normalizeClass([backgroundColorClasses.value]),
          "style": normalizeStyle([backgroundColorStyles.value])
        }, [hasTitle && createVNode(VPickerTitle, {
          "key": "picker-title"
        }, {
          default: () => [slots.title?.() ?? props.title]
        }), slots.header && createBaseVNode("div", {
          "class": "v-picker__header"
        }, [slots.header()])]), createBaseVNode("div", {
          "class": "v-picker__body"
        }, [slots.default?.()]), slots.actions && createVNode(VDefaultsProvider, {
          "defaults": {
            VBtn: {
              slim: true,
              variant: "text"
            }
          }
        }, {
          default: () => [createBaseVNode("div", {
            "class": "v-picker__actions"
          }, [slots.actions()])]
        })]
      });
    });
    return {};
  }
});
const makeVDatePickerProps = propsFactory({
  // TODO: implement in v3.5
  // calendarIcon: {
  //   type: String,
  //   default: '$calendar',
  // },
  // keyboardIcon: {
  //   type: String,
  //   default: '$edit',
  // },
  // inputMode: {
  //   type: String as PropType<'calendar' | 'keyboard'>,
  //   default: 'calendar',
  // },
  // inputText: {
  //   type: String,
  //   default: '$vuetify.datePicker.input.placeholder',
  // },
  // inputPlaceholder: {
  //   type: String,
  //   default: 'dd/mm/yyyy',
  // },
  header: {
    type: String,
    default: "$vuetify.datePicker.header"
  },
  headerColor: String,
  ...makeVDatePickerControlsProps(),
  ...makeVDatePickerMonthProps({
    weeksInMonth: "static"
  }),
  ...omit(makeVDatePickerMonthsProps(), ["modelValue"]),
  ...omit(makeVDatePickerYearsProps(), ["modelValue"]),
  ...makeVPickerProps({
    title: "$vuetify.datePicker.title"
  }),
  modelValue: null
}, "VDatePicker");
const VDatePicker = genericComponent()({
  name: "VDatePicker",
  props: makeVDatePickerProps(),
  emits: {
    "update:modelValue": (date) => true,
    "update:month": (date) => true,
    "update:year": (date) => true,
    // 'update:inputMode': (date: any) => true,
    "update:viewMode": (date) => true
  },
  setup(props, _ref) {
    let {
      emit,
      slots
    } = _ref;
    const adapter = useDate();
    const {
      t
    } = useLocale();
    const {
      rtlClasses
    } = useRtl();
    const model = useProxiedModel(props, "modelValue", void 0, (v) => wrapInArray(v).map((i) => adapter.date(i)), (v) => props.multiple ? v : v[0]);
    const viewMode = useProxiedModel(props, "viewMode");
    const minDate = computed(() => {
      const date = adapter.date(props.min);
      return props.min && adapter.isValid(date) ? date : null;
    });
    const maxDate = computed(() => {
      const date = adapter.date(props.max);
      return props.max && adapter.isValid(date) ? date : null;
    });
    const internal = computed(() => {
      const today = adapter.date();
      let value = today;
      if (model.value?.[0]) {
        value = adapter.date(model.value[0]);
      } else if (minDate.value && adapter.isBefore(today, minDate.value)) {
        value = minDate.value;
      } else if (maxDate.value && adapter.isAfter(today, maxDate.value)) {
        value = maxDate.value;
      }
      return value && adapter.isValid(value) ? value : today;
    });
    const headerColor = toRef(() => props.headerColor ?? props.color);
    const _month = useProxiedModel(props, "month");
    const month = computed({
      get: () => Number(_month.value ?? adapter.getMonth(adapter.startOfMonth(internal.value))),
      set: (v) => _month.value = v
    });
    const _year = useProxiedModel(props, "year");
    const year = computed({
      get: () => Number(_year.value ?? adapter.getYear(adapter.startOfYear(adapter.setMonth(internal.value, month.value)))),
      set: (v) => _year.value = v
    });
    const isReversing = shallowRef(false);
    const header = computed(() => {
      if (props.multiple && model.value.length > 1) {
        return t("$vuetify.datePicker.itemsSelected", model.value.length);
      }
      return model.value[0] && adapter.isValid(model.value[0]) ? adapter.format(adapter.date(model.value[0]), "normalDateWithWeekday") : t(props.header);
    });
    const text = computed(() => {
      let date = adapter.date();
      date = adapter.setDate(date, 1);
      date = adapter.setMonth(date, month.value);
      date = adapter.setYear(date, year.value);
      return adapter.format(date, "monthAndYear");
    });
    const headerTransition = toRef(() => `date-picker-header${isReversing.value ? "-reverse" : ""}-transition`);
    const disabled = computed(() => {
      if (props.disabled) return true;
      const targets = [];
      if (viewMode.value !== "month") {
        targets.push(...["prev", "next"]);
      } else {
        let _date = adapter.date();
        _date = adapter.startOfMonth(_date);
        _date = adapter.setMonth(_date, month.value);
        _date = adapter.setYear(_date, year.value);
        if (minDate.value) {
          const date = adapter.addDays(adapter.startOfMonth(_date), -1);
          adapter.isAfter(minDate.value, date) && targets.push("prev");
        }
        if (maxDate.value) {
          const date = adapter.addDays(adapter.endOfMonth(_date), 1);
          adapter.isAfter(date, maxDate.value) && targets.push("next");
        }
      }
      return targets;
    });
    const allowedYears = computed(() => {
      return props.allowedYears || isYearAllowed;
    });
    const allowedMonths = computed(() => {
      return props.allowedMonths || isMonthAllowed;
    });
    function isAllowedInRange(start, end) {
      const allowedDates = props.allowedDates;
      if (typeof allowedDates !== "function") return true;
      const days = 1 + daysDiff(adapter, start, end);
      for (let i = 0; i < days; i++) {
        if (allowedDates(adapter.addDays(start, i))) return true;
      }
      return false;
    }
    function isYearAllowed(year2) {
      if (typeof props.allowedDates === "function") {
        const startOfYear = adapter.parseISO(`${year2}-01-01`);
        return isAllowedInRange(startOfYear, adapter.endOfYear(startOfYear));
      }
      if (Array.isArray(props.allowedDates) && props.allowedDates.length) {
        for (const date of props.allowedDates) {
          if (adapter.getYear(adapter.date(date)) === year2) return true;
        }
        return false;
      }
      return true;
    }
    function isMonthAllowed(month2) {
      if (typeof props.allowedDates === "function") {
        const monthTwoDigits = String(month2 + 1).padStart(2, "0");
        const startOfMonth = adapter.parseISO(`${year.value}-${monthTwoDigits}-01`);
        return isAllowedInRange(startOfMonth, adapter.endOfMonth(startOfMonth));
      }
      if (Array.isArray(props.allowedDates) && props.allowedDates.length) {
        for (const date of props.allowedDates) {
          if (adapter.getYear(adapter.date(date)) === year.value && adapter.getMonth(adapter.date(date)) === month2) return true;
        }
        return false;
      }
      return true;
    }
    function onClickNext() {
      if (month.value < 11) {
        month.value++;
      } else {
        year.value++;
        month.value = 0;
        onUpdateYear();
      }
      onUpdateMonth();
    }
    function onClickPrev() {
      if (month.value > 0) {
        month.value--;
      } else {
        year.value--;
        month.value = 11;
        onUpdateYear();
      }
      onUpdateMonth();
    }
    function onClickDate() {
      viewMode.value = "month";
    }
    function onClickMonth() {
      viewMode.value = viewMode.value === "months" ? "month" : "months";
    }
    function onClickYear() {
      viewMode.value = viewMode.value === "year" ? "month" : "year";
    }
    function onUpdateMonth() {
      if (viewMode.value === "months") onClickMonth();
    }
    function onUpdateYear() {
      if (viewMode.value === "year") onClickYear();
    }
    watch(model, (val, oldVal) => {
      const arrBefore = wrapInArray(oldVal);
      const arrAfter = wrapInArray(val);
      if (!arrAfter.length) return;
      const before = adapter.date(arrBefore[arrBefore.length - 1]);
      const after = adapter.date(arrAfter[arrAfter.length - 1]);
      const newMonth = adapter.getMonth(after);
      const newYear = adapter.getYear(after);
      if (newMonth !== month.value) {
        month.value = newMonth;
        onUpdateMonth();
      }
      if (newYear !== year.value) {
        year.value = newYear;
        onUpdateYear();
      }
      isReversing.value = adapter.isBefore(before, after);
    });
    useRender(() => {
      const pickerProps = VPicker.filterProps(props);
      const datePickerControlsProps = VDatePickerControls.filterProps(props);
      const datePickerHeaderProps = VDatePickerHeader.filterProps(props);
      const datePickerMonthProps = VDatePickerMonth.filterProps(props);
      const datePickerMonthsProps = omit(VDatePickerMonths.filterProps(props), ["modelValue"]);
      const datePickerYearsProps = omit(VDatePickerYears.filterProps(props), ["modelValue"]);
      const headerProps = {
        color: headerColor.value,
        header: header.value,
        transition: headerTransition.value
      };
      return createVNode(VPicker, mergeProps(pickerProps, {
        "color": headerColor.value,
        "class": ["v-date-picker", `v-date-picker--${viewMode.value}`, {
          "v-date-picker--show-week": props.showWeek
        }, rtlClasses.value, props.class],
        "style": props.style
      }), {
        title: () => slots.title?.() ?? createBaseVNode("div", {
          "class": "v-date-picker__title"
        }, [t(props.title)]),
        header: () => slots.header ? createVNode(VDefaultsProvider, {
          "defaults": {
            VDatePickerHeader: {
              ...headerProps
            }
          }
        }, {
          default: () => [slots.header?.(headerProps)]
        }) : createVNode(VDatePickerHeader, mergeProps({
          "key": "header"
        }, datePickerHeaderProps, headerProps, {
          "onClick": viewMode.value !== "month" ? onClickDate : void 0
        }), {
          prepend: slots.prepend,
          append: slots.append
        }),
        default: () => createBaseVNode(Fragment, null, [createVNode(VDatePickerControls, mergeProps(datePickerControlsProps, {
          "disabled": disabled.value,
          "text": text.value,
          "onClick:next": onClickNext,
          "onClick:prev": onClickPrev,
          "onClick:month": onClickMonth,
          "onClick:year": onClickYear
        }), null), createVNode(VFadeTransition, {
          "hideOnLeave": true
        }, {
          default: () => [viewMode.value === "months" ? createVNode(VDatePickerMonths, mergeProps({
            "key": "date-picker-months"
          }, datePickerMonthsProps, {
            "modelValue": month.value,
            "onUpdate:modelValue": [($event) => month.value = $event, onUpdateMonth],
            "min": minDate.value,
            "max": maxDate.value,
            "year": year.value,
            "allowedMonths": allowedMonths.value
          }), {
            month: slots.month
          }) : viewMode.value === "year" ? createVNode(VDatePickerYears, mergeProps({
            "key": "date-picker-years"
          }, datePickerYearsProps, {
            "modelValue": year.value,
            "onUpdate:modelValue": [($event) => year.value = $event, onUpdateYear],
            "min": minDate.value,
            "max": maxDate.value,
            "allowedYears": allowedYears.value
          }), {
            year: slots.year
          }) : createVNode(VDatePickerMonth, mergeProps({
            "key": "date-picker-month"
          }, datePickerMonthProps, {
            "modelValue": model.value,
            "onUpdate:modelValue": ($event) => model.value = $event,
            "month": month.value,
            "onUpdate:month": [($event) => month.value = $event, onUpdateMonth],
            "year": year.value,
            "onUpdate:year": [($event) => year.value = $event, onUpdateYear],
            "min": minDate.value,
            "max": maxDate.value
          }), {
            day: slots.day
          })]
        })]),
        actions: slots.actions
      });
    });
    return {};
  }
});
const VExpansionPanelSymbol = /* @__PURE__ */ Symbol.for("vuetify:v-expansion-panel");
const makeVExpansionPanelTextProps = propsFactory({
  ...makeComponentProps(),
  ...makeLazyProps()
}, "VExpansionPanelText");
const VExpansionPanelText = genericComponent()({
  name: "VExpansionPanelText",
  props: makeVExpansionPanelTextProps(),
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    const expansionPanel = inject(VExpansionPanelSymbol);
    if (!expansionPanel) throw new Error("[Vuetify] v-expansion-panel-text needs to be placed inside v-expansion-panel");
    const {
      hasContent,
      onAfterLeave
    } = useLazy(props, expansionPanel.isSelected);
    useRender(() => createVNode(VExpandTransition, {
      "onAfterLeave": onAfterLeave
    }, {
      default: () => [withDirectives(createBaseVNode("div", {
        "class": normalizeClass(["v-expansion-panel-text", props.class]),
        "style": normalizeStyle(props.style)
      }, [slots.default && hasContent.value && createBaseVNode("div", {
        "class": "v-expansion-panel-text__wrapper"
      }, [slots.default?.()])]), [[vShow, expansionPanel.isSelected.value]])]
    }));
    return {};
  }
});
const makeVExpansionPanelTitleProps = propsFactory({
  color: String,
  expandIcon: {
    type: IconValue,
    default: "$expand"
  },
  collapseIcon: {
    type: IconValue,
    default: "$collapse"
  },
  hideActions: Boolean,
  focusable: Boolean,
  static: Boolean,
  ripple: {
    type: [Boolean, Object],
    default: false
  },
  readonly: Boolean,
  ...makeComponentProps(),
  ...makeDimensionProps()
}, "VExpansionPanelTitle");
const VExpansionPanelTitle = genericComponent()({
  name: "VExpansionPanelTitle",
  directives: {
    vRipple: Ripple
  },
  props: makeVExpansionPanelTitleProps(),
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    const expansionPanel = inject(VExpansionPanelSymbol);
    if (!expansionPanel) throw new Error("[Vuetify] v-expansion-panel-title needs to be placed inside v-expansion-panel");
    const {
      backgroundColorClasses,
      backgroundColorStyles
    } = useBackgroundColor(() => props.color);
    const {
      dimensionStyles
    } = useDimension(props);
    const slotProps = computed(() => ({
      collapseIcon: props.collapseIcon,
      disabled: expansionPanel.disabled.value,
      expanded: expansionPanel.isSelected.value,
      expandIcon: props.expandIcon,
      readonly: props.readonly
    }));
    const icon = toRef(() => expansionPanel.isSelected.value ? props.collapseIcon : props.expandIcon);
    useRender(() => withDirectives(createBaseVNode("button", {
      "class": normalizeClass(["v-expansion-panel-title", {
        "v-expansion-panel-title--active": expansionPanel.isSelected.value,
        "v-expansion-panel-title--focusable": props.focusable,
        "v-expansion-panel-title--static": props.static
      }, backgroundColorClasses.value, props.class]),
      "style": normalizeStyle([backgroundColorStyles.value, dimensionStyles.value, props.style]),
      "type": "button",
      "tabindex": expansionPanel.disabled.value ? -1 : void 0,
      "disabled": expansionPanel.disabled.value,
      "aria-expanded": expansionPanel.isSelected.value,
      "onClick": !props.readonly ? expansionPanel.toggle : void 0
    }, [createBaseVNode("span", {
      "class": "v-expansion-panel-title__overlay"
    }, null), slots.default?.(slotProps.value), !props.hideActions && createVNode(VDefaultsProvider, {
      "defaults": {
        VIcon: {
          icon: icon.value
        }
      }
    }, {
      default: () => [createBaseVNode("span", {
        "class": "v-expansion-panel-title__icon"
      }, [slots.actions?.(slotProps.value) ?? createVNode(VIcon, null, null)])]
    })]), [[Ripple, props.ripple]]));
    return {};
  }
});
const makeVExpansionPanelProps = propsFactory({
  title: String,
  text: String,
  bgColor: String,
  ...makeElevationProps(),
  ...makeGroupItemProps(),
  ...makeRoundedProps(),
  ...makeTagProps(),
  ...makeVExpansionPanelTitleProps(),
  ...makeVExpansionPanelTextProps()
}, "VExpansionPanel");
const VExpansionPanel = genericComponent()({
  name: "VExpansionPanel",
  props: makeVExpansionPanelProps(),
  emits: {
    "group:selected": (val) => true
  },
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    const groupItem = useGroupItem(props, VExpansionPanelSymbol);
    const {
      backgroundColorClasses,
      backgroundColorStyles
    } = useBackgroundColor(() => props.bgColor);
    const {
      elevationClasses
    } = useElevation(props);
    const {
      roundedClasses
    } = useRounded(props);
    const isDisabled = toRef(() => groupItem?.disabled.value || props.disabled);
    const selectedIndices = computed(() => groupItem.group.items.value.reduce((arr, item, index) => {
      if (groupItem.group.selected.value.includes(item.id)) arr.push(index);
      return arr;
    }, []));
    const isBeforeSelected = computed(() => {
      const index = groupItem.group.items.value.findIndex((item) => item.id === groupItem.id);
      return !groupItem.isSelected.value && selectedIndices.value.some((selectedIndex) => selectedIndex - index === 1);
    });
    const isAfterSelected = computed(() => {
      const index = groupItem.group.items.value.findIndex((item) => item.id === groupItem.id);
      return !groupItem.isSelected.value && selectedIndices.value.some((selectedIndex) => selectedIndex - index === -1);
    });
    provide(VExpansionPanelSymbol, groupItem);
    useRender(() => {
      const hasText = !!(slots.text || props.text);
      const hasTitle = !!(slots.title || props.title);
      const expansionPanelTitleProps = VExpansionPanelTitle.filterProps(props);
      const expansionPanelTextProps = VExpansionPanelText.filterProps(props);
      return createVNode(props.tag, {
        "class": normalizeClass(["v-expansion-panel", {
          "v-expansion-panel--active": groupItem.isSelected.value,
          "v-expansion-panel--before-active": isBeforeSelected.value,
          "v-expansion-panel--after-active": isAfterSelected.value,
          "v-expansion-panel--disabled": isDisabled.value
        }, roundedClasses.value, backgroundColorClasses.value, props.class]),
        "style": normalizeStyle([backgroundColorStyles.value, props.style])
      }, {
        default: () => [createBaseVNode("div", {
          "class": normalizeClass(["v-expansion-panel__shadow", ...elevationClasses.value])
        }, null), createVNode(VDefaultsProvider, {
          "defaults": {
            VExpansionPanelTitle: {
              ...expansionPanelTitleProps
            },
            VExpansionPanelText: {
              ...expansionPanelTextProps
            }
          }
        }, {
          default: () => [hasTitle && createVNode(VExpansionPanelTitle, {
            "key": "title"
          }, {
            default: () => [slots.title ? slots.title() : props.title]
          }), hasText && createVNode(VExpansionPanelText, {
            "key": "text"
          }, {
            default: () => [slots.text ? slots.text() : props.text]
          }), slots.default?.()]
        })]
      });
    });
    return {
      groupItem
    };
  }
});
const allowedVariants = ["default", "accordion", "inset", "popout"];
const makeVExpansionPanelsProps = propsFactory({
  flat: Boolean,
  ...makeGroupProps(),
  ...pick(makeVExpansionPanelProps(), ["bgColor", "collapseIcon", "color", "eager", "elevation", "expandIcon", "focusable", "hideActions", "readonly", "ripple", "rounded", "tile", "static"]),
  ...makeThemeProps(),
  ...makeComponentProps(),
  ...makeTagProps(),
  variant: {
    type: String,
    default: "default",
    validator: (v) => allowedVariants.includes(v)
  }
}, "VExpansionPanels");
const VExpansionPanels = genericComponent()({
  name: "VExpansionPanels",
  props: makeVExpansionPanelsProps(),
  emits: {
    "update:modelValue": (val) => true
  },
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    const {
      next,
      prev
    } = useGroup(props, VExpansionPanelSymbol);
    const {
      themeClasses
    } = provideTheme(props);
    const variantClass = toRef(() => props.variant && `v-expansion-panels--variant-${props.variant}`);
    provideDefaults({
      VExpansionPanel: {
        bgColor: toRef(() => props.bgColor),
        collapseIcon: toRef(() => props.collapseIcon),
        color: toRef(() => props.color),
        eager: toRef(() => props.eager),
        elevation: toRef(() => props.elevation),
        expandIcon: toRef(() => props.expandIcon),
        focusable: toRef(() => props.focusable),
        hideActions: toRef(() => props.hideActions),
        readonly: toRef(() => props.readonly),
        ripple: toRef(() => props.ripple),
        rounded: toRef(() => props.rounded),
        static: toRef(() => props.static)
      }
    });
    useRender(() => createVNode(props.tag, {
      "class": normalizeClass(["v-expansion-panels", {
        "v-expansion-panels--flat": props.flat,
        "v-expansion-panels--tile": props.tile
      }, themeClasses.value, variantClass.value, props.class]),
      "style": normalizeStyle(props.style)
    }, {
      default: () => [slots.default?.({
        prev,
        next
      })]
    }));
    return {
      next,
      prev
    };
  }
});
function useSticky(_ref) {
  let {
    rootEl,
    isSticky,
    layoutItemStyles
  } = _ref;
  const isStuck = shallowRef(false);
  const stuckPosition = shallowRef(0);
  const stickyStyles = computed(() => {
    const side = typeof isStuck.value === "boolean" ? "top" : isStuck.value;
    return [isSticky.value ? {
      top: "auto",
      bottom: "auto",
      height: void 0
    } : void 0, isStuck.value ? {
      [side]: convertToUnit(stuckPosition.value)
    } : {
      top: layoutItemStyles.value.top
    }];
  });
  onMounted(() => {
    watch(isSticky, (val) => {
      if (val) {
        window.addEventListener("scroll", onScroll, {
          passive: true
        });
      } else {
        window.removeEventListener("scroll", onScroll);
      }
    }, {
      immediate: true
    });
  });
  onBeforeUnmount(() => {
    window.removeEventListener("scroll", onScroll);
  });
  let lastScrollTop = 0;
  function onScroll() {
    const direction = lastScrollTop > window.scrollY ? "up" : "down";
    const rect = rootEl.value.getBoundingClientRect();
    const layoutTop = parseFloat(layoutItemStyles.value.top ?? 0);
    const top = window.scrollY - Math.max(0, stuckPosition.value - layoutTop);
    const bottom = rect.height + Math.max(stuckPosition.value, layoutTop) - window.scrollY - window.innerHeight;
    const bodyScroll = parseFloat(getComputedStyle(rootEl.value).getPropertyValue("--v-body-scroll-y")) || 0;
    if (rect.height < window.innerHeight - layoutTop) {
      isStuck.value = "top";
      stuckPosition.value = layoutTop;
    } else if (direction === "up" && isStuck.value === "bottom" || direction === "down" && isStuck.value === "top") {
      stuckPosition.value = window.scrollY + rect.top - bodyScroll;
      isStuck.value = true;
    } else if (direction === "down" && bottom <= 0) {
      stuckPosition.value = 0;
      isStuck.value = "bottom";
    } else if (direction === "up" && top <= 0) {
      if (!bodyScroll) {
        stuckPosition.value = rect.top + top;
        isStuck.value = "top";
      } else if (isStuck.value !== "top") {
        stuckPosition.value = -top + bodyScroll + layoutTop;
        isStuck.value = "top";
      }
    }
    lastScrollTop = window.scrollY;
  }
  return {
    isStuck,
    stickyStyles
  };
}
const HORIZON = 100;
const HISTORY = 20;
function kineticEnergyToVelocity(work) {
  const sqrt2 = 1.41421356237;
  return (work < 0 ? -1 : 1) * Math.sqrt(Math.abs(work)) * sqrt2;
}
function calculateImpulseVelocity(samples) {
  if (samples.length < 2) {
    return 0;
  }
  if (samples.length === 2) {
    if (samples[1].t === samples[0].t) {
      return 0;
    }
    return (samples[1].d - samples[0].d) / (samples[1].t - samples[0].t);
  }
  let work = 0;
  for (let i = samples.length - 1; i > 0; i--) {
    if (samples[i].t === samples[i - 1].t) {
      continue;
    }
    const vprev = kineticEnergyToVelocity(work);
    const vcurr = (samples[i].d - samples[i - 1].d) / (samples[i].t - samples[i - 1].t);
    work += (vcurr - vprev) * Math.abs(vcurr);
    if (i === samples.length - 1) {
      work *= 0.5;
    }
  }
  return kineticEnergyToVelocity(work) * 1e3;
}
function useVelocity() {
  const touches = {};
  function addMovement(e) {
    Array.from(e.changedTouches).forEach((touch) => {
      const samples = touches[touch.identifier] ?? (touches[touch.identifier] = new CircularBuffer(HISTORY));
      samples.push([e.timeStamp, touch]);
    });
  }
  function endTouch(e) {
    Array.from(e.changedTouches).forEach((touch) => {
      delete touches[touch.identifier];
    });
  }
  function getVelocity(id) {
    const samples = touches[id]?.values().reverse();
    if (!samples) {
      throw new Error(`No samples for touch id ${id}`);
    }
    const newest = samples[0];
    const x = [];
    const y = [];
    for (const val of samples) {
      if (newest[0] - val[0] > HORIZON) break;
      x.push({
        t: val[0],
        d: val[1].clientX
      });
      y.push({
        t: val[0],
        d: val[1].clientY
      });
    }
    return {
      x: calculateImpulseVelocity(x),
      y: calculateImpulseVelocity(y),
      get direction() {
        const {
          x: x2,
          y: y2
        } = this;
        const [absX, absY] = [Math.abs(x2), Math.abs(y2)];
        return absX > absY && x2 >= 0 ? "right" : absX > absY && x2 <= 0 ? "left" : absY > absX && y2 >= 0 ? "down" : absY > absX && y2 <= 0 ? "up" : oops$1();
      }
    };
  }
  return {
    addMovement,
    endTouch,
    getVelocity
  };
}
function oops$1() {
  throw new Error();
}
function useTouch(_ref) {
  let {
    el,
    isActive,
    isTemporary,
    width,
    touchless,
    position
  } = _ref;
  onMounted(() => {
    window.addEventListener("touchstart", onTouchstart, {
      passive: true
    });
    window.addEventListener("touchmove", onTouchmove, {
      passive: false
    });
    window.addEventListener("touchend", onTouchend, {
      passive: true
    });
  });
  onBeforeUnmount(() => {
    window.removeEventListener("touchstart", onTouchstart);
    window.removeEventListener("touchmove", onTouchmove);
    window.removeEventListener("touchend", onTouchend);
  });
  const isHorizontal = computed(() => ["left", "right"].includes(position.value));
  const {
    addMovement,
    endTouch,
    getVelocity
  } = useVelocity();
  let maybeDragging = false;
  const isDragging = shallowRef(false);
  const dragProgress = shallowRef(0);
  const offset = shallowRef(0);
  let start;
  function getOffset(pos, active) {
    return (position.value === "left" ? pos : position.value === "right" ? document.documentElement.clientWidth - pos : position.value === "top" ? pos : position.value === "bottom" ? document.documentElement.clientHeight - pos : oops()) - (active ? width.value : 0);
  }
  function getProgress(pos) {
    let limit = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : true;
    const progress = position.value === "left" ? (pos - offset.value) / width.value : position.value === "right" ? (document.documentElement.clientWidth - pos - offset.value) / width.value : position.value === "top" ? (pos - offset.value) / width.value : position.value === "bottom" ? (document.documentElement.clientHeight - pos - offset.value) / width.value : oops();
    return limit ? clamp(progress) : progress;
  }
  function onTouchstart(e) {
    if (touchless.value) return;
    const touchX = e.changedTouches[0].clientX;
    const touchY = e.changedTouches[0].clientY;
    const touchZone = 25;
    const inTouchZone = position.value === "left" ? touchX < touchZone : position.value === "right" ? touchX > document.documentElement.clientWidth - touchZone : position.value === "top" ? touchY < touchZone : position.value === "bottom" ? touchY > document.documentElement.clientHeight - touchZone : oops();
    const inElement = isActive.value && (position.value === "left" ? touchX < width.value : position.value === "right" ? touchX > document.documentElement.clientWidth - width.value : position.value === "top" ? touchY < width.value : position.value === "bottom" ? touchY > document.documentElement.clientHeight - width.value : oops());
    if (inTouchZone || inElement || isActive.value && isTemporary.value) {
      start = [touchX, touchY];
      offset.value = getOffset(isHorizontal.value ? touchX : touchY, isActive.value);
      dragProgress.value = getProgress(isHorizontal.value ? touchX : touchY);
      maybeDragging = offset.value > -20 && offset.value < 80;
      endTouch(e);
      addMovement(e);
    }
  }
  function onTouchmove(e) {
    const touchX = e.changedTouches[0].clientX;
    const touchY = e.changedTouches[0].clientY;
    if (maybeDragging) {
      if (!e.cancelable) {
        maybeDragging = false;
        return;
      }
      const dx = Math.abs(touchX - start[0]);
      const dy = Math.abs(touchY - start[1]);
      const thresholdMet = isHorizontal.value ? dx > dy && dx > 3 : dy > dx && dy > 3;
      if (thresholdMet) {
        isDragging.value = true;
        maybeDragging = false;
      } else if ((isHorizontal.value ? dy : dx) > 3) {
        maybeDragging = false;
      }
    }
    if (!isDragging.value) return;
    e.preventDefault();
    addMovement(e);
    const progress = getProgress(isHorizontal.value ? touchX : touchY, false);
    dragProgress.value = Math.max(0, Math.min(1, progress));
    if (progress > 1) {
      offset.value = getOffset(isHorizontal.value ? touchX : touchY, true);
    } else if (progress < 0) {
      offset.value = getOffset(isHorizontal.value ? touchX : touchY, false);
    }
  }
  function onTouchend(e) {
    maybeDragging = false;
    if (!isDragging.value) return;
    addMovement(e);
    isDragging.value = false;
    const velocity = getVelocity(e.changedTouches[0].identifier);
    const vx = Math.abs(velocity.x);
    const vy = Math.abs(velocity.y);
    const thresholdMet = isHorizontal.value ? vx > vy && vx > 400 : vy > vx && vy > 3;
    if (thresholdMet) {
      isActive.value = velocity.direction === ({
        left: "right",
        right: "left",
        top: "down",
        bottom: "up"
      }[position.value] || oops());
    } else {
      isActive.value = dragProgress.value > 0.5;
    }
  }
  const dragStyles = computed(() => {
    return isDragging.value ? {
      transform: position.value === "left" ? `translateX(calc(-100% + ${dragProgress.value * width.value}px))` : position.value === "right" ? `translateX(calc(100% - ${dragProgress.value * width.value}px))` : position.value === "top" ? `translateY(calc(-100% + ${dragProgress.value * width.value}px))` : position.value === "bottom" ? `translateY(calc(100% - ${dragProgress.value * width.value}px))` : oops(),
      transition: "none"
    } : void 0;
  });
  useToggleScope(isDragging, () => {
    const transform = el.value?.style.transform ?? null;
    const transition = el.value?.style.transition ?? null;
    watchEffect(() => {
      el.value?.style.setProperty("transform", dragStyles.value?.transform || "none");
      el.value?.style.setProperty("transition", dragStyles.value?.transition || null);
    });
    onScopeDispose(() => {
      el.value?.style.setProperty("transform", transform);
      el.value?.style.setProperty("transition", transition);
    });
  });
  return {
    isDragging,
    dragProgress,
    dragStyles
  };
}
function oops() {
  throw new Error();
}
const locations = ["start", "end", "left", "right", "top", "bottom"];
const makeVNavigationDrawerProps = propsFactory({
  color: String,
  disableResizeWatcher: Boolean,
  disableRouteWatcher: Boolean,
  expandOnHover: Boolean,
  floating: Boolean,
  modelValue: {
    type: Boolean,
    default: null
  },
  permanent: Boolean,
  rail: {
    type: Boolean,
    default: null
  },
  railWidth: {
    type: [Number, String],
    default: 56
  },
  scrim: {
    type: [Boolean, String],
    default: true
  },
  image: String,
  temporary: Boolean,
  persistent: Boolean,
  touchless: Boolean,
  width: {
    type: [Number, String],
    default: 256
  },
  location: {
    type: String,
    default: "start",
    validator: (value) => locations.includes(value)
  },
  sticky: Boolean,
  ...makeBorderProps(),
  ...makeComponentProps(),
  ...makeDelayProps(),
  ...makeDisplayProps({
    mobile: null
  }),
  ...makeElevationProps(),
  ...makeLayoutItemProps(),
  ...makeRoundedProps(),
  ...makeTagProps({
    tag: "nav"
  }),
  ...makeThemeProps()
}, "VNavigationDrawer");
const VNavigationDrawer = genericComponent()({
  name: "VNavigationDrawer",
  props: makeVNavigationDrawerProps(),
  emits: {
    "update:modelValue": (val) => true,
    "update:rail": (val) => true
  },
  setup(props, _ref) {
    let {
      attrs,
      emit,
      slots
    } = _ref;
    const {
      isRtl
    } = useRtl();
    const {
      themeClasses
    } = provideTheme(props);
    const {
      borderClasses
    } = useBorder(props);
    const {
      backgroundColorClasses,
      backgroundColorStyles
    } = useBackgroundColor(() => props.color);
    const {
      elevationClasses
    } = useElevation(props);
    const {
      displayClasses,
      mobile
    } = useDisplay(props);
    const {
      roundedClasses
    } = useRounded(props);
    const router = useRouter();
    const isActive = useProxiedModel(props, "modelValue", null, (v) => !!v);
    const {
      ssrBootStyles
    } = useSsrBoot();
    const {
      scopeId
    } = useScopeId();
    const rootEl = ref();
    const isHovering = shallowRef(false);
    const {
      runOpenDelay,
      runCloseDelay
    } = useDelay(props, (value) => {
      isHovering.value = value;
    });
    const width = computed(() => {
      return props.rail && props.expandOnHover && isHovering.value ? Number(props.width) : Number(props.rail ? props.railWidth : props.width);
    });
    const location = computed(() => {
      return toPhysical(props.location, isRtl.value);
    });
    const isPersistent = toRef(() => props.persistent);
    const isTemporary = computed(() => !props.permanent && (mobile.value || props.temporary));
    const isSticky = computed(() => props.sticky && !isTemporary.value && location.value !== "bottom");
    useToggleScope(() => props.expandOnHover && props.rail != null, () => {
      watch(isHovering, (val) => emit("update:rail", !val));
    });
    useToggleScope(() => !props.disableResizeWatcher, () => {
      watch(isTemporary, (val) => !props.permanent && nextTick(() => isActive.value = !val));
    });
    useToggleScope(() => !props.disableRouteWatcher && !!router, () => {
      watch(router.currentRoute, () => isTemporary.value && (isActive.value = false));
    });
    watch(() => props.permanent, (val) => {
      if (val) isActive.value = true;
    });
    if (props.modelValue == null && !isTemporary.value) {
      isActive.value = props.permanent || !mobile.value;
    }
    const {
      isDragging,
      dragProgress
    } = useTouch({
      el: rootEl,
      isActive,
      isTemporary,
      width,
      touchless: toRef(() => props.touchless),
      position: location
    });
    const layoutSize = computed(() => {
      const size = isTemporary.value ? 0 : props.rail && props.expandOnHover ? Number(props.railWidth) : width.value;
      return isDragging.value ? size * dragProgress.value : size;
    });
    const {
      layoutItemStyles,
      layoutItemScrimStyles
    } = useLayoutItem({
      id: props.name,
      order: computed(() => parseInt(props.order, 10)),
      position: location,
      layoutSize,
      elementSize: width,
      active: readonly(isActive),
      disableTransitions: toRef(() => isDragging.value),
      absolute: computed(() => (
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        props.absolute || isSticky.value && typeof isStuck.value !== "string"
      ))
    });
    const {
      isStuck,
      stickyStyles
    } = useSticky({
      rootEl,
      isSticky,
      layoutItemStyles
    });
    const scrimColor = useBackgroundColor(() => {
      return typeof props.scrim === "string" ? props.scrim : null;
    });
    const scrimStyles = computed(() => ({
      ...isDragging.value ? {
        opacity: dragProgress.value * 0.2,
        transition: "none"
      } : void 0,
      ...layoutItemScrimStyles.value
    }));
    provideDefaults({
      VList: {
        bgColor: "transparent"
      }
    });
    useRender(() => {
      const hasImage = slots.image || props.image;
      return createBaseVNode(Fragment, null, [createVNode(props.tag, mergeProps({
        "ref": rootEl,
        "onMouseenter": runOpenDelay,
        "onMouseleave": runCloseDelay,
        "class": ["v-navigation-drawer", `v-navigation-drawer--${location.value}`, {
          "v-navigation-drawer--expand-on-hover": props.expandOnHover,
          "v-navigation-drawer--floating": props.floating,
          "v-navigation-drawer--is-hovering": isHovering.value,
          "v-navigation-drawer--rail": props.rail,
          "v-navigation-drawer--temporary": isTemporary.value,
          "v-navigation-drawer--persistent": isPersistent.value,
          "v-navigation-drawer--active": isActive.value,
          "v-navigation-drawer--sticky": isSticky.value
        }, themeClasses.value, backgroundColorClasses.value, borderClasses.value, displayClasses.value, elevationClasses.value, roundedClasses.value, props.class],
        "style": [backgroundColorStyles.value, layoutItemStyles.value, ssrBootStyles.value, stickyStyles.value, props.style]
      }, scopeId, attrs), {
        default: () => [hasImage && createBaseVNode("div", {
          "key": "image",
          "class": "v-navigation-drawer__img"
        }, [!slots.image ? createVNode(VImg, {
          "key": "image-img",
          "alt": "",
          "cover": true,
          "height": "inherit",
          "src": props.image
        }, null) : createVNode(VDefaultsProvider, {
          "key": "image-defaults",
          "disabled": !props.image,
          "defaults": {
            VImg: {
              alt: "",
              cover: true,
              height: "inherit",
              src: props.image
            }
          }
        }, slots.image)]), slots.prepend && createBaseVNode("div", {
          "class": "v-navigation-drawer__prepend"
        }, [slots.prepend?.()]), createBaseVNode("div", {
          "class": "v-navigation-drawer__content"
        }, [slots.default?.()]), slots.append && createBaseVNode("div", {
          "class": "v-navigation-drawer__append"
        }, [slots.append?.()])]
      }), createVNode(Transition, {
        "name": "fade-transition"
      }, {
        default: () => [isTemporary.value && (isDragging.value || isActive.value) && !!props.scrim && createBaseVNode("div", mergeProps({
          "class": ["v-navigation-drawer__scrim", scrimColor.backgroundColorClasses.value],
          "style": [scrimStyles.value, scrimColor.backgroundColorStyles.value],
          "onClick": () => {
            if (isPersistent.value) return;
            isActive.value = false;
          }
        }, scopeId), null)]
      })]);
    });
    return {
      isStuck
    };
  }
});
function useCountdown(milliseconds) {
  const time = shallowRef(milliseconds());
  let timer = -1;
  function clear() {
    clearInterval(timer);
  }
  function reset() {
    clear();
    nextTick(() => time.value = milliseconds());
  }
  function start(el) {
    const style = el ? getComputedStyle(el) : {
      transitionDuration: 0.2
    };
    const interval = parseFloat(style.transitionDuration) * 1e3 || 200;
    clear();
    if (time.value <= 0) return;
    const startTime = performance.now();
    timer = window.setInterval(() => {
      const elapsed = performance.now() - startTime + interval;
      time.value = Math.max(milliseconds() - elapsed, 0);
      if (time.value <= 0) clear();
    }, interval);
  }
  onScopeDispose(clear);
  return {
    clear,
    time,
    start,
    reset
  };
}
const makeVSnackbarProps = propsFactory({
  /* @deprecated */
  multiLine: Boolean,
  text: String,
  timer: [Boolean, String],
  timeout: {
    type: [Number, String],
    default: 5e3
  },
  vertical: Boolean,
  ...makeLocationProps({
    location: "bottom"
  }),
  ...makePositionProps(),
  ...makeRoundedProps(),
  ...makeVariantProps(),
  ...makeThemeProps(),
  ...omit(makeVOverlayProps({
    transition: "v-snackbar-transition"
  }), ["persistent", "noClickAnimation", "scrim", "scrollStrategy", "stickToTarget"])
}, "VSnackbar");
const VSnackbar = genericComponent()({
  name: "VSnackbar",
  props: makeVSnackbarProps(),
  emits: {
    "update:modelValue": (v) => true
  },
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    const isActive = useProxiedModel(props, "modelValue");
    const {
      positionClasses
    } = usePosition(props);
    const {
      scopeId
    } = useScopeId();
    const {
      themeClasses
    } = provideTheme(props);
    const {
      colorClasses,
      colorStyles,
      variantClasses
    } = useVariant(props);
    const {
      roundedClasses
    } = useRounded(props);
    const countdown = useCountdown(() => Number(props.timeout));
    const overlay = ref();
    const timerRef = ref();
    const isHovering = shallowRef(false);
    const startY = shallowRef(0);
    const mainStyles = ref();
    const hasLayout = inject(VuetifyLayoutKey, void 0);
    useToggleScope(() => !!hasLayout, () => {
      const layout = useLayout();
      watchEffect(() => {
        mainStyles.value = layout.mainStyles.value;
      });
    });
    watch(isActive, startTimeout);
    watch(() => props.timeout, startTimeout);
    onMounted(() => {
      if (isActive.value) startTimeout();
    });
    let activeTimeout = -1;
    function startTimeout() {
      countdown.reset();
      window.clearTimeout(activeTimeout);
      const timeout = Number(props.timeout);
      if (!isActive.value || timeout === -1) return;
      const element = refElement(timerRef.value);
      countdown.start(element);
      activeTimeout = window.setTimeout(() => {
        isActive.value = false;
      }, timeout);
    }
    function clearTimeout2() {
      countdown.reset();
      window.clearTimeout(activeTimeout);
    }
    function onPointerenter() {
      isHovering.value = true;
      clearTimeout2();
    }
    function onPointerleave() {
      isHovering.value = false;
      startTimeout();
    }
    function onTouchstart(event) {
      startY.value = event.touches[0].clientY;
    }
    function onTouchend(event) {
      if (Math.abs(startY.value - event.changedTouches[0].clientY) > 50) {
        isActive.value = false;
      }
    }
    function onAfterLeave() {
      if (isHovering.value) onPointerleave();
    }
    const locationClasses = computed(() => {
      return props.location.split(" ").reduce((acc, loc) => {
        acc[`v-snackbar--${loc}`] = true;
        return acc;
      }, {});
    });
    useRender(() => {
      const overlayProps = VOverlay.filterProps(props);
      const hasContent = !!(slots.default || slots.text || props.text);
      return createVNode(VOverlay, mergeProps({
        "ref": overlay,
        "class": ["v-snackbar", {
          "v-snackbar--active": isActive.value,
          "v-snackbar--multi-line": props.multiLine && !props.vertical,
          "v-snackbar--timer": !!props.timer,
          "v-snackbar--vertical": props.vertical
        }, locationClasses.value, positionClasses.value, props.class],
        "style": [mainStyles.value, props.style]
      }, overlayProps, {
        "modelValue": isActive.value,
        "onUpdate:modelValue": ($event) => isActive.value = $event,
        "contentProps": mergeProps({
          class: ["v-snackbar__wrapper", themeClasses.value, colorClasses.value, roundedClasses.value, variantClasses.value],
          style: [colorStyles.value],
          onPointerenter,
          onPointerleave
        }, overlayProps.contentProps),
        "persistent": true,
        "noClickAnimation": true,
        "scrim": false,
        "scrollStrategy": "none",
        "_disableGlobalStack": true,
        "onTouchstartPassive": onTouchstart,
        "onTouchend": onTouchend,
        "onAfterLeave": onAfterLeave
      }, scopeId), {
        default: () => [genOverlays(false, "v-snackbar"), props.timer && !isHovering.value && createBaseVNode("div", {
          "key": "timer",
          "class": "v-snackbar__timer"
        }, [createVNode(VProgressLinear, {
          "ref": timerRef,
          "color": typeof props.timer === "string" ? props.timer : "info",
          "max": props.timeout,
          "modelValue": countdown.time.value
        }, null)]), hasContent && createBaseVNode("div", {
          "key": "content",
          "class": "v-snackbar__content",
          "role": "status",
          "aria-live": "polite"
        }, [slots.text?.() ?? props.text, slots.default?.()]), slots.actions && createVNode(VDefaultsProvider, {
          "defaults": {
            VBtn: {
              variant: "text",
              ripple: false,
              slim: true
            }
          }
        }, {
          default: () => [createBaseVNode("div", {
            "class": "v-snackbar__actions"
          }, [slots.actions({
            isActive
          })])]
        })],
        activator: slots.activator
      });
    });
    return forwardRefs({}, overlay);
  }
});
const _hoisted_1 = { class: "d-flex justify-space-between align-center flex-wrap ga-2" };
const _hoisted_2 = { class: "ma-0 pl-4" };
const _hoisted_3 = { class: "drawer-header" };
const _hoisted_4 = { class: "d-flex align-center ga-3" };
const _hoisted_5 = { class: "flex-grow-1 overflow-hidden" };
const _hoisted_6 = { class: "text-subtitle-1 font-weight-bold text-truncate" };
const _hoisted_7 = { class: "d-flex ga-2 flex-wrap justify-end" };
const _hoisted_8 = { class: "text-h6" };
const _hoisted_9 = { class: "text-h6" };
const _hoisted_10 = { class: "text-h6" };
const _hoisted_11 = { class: "text-h6" };
const _hoisted_12 = { class: "text-h6" };
const _hoisted_13 = {
  key: 0,
  class: "text-caption text-medium-emphasis mt-3 mb-0"
};
const _hoisted_14 = { class: "text-caption mb-2" };
const _hoisted_15 = { class: "text-no-wrap" };
const _hoisted_16 = { class: "text-no-wrap" };
const _hoisted_17 = { class: "text-no-wrap" };
const _hoisted_18 = { class: "text-no-wrap" };
const _hoisted_19 = {
  key: 1,
  class: "text-caption mb-0"
};
const _hoisted_20 = { class: "text-subtitle-1 mb-2" };
const _sfc_main = {
  __name: "dashboard",
  setup(__props) {
    const { mdAndUp, width } = useDisplay();
    const isWide = computed(() => width.value >= 1660);
    const { drawerOpen } = useDrawer();
    const theme = useTheme();
    function toggleTheme() {
      theme.global.name.value = theme.global.current.value.dark ? "light" : "dark";
    }
    const authStore = useAuthStore();
    const { user } = storeToRefs(authStore);
    const search = ref("");
    const filters = ref({
      classe: [],
      assunto: [],
      tarjas: [],
      fonte: [],
      vinculacao: [],
      userId: [],
      prazo: null,
      cumprido: false,
      // Default é "Não Cumprido"
      data_inicio: null,
      data_fim: null
    });
    const selected = ref([]);
    const fonteOptions = [
      { title: "eSAJ", value: "esaj" },
      { title: "PJe", value: "pje" }
    ];
    const importandoPje = ref(false);
    const dialogLogsPje = ref(false);
    const logsPje = ref([]);
    const loadingLogsPje = ref(false);
    const importHealth = ref([]);
    const showImportHealthAlert = ref(true);
    const importHealthProblemas = computed(() => importHealth.value.filter((h2) => h2.problema));
    const importHealthTemErroGrave = computed(
      () => importHealthProblemas.value.some((h2) => h2.ultimoStatus === "nunca" || h2.ultimoErro)
    );
    const importHealthEmDia = computed(
      () => importHealth.value.length > 0 && importHealthProblemas.value.length === 0
    );
    const importHealthMaisRecenteHoras = computed(() => {
      const idades = importHealth.value.map((h2) => h2.idadeHoras).filter((v) => v != null);
      return idades.length > 0 ? Math.min(...idades) : null;
    });
    function formatarHoras(h2) {
      if (h2 == null) return "—";
      if (h2 < 1) return "menos de 1h";
      if (h2 < 24) return `${Math.round(h2)}h`;
      return `${Math.floor(h2 / 24)}d`;
    }
    async function fetchImportHealth() {
      try {
        const { data } = await apiClient.get("/admin/import-pje/health");
        importHealth.value = data.items || [];
        if (importHealth.value.some((h2) => h2.problema)) {
          showImportHealthAlert.value = true;
        }
      } catch {
      }
    }
    const logsHeaders = [
      { title: "Data", key: "created_at" },
      { title: "Por", key: "usuario" },
      { title: "Pendentes de ciência", key: "adiados", align: "center" },
      { title: "Importados", key: "importados", align: "center", sortable: false },
      { title: "Sem prazo (ignorados)", key: "ignoradosSemPrazo", align: "center" },
      { title: "Novos", key: "criados", align: "center" },
      { title: "Atualizados", key: "atualizados", align: "center" },
      { title: "Falhas", key: "falhasTeor", align: "center" },
      { title: "Duração", key: "duracaoMs", align: "center" },
      { title: "Status", key: "status", align: "center", sortable: false }
    ];
    const loadingTable = ref(true);
    const serverItems = ref([]);
    const totalItems = ref(0);
    const options = ref({});
    const actionLoading = ref(false);
    const actionLoadingText = ref("Processando...");
    const loadingCharts = ref(true);
    const statsResponse = ref(null);
    const unassignedCount = ref(0);
    const showUnassignedAlert = ref(true);
    const allUsersList = ref([]);
    const allClassesList = ref([]);
    const allAssuntosList = ref([]);
    const allTarjasList = ref([]);
    const allVinculacoesList = ref([]);
    const {
      snackbar,
      snackbarText,
      snackbarColor,
      snackbarProgress,
      snackbarIndeterminate,
      notify,
      onSnackbarToggle
    } = useSnackbar();
    const userDialogs = ref(null);
    const pjeAuthDialog = ref(null);
    const unidadesDialog = ref(null);
    const unidadeAtiva = useUnidadeAtivaStore();
    const selectedUnidadeId = computed(() => unidadeAtiva.selectedId);
    const selectedUnidadeNome = computed(() => {
      const u = unidadeAtiva.unidades.find((x) => x.id === unidadeAtiva.selectedId);
      return u ? u.nome : null;
    });
    const uploadUnidadeId = computed(() => authStore.isSuper ? unidadeAtiva.selectedId : null);
    const papelChip = computed(() => {
      if (authStore.isSuper) return { label: "Admin global", color: "deep-purple" };
      if (authStore.role === "admin_unidade") return { label: "Admin unidade", color: "primary" };
      return { label: "Usuário", color: "blue-grey" };
    });
    const menuInicio = ref(false);
    const menuFim = ref(false);
    const dialogBulkAssign = ref(false);
    const formBulkAssignRef = ref(null);
    const loadingBulkAssign = ref(false);
    const matriculaParaAtribuir = ref(null);
    const requiredRule = (v) => !!v || "Campo obrigatório";
    const statusCumpridoOptions = [
      { title: "Todos", value: null },
      { title: "Cumprido", value: true },
      { title: "Não Cumprido", value: false }
    ];
    const prazoOptions = [
      { title: "Vencido", value: "vencido" },
      { title: "A Vencer", value: "a_vencer" }
    ];
    const allUsersOptions = computed(() => {
      return allUsersList.value.map((user2) => ({
        title: `${user2.nome} (${user2.matricula})`,
        value: user2.matricula
        // Modais de admin usam 'matricula'
      }));
    });
    const uniqueUsers = computed(() => {
      const naoAtribuidoOption = { title: "Não Atribuído", value: "NA" };
      const userOptions = allUsersList.value ? allUsersList.value.map((user2) => ({
        title: user2.nome,
        value: user2.id
        // Filtro principal usa 'id'
      })) : [];
      return [naoAtribuidoOption, ...userOptions];
    });
    const uniqueClasses = computed(() => {
      return allClassesList.value;
    });
    const uniqueAssuntos = computed(() => {
      return allAssuntosList.value;
    });
    const uniqueTarjas = computed(() => {
      return allTarjasList.value;
    });
    const uniqueVinculacoes = computed(() => {
      return allVinculacoesList.value;
    });
    const statsData = computed(() => {
      if (!statsResponse.value) {
        return { total: 0, byUser: [], byPrazo: [], byAssunto: [] };
      }
      const { totalPendentes, byUser, byPrazo, byAssunto } = statsResponse.value;
      const byUserFormatted = byUser.map((user2) => ({
        ...user2,
        percent: totalPendentes > 0 ? user2.count / totalPendentes * 100 : 0
      }));
      const byPrazoFormatted = [
        { nome: "Vencidos", count: byPrazo.vencidos, percent: totalPendentes > 0 ? byPrazo.vencidos / totalPendentes * 100 : 0 },
        { nome: "P < 10d", count: byPrazo.p10d, percent: totalPendentes > 0 ? byPrazo.p10d / totalPendentes * 100 : 0 },
        { nome: "P < 30d", count: byPrazo.p30d, percent: totalPendentes > 0 ? byPrazo.p30d / totalPendentes * 100 : 0 }
      ];
      const byAssuntoFormatted = byAssunto.map((assunto) => ({
        ...assunto,
        percent: totalPendentes > 0 ? assunto.count / totalPendentes * 100 : 0
      }));
      return {
        total: totalPendentes,
        byUser: byUserFormatted,
        byPrazo: byPrazoFormatted,
        byAssunto: byAssuntoFormatted
      };
    });
    const cumpridosChartData = computed(() => {
      if (!statsResponse.value) {
        return { labels: [], datasets: [] };
      }
      const sortedUsers = statsResponse.value.cumpridos30d;
      const labels = sortedUsers.map((entry) => entry.nome);
      const data = sortedUsers.map((entry) => entry.count);
      return {
        labels,
        datasets: [
          {
            label: "Processos Cumpridos por Usuário (Últimos 30d)",
            backgroundColor: "#4CAF50",
            data
          }
        ]
      };
    });
    const formattedDataInicio = computed(() => {
      return filters.value.data_inicio ? format(filters.value.data_inicio, "dd/MM/yyyy") : "";
    });
    const formattedDataFim = computed(() => {
      return filters.value.data_fim ? format(filters.value.data_fim, "dd/MM/yyyy") : "";
    });
    function buildChartQueryParams() {
      const params = new URLSearchParams();
      if (search.value) params.append("search", search.value);
      if (filters.value.prazo) params.append("prazo", filters.value.prazo);
      if (filters.value.data_inicio) {
        params.append("dataInicio", format(filters.value.data_inicio, "yyyy-MM-dd"));
      }
      if (filters.value.data_fim) {
        params.append("dataFim", format(filters.value.data_fim, "yyyy-MM-dd"));
      }
      for (const v of filters.value.classe) params.append("classe", v);
      for (const v of filters.value.assunto) params.append("assunto", v);
      for (const v of filters.value.tarjas) params.append("tarjas", v);
      const userIdFilterValues = filters.value.userId || [];
      const realUserIds = userIdFilterValues.filter((id) => id !== "NA");
      const includesNaoAtribuido = userIdFilterValues.includes("NA");
      for (const id of realUserIds) params.append("userId", id);
      if (includesNaoAtribuido) params.append("includeNA", "true");
      if (authStore.isSuper && selectedUnidadeId.value) {
        params.append("unidadeId", selectedUnidadeId.value);
      }
      return params;
    }
    function buildQueryParams() {
      const params = buildChartQueryParams();
      if (filters.value.cumprido !== null) {
        params.append("cumprido", filters.value.cumprido);
      }
      for (const v of filters.value.fonte || []) params.append("fonte", v);
      for (const v of filters.value.vinculacao || []) params.append("vinculacao", v);
      return params;
    }
    let tableAbortController = null;
    let chartAbortController = null;
    let unassignedAbortController = null;
    async function fetchTableData() {
      if (tableAbortController) {
        tableAbortController.abort();
      }
      tableAbortController = new AbortController();
      loadingTable.value = true;
      const params = buildQueryParams();
      params.append("page", options.value.page || 1);
      params.append("itemsPerPage", options.value.itemsPerPage || 10);
      params.append("sortBy", JSON.stringify(options.value.sortBy || []));
      try {
        const response = await apiClient.get("/admin/processes", {
          params,
          signal: tableAbortController.signal
        });
        serverItems.value = response.data.items.map((proc) => {
          const prazoNum = getPrazoRestanteNum(proc);
          return {
            ...proc,
            prazoRestanteNum: prazoNum,
            prazoRestanteStr: formatarPrazo(prazoNum),
            prazoRestanteColor: getCorPrazo(prazoNum)
          };
        });
        totalItems.value = response.data.totalItems;
      } catch (error) {
        if (error?.code === "ERR_CANCELED") return;
        notify("Erro ao carregar processos da tabela.", "error");
      } finally {
        loadingTable.value = false;
      }
    }
    async function fetchChartData() {
      if (chartAbortController) chartAbortController.abort();
      chartAbortController = new AbortController();
      loadingCharts.value = true;
      const params = buildChartQueryParams();
      try {
        const response = await apiClient.get("/admin/stats/dashboard", {
          params,
          signal: chartAbortController.signal
        });
        statsResponse.value = response.data;
      } catch (error) {
        if (error?.code === "ERR_CANCELED") return;
        notify("Erro ao carregar dados dos gráficos.", "error");
      } finally {
        loadingCharts.value = false;
      }
    }
    async function checkUnassignedProcesses() {
      if (unassignedAbortController) unassignedAbortController.abort();
      unassignedAbortController = new AbortController();
      try {
        const response = await apiClient.get("/admin/stats/unassigned-count", {
          signal: unassignedAbortController.signal
        });
        unassignedCount.value = response.data.count;
        if (unassignedCount.value > 0) {
          showUnassignedAlert.value = true;
        }
      } catch (error) {
        if (error?.code === "ERR_CANCELED") return;
      }
    }
    async function fetchAllUsers() {
      const cached = getCache("cache:users");
      if (cached) {
        allUsersList.value = cached;
        return;
      }
      try {
        const response = await apiClient.get("/admin/users");
        allUsersList.value = response.data;
        setCache("cache:users", response.data);
      } catch {
        notify("Erro ao carregar lista de usuários.", "error");
      }
    }
    async function handleUsersChanged() {
      clearCache("cache:users");
      await fetchAllUsers();
    }
    async function fetchFilterOptions() {
      const cached = getCache("cache:filterOptions");
      if (cached) {
        allClassesList.value = cached.classes;
        allAssuntosList.value = cached.assuntos;
        allTarjasList.value = cached.tarjas;
        allVinculacoesList.value = cached.vinculacoes || [];
        return;
      }
      try {
        const { data } = await apiClient.get("/admin/filter-options");
        allClassesList.value = data.classes;
        allAssuntosList.value = data.assuntos;
        allTarjasList.value = data.tarjas;
        allVinculacoesList.value = data.vinculacoes || [];
        setCache("cache:filterOptions", data);
      } catch {
      }
    }
    function limparFiltros() {
      search.value = "";
      filters.value = {
        classe: [],
        assunto: [],
        tarjas: [],
        fonte: [],
        vinculacao: [],
        userId: [],
        prazo: null,
        cumprido: false,
        data_inicio: null,
        data_fim: null
      };
    }
    const dialogImportPje = ref(false);
    const pjeAuthStatusImport = reactive({ checking: true, configured: false, cpfDisplay: null });
    const dialogResultadoPje = ref(false);
    const resultadoImportPje = ref({});
    function abrirPjeAuth() {
      if (authStore.isSuper && !selectedUnidadeId.value) {
        notify("Selecione uma unidade ativa no menu para gerenciar as credenciais PJe.", "warning");
        return;
      }
      pjeAuthDialog.value?.abrir(
        authStore.isSuper ? { unidadeId: selectedUnidadeId.value, unidadeNome: selectedUnidadeNome.value } : {}
      );
    }
    async function abrirConfirmImportPje() {
      if (importandoPje.value) return;
      if (authStore.isSuper && !selectedUnidadeId.value) {
        notify("Selecione uma unidade ativa no menu para importar do PJe.", "warning");
        return;
      }
      pjeAuthStatusImport.checking = true;
      dialogImportPje.value = true;
      try {
        const params = authStore.isSuper ? { unidadeId: selectedUnidadeId.value } : {};
        const { data } = await apiClient.get("/admin/pje-auth/status", { params });
        Object.assign(pjeAuthStatusImport, { checking: false, configured: false, cpfDisplay: null }, data);
      } catch {
        Object.assign(pjeAuthStatusImport, { checking: false, configured: false, cpfDisplay: null });
      }
    }
    function confirmarImportPje() {
      dialogImportPje.value = false;
      importarPje();
    }
    async function importarPje() {
      if (importandoPje.value) return;
      importandoPje.value = true;
      notify("Importação do PJe iniciada. Aguardando conclusão...", "info", 0, { persistent: true });
      try {
        const params = authStore.isSuper && selectedUnidadeId.value ? { unidadeId: selectedUnidadeId.value } : {};
        await apiClient.post("/admin/import-pje", null, { params });
        await aguardarImportPje();
      } catch (error) {
        if (error.response?.status === 409) {
          notify("Já existe uma importação do PJe em andamento.", "warning");
        } else {
          notify(error.response?.data?.error || "Erro ao iniciar a importação do PJe.", "error");
        }
      } finally {
        importandoPje.value = false;
      }
    }
    async function aguardarImportPje() {
      const limiteMs = 8 * 60 * 1e3;
      const inicio = Date.now();
      while (Date.now() - inicio < limiteMs) {
        await new Promise((resolve) => setTimeout(resolve, 5e3));
        let data;
        try {
          ({ data } = await apiClient.get("/admin/import-pje/status"));
        } catch {
          continue;
        }
        if (data && !data.running) {
          if (data.error) {
            notify(`Importação do PJe falhou: ${data.error}`, "error");
          } else {
            snackbar.value = false;
            resultadoImportPje.value = data.result || {};
            dialogResultadoPje.value = true;
          }
          clearCache("cache:filterOptions");
          await fetchFilterOptions();
          await reloadAllData();
          fetchImportHealth();
          return;
        }
      }
      notify("A importação do PJe está demorando mais que o esperado; atualize a página em instantes.", "warning");
    }
    async function abrirLogsPje() {
      dialogLogsPje.value = true;
      await carregarLogsPje();
    }
    async function carregarLogsPje() {
      loadingLogsPje.value = true;
      try {
        const { data } = await apiClient.get("/admin/import-pje/logs");
        logsPje.value = data.items || [];
      } catch {
        notify("Erro ao carregar o histórico de importações do PJe.", "error");
      } finally {
        loadingLogsPje.value = false;
      }
    }
    function formatarDataHoraLog(valor) {
      try {
        return format(new Date(valor), "dd/MM/yyyy HH:mm");
      } catch {
        return valor;
      }
    }
    async function reloadAllData() {
      await Promise.all([
        fetchTableData(),
        fetchChartData(),
        checkUnassignedProcesses()
      ]);
    }
    async function handleSalvarObservacoes(itemEditado) {
      actionLoading.value = true;
      actionLoadingText.value = "Salvando observação...";
      try {
        const { id, observacoes } = itemEditado;
        await apiClient.put(`/admin/processes/${id}/observacoes`, { observacoes });
        await reloadAllData();
      } catch {
        notify("Erro ao salvar observação.", "error");
      } finally {
        actionLoading.value = false;
      }
    }
    const dialogConfirm = ref(false);
    const dialogConfirmText = ref("");
    let dialogConfirmCallback = null;
    function openConfirmDialog(text, callback) {
      dialogConfirmText.value = text;
      dialogConfirmCallback = callback;
      dialogConfirm.value = true;
    }
    async function onDialogConfirm() {
      dialogConfirm.value = false;
      if (dialogConfirmCallback) {
        await dialogConfirmCallback();
        dialogConfirmCallback = null;
      }
    }
    function handleMarcarComoCumprido(item) {
      const acao = item.cumprido ? "desfazer-cumprir" : "cumprir";
      const texto = `Deseja realmente ${item.cumprido ? "DESMARCAR" : "MARCAR"} o processo ${item.numero_processo} como cumprido?`;
      openConfirmDialog(texto, async () => {
        actionLoading.value = true;
        actionLoadingText.value = item.cumprido ? "Desmarcando processo..." : "Marcando como cumprido...";
        try {
          await apiClient.patch(`/admin/processes/${item.id}/${acao}`);
          await reloadAllData();
        } catch {
          notify(`Erro ao ${acao} processo.`, "error");
        } finally {
          actionLoading.value = false;
        }
      });
    }
    function filterUnassigned() {
      filters.value.userId = ["NA"];
      showUnassignedAlert.value = false;
    }
    function buildFiltrosAtivos() {
      const filtrosAtivos = [];
      if (search.value) {
        filtrosAtivos.push(`Busca: "${search.value}"`);
      }
      if (filters.value.classe && filters.value.classe.length > 0) {
        filtrosAtivos.push(`Classe: ${filters.value.classe.join(", ")}`);
      }
      if (filters.value.assunto && filters.value.assunto.length > 0) {
        filtrosAtivos.push(`Assunto: ${filters.value.assunto.join(", ")}`);
      }
      if (filters.value.tarjas && filters.value.tarjas.length > 0) {
        filtrosAtivos.push(`Tarjas: ${filters.value.tarjas.join(", ")}`);
      }
      if (filters.value.userId && filters.value.userId.length > 0) {
        const userNames = filters.value.userId.map((id) => {
          if (id === "NA") return "Não Atribuído";
          const usuario = allUsersList.value.find((u) => u.id === id);
          return usuario ? usuario.nome : id;
        });
        filtrosAtivos.push(`Usuário: ${userNames.join(", ")}`);
      }
      if (filters.value.cumprido !== null && filters.value.cumprido !== false) {
        filtrosAtivos.push(`Status: ${filters.value.cumprido ? "Cumprido" : "Não Cumprido"}`);
      }
      if (filters.value.prazo) {
        const prazoLabel = filters.value.prazo === "vencido" ? "Vencido" : "A Vencer";
        filtrosAtivos.push(`Prazo: ${prazoLabel}`);
      }
      if (filters.value.data_inicio) {
        filtrosAtivos.push(`Data Início: ${format(filters.value.data_inicio, "dd/MM/yyyy")}`);
      }
      if (filters.value.data_fim) {
        filtrosAtivos.push(`Data Fim: ${format(filters.value.data_fim, "dd/MM/yyyy")}`);
      }
      return filtrosAtivos;
    }
    function comPrazoCalculado(items) {
      return items.map((proc) => {
        const prazoNum = getPrazoRestanteNum(proc);
        return {
          ...proc,
          prazoRestanteNum: prazoNum,
          prazoRestanteStr: formatarPrazo(prazoNum),
          prazoRestanteColor: getCorPrazo(prazoNum)
        };
      });
    }
    async function exportarLista(items) {
      if (!items || items.length === 0) {
        notify("Nenhum item para exportar.", "info");
        return;
      }
      actionLoading.value = true;
      actionLoadingText.value = "Gerando PDF...";
      await nextTick();
      try {
        await exportProcessesPDF(items, options.value.sortBy || [], buildFiltrosAtivos());
      } catch {
        notify("Erro ao gerar PDF.", "error");
      } finally {
        actionLoading.value = false;
      }
    }
    async function downloadSelecionados() {
      await exportarLista([...selected.value]);
    }
    async function downloadFiltrados() {
      actionLoading.value = true;
      actionLoadingText.value = "Buscando todos os processos...";
      try {
        const params = buildQueryParams();
        params.append("page", "1");
        params.append("itemsPerPage", "-1");
        params.append("sortBy", JSON.stringify(options.value.sortBy || []));
        const { data } = await apiClient.get("/admin/processes", { params });
        const items = comPrazoCalculado(data.items || []);
        if (items.length === 0) {
          notify("Nenhum processo para exportar.", "info");
          return;
        }
        actionLoadingText.value = "Gerando PDF...";
        await nextTick();
        await exportProcessesPDF(items, options.value.sortBy || [], buildFiltrosAtivos());
      } catch {
        notify("Erro ao gerar PDF.", "error");
      } finally {
        actionLoading.value = false;
      }
    }
    function abrirModalBulkAssign() {
      if (selected.value.length === 0) {
        notify("Nenhum processo selecionado.", "warning");
        return;
      }
      matriculaParaAtribuir.value = null;
      formBulkAssignRef.value?.resetValidation();
      dialogBulkAssign.value = true;
    }
    function fecharModalBulkAssign() {
      dialogBulkAssign.value = false;
    }
    async function handleBulkAssign() {
      const { valid } = await formBulkAssignRef.value.validate();
      if (!valid) return;
      const processIds = selected.value.map((processo) => processo.id);
      loadingBulkAssign.value = true;
      try {
        await apiClient.post("/admin/bulk-assign", {
          processIds,
          matricula: matriculaParaAtribuir.value
        });
        notify("Processos atribuídos com sucesso!");
        fecharModalBulkAssign();
        selected.value = [];
        await reloadAllData();
      } catch (error) {
        notify(error.response?.data?.error || "Erro ao atribuir processos.", "error");
      } finally {
        loadingBulkAssign.value = false;
      }
    }
    watch(options, fetchTableData, { deep: true });
    watch(selectedUnidadeId, () => {
      reloadAllData();
    });
    let filterDebounceTimer = null;
    watch(
      [filters, search],
      () => {
        clearTimeout(filterDebounceTimer);
        filterDebounceTimer = setTimeout(() => {
          fetchTableData();
          fetchChartData();
          checkUnassignedProcesses();
        }, 400);
      },
      { deep: true }
    );
    onMounted(() => {
      fetchChartData();
      fetchAllUsers();
      fetchFilterOptions();
      checkUnassignedProcesses();
      fetchImportHealth();
      if (authStore.isSuper && !unidadeAtiva.carregada) unidadeAtiva.carregar();
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock(Fragment, null, [
        unassignedCount.value > 0 && showUnassignedAlert.value ? (openBlock(), createBlock(VAlert, {
          key: 0,
          border: "start",
          class: "mb-6",
          closable: "",
          prominent: "",
          type: "warning",
          variant: "tonal",
          "onClick:close": _cache[0] || (_cache[0] = ($event) => showUnassignedAlert.value = false)
        }, {
          default: withCtx(() => [
            createBaseVNode("div", _hoisted_1, [
              createBaseVNode("div", null, [
                _cache[50] || (_cache[50] = createTextVNode(" Atenção: Existem ", -1)),
                createBaseVNode("strong", null, toDisplayString(unassignedCount.value), 1),
                _cache[51] || (_cache[51] = createTextVNode(" processo(s) sem atribuição. ", -1))
              ]),
              createVNode(VBtn, {
                color: "warning",
                size: "small",
                variant: "flat",
                onClick: filterUnassigned
              }, {
                default: withCtx(() => [..._cache[52] || (_cache[52] = [
                  createTextVNode(" Filtrar Não Atribuídos ", -1)
                ])]),
                _: 1
              })
            ])
          ]),
          _: 1
        })) : createCommentVNode("", true),
        importHealthProblemas.value.length > 0 && showImportHealthAlert.value ? (openBlock(), createBlock(VAlert, {
          key: 1,
          border: "start",
          class: "mb-6",
          closable: "",
          prominent: "",
          type: importHealthTemErroGrave.value ? "error" : "warning",
          variant: "tonal",
          "onClick:close": _cache[1] || (_cache[1] = ($event) => showImportHealthAlert.value = false)
        }, {
          default: withCtx(() => [
            _cache[56] || (_cache[56] = createBaseVNode("div", { class: "font-weight-medium mb-1" }, " Atenção: a importação do PJe pode ter falhado ", -1)),
            createBaseVNode("ul", _hoisted_2, [
              (openBlock(true), createElementBlock(Fragment, null, renderList(importHealthProblemas.value, (h2) => {
                return openBlock(), createElementBlock("li", {
                  key: h2.unidadeId
                }, [
                  createBaseVNode("strong", null, toDisplayString(h2.unidade), 1),
                  _cache[55] || (_cache[55] = createTextVNode(": ", -1)),
                  h2.ultimoStatus === "nunca" ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [
                    createTextVNode("nunca importou.")
                  ], 64)) : h2.ultimoErro ? (openBlock(), createElementBlock(Fragment, { key: 1 }, [
                    _cache[53] || (_cache[53] = createTextVNode(" última tentativa falhou", -1)),
                    h2.erro ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [
                      createTextVNode(" — " + toDisplayString(h2.erro), 1)
                    ], 64)) : createCommentVNode("", true),
                    _cache[54] || (_cache[54] = createTextVNode(". ", -1))
                  ], 64)) : (openBlock(), createElementBlock(Fragment, { key: 2 }, [
                    createTextVNode(" última importação há " + toDisplayString(formatarHoras(h2.idadeHoras)) + " (acima do esperado). ", 1)
                  ], 64))
                ]);
              }), 128))
            ])
          ]),
          _: 1
        }, 8, ["type"])) : importHealthEmDia.value ? (openBlock(), createBlock(VAlert, {
          key: 2,
          class: "mb-4",
          density: "compact",
          type: "success",
          variant: "tonal"
        }, {
          default: withCtx(() => [
            createTextVNode(" Importação do PJe em dia — mais recente há " + toDisplayString(formatarHoras(importHealthMaisRecenteHoras.value)) + ". ", 1)
          ]),
          _: 1
        })) : createCommentVNode("", true),
        (openBlock(), createBlock(Teleport, { to: "body" }, [
          createVNode(VNavigationDrawer, {
            modelValue: unref(drawerOpen),
            "onUpdate:modelValue": _cache[13] || (_cache[13] = ($event) => isRef(drawerOpen) ? drawerOpen.value = $event : null),
            class: "app-drawer",
            location: "left",
            style: { "top": "0", "height": "100%", "position": "fixed", "z-index": "1010" },
            width: unref(DRAWER_WIDTH)
          }, {
            append: withCtx(() => [
              createVNode(VDivider),
              createVNode(VList, {
                class: "admin-nav",
                density: "comfortable",
                nav: ""
              }, {
                default: withCtx(() => [
                  createVNode(VListItem, {
                    "prepend-icon": unref(theme).global.current.value.dark ? "mdi-white-balance-sunny" : "mdi-weather-night",
                    rounded: "lg",
                    title: unref(theme).global.current.value.dark ? "Tema Claro" : "Tema Escuro",
                    onClick: toggleTheme
                  }, null, 8, ["prepend-icon", "title"]),
                  createVNode(VListItem, {
                    "base-color": "error",
                    "prepend-icon": "mdi-logout",
                    rounded: "lg",
                    title: "Sair",
                    onClick: _cache[12] || (_cache[12] = () => {
                      drawerOpen.value = false;
                      unref(authStore).logout();
                    })
                  })
                ]),
                _: 1
              })
            ]),
            default: withCtx(() => [
              createBaseVNode("div", _hoisted_3, [
                createBaseVNode("div", _hoisted_4, [
                  createVNode(VAvatar, {
                    color: "primary",
                    size: "42",
                    variant: "tonal"
                  }, {
                    default: withCtx(() => [
                      createVNode(VIcon, { size: "24" }, {
                        default: withCtx(() => [..._cache[57] || (_cache[57] = [
                          createTextVNode("mdi-account", -1)
                        ])]),
                        _: 1
                      })
                    ]),
                    _: 1
                  }),
                  createBaseVNode("div", _hoisted_5, [
                    _cache[58] || (_cache[58] = createBaseVNode("div", { class: "text-caption text-medium-emphasis" }, "Bem-vindo", -1)),
                    createBaseVNode("div", _hoisted_6, toDisplayString(unref(user)?.nome), 1),
                    createVNode(VChip, {
                      class: "mt-1",
                      color: papelChip.value.color,
                      density: "comfortable",
                      label: "",
                      size: "x-small",
                      variant: "flat"
                    }, {
                      default: withCtx(() => [
                        createTextVNode(toDisplayString(papelChip.value.label), 1)
                      ]),
                      _: 1
                    }, 8, ["color"])
                  ]),
                  !isWide.value ? (openBlock(), createBlock(VBtn, {
                    key: 0,
                    "aria-label": "Fechar menu",
                    icon: "",
                    size: "small",
                    variant: "text",
                    onClick: _cache[2] || (_cache[2] = ($event) => drawerOpen.value = false)
                  }, {
                    default: withCtx(() => [
                      createVNode(VIcon, { size: "20" }, {
                        default: withCtx(() => [..._cache[59] || (_cache[59] = [
                          createTextVNode("mdi-close", -1)
                        ])]),
                        _: 1
                      })
                    ]),
                    _: 1
                  })) : createCommentVNode("", true)
                ])
              ]),
              unref(authStore).isGestor ? (openBlock(), createBlock(VList, {
                key: 0,
                class: "admin-nav",
                density: "comfortable",
                nav: "",
                "open-strategy": "single"
              }, {
                default: withCtx(() => [
                  createVNode(VListSubheader, { class: "text-uppercase font-weight-bold" }, {
                    default: withCtx(() => [..._cache[60] || (_cache[60] = [
                      createTextVNode("Administrador", -1)
                    ])]),
                    _: 1
                  }),
                  unref(authStore).isSuper ? (openBlock(), createBlock(VListItem, {
                    key: 0,
                    class: "menu-top",
                    "prepend-icon": "mdi-office-building-cog-outline",
                    rounded: "lg",
                    title: "Gerenciar Unidades",
                    onClick: _cache[3] || (_cache[3] = () => {
                      drawerOpen.value = false;
                      unidadesDialog.value?.abrir();
                    })
                  })) : createCommentVNode("", true),
                  createVNode(VListGroup, {
                    class: "menu-top",
                    value: "usuarios"
                  }, {
                    activator: withCtx(({ props }) => [
                      createVNode(VListItem, mergeProps({
                        "prepend-icon": "mdi-account-cog-outline",
                        title: "Gerenc. Usuários"
                      }, props), null, 16)
                    ]),
                    default: withCtx(() => [
                      createVNode(VListItem, {
                        "prepend-icon": "mdi-account-plus-outline",
                        title: "Cadastrar Usuário",
                        onClick: _cache[4] || (_cache[4] = () => {
                          drawerOpen.value = false;
                          userDialogs.value?.abrirModalCadastro();
                        })
                      }),
                      createVNode(VListItem, {
                        "prepend-icon": "mdi-account-edit-outline",
                        title: "Editar Usuário",
                        onClick: _cache[5] || (_cache[5] = () => {
                          drawerOpen.value = false;
                          userDialogs.value?.abrirModalEditar();
                        })
                      }),
                      createVNode(VListItem, {
                        "base-color": "orange",
                        "prepend-icon": "mdi-lock-reset",
                        title: "Resetar Senha",
                        onClick: _cache[6] || (_cache[6] = () => {
                          drawerOpen.value = false;
                          userDialogs.value?.abrirModalReset();
                        })
                      }),
                      createVNode(VListItem, {
                        "base-color": "red",
                        "prepend-icon": "mdi-account-remove-outline",
                        title: "Apagar Usuário",
                        onClick: _cache[7] || (_cache[7] = () => {
                          drawerOpen.value = false;
                          userDialogs.value?.abrirModalDelete();
                        })
                      })
                    ]),
                    _: 1
                  }),
                  createVNode(VListGroup, {
                    class: "menu-top",
                    value: "esaj"
                  }, {
                    activator: withCtx(({ props }) => [
                      createVNode(VListItem, mergeProps({
                        "prepend-icon": "mdi-file-table-outline",
                        title: "Gerenciar eSAJ"
                      }, props), null, 16)
                    ]),
                    default: withCtx(() => [
                      createVNode(VListItem, {
                        "base-color": "teal",
                        "prepend-icon": "mdi-file-upload-outline",
                        title: "Importar CSV",
                        onClick: _cache[8] || (_cache[8] = () => {
                          drawerOpen.value = false;
                          userDialogs.value?.abrirModalUpload();
                        })
                      })
                    ]),
                    _: 1
                  }),
                  createVNode(VListGroup, {
                    class: "menu-top",
                    value: "pje"
                  }, {
                    activator: withCtx(({ props }) => [
                      createVNode(VListItem, mergeProps({
                        "prepend-icon": "mdi-gavel",
                        title: "Gerenciar PJe"
                      }, props), null, 16)
                    ]),
                    default: withCtx(() => [
                      createVNode(VListItem, {
                        "base-color": "indigo",
                        "prepend-icon": "mdi-shield-key-outline",
                        title: "Autenticação PJe",
                        onClick: _cache[9] || (_cache[9] = () => {
                          drawerOpen.value = false;
                          abrirPjeAuth();
                        })
                      }),
                      createVNode(VListItem, {
                        "base-color": "green",
                        disabled: importandoPje.value,
                        "prepend-icon": "mdi-download-network-outline",
                        title: "Importar do PJe",
                        onClick: _cache[10] || (_cache[10] = () => {
                          drawerOpen.value = false;
                          abrirConfirmImportPje();
                        })
                      }, null, 8, ["disabled"]),
                      createVNode(VListItem, {
                        "base-color": "green",
                        "prepend-icon": "mdi-history",
                        title: "Logs do PJe",
                        onClick: _cache[11] || (_cache[11] = () => {
                          drawerOpen.value = false;
                          abrirLogsPje();
                        })
                      })
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              })) : createCommentVNode("", true)
            ]),
            _: 1
          }, 8, ["modelValue", "width"])
        ])),
        createVNode(VExpansionPanels, {
          class: "mb-6",
          "model-value": unref(mdAndUp) ? 0 : void 0
        }, {
          default: withCtx(() => [
            createVNode(VExpansionPanel, { readonly: unref(mdAndUp) }, {
              default: withCtx(() => [
                createVNode(VExpansionPanelTitle, { "hide-actions": unref(mdAndUp) }, {
                  default: withCtx(() => [
                    createVNode(VIcon, { start: "" }, {
                      default: withCtx(() => [..._cache[61] || (_cache[61] = [
                        createTextVNode("mdi-chart-bar", -1)
                      ])]),
                      _: 1
                    }),
                    _cache[62] || (_cache[62] = createTextVNode(" Gráficos e Estatísticas ", -1))
                  ]),
                  _: 1
                }, 8, ["hide-actions"]),
                createVNode(VExpansionPanelText, null, {
                  default: withCtx(() => [
                    createVNode(VRow, {
                      class: "pt-0",
                      dense: ""
                    }, {
                      default: withCtx(() => [
                        createVNode(VCol, {
                          cols: "12",
                          lg: "6"
                        }, {
                          default: withCtx(() => [
                            createVNode(_sfc_main$4, {
                              loading: loadingCharts.value,
                              stats: statsData.value,
                              style: { "padding-right": "1%" }
                            }, null, 8, ["loading", "stats"])
                          ]),
                          _: 1
                        }),
                        createVNode(VCol, {
                          class: normalizeClass({ "mt-6 border-s pl-4": unref(mdAndUp) }),
                          cols: "12",
                          lg: "6"
                        }, {
                          default: withCtx(() => [
                            createVNode(VCardSubtitle, null, {
                              default: withCtx(() => [..._cache[63] || (_cache[63] = [
                                createTextVNode("Cumpridos por Usuário (Últimos 30 dias)", -1)
                              ])]),
                              _: 1
                            }),
                            createVNode(_sfc_main$6, {
                              "chart-data": cumpridosChartData.value,
                              loading: loadingCharts.value
                            }, null, 8, ["chart-data", "loading"])
                          ]),
                          _: 1
                        }, 8, ["class"])
                      ]),
                      _: 1
                    })
                  ]),
                  _: 1
                })
              ]),
              _: 1
            }, 8, ["readonly"])
          ]),
          _: 1
        }, 8, ["model-value"]),
        createVNode(VExpansionPanels, { class: "mb-6" }, {
          default: withCtx(() => [
            createVNode(VExpansionPanel, null, {
              default: withCtx(() => [
                createVNode(VExpansionPanelTitle, null, {
                  default: withCtx(() => [
                    createVNode(VIcon, { start: "" }, {
                      default: withCtx(() => [..._cache[64] || (_cache[64] = [
                        createTextVNode("mdi-filter-variant", -1)
                      ])]),
                      _: 1
                    }),
                    _cache[65] || (_cache[65] = createTextVNode(" Filtros ", -1))
                  ]),
                  _: 1
                }),
                createVNode(VExpansionPanelText, null, {
                  default: withCtx(() => [
                    createVNode(VRow, null, {
                      default: withCtx(() => [
                        createVNode(VCol, {
                          cols: "12",
                          md: "4"
                        }, {
                          default: withCtx(() => [
                            createVNode(VAutocomplete, {
                              modelValue: filters.value.classe,
                              "onUpdate:modelValue": _cache[14] || (_cache[14] = ($event) => filters.value.classe = $event),
                              chips: "",
                              clearable: "",
                              density: "compact",
                              items: uniqueClasses.value,
                              label: "Classe",
                              multiple: "",
                              variant: "outlined"
                            }, null, 8, ["modelValue", "items"])
                          ]),
                          _: 1
                        }),
                        createVNode(VCol, {
                          cols: "12",
                          md: "4"
                        }, {
                          default: withCtx(() => [
                            createVNode(VAutocomplete, {
                              modelValue: filters.value.assunto,
                              "onUpdate:modelValue": _cache[15] || (_cache[15] = ($event) => filters.value.assunto = $event),
                              chips: "",
                              clearable: "",
                              density: "compact",
                              items: uniqueAssuntos.value,
                              label: "Assunto",
                              multiple: "",
                              variant: "outlined"
                            }, null, 8, ["modelValue", "items"])
                          ]),
                          _: 1
                        }),
                        createVNode(VCol, {
                          cols: "12",
                          md: "4"
                        }, {
                          default: withCtx(() => [
                            createVNode(VAutocomplete, {
                              modelValue: filters.value.tarjas,
                              "onUpdate:modelValue": _cache[16] || (_cache[16] = ($event) => filters.value.tarjas = $event),
                              chips: "",
                              clearable: "",
                              density: "compact",
                              items: uniqueTarjas.value,
                              label: "Tarjas",
                              multiple: "",
                              variant: "outlined"
                            }, null, 8, ["modelValue", "items"])
                          ]),
                          _: 1
                        }),
                        createVNode(VCol, {
                          cols: "12",
                          md: "4"
                        }, {
                          default: withCtx(() => [
                            createVNode(VSelect, {
                              modelValue: filters.value.fonte,
                              "onUpdate:modelValue": _cache[17] || (_cache[17] = ($event) => filters.value.fonte = $event),
                              chips: "",
                              clearable: "",
                              density: "compact",
                              "item-title": "title",
                              "item-value": "value",
                              items: fonteOptions,
                              label: "Fonte (Origem)",
                              multiple: "",
                              variant: "outlined"
                            }, null, 8, ["modelValue"])
                          ]),
                          _: 1
                        }),
                        createVNode(VCol, {
                          cols: "12",
                          md: "4"
                        }, {
                          default: withCtx(() => [
                            createVNode(VAutocomplete, {
                              modelValue: filters.value.vinculacao,
                              "onUpdate:modelValue": _cache[18] || (_cache[18] = ($event) => filters.value.vinculacao = $event),
                              chips: "",
                              clearable: "",
                              density: "compact",
                              items: uniqueVinculacoes.value,
                              label: "Vinculação",
                              multiple: "",
                              variant: "outlined"
                            }, null, 8, ["modelValue", "items"])
                          ]),
                          _: 1
                        }),
                        createVNode(VCol, {
                          cols: "12",
                          md: "4"
                        }, {
                          default: withCtx(() => [
                            createVNode(VAutocomplete, {
                              modelValue: filters.value.userId,
                              "onUpdate:modelValue": _cache[19] || (_cache[19] = ($event) => filters.value.userId = $event),
                              chips: "",
                              clearable: "",
                              density: "compact",
                              disabled: !unref(authStore).isGestor,
                              "item-title": "title",
                              "item-value": "value",
                              items: uniqueUsers.value,
                              label: "Usuário",
                              multiple: "",
                              variant: "outlined"
                            }, null, 8, ["modelValue", "disabled", "items"])
                          ]),
                          _: 1
                        }),
                        createVNode(VCol, {
                          cols: "12",
                          md: "4"
                        }, {
                          default: withCtx(() => [
                            createVNode(VSelect, {
                              modelValue: filters.value.cumprido,
                              "onUpdate:modelValue": _cache[20] || (_cache[20] = ($event) => filters.value.cumprido = $event),
                              density: "compact",
                              disabled: !unref(authStore).isGestor,
                              "item-title": "title",
                              "item-value": "value",
                              items: statusCumpridoOptions,
                              label: "Status (Cumprido)",
                              variant: "outlined"
                            }, null, 8, ["modelValue", "disabled"])
                          ]),
                          _: 1
                        }),
                        createVNode(VCol, {
                          cols: "12",
                          md: "4"
                        }, {
                          default: withCtx(() => [
                            createVNode(VSelect, {
                              modelValue: filters.value.prazo,
                              "onUpdate:modelValue": _cache[21] || (_cache[21] = ($event) => filters.value.prazo = $event),
                              clearable: "",
                              density: "compact",
                              "item-title": "title",
                              "item-value": "value",
                              items: prazoOptions,
                              label: "Prazo Restante",
                              variant: "outlined"
                            }, null, 8, ["modelValue"])
                          ]),
                          _: 1
                        }),
                        createVNode(VCol, {
                          cols: "12",
                          md: "3"
                        }, {
                          default: withCtx(() => [
                            createVNode(VMenu, {
                              modelValue: menuInicio.value,
                              "onUpdate:modelValue": _cache[26] || (_cache[26] = ($event) => menuInicio.value = $event),
                              "close-on-content-click": false,
                              location: "bottom end",
                              transition: "scale-transition"
                            }, {
                              activator: withCtx(({ props }) => [
                                createVNode(VTextField, mergeProps({
                                  modelValue: formattedDataInicio.value,
                                  "onUpdate:modelValue": _cache[22] || (_cache[22] = ($event) => formattedDataInicio.value = $event),
                                  clearable: "",
                                  density: "compact",
                                  label: "Data Início (Cumprido)",
                                  "prepend-inner-icon": "mdi-calendar",
                                  readonly: "",
                                  variant: "outlined"
                                }, props, {
                                  "onClick:clear": _cache[23] || (_cache[23] = ($event) => filters.value.data_inicio = null)
                                }), null, 16, ["modelValue"])
                              ]),
                              default: withCtx(() => [
                                createVNode(VDatePicker, {
                                  modelValue: filters.value.data_inicio,
                                  "onUpdate:modelValue": [
                                    _cache[24] || (_cache[24] = ($event) => filters.value.data_inicio = $event),
                                    _cache[25] || (_cache[25] = ($event) => menuInicio.value = false)
                                  ],
                                  "hide-header": "",
                                  locale: "pt-BR",
                                  title: "Data Início"
                                }, null, 8, ["modelValue"])
                              ]),
                              _: 1
                            }, 8, ["modelValue"])
                          ]),
                          _: 1
                        }),
                        createVNode(VCol, {
                          cols: "12",
                          md: "3"
                        }, {
                          default: withCtx(() => [
                            createVNode(VMenu, {
                              modelValue: menuFim.value,
                              "onUpdate:modelValue": _cache[31] || (_cache[31] = ($event) => menuFim.value = $event),
                              "close-on-content-click": false,
                              location: "bottom end",
                              transition: "scale-transition"
                            }, {
                              activator: withCtx(({ props }) => [
                                createVNode(VTextField, mergeProps({
                                  modelValue: formattedDataFim.value,
                                  "onUpdate:modelValue": _cache[27] || (_cache[27] = ($event) => formattedDataFim.value = $event),
                                  clearable: "",
                                  density: "compact",
                                  label: "Data Fim (Cumprido)",
                                  "prepend-inner-icon": "mdi-calendar",
                                  readonly: "",
                                  variant: "outlined"
                                }, props, {
                                  "onClick:clear": _cache[28] || (_cache[28] = ($event) => filters.value.data_fim = null)
                                }), null, 16, ["modelValue"])
                              ]),
                              default: withCtx(() => [
                                createVNode(VDatePicker, {
                                  modelValue: filters.value.data_fim,
                                  "onUpdate:modelValue": [
                                    _cache[29] || (_cache[29] = ($event) => filters.value.data_fim = $event),
                                    _cache[30] || (_cache[30] = ($event) => menuFim.value = false)
                                  ],
                                  "hide-header": "",
                                  locale: "pt-BR",
                                  title: "Data Fim"
                                }, null, 8, ["modelValue"])
                              ]),
                              _: 1
                            }, 8, ["modelValue"])
                          ]),
                          _: 1
                        }),
                        createVNode(VCol, {
                          class: "d-flex align-center",
                          cols: "12",
                          md: "2"
                        }, {
                          default: withCtx(() => [
                            createVNode(VBtn, {
                              "aria-label": "Limpar todos os filtros",
                              block: "",
                              color: "grey",
                              "prepend-icon": "mdi-filter-remove-outline",
                              variant: "tonal",
                              onClick: limparFiltros
                            }, {
                              default: withCtx(() => [..._cache[66] || (_cache[66] = [
                                createTextVNode(" Limpar Filtros ", -1)
                              ])]),
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
                })
              ]),
              _: 1
            })
          ]),
          _: 1
        }),
        createVNode(VCard, null, {
          default: withCtx(() => [
            createVNode(VCardTitle, { class: "d-flex justify-space-between align-center flex-wrap ga-2" }, {
              default: withCtx(() => [
                _cache[70] || (_cache[70] = createBaseVNode("span", { class: "text-h5" }, "Lista de Processos", -1)),
                createVNode(VSpacer),
                createBaseVNode("div", _hoisted_7, [
                  createVNode(VBtn, {
                    color: "primary",
                    disabled: totalItems.value === 0 || actionLoading.value,
                    "prepend-icon": "mdi-download",
                    variant: "flat",
                    onClick: _cache[32] || (_cache[32] = ($event) => downloadFiltrados())
                  }, {
                    default: withCtx(() => [..._cache[67] || (_cache[67] = [
                      createBaseVNode("span", { class: "d-none d-md-inline" }, "Baixar Filtrados", -1)
                    ])]),
                    _: 1
                  }, 8, ["disabled"]),
                  createVNode(VBtn, {
                    color: "blue-grey",
                    disabled: selected.value.length === 0 || actionLoading.value,
                    "prepend-icon": "mdi-download-box-outline",
                    variant: "flat",
                    onClick: _cache[33] || (_cache[33] = ($event) => downloadSelecionados())
                  }, {
                    default: withCtx(() => [..._cache[68] || (_cache[68] = [
                      createBaseVNode("span", { class: "d-none d-md-inline" }, "Baixar Selecionados", -1)
                    ])]),
                    _: 1
                  }, 8, ["disabled"]),
                  createVNode(VBtn, {
                    color: "secondary",
                    disabled: selected.value.length === 0,
                    "prepend-icon": "mdi-account-arrow-right",
                    variant: "flat",
                    onClick: abrirModalBulkAssign
                  }, {
                    default: withCtx(() => [..._cache[69] || (_cache[69] = [
                      createBaseVNode("span", { class: "d-none d-md-inline" }, "Atribuir Seleção", -1)
                    ])]),
                    _: 1
                  }, 8, ["disabled"])
                ])
              ]),
              _: 1
            }),
            createVNode(VCardText, { class: "pt-2 pb-0" }, {
              default: withCtx(() => [
                createVNode(VTextField, {
                  modelValue: search.value,
                  "onUpdate:modelValue": _cache[34] || (_cache[34] = ($event) => search.value = $event),
                  density: "compact",
                  "hide-details": "",
                  label: "Buscar processo...",
                  "prepend-inner-icon": "mdi-magnify",
                  variant: "outlined"
                }, null, 8, ["modelValue"])
              ]),
              _: 1
            }),
            createVNode(TabelaProcessos, {
              selected: selected.value,
              "onUpdate:selected": _cache[35] || (_cache[35] = ($event) => selected.value = $event),
              "action-loading": actionLoading.value,
              "action-loading-text": actionLoadingText.value,
              items: serverItems.value,
              loading: loadingTable.value,
              "total-items": totalItems.value,
              onMarcarCumprido: handleMarcarComoCumprido,
              onSalvarObs: handleSalvarObservacoes,
              "onUpdate:options": _cache[36] || (_cache[36] = ($event) => options.value = $event)
            }, null, 8, ["selected", "action-loading", "action-loading-text", "items", "loading", "total-items"])
          ]),
          _: 1
        }),
        createVNode(_sfc_main$1, {
          ref_key: "userDialogs",
          ref: userDialogs,
          "all-users-options": allUsersOptions.value,
          "upload-unidade-id": uploadUnidadeId.value,
          onDataChanged: reloadAllData,
          onNotify: unref(notify),
          onUsersChanged: handleUsersChanged
        }, null, 8, ["all-users-options", "upload-unidade-id", "onNotify"]),
        createVNode(_sfc_main$5, {
          ref_key: "pjeAuthDialog",
          ref: pjeAuthDialog,
          onNotify: unref(notify)
        }, null, 8, ["onNotify"]),
        createVNode(_sfc_main$2, {
          ref_key: "unidadesDialog",
          ref: unidadesDialog,
          onChanged: _cache[37] || (_cache[37] = ($event) => unref(unidadeAtiva).carregar()),
          onNotify: unref(notify)
        }, null, 8, ["onNotify"]),
        createVNode(VDialog, {
          modelValue: dialogLogsPje.value,
          "onUpdate:modelValue": _cache[39] || (_cache[39] = ($event) => dialogLogsPje.value = $event),
          "max-width": "1150px",
          scrollable: ""
        }, {
          default: withCtx(() => [
            createVNode(VCard, null, {
              default: withCtx(() => [
                createVNode(VCardTitle, { class: "d-flex align-center" }, {
                  default: withCtx(() => [
                    createVNode(VIcon, { start: "" }, {
                      default: withCtx(() => [..._cache[71] || (_cache[71] = [
                        createTextVNode("mdi-history", -1)
                      ])]),
                      _: 1
                    }),
                    _cache[72] || (_cache[72] = createTextVNode(" Histórico de Importações do PJe ", -1)),
                    createVNode(VSpacer),
                    createVNode(VBtn, {
                      icon: "mdi-refresh",
                      loading: loadingLogsPje.value,
                      variant: "text",
                      onClick: carregarLogsPje
                    }, null, 8, ["loading"]),
                    createVNode(VBtn, {
                      icon: "mdi-close",
                      variant: "text",
                      onClick: _cache[38] || (_cache[38] = ($event) => dialogLogsPje.value = false)
                    })
                  ]),
                  _: 1
                }),
                createVNode(VDivider),
                createVNode(VCardText, { style: { "max-height": "70vh" } }, {
                  default: withCtx(() => [
                    createVNode(VDataTable, {
                      density: "compact",
                      headers: logsHeaders,
                      items: logsPje.value,
                      "items-per-page": -1,
                      loading: loadingLogsPje.value,
                      "no-data-text": "Nenhuma importação registrada ainda."
                    }, {
                      "item.created_at": withCtx(({ item }) => [
                        createTextVNode(toDisplayString(formatarDataHoraLog(item.created_at)), 1)
                      ]),
                      "item.adiados": withCtx(({ item }) => [
                        createTextVNode(toDisplayString(item.adiados ?? 0), 1)
                      ]),
                      "item.importados": withCtx(({ item }) => [
                        createTextVNode(toDisplayString(Math.max(0, (item.avisos ?? 0) - (item.adiados ?? 0) - (item.ignoradosSemPrazo ?? 0))), 1)
                      ]),
                      "item.ignoradosSemPrazo": withCtx(({ item }) => [
                        createTextVNode(toDisplayString(item.ignoradosSemPrazo ?? 0), 1)
                      ]),
                      "item.duracaoMs": withCtx(({ item }) => [
                        createTextVNode(toDisplayString(((item.duracaoMs ?? 0) / 1e3).toFixed(1)) + "s ", 1)
                      ]),
                      "item.status": withCtx(({ item }) => [
                        item.erro ? (openBlock(), createBlock(VTooltip, {
                          key: 0,
                          location: "top"
                        }, {
                          activator: withCtx(({ props: tip }) => [
                            createVNode(VChip, mergeProps({
                              color: "error",
                              size: "small"
                            }, tip), {
                              default: withCtx(() => [..._cache[73] || (_cache[73] = [
                                createTextVNode("Erro", -1)
                              ])]),
                              _: 1
                            }, 16)
                          ]),
                          default: withCtx(() => [
                            createBaseVNode("span", null, toDisplayString(item.erro), 1)
                          ]),
                          _: 2
                        }, 1024)) : (openBlock(), createBlock(VChip, {
                          key: 1,
                          color: "success",
                          size: "small"
                        }, {
                          default: withCtx(() => [..._cache[74] || (_cache[74] = [
                            createTextVNode("OK", -1)
                          ])]),
                          _: 1
                        }))
                      ]),
                      _: 1
                    }, 8, ["items", "loading"])
                  ]),
                  _: 1
                })
              ]),
              _: 1
            })
          ]),
          _: 1
        }, 8, ["modelValue"]),
        createVNode(VDialog, {
          modelValue: dialogImportPje.value,
          "onUpdate:modelValue": _cache[41] || (_cache[41] = ($event) => dialogImportPje.value = $event),
          "max-width": "560px"
        }, {
          default: withCtx(() => [
            createVNode(VCard, null, {
              default: withCtx(() => [
                createVNode(VCardTitle, { class: "d-flex align-center" }, {
                  default: withCtx(() => [
                    createVNode(VIcon, {
                      color: "green",
                      start: ""
                    }, {
                      default: withCtx(() => [..._cache[75] || (_cache[75] = [
                        createTextVNode("mdi-download-network-outline", -1)
                      ])]),
                      _: 1
                    }),
                    _cache[76] || (_cache[76] = createTextVNode(" Importar do PJe ", -1))
                  ]),
                  _: 1
                }),
                createVNode(VCardText, null, {
                  default: withCtx(() => [
                    !pjeAuthStatusImport.checking && !pjeAuthStatusImport.configured ? (openBlock(), createBlock(VAlert, {
                      key: 0,
                      border: "start",
                      class: "mb-4",
                      density: "compact",
                      type: "warning",
                      variant: "tonal"
                    }, {
                      default: withCtx(() => [..._cache[77] || (_cache[77] = [
                        createTextVNode(" Nenhuma credencial cadastrada em ", -1),
                        createBaseVNode("strong", null, '"Autenticação PJe"', -1),
                        createTextVNode(". Configure-a para ter acesso à função importar. ", -1)
                      ])]),
                      _: 1
                    })) : pjeAuthStatusImport.configured ? (openBlock(), createBlock(VAlert, {
                      key: 1,
                      border: "start",
                      class: "mb-4",
                      density: "compact",
                      type: "info",
                      variant: "tonal"
                    }, {
                      default: withCtx(() => [
                        _cache[78] || (_cache[78] = createTextVNode(' Será usada a credencial salva em "Autenticação PJe": CPF ', -1)),
                        createBaseVNode("strong", null, toDisplayString(pjeAuthStatusImport.cpfDisplay), 1),
                        _cache[79] || (_cache[79] = createTextVNode(". ", -1))
                      ]),
                      _: 1
                    })) : createCommentVNode("", true),
                    _cache[80] || (_cache[80] = createBaseVNode("p", { class: "mb-2" }, " Ao importar do PJe o sistema consulta os avisos pendentes e abre as intimações que chegaram há 5 dias, para checar o teor e o prazo. ", -1)),
                    _cache[81] || (_cache[81] = createBaseVNode("p", { class: "mb-2" }, [
                      createBaseVNode("strong", null, "Abrir a intimação REGISTRA CIÊNCIA e INICIA O PRAZO no PJe."),
                      createTextVNode(" As intimações com menos de 5 dias entram no painel sem prazo e são abertas num import futuro. ")
                    ], -1)),
                    _cache[82] || (_cache[82] = createBaseVNode("p", { class: "mb-0" }, [
                      createTextVNode(" As intimações que o PJe devolve como "),
                      createBaseVNode("strong", null, '"sem prazo"'),
                      createTextVNode(" (atos de praxe, sem nada a cumprir) têm a ciência registrada, mas "),
                      createBaseVNode("strong", null, "não entram no painel"),
                      createTextVNode(". ")
                    ], -1))
                  ]),
                  _: 1
                }),
                createVNode(VCardActions, null, {
                  default: withCtx(() => [
                    createVNode(VSpacer),
                    createVNode(VBtn, {
                      variant: "text",
                      onClick: _cache[40] || (_cache[40] = ($event) => dialogImportPje.value = false)
                    }, {
                      default: withCtx(() => [..._cache[83] || (_cache[83] = [
                        createTextVNode("Cancelar", -1)
                      ])]),
                      _: 1
                    }),
                    createVNode(VBtn, {
                      color: "green",
                      disabled: pjeAuthStatusImport.checking || !pjeAuthStatusImport.configured,
                      loading: pjeAuthStatusImport.checking,
                      variant: "flat",
                      onClick: confirmarImportPje
                    }, {
                      default: withCtx(() => [..._cache[84] || (_cache[84] = [
                        createTextVNode(" Importar ", -1)
                      ])]),
                      _: 1
                    }, 8, ["disabled", "loading"])
                  ]),
                  _: 1
                })
              ]),
              _: 1
            })
          ]),
          _: 1
        }, 8, ["modelValue"]),
        createVNode(VDialog, {
          modelValue: dialogResultadoPje.value,
          "onUpdate:modelValue": _cache[43] || (_cache[43] = ($event) => dialogResultadoPje.value = $event),
          "max-width": "760px"
        }, {
          default: withCtx(() => [
            createVNode(VCard, null, {
              default: withCtx(() => [
                createVNode(VCardTitle, { class: "d-flex align-center" }, {
                  default: withCtx(() => [
                    createVNode(VIcon, {
                      color: "success",
                      start: ""
                    }, {
                      default: withCtx(() => [..._cache[85] || (_cache[85] = [
                        createTextVNode("mdi-check-circle-outline", -1)
                      ])]),
                      _: 1
                    }),
                    _cache[86] || (_cache[86] = createTextVNode(" Importação do PJe concluída ", -1))
                  ]),
                  _: 1
                }),
                createVNode(VDivider),
                createVNode(VCardText, null, {
                  default: withCtx(() => [
                    createVNode(VList, {
                      class: "py-0",
                      density: "comfortable",
                      lines: "two"
                    }, {
                      default: withCtx(() => [
                        createVNode(VListItem, null, {
                          append: withCtx(() => [
                            createBaseVNode("span", _hoisted_8, toDisplayString(resultadoImportPje.value.adiados ?? 0), 1)
                          ]),
                          default: withCtx(() => [
                            createVNode(VListItemTitle, { class: "text-wrap" }, {
                              default: withCtx(() => [..._cache[87] || (_cache[87] = [
                                createTextVNode("Pendentes de ciência e não importados (chegaram há menos de 5 dias)", -1)
                              ])]),
                              _: 1
                            })
                          ]),
                          _: 1
                        }),
                        createVNode(VDivider),
                        createVNode(VListItem, null, {
                          append: withCtx(() => [
                            createBaseVNode("span", _hoisted_9, toDisplayString(resultadoImportPje.value.importados ?? 0), 1)
                          ]),
                          default: withCtx(() => [
                            createVNode(VListItemTitle, { class: "text-wrap" }, {
                              default: withCtx(() => [..._cache[88] || (_cache[88] = [
                                createTextVNode("Tomados ciência e importados (chegaram há mais de 5 dias)", -1)
                              ])]),
                              _: 1
                            })
                          ]),
                          _: 1
                        }),
                        createVNode(VDivider),
                        createVNode(VListItem, null, {
                          append: withCtx(() => [
                            createBaseVNode("span", _hoisted_10, toDisplayString(resultadoImportPje.value.ignoradosSemPrazo ?? 0), 1)
                          ]),
                          default: withCtx(() => [
                            createVNode(VListItemTitle, { class: "text-wrap" }, {
                              default: withCtx(() => [..._cache[89] || (_cache[89] = [
                                createTextVNode("Ignorados por não terem prazo (ciência tomada, fora do painel)", -1)
                              ])]),
                              _: 1
                            })
                          ]),
                          _: 1
                        }),
                        createVNode(VDivider),
                        createVNode(VListItem, null, {
                          append: withCtx(() => [
                            createBaseVNode("span", _hoisted_11, toDisplayString(resultadoImportPje.value.criados ?? 0), 1)
                          ]),
                          default: withCtx(() => [
                            createVNode(VListItemTitle, { class: "text-wrap" }, {
                              default: withCtx(() => [..._cache[90] || (_cache[90] = [
                                createTextVNode("Novos processos (criados na importação)", -1)
                              ])]),
                              _: 1
                            })
                          ]),
                          _: 1
                        }),
                        createVNode(VDivider),
                        createVNode(VListItem, null, {
                          append: withCtx(() => [
                            createBaseVNode("span", _hoisted_12, toDisplayString(resultadoImportPje.value.atualizados ?? 0), 1)
                          ]),
                          default: withCtx(() => [
                            createVNode(VListItemTitle, { class: "text-wrap" }, {
                              default: withCtx(() => [..._cache[91] || (_cache[91] = [
                                createTextVNode("Processos atualizados (já existentes de outras importações)", -1)
                              ])]),
                              _: 1
                            })
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    }),
                    resultadoImportPje.value.falhasTeor ? (openBlock(), createElementBlock("p", _hoisted_13, toDisplayString(resultadoImportPje.value.falhasTeor) + " aviso(s) falharam ao abrir o teor e não foram importados. ", 1)) : createCommentVNode("", true),
                    resultadoImportPje.value.diagnostico ? (openBlock(), createBlock(VExpansionPanels, {
                      key: 1,
                      class: "mt-4",
                      variant: "accordion"
                    }, {
                      default: withCtx(() => [
                        createVNode(VExpansionPanel, null, {
                          default: withCtx(() => [
                            createVNode(VExpansionPanelTitle, { class: "text-body-2" }, {
                              default: withCtx(() => [
                                createVNode(VIcon, {
                                  size: "small",
                                  start: ""
                                }, {
                                  default: withCtx(() => [..._cache[92] || (_cache[92] = [
                                    createTextVNode("mdi-stethoscope", -1)
                                  ])]),
                                  _: 1
                                }),
                                _cache[93] || (_cache[93] = createTextVNode(" Diagnóstico da importação ", -1))
                              ]),
                              _: 1
                            }),
                            createVNode(VExpansionPanelText, null, {
                              default: withCtx(() => [
                                createBaseVNode("div", _hoisted_14, [
                                  createBaseVNode("div", null, [
                                    _cache[94] || (_cache[94] = createBaseVNode("strong", null, "Unidade de destino:", -1)),
                                    createTextVNode(" " + toDisplayString(resultadoImportPje.value.diagnostico.unidadeDestino?.nome) + " (id " + toDisplayString(resultadoImportPje.value.diagnostico.unidadeDestino?.id) + ")", 1)
                                  ]),
                                  createBaseVNode("div", null, [
                                    _cache[95] || (_cache[95] = createBaseVNode("strong", null, "Nome PJe registrado:", -1)),
                                    createTextVNode(" " + toDisplayString(resultadoImportPje.value.diagnostico.unidadeDestino?.nome_pje || "(não definido)"), 1)
                                  ]),
                                  createBaseVNode("div", null, [
                                    _cache[96] || (_cache[96] = createBaseVNode("strong", null, "Avisos retornados pelo MNI:", -1)),
                                    createTextVNode(" " + toDisplayString(resultadoImportPje.value.diagnostico.avisosRetornadosPeloMni), 1)
                                  ]),
                                  createBaseVNode("div", null, [
                                    _cache[97] || (_cache[97] = createBaseVNode("strong", null, "Vinculações encontradas:", -1)),
                                    createTextVNode(" " + toDisplayString((resultadoImportPje.value.diagnostico.vinculacoesEncontradas || []).join(", ") || "(nenhuma)"), 1)
                                  ]),
                                  createBaseVNode("div", null, [
                                    _cache[98] || (_cache[98] = createBaseVNode("strong", null, "Limiar de ciência:", -1)),
                                    createTextVNode(" " + toDisplayString(resultadoImportPje.value.diagnostico.cienciaMinDias) + " dia(s)", 1)
                                  ])
                                ]),
                                (resultadoImportPje.value.diagnostico.avisosDetalhe || []).length > 0 ? (openBlock(), createBlock(VTable, {
                                  key: 0,
                                  class: "text-caption",
                                  density: "compact"
                                }, {
                                  default: withCtx(() => [
                                    _cache[99] || (_cache[99] = createBaseVNode("thead", null, [
                                      createBaseVNode("tr", null, [
                                        createBaseVNode("th", null, "Processo"),
                                        createBaseVNode("th", null, "Disponibilizado"),
                                        createBaseVNode("th", null, "Idade"),
                                        createBaseVNode("th", null, "Decisão"),
                                        createBaseVNode("th", null, "Motivo")
                                      ])
                                    ], -1)),
                                    createBaseVNode("tbody", null, [
                                      (openBlock(true), createElementBlock(Fragment, null, renderList(resultadoImportPje.value.diagnostico.avisosDetalhe, (d, i) => {
                                        return openBlock(), createElementBlock("tr", { key: i }, [
                                          createBaseVNode("td", _hoisted_15, toDisplayString(d.processo), 1),
                                          createBaseVNode("td", _hoisted_16, toDisplayString(d.dataDisponibilizacao || "—"), 1),
                                          createBaseVNode("td", _hoisted_17, toDisplayString(d.idadeDias != null ? d.idadeDias + "d" : "—"), 1),
                                          createBaseVNode("td", _hoisted_18, toDisplayString(d.decisao), 1),
                                          createBaseVNode("td", null, toDisplayString(d.motivo), 1)
                                        ]);
                                      }), 128))
                                    ])
                                  ]),
                                  _: 1
                                })) : (openBlock(), createElementBlock("p", _hoisted_19, " O MNI não retornou nenhum aviso pendente para esta credencial. Verifique no PJe se o perfil/vinculação do usuário da credencial corresponde à unidade e se as intimações aparecem no painel do representante. "))
                              ]),
                              _: 1
                            })
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    })) : createCommentVNode("", true)
                  ]),
                  _: 1
                }),
                createVNode(VCardActions, null, {
                  default: withCtx(() => [
                    createVNode(VSpacer),
                    createVNode(VBtn, {
                      color: "primary",
                      variant: "flat",
                      onClick: _cache[42] || (_cache[42] = ($event) => dialogResultadoPje.value = false)
                    }, {
                      default: withCtx(() => [..._cache[100] || (_cache[100] = [
                        createTextVNode("Fechar", -1)
                      ])]),
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
        }, 8, ["modelValue"]),
        createVNode(VDialog, {
          modelValue: dialogBulkAssign.value,
          "onUpdate:modelValue": _cache[45] || (_cache[45] = ($event) => dialogBulkAssign.value = $event),
          "max-width": "500px",
          persistent: ""
        }, {
          default: withCtx(() => [
            createVNode(VCard, null, {
              default: withCtx(() => [
                createVNode(VForm, {
                  ref_key: "formBulkAssignRef",
                  ref: formBulkAssignRef,
                  onSubmit: withModifiers(handleBulkAssign, ["prevent"])
                }, {
                  default: withCtx(() => [
                    createVNode(VCardTitle, null, {
                      default: withCtx(() => [..._cache[101] || (_cache[101] = [
                        createBaseVNode("span", { class: "text-h5" }, "Atribuir Processos Selecionados", -1)
                      ])]),
                      _: 1
                    }),
                    createVNode(VCardText, null, {
                      default: withCtx(() => [
                        createVNode(VContainer, null, {
                          default: withCtx(() => [
                            createVNode(VRow, null, {
                              default: withCtx(() => [
                                createVNode(VCol, { cols: "12" }, {
                                  default: withCtx(() => [
                                    createBaseVNode("div", _hoisted_20, [
                                      createBaseVNode("strong", null, toDisplayString(selected.value.length), 1),
                                      _cache[102] || (_cache[102] = createTextVNode(" processo(s) selecionado(s). ", -1))
                                    ]),
                                    createVNode(VAutocomplete, {
                                      modelValue: matriculaParaAtribuir.value,
                                      "onUpdate:modelValue": _cache[44] || (_cache[44] = ($event) => matriculaParaAtribuir.value = $event),
                                      density: "compact",
                                      "item-title": "title",
                                      "item-value": "value",
                                      items: allUsersOptions.value,
                                      label: "Atribuir ao usuário:",
                                      placeholder: "Selecione o usuário de destino...",
                                      rules: [requiredRule],
                                      variant: "outlined"
                                    }, null, 8, ["modelValue", "items", "rules"])
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
                    }),
                    createVNode(VCardActions, null, {
                      default: withCtx(() => [
                        createVNode(VSpacer),
                        createVNode(VBtn, {
                          variant: "text",
                          onClick: fecharModalBulkAssign
                        }, {
                          default: withCtx(() => [..._cache[103] || (_cache[103] = [
                            createTextVNode("Cancelar", -1)
                          ])]),
                          _: 1
                        }),
                        createVNode(VBtn, {
                          color: "secondary",
                          loading: loadingBulkAssign.value,
                          type: "submit"
                        }, {
                          default: withCtx(() => [..._cache[104] || (_cache[104] = [
                            createTextVNode(" Atribuir ", -1)
                          ])]),
                          _: 1
                        }, 8, ["loading"])
                      ]),
                      _: 1
                    })
                  ]),
                  _: 1
                }, 512)
              ]),
              _: 1
            })
          ]),
          _: 1
        }, 8, ["modelValue"]),
        createVNode(VDialog, {
          modelValue: dialogConfirm.value,
          "onUpdate:modelValue": _cache[47] || (_cache[47] = ($event) => dialogConfirm.value = $event),
          "max-width": "450px"
        }, {
          default: withCtx(() => [
            createVNode(VCard, null, {
              default: withCtx(() => [
                createVNode(VCardTitle, { class: "text-h6" }, {
                  default: withCtx(() => [..._cache[105] || (_cache[105] = [
                    createTextVNode("Confirmação", -1)
                  ])]),
                  _: 1
                }),
                createVNode(VCardText, null, {
                  default: withCtx(() => [
                    createTextVNode(toDisplayString(dialogConfirmText.value), 1)
                  ]),
                  _: 1
                }),
                createVNode(VCardActions, null, {
                  default: withCtx(() => [
                    createVNode(VSpacer),
                    createVNode(VBtn, {
                      variant: "text",
                      onClick: _cache[46] || (_cache[46] = ($event) => dialogConfirm.value = false)
                    }, {
                      default: withCtx(() => [..._cache[106] || (_cache[106] = [
                        createTextVNode("Cancelar", -1)
                      ])]),
                      _: 1
                    }),
                    createVNode(VBtn, {
                      color: "primary",
                      variant: "flat",
                      onClick: onDialogConfirm
                    }, {
                      default: withCtx(() => [..._cache[107] || (_cache[107] = [
                        createTextVNode("Confirmar", -1)
                      ])]),
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
        }, 8, ["modelValue"]),
        createVNode(VSnackbar, {
          modelValue: unref(snackbar),
          "onUpdate:modelValue": [
            _cache[49] || (_cache[49] = ($event) => isRef(snackbar) ? snackbar.value = $event : null),
            unref(onSnackbarToggle)
          ],
          class: "toast-snackbar",
          color: unref(snackbarColor),
          location: "top right",
          "multi-line": "",
          timeout: -1
        }, {
          actions: withCtx(() => [
            createVNode(VBtn, {
              icon: "",
              onClick: _cache[48] || (_cache[48] = ($event) => snackbar.value = false)
            }, {
              default: withCtx(() => [
                createVNode(VIcon, null, {
                  default: withCtx(() => [..._cache[108] || (_cache[108] = [
                    createTextVNode("mdi-close", -1)
                  ])]),
                  _: 1
                })
              ]),
              _: 1
            })
          ]),
          default: withCtx(() => [
            createTextVNode(toDisplayString(unref(snackbarText)) + " ", 1),
            createVNode(VProgressLinear, {
              "bg-color": "rgba(255,255,255,0.2)",
              class: "mt-2",
              color: "rgba(255,255,255,0.7)",
              height: "3",
              indeterminate: unref(snackbarIndeterminate),
              "model-value": unref(snackbarIndeterminate) ? void 0 : unref(snackbarProgress),
              rounded: ""
            }, null, 8, ["indeterminate", "model-value"])
          ]),
          _: 1
        }, 8, ["modelValue", "color", "onUpdate:modelValue"])
      ], 64);
    };
  }
};
const dashboard = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-877f87b8"]]);
export {
  dashboard as default
};
