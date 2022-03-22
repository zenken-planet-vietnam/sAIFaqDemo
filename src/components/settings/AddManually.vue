<template>
  <div>
    <b-sidebar
      id="sidebar-backdrop"
      title="Add manually"
      backdrop-variant="dark"
      backdrop
      shadow
      right
      width="800px"
    >
      <div class="px-3 py-2">
        <search-form-manually/>
      </div>

    </b-sidebar>
  </div>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";
import {BCol, BRow, BSidebar} from "bootstrap-vue";
import
  SearchFormManually
 from "@/components/settings/SearchFormManually.vue";
@Component({
  components: {
    BRow,
    BCol,
    BSidebar,
    'search-form-manually':SearchFormManually
  },
})
export default class AddManually extends Vue {
}
</script>