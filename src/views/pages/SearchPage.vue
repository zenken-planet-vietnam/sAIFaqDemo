<template lang="">
  <div class="search-page-container" :class="{ card: config.SEARCH_BUTTON }">
    <search-form />
    <div v-if="!(searchProcess && config.SEARCH_BUTTON)">
      <div class="faq-title mt-2">
        <span class="font-weight-bold">
          {{ "Frequently Asked Questions" }}
        </span>
      </div>
      <div v-if="faqQuestions">
        <question-item
          v-for="item in faqQuestions"
          :key="item.id"
          :data="item"
        />
      </div>
      <div v-if="showRecentlyQuestions">
        <div class="faq-title mt-2">
          <span class="font-weight-bold">
            {{ "Recent Questions" }}
          </span>
        </div>
        <div>
          <question-item
            v-for="item in recentlyQuestions"
            :key="item.id"
            :data="item"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component } from "vue-property-decorator";
import { BFormInput, BFormGroup, BForm } from "bootstrap-vue";
import { SearchForm } from "@/components/questions";
import { mixins } from "vue-class-component";
import PageMixin from "@/@core/mixins/searchDataMixin";
@Component({
  components: {
    BFormInput,
    BFormGroup,
    BForm,
    SearchForm,
    QuestionItem: () => import("@/components/questions/QuestionItem.vue"),
  },
})
export default class SearchPage extends mixins(PageMixin) {
  get recentlyQuestions() {
    let faqIds = this.localFaq();
    if (faqIds?.length && this.questions?.length)
      return faqIds.map((x: any) => {
        return this.questions.find((y: any) => y.id === x);
      });
    return [];
  }

  get showRecentlyQuestions() {
    return this.localFaq()?.length;
  }

  localFaq() {
    let recentFagIds: any = [];
    let localData = localStorage.getItem("recent-faq");
    if (localData) recentFagIds = JSON.parse(localData);
    return recentFagIds;
  }
}
</script>
<style lang="scss">
.search-page-container {
  .faq-title {
    padding: 10px 0px;
    border-bottom: 2px solid #138d75;
  }
}
</style>
