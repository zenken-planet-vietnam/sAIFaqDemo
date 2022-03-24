<template lang="">
   <li
    class="nav-item no-sub"
  >
    <b-link
      @click="selectedMenu"
      :class="{'selected': selectedCategory!==null&&item.id===selectedCategory.id}"
      class="d-flex align-items-center"
    >
      <span class="menu-title text-truncate">{{item.label }}</span>
    </b-link>
  </li>
</template>
<script lang="ts">
import { Component, Prop } from "vue-property-decorator";
import { CategoryModule } from "@/store/modules/category";
import CategoryMixin from "@/@core/mixins/categoryMixin";
import { mixins } from "vue-class-component";
@Component({})
export default class VerticalNavLink extends mixins(CategoryMixin) {
  @Prop({ default: {} })
  private item!: any;

  // select menu
  selectedMenu() {
    CategoryModule.updateSelectedCategory(this.item);
  }
}
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