<template lang="">
    <li class="nav-item has-sub" :class="{'open': item.isOpen,}">
    <b-link
      @click="() => updateGroupOpen(!item.isOpen)"
      class="group-title d-flex align-items-center"
       
    >
      <span class="menu-title text-truncate">{{ item.label }}</span>
    </b-link>
    <b-collapse
      v-model="item.isOpen"
      class="menu-content"
      tag="ul"
    >
      <component
      :is="resolveNavItemComponent(item)"
      v-for="item in item.childs"
      :key="item.id"
      :item="item"
    />
    </b-collapse>
  </li>
</template>
<script>
import VerticalNavLink from "./VerticalNavLink.vue";
import { BCollapse, BLink } from "bootstrap-vue";
export default {
  components: {
    VerticalNavLink,
    BCollapse,
    BLink,
  },
  data() {
    return {};
  },
  props: {
    item: {
      type: Object,
      default: () => {},
    },
  },
  methods: {
    // eslint-disable-next-line no-unused-vars
    resolveNavItemComponent(item) {
      return item.childs && item.childs.length > 0
        ? "vertical-nav-group"
        : "vertical-nav-link";
    },
    updateGroupOpen(value) {
      this.$store.dispatch("category/updateGroupOpen", {
        id: this.item.id,
        value,
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.nav-item {
  position: relative;
  &:hover {
    a {
      padding-left: 30px;
    }
  }
  &.has-sub {
    a {
      &::after {
        content: "";
        height: 1.1rem;
        width: 1.1rem;
        display: inline-block;
        position: absolute;
        right: 20px;
        background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%236e6b7b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' class='feather feather-chevron-right'%3E%3Cpath d='M9 18l6-6-6-6'/%3E%3C/svg%3E");
        // background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%236e6b7b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' class='feather feather-chevron-down'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E") !important;
      }
    }
    &.open {
      a {
        &::after {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%236e6b7b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' class='feather feather-chevron-down'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E") !important;
        }
      }
    }
  }
}
</style>