/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
<template lang="s">
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
   </div>
</template>
<script>
// eslint-disable-next-line no-unused-vars
import { BFormInput, BFormGroup, BForm } from "bootstrap-vue";
import SearchForm from "./questions/SearchForm.vue";
import searchDataMixin from "@/@core/mixins/searchDataMixin";
import configMixin from "@/@core/mixins/configMixin";
export default {
  data() {
    return {};
  },
  mixins: [searchDataMixin, configMixin],
  components: {
    QuestionItem: () => import("./questions/QuestionItem.vue"),
    BFormInput,
    BFormGroup,
    BForm,
    SearchForm,
  },

  created() {},
  methods: {
    // ...mapActions(["page/updateQuestion", "page/getQuestionsFaq"]),
  },
};
</script>
<style lang="scss" scoped>
</style>