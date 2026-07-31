import { g as genericComponent, b as useRender, d as propsFactory, f as makeComponentProps, u as useRtl } from "./vendor-vuetify-aQIaOcnC.js";
import { u as useDimension, a as makeDimensionProps, m as makeTagProps } from "./dimensions-E8hH3RXf.js";
import { y as createBaseVNode, Q as normalizeStyle, q as normalizeClass, f as computed, s as shallowRef, D as onMounted, t as toRef, B as readonly, n as createVNode } from "./vendor-vue-GTicgduU.js";
function useAspectStyles(props) {
  return {
    aspectStyles: computed(() => {
      const ratio = Number(props.aspectRatio);
      return ratio ? {
        paddingBottom: String(1 / ratio * 100) + "%"
      } : void 0;
    })
  };
}
const makeVResponsiveProps = propsFactory({
  aspectRatio: [String, Number],
  contentClass: null,
  inline: Boolean,
  ...makeComponentProps(),
  ...makeDimensionProps()
}, "VResponsive");
const VResponsive = genericComponent()({
  name: "VResponsive",
  props: makeVResponsiveProps(),
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    const {
      aspectStyles
    } = useAspectStyles(props);
    const {
      dimensionStyles
    } = useDimension(props);
    useRender(() => createBaseVNode("div", {
      "class": normalizeClass(["v-responsive", {
        "v-responsive--inline": props.inline
      }, props.class]),
      "style": normalizeStyle([dimensionStyles.value, props.style])
    }, [createBaseVNode("div", {
      "class": "v-responsive__sizer",
      "style": normalizeStyle(aspectStyles.value)
    }, null), slots.additional?.(), slots.default && createBaseVNode("div", {
      "class": normalizeClass(["v-responsive__content", props.contentClass])
    }, [slots.default()])]));
    return {};
  }
});
function useSsrBoot() {
  const isBooted = shallowRef(false);
  onMounted(() => {
    window.requestAnimationFrame(() => {
      isBooted.value = true;
    });
  });
  const ssrBootStyles = toRef(() => !isBooted.value ? {
    transition: "none !important"
  } : void 0);
  return {
    ssrBootStyles,
    isBooted: readonly(isBooted)
  };
}
const makeVContainerProps = propsFactory({
  fluid: {
    type: Boolean,
    default: false
  },
  ...makeComponentProps(),
  ...makeDimensionProps(),
  ...makeTagProps()
}, "VContainer");
const VContainer = genericComponent()({
  name: "VContainer",
  props: makeVContainerProps(),
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    const {
      rtlClasses
    } = useRtl();
    const {
      dimensionStyles
    } = useDimension(props);
    useRender(() => createVNode(props.tag, {
      "class": normalizeClass(["v-container", {
        "v-container--fluid": props.fluid
      }, rtlClasses.value, props.class]),
      "style": normalizeStyle([dimensionStyles.value, props.style])
    }, slots));
    return {};
  }
});
export {
  VContainer as V,
  VResponsive as a,
  makeVResponsiveProps as m,
  useSsrBoot as u
};
