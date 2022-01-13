<script>
import * as icons from "vue-feather-icons";

export default {
  name: "FeatherIcon",
  functional: true,
  props: {
    icon: {
      required: true,
      type: [String, Object],
    },
    size: {
      type: String,
      default: "14",
    },
    badge: {
      type: [String, Object, Number],
      default: null,
    },
    badgeClasses: {
      type: [String, Object, Array],
      default: "badge-primary",
    },
  },
  render(h, { props, data }) {
    // Create Feather Icon
    const svg = h(icons[props.icon], { props: { size: props.size }, ...data });

    // If no badge is provided => Render just SVG
    if (!props.badge) return svg;

    // Badge
    const badgeEl = h(
      "span",
      { staticClass: "badge badge-up badge-pill", class: props.badgeClasses },
      [props.badge]
    );

    // Return span with children
    return h("span", { staticClass: "feather-icon position-relative" }, [
      svg,
      badgeEl,
    ]);
  },
};
</script>

<style lang="scss">
svg.feather {
  outline: none;
}
</style>


<!--
// import * as icons from "vue-feather-icons";
// import { Component, Vue, Prop } from "vue-property-decorator";
// @Component({
//   name: "FeatherIcon",
// })
// export default class FeatherIcon extends Vue {
//   // name: "FeatherIcon",
//   // functional: true,
//   @Prop({ default: null, required: true })
//   private icon!: [String, Object];
//   @Prop({ default: 14 })
//   private size!: String;
//   @Prop({ default: null })
//   private badge!: [String, Object, Number];
//   @Prop({ default: "badge-primary" })
//   private badgeClasses!: [String, Object, Array];
//   render(h, { props, data }) {
//     // Create Feather Icon
//     const svg = h(icons[props.icon], { props: { size: props.size }, ...data });

//     // If no badge is provided => Render just SVG
//     if (!props.badge) return svg;

//     // Badge
//     const badgeEl = h(
//       "span",
//       { staticClass: "badge badge-up badge-pill", class: props.badgeClasses },
//       [props.badge]
//     );

//     // Return span with children
//     return h("span", { staticClass: "feather-icon position-relative" }, [
//       svg,
//       badgeEl,
//     ]);
//   }
// }
//
</script>

// <style lang="scss">
// svg.feather {
//   outline: none;
// }
//
</style>

