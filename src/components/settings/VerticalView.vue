<template>
  <div>
    <b-tabs v-model="tabIndex"
        active-nav-item-class="font-weight-bold"
        content-class="mt-1"
      >
        <b-tab active>
          <template #title>
            Promoted Results <span class="sai-badges"> {{countPromotedQuestion}}</span>
          </template>
          <promoted-results/>
        </b-tab>
        <b-tab lazy>
          <template #title>
            Hidden Results <span class="sai-badges"> {{countHiddenQuestion}}</span>
          </template>
          <hidden-results/>
        </b-tab>
      </b-tabs>
      <div>
        <query-search-results/>
      </div>
  </div>
</template>

<script lang="ts">
import {Component} from "vue-property-decorator";
import { BTabs } from "bootstrap-vue";
import SettingMixin from "@/@core/mixins/settingMixin";
import {mixins} from "vue-class-component";
import HiddenResults from "./HiddenResults.vue";
import PromotedResults from "./PromotedResults.vue";
import QuerySearchResults from "./QuerySearchResults.vue";

@Component({
  components: {
    BTabs,
    "hidden-results": HiddenResults,
    "promoted-results": PromotedResults,
    "query-search-results": QuerySearchResults,
  },
})
export default class HorizontalView extends mixins(SettingMixin) {
  tabIndex: any = 1

}
</script>

<style scoped>

</style>