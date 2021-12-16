/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
<template lang="s">
   <div class="search-page-container">
     <search-form/>
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
<script>
// eslint-disable-next-line no-unused-vars
import { BFormInput, BFormGroup, BForm } from "bootstrap-vue";
import SearchForm from "./questions/SearchForm.vue";
import searchDataMixin from "@/@core/mixins/searchDataMixin";
export default {
  data() {
    return {};
  },
  mixins: [searchDataMixin],
  components: {
    QuestionItem: () => import("./questions/QuestionItem.vue"),
    BFormInput,
    BFormGroup,
    BForm,
    SearchForm,
  },

  created() {
    // fake data to store
    this.$store.dispatch("page/getQuestionsFaq");
  },
  methods: {
    // ...mapActions(["page/updateQuestion", "page/getQuestionsFaq"]),
  },
};
</script>
<style lang="scss" scoped>
.search-page-container {
  max-width: 1280px;
  margin: auto;
  padding: 50px 20px;
}
@media (max-width: 768px) {
  .search-page-container {
    padding: 10px 10px;
  }
}
</style>