<template lang="s">
   <div class="result-page-container">
    <div class="card">
       <search-form/>
    </div>
     <div v-if="!searchProcess &&question" class="qa card mt-2">
       <!-- <div class="question-icon">
          <feather-icon
                    class="icon"
                    size="24"
                    icon="HelpCircleIcon"
                  />
       </div> -->
       <div class="back-icon" @click="$router.push({name:'search-page'})">
          <feather-icon
                    class="icon"
                    size="24"
                    icon="ArrowLeftIcon"
                  />
       </div>
        <pin class="question-pin"/>
        <div class="question-content">
            <span>{{question.label}}</span>
        </div>
       <div class="mt-1">
          <div v-for="item,index in question.answers" :key="index" class="answer-content">
            <span>{{item.text}}</span>
        </div>
       </div>
        <div class='result mt-2'>
          <b-button variant='primary'>
            <span>{{'Resolve'}}</span>
          </b-button>
          <b-button class='ml-1' variant='outline-primary'>
            <span>{{'UnResolve'}}</span>
          </b-button>
        </div>
     </div>
   </div>
</template>
<script>
// eslint-disable-next-line no-unused-vars
import { BFormInput, BFormGroup, BForm, BButton } from "bootstrap-vue";
import SearchForm from "./questions/SearchForm.vue";
import searchDataMixin from "@/@core/mixins/searchDataMixin";
import configMixin from "@/@core/mixins/configMixin";
import Pin from "../components/questions/Pin.vue";
export default {
  data() {
    return {
      question: null,
      questionId: null,
    };
  },
  mixins: [searchDataMixin, configMixin],
  components: {
    QuestionItem: () => import("./questions/QuestionItem.vue"),
    BFormInput,
    BFormGroup,
    BForm,
    SearchForm,
    BButton,
    Pin,
  },
  watch: {
    questions(newValue) {
      if (newValue.length > 0) {
        this.getQuestion();
      }
    },
    $route(newValue) {
      this.questionId = parseInt(newValue.query.id);
      this.getQuestion();
    },
  },
  async created() {
    this.questionId = parseInt(this.$route.query.id, 10);
    if (this.questions.length > 0) this.getQuestion();
  },
  methods: {
    async getQuestion() {
      // fake data to store
      this.question = await this.$store.dispatch(
        "page/getAnswerFromQuestion",
        this.questionId
      );
    },
  },
};
</script>
<style lang="scss" scoped>
.qa {
  position: relative;
  .question-icon {
    width: 50px;
    height: 50px;
    position: absolute;
    background: gray;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff;
    top: -25px;
    left: 0px;
    background: #7367f0;
  }
  .back-icon {
    top: 5px;
    left: 5px;
    position: absolute;
    width: 25px;
    height: 25px;
    background: rgba(0, 207, 232, 0.12);
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    color: #00cfe8;
    cursor: pointer;
    transition: all 0.5s ease;
    &:hover {
      background: rgba(0, 207, 232, 0.12);
      width: 30px;
      height: 30px;
    }
  }
  .question-content {
    font-size: 21px;
    font-weight: 500;
  }
  .answer-content {
    color: #b9b9c3;
    padding-left: 20px;
  }
  .question-pin {
    position: absolute;
    right: 20px;
    top: 20px;
  }
  .result {
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>