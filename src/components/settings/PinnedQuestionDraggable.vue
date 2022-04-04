<template>
  <div class="">
    <div class="mb-1 d-flex align-items-center justify-content-between">
      <b-link class="d-flex align-items-center" @click="$router.push({name:'settings'})">
        <feather-icon icon="ArrowLeftIcon"/> Back
      </b-link>
      <div>
        <b-button variant="outline-dark" @click="toggleView(true)" :pressed="pressView" size="sm" class="mr-1">
          <feather-icon icon="ListIcon"></feather-icon>
        </b-button>
        <b-button variant="outline-dark" @click="toggleView(false)" :pressed="!pressView" size="sm" class="">
          <feather-icon icon="ColumnsIcon"></feather-icon>
        </b-button>
      </div>
    </div>
    <div v-if="pressView">
      <horizontal-view/>
    </div>
    <div v-else>
      <vertical-view/>
    </div>
    <add-manually/>

  </div>
</template>

<script lang="ts">
import {Component} from "vue-property-decorator";
import SettingMixin from "@/@core/mixins/settingMixin";
import {mixins} from "vue-class-component";
import {SettingModule} from "@/store/modules/setting";
import HorizontalView from "./VerticalView.vue";
import VerticalView from "./HorizontalView.vue"
import AddManually from "./AddManually.vue"

@Component({
  components: {
    HorizontalView,
    VerticalView,
    AddManually,

  },
})
export default class PinnedQuestionDraggable extends mixins(SettingMixin) {
  pressView: boolean = true

  async fetchDataPinnedQuestion(queryId: any) {
    await SettingModule.getPinnedQuestionByQuery(queryId)
  }

  toggleView(isPressed: any) {
    this.pressView = isPressed
    return this.toggleView
  }

  async created() {
    this.$store.state.config.isLoading = true;
    await this.fetchDataPinnedQuestion(this.$route.params.pinnedQueryId)
    this.$store.state.config.isLoading = false;
  }
}
</script>

<style>

.flip-list-move {
  transition: transform 0.5s;
}

.no-move {
  transition: transform 0s;
}

.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}

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