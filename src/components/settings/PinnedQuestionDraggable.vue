<template>
  <div class="">
    <div class="mb-1 d-flex align-items-center">
      <b-link class="d-flex align-items-center" @click="$router.push({name:'settings'})">
        <feather-icon icon="ArrowLeftIcon"/> Back
      </b-link>
    </div>
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
    <add-manually/>
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
import {SettingModule} from "@/store/modules/setting";
import HiddenResults from "./HiddenResults.vue";
import PromotedResults from "./PromotedResults.vue";
import QuerySearchResults from "./QuerySearchResults.vue";
import AddManually from "./AddManually.vue"

@Component({
  components: {
    BTabs,
    AddManually,
    "hidden-results": HiddenResults,
    "promoted-results": PromotedResults,
    "query-search-results": QuerySearchResults,
  },
})
export default class PinnedQuestionDraggable extends mixins(SettingMixin) {
  tabIndex: any = 1

  async fetchDataPinnedQuestion(queryId: any) {
    await SettingModule.getPinnedQuestionByQuery(queryId)
  }

  async created() {
    this.$store.state.config.isLoading = true;
    await this.fetchDataPinnedQuestion(this.$route.params.pinnedQueryId)
    this.$store.state.config.isLoading = false;
  }

  get countPromotedQuestion() {
    return this.pinnedQuestionByQueryID
        .filter((item: any) => item.pin_type).length
  }

  get countHiddenQuestion() {
    return this.pinnedQuestionByQueryID
        .filter((item: any) => !item.pin_type).length
  }

}
</script>

<style scoped>
.sai-badges {
  font-size: 12px;
  font-weight: 500;
  line-height: 18px;
  padding: 0 8px;
  display: inline-block;
  text-decoration: none;
  border-radius: 3px;
  border: 1px solid transparent;
  background-color: initial;
  white-space: nowrap;
  vertical-align: middle;
  cursor: default;
  max-width: 100%;
  text-align: left;
  background-color: #bce4b7;
  color: rgb(0, 0, 0);
}

</style>