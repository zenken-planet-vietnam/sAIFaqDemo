<template>
  <div>
    <b-row v-if="getQuestionSearchResult.length > 0" class="mt-2">
      <div class="settings-title">
        Top search by query "{{ $route.params.pinnedQueryLabel }}"
      </div>
      <b-col md="12" >
        <div class="question-search-result">
          <div v-for="question in getQuestionSearchResult" :key="question.id">
            <b-card class="mt-1 question-search-item"
                    :sub-title="'Last updated ' + formatDatetime(question.modified)">
              <template #header>
                <high-light class="question-title" :textColor="'rgba(14,183,84,0.21)'" :text="question.label" :targets="getTargets"/>
                <div>
                  <b-button title="Promote this result" variant="outline-success" @click="promoteQuestion(question)" size="sm" class="mr-1">
                    <feather-icon icon="TrendingUpIcon"></feather-icon>
                  </b-button>
                  <b-button title="Hide this result" variant="outline-danger"  @click="hideQuestion(question)" size="sm">
                    <feather-icon icon="EyeOffIcon"></feather-icon>
                  </b-button>
                </div>
              </template>
              <b-card-text>
                <high-light :textColor="'rgba(14,183,84,0.21)'" :text="question.title" :targets="getTargets"/>
              </b-card-text>
            </b-card>
          </div>
        </div>
      </b-col>
    </b-row>
    <b-row v-else class="mt-1 d-flex flex-column justify-content-center align-items-center">
      <b-col md="6" class="d-flex justify-content-center">
        <div class="settings-title">
          Cannot find any search result with query "{{ $route.params.pinnedQueryLabel }}"
        </div>
      </b-col>
    </b-row>
  </div>
</template>

<script lang="ts">
import {Component} from "vue-property-decorator";
import { BCol, BRow } from "bootstrap-vue";
import SettingMixin from "@/@core/mixins/settingMixin";
import {mixins} from "vue-class-component";
import {PageModule} from "@/store/modules/page";
import HighLight from "../questions/HighLight.vue";

@Component({
  components: {
    BRow,
    BCol,
    HighLight,
  },
})
export default class QuerySearchResults extends mixins(SettingMixin) {
  get getTargets() {
      return PageModule.searchWords;
  }

  get getQuestionSearchResult() {
    const array = PageModule.fullQuestions
    return array.filter((elem: any) => !this.pinnedQuestionByQueryID.find(
        (question: any) => elem.id === question.id))
  }
  async fetchDataQuestionByQuery(text: any) {
    let searchText = text.toLowerCase().trim();
    PageModule.updateProcess(true);
    PageModule.filterQuestions(searchText)
  }

  async created() {
    this.$store.state.config.isLoading = true;
    await this.fetchDataQuestionByQuery(this.$route.params.pinnedQueryLabel)
    this.$store.state.config.isLoading = false;
  }

}
</script>

<style scoped>
.list-group-item i {
  cursor: pointer;
}
.settings-title {
  font-size: 21px;
  font-weight: 600;
}

.question-title {
  font-size: 20px;
}
.card-header {
  display: flex;
  justify-content: space-between;
}
</style>
