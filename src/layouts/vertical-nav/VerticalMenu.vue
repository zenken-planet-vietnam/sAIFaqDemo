<template lang="">
  <div class="vertical-menu-container">
    <ul class="vertical-menu">
      <component
        :is="resolveNavItemComponent(item)"
        v-for="item in categoriesData"
        :key="item.id"
        :item="item"
        :loading="loading"
      />
    </ul>
    <div
      v-if="$route.name !== 'analytic'"
      @click="$router.push({ name: 'analytic' })"
      class="analytic-btn-container"
    >
      <div class="analytic-btn">
        <feather-icon size="18" icon="BarChartIcon" />
        <span class="ml-1">Analytic</span>
      </div>
    </div>
    <div
      v-if="$route.name !== 'settings'"
      @click="$router.push({ name: 'settings' })"
      class="settings-btn-container"
    >
      <div class="settings-btn">
        <feather-icon size="18" icon="SettingsIcon" />
        <span class="ml-1">Settings</span>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component } from 'vue-property-decorator'
import VerticalNavLink from './VerticalNavLink.vue'
import VerticalNavGroup from './VerticalNavGroup.vue'
import CategoryMixin from '@/@core/mixins/categoryMixin'
// import { CategoryModule } from "@/store/modules/category";
import { mixins } from 'vue-class-component'

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
  get categoriesData() {
    const categorieSkeleton: any = []
    if (this.loading) {
      for (let i = 0; i < 6; i++) {
        categorieSkeleton.push({})
      }
      return categorieSkeleton
    }
    // return categorieSkeleton
    return this.categories
  }
  resolveNavItemComponent = (item: any) => {
    if (!item.childs) return 'vertical-nav-group'
    return item.childs && item.childs.length > 0
      ? 'vertical-nav-group'
      : 'vertical-nav-link'
  }
}
</script>
<style lang="scss">
.vertical-menu-container {
  .b-skeleton-wrapper {
    width: 100%;
  }
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
  .settings-btn-container {
    position: absolute;
    bottom: 60px;
    width: 100%;
    padding: 0rem 3rem;
    .settings-btn {
      cursor: pointer;
      width: auto;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 0.375rem 0.375rem;
      background: rgba(232, 228, 0, 0.12);
      border-radius: 0.375rem;
      // border: 1px solid #00cfe8;
      font-weight: 500;
      &:hover {
        border: 1px solid #b6b302;
      }
      svg {
        stroke: #b6b302;
      }
    }
  }
}
</style>
