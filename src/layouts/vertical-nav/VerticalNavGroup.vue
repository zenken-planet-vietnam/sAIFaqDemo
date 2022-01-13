<template lang="">
    <li class="nav-item has-sub" :class="[ item.isOpen?'open':'close']">
    <b-link
      @click="() => updateGroupOpen(!item.isOpen)"
      class="group-title d-flex align-items-center"
      :class="{'close':!item.isOpen,'active':item.isOpen}"
       
    >
      <span class="menu-title text-truncate">{{ item.label }}</span>
    </b-link>
    <b-collapse
      v-if="item.childs&&item.childs.length>0"
      v-model="item.isOpen"
      class="menu-content"
      tag="ul"
    >
      <component
      :is="resolveNavItemComponent(childItem)"
      v-for="childItem in item.childs"
      :key="childItem.id"
      :item="childItem"
    />
    </b-collapse>
  </li>
</template>
<script lang="ts">
import VerticalNavLink from "./VerticalNavLink.vue";
import { BCollapse, BLink } from "bootstrap-vue";
import { Component, Vue, Prop } from "vue-property-decorator";
import { CategoryModule } from "@/store/modules/category";
@Component({
  name: "VerticalNavGroup",
  components: {
    VerticalNavLink,
    BCollapse,
    BLink,
  },
})
export default class VerticalNavGroup extends Vue {
  @Prop({ default: {} })
  private item!: any;
  // eslint-disable-next-line no-unused-vars
  resolveNavItemComponent(item: any) {
    return item.childs && item.childs.length > 0
      ? "vertical-nav-group"
      : "vertical-nav-link";
  }
  updateGroupOpen(value: any) {
    CategoryModule.updateGroupOpen({
      id: this.item.id,
      value,
    });
  }
}
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
    ul {
      li {
        padding-left: 1rem;
        position: relative;
      }
    }
    a {
      &::after {
        content: "";
        height: 1.1rem;
        width: 1.1rem;
        display: inline-block;
        position: absolute;
        right: 20px;
        background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%236e6b7b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' class='feather feather-chevron-right'%3E%3Cpath d='M9 18l6-6-6-6'/%3E%3C/svg%3E");
      }
      &.active {
        font-weight: bold;
      }
      &:hover {
        background: #f5f5f5;
      }
    }
    &.open {
      :not(.close) {
        &::after {
          -webkit-transform: rotate(90deg);
        }
      }
    }
  }
}
</style>