<template lang="">
   <li
    class="nav-item no-sub"
  >
    <b-link
      @click="selectedMenu"
      :class="{'selected':item.isSelected}"
      class="d-flex align-items-center"
    >
      <span class="menu-title text-truncate">{{ item.label }}</span>
    </b-link>
  </li>
</template>
<script>
export default {
  props: {
    item: {
      type: Object,
      default: () => {},
    },
  },
  methods: {
    selectedMenu() {
      this.$store.dispatch("category/selectedCategory", this.item.id);
    },
  },
};
</script>
<style lang="scss">
.nav-item {
  list-style-type: none;
  .no-sub {
    &:hover {
      a {
        padding-left: 30px;
      }
    }
  }
  a {
    padding: 0.75rem 1rem;
    color: #625f6e;
    line-height: 1.45;
    text-decoration: none;
    -webkit-transition: all 0.5s ease;
    -moz-transition: all 0.5s ease;
    transition: all 0.5s ease;
    &.selected {
      font-weight: bold;
      color: #7367f0;
    }
  }
}
</style>