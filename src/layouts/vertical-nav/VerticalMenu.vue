<template lang="">
    <div class="vertical-menu-container">
        <ul class="vertical-menu">
          <component
            :is="resolveNavItemComponent(item)"
            v-for="item in categories"
            :key="item.id"
            :item="item"
          />
        </ul>
        <div v-if="$route.name!=='analytic'" @click="$router.push({name:'analytic'})" class="analytic-btn-container">
          <div class="analytic-btn">
          <feather-icon size="18" icon="BarChartIcon"/>
          <span class="ml-1">Analytic</span>
         </div>
        </div>
    </div>
</template>
<script lang="ts">
import { Component } from "vue-property-decorator";
import VerticalNavLink from "./VerticalNavLink.vue";
import VerticalNavGroup from "./VerticalNavGroup.vue";
import CategoryMixin from "@/@core/mixins/categoryMixin";
// import { CategoryModule } from "@/store/modules/category";
import { mixins } from "vue-class-component";
@Component({
  components: {
    VerticalNavLink,
    VerticalNavGroup,
  },
  created() {
    // get all menu
    // CategoryModule.getCategory();
  },
})
export default class VerticalMenu extends mixins(CategoryMixin) {
  resolveNavItemComponent = (item: any) => {
    return item.childs && item.childs.length > 0
      ? "vertical-nav-group"
      : "vertical-nav-link";
  };
}
</script>
<style lang="scss">
.vertical-menu-container {
  position: relative;
  height: 100%;
  .vertical-menu {
    list-style-type: none;
    padding: 1rem 0 0 0;
    max-height: calc(100% - 60px);
    overflow-y: auto;
    ul {
      padding-left: 0;
    }
  }
  .analytic-btn-container {
    position: absolute;
    bottom: 10px;
    width: 100%;
    padding: 0rem 3rem;
    .analytic-btn {
      cursor: pointer;
      width: auto;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 0.375rem 0.375rem;
      background: rgba(0, 207, 232, 0.12);
      border-radius: 0.375rem;
      // border: 1px solid #00cfe8;
      font-weight: 500;
      &:hover {
        border: 1px solid #00cfe8;
      }
      svg {
        stroke: #00cfe8;
      }
    }
  }
}
</style>