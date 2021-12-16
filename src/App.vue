<template>
  <div id="app">
    <!-- <Login /> -->
    <component :is="layout">
      <router-view />
    </component>
  </div>
</template>

<script>
// import HelloWorld from './components/HelloWorld.vue'
// import Login from '@/components/Login.vue'
export default {
  name: "App",
  components: {
    // HelloWorld,
    // Login
    Layout: () => import("@/layouts/Layout.vue"),
    LayoutFull: () => import("@/layouts/LayoutFull.vue"),
  },
  computed: {
    layout() {
      return this.$route.meta.layout ? "layout-full" : "layout";
    },
  },
};
</script>

<style>
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  height: 100vh;
}
</style>
