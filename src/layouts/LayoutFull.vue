<template>
  <div class="h-100">
    <router-view />
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
@Component({})
export default class LayoutFull extends Vue {}
</script>
