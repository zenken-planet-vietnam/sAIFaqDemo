<template>
  <div id="app">
    <component :is="layout">
      <router-view />
    </component>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component({
  components: {
    Layout: () => import("@/layouts/Layout.vue"),
    LayoutFull: () => import("@/layouts/LayoutFull.vue"),
  },
})
export default class App extends Vue {
  get layout() {
    return this.$route?.meta?.layout ? "layout-full" : "layout";
  }
}
</script>

<style>
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  height: 100vh;
}
</style>
