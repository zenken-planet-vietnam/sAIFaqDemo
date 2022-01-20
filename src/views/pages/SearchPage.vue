<template lang="">
  <div class="search-page-container" :class="{'card':config.SEARCH_BUTTON}">
     <search-form/>
     <div v-if="!(searchProcess&&config.SEARCH_BUTTON)">
      <div class="mt-2">
       <span class="font-weight-bold">
         {{"Frequently Asked Questions"}}
       </span>
      </div>
       <div v-if="faqQuestions">
         <question-item v-for="item in faqQuestions" :key="item.id" :data="item"/>
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
export default class SearchPage extends mixins(PageMixin) {}
</script>
<style lang="">
</style>