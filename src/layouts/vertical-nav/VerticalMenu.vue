<template lang="">
    <div>
        <ul class="vertical-menu">
    <component
      :is="resolveNavItemComponent(item)"
      v-for="item in categories"
      :key="item.id"
      :item="item"
    />
  </ul>
    </div>
</template>
<script>
import VerticalNavLink from "./VerticalNavLink.vue";
import VerticalNavGroup from "./VerticalNavGroup.vue";
import categoryMixin from "@core/mixins/categoryMixin";
export default {
  mixins: [categoryMixin],
  components: {
    VerticalNavLink,
    VerticalNavGroup,
  },
  computed: {},
  created() {
    // get all menu
    this.$store.dispatch("category/getCategory", { all: true });
  },
  methods: {
    // eslint-disable-next-line no-unused-vars
    resolveNavItemComponent(item) {
      return item.childs && item.childs.length > 0
        ? "vertical-nav-group"
        : "vertical-nav-link";
    },
  },
};
</script>
<style lang="scss">
.vertical-menu {
  list-style-type: none;
  padding: 1rem 0 0 0;
  ul {
    padding-left: 0;
  }
}
</style>