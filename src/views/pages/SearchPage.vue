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
        <question-pagination :loading="pageLoading" :questions="faqQuestionData" />
      </div>
      <div v-if="showRecentlyQuestions">
        <div class="faq-title mt-2">
          <span class="font-weight-bold">
            {{ "Recently Questions" }}
          </span>
        </div>
        <div class="recent-question">
           <question-pagination :loading="pageLoading" :questions="recentlyQuestions" />
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
import {QuestionPagination} from "@/components/questions"
@Component({
  components: {
    BFormInput,
    BFormGroup,
    BForm,
    SearchForm,
    QuestionPagination
  },
})
export default class SearchPage extends mixins(PageMixin) {
 get faqQuestionData(){
    if(this.pageLoading){
       let skeletonItems=[]
      for (let i = 0; i < 10; i++) {
       skeletonItems.push({})
      }
      return skeletonItems
    }
    return this.faqQuestions
 }
  get recentlyQuestions() {
    let faqIds = this.localFaq();
     if(this.pageLoading){
       let skeletonItems=[]
      for (let i = 0; i < faqIds.length; i++) {
       skeletonItems.push({})
      }
      return skeletonItems
    }
    const recentlyQuestion: any = []

    if (faqIds?.length && this.faqQuestions?.length) {
      faqIds.forEach((x: any) => {
        const findItem:any = this.faqQuestions.find((item: any) => item.id == x)
        if (findItem)
          recentlyQuestion.push({...findItem})
      })
      // return faqIds.map((x: any) => {
      //   return this.questions.find((y: any) => y.id === x);
      // });
    }
    return recentlyQuestion
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
  .recent-question{
    transition: all .5s ease-in-out;
  }
}
</style>
