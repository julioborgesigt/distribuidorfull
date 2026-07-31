import { g as genericComponent, t as useLayout, b as useRender, d as propsFactory, f as makeComponentProps } from "./vendor-vuetify-aQIaOcnC.js";
import { u as useDimension, m as makeTagProps, a as makeDimensionProps } from "./dimensions-E8hH3RXf.js";
import { u as useSsrBoot } from "./VContainer-CkSzbdeb.js";
import { n as createVNode, Q as normalizeStyle, q as normalizeClass, y as createBaseVNode } from "./vendor-vue-GTicgduU.js";
const makeVMainProps = propsFactory({
  scrollable: Boolean,
  ...makeComponentProps(),
  ...makeDimensionProps(),
  ...makeTagProps({
    tag: "main"
  })
}, "VMain");
const VMain = genericComponent()({
  name: "VMain",
  props: makeVMainProps(),
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    const {
      dimensionStyles
    } = useDimension(props);
    const {
      mainStyles
    } = useLayout();
    const {
      ssrBootStyles
    } = useSsrBoot();
    useRender(() => createVNode(props.tag, {
      "class": normalizeClass(["v-main", {
        "v-main--scrollable": props.scrollable
      }, props.class]),
      "style": normalizeStyle([mainStyles.value, ssrBootStyles.value, dimensionStyles.value, props.style])
    }, {
      default: () => [props.scrollable ? createBaseVNode("div", {
        "class": "v-main__scroller"
      }, [slots.default?.()]) : slots.default?.()]
    }));
    return {};
  }
});
export {
  VMain as V
};
