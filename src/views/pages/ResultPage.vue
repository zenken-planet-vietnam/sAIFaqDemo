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
       <div v-if="question.conditions" class="mt-1">
         <condition-group v-for="item,index in conditionGroup"  :key="item.id" @selectedChange="conditionChange" :data="item" :levelIndex="index+1" :selectedCondition="selectedCondition"/>
       </div>
        <div v-if="(question.conditions.length===0||(question.conditions.length>0&&answers!==null&&answers.length===1))" class="mt-1">
          <div v-for="item,index in getAnswer" :key="index" class="answer-content">
            <span>{{item.text}}</span>
          </div>
       </div>
        <div v-if="showResult" class='result mt-2'>
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
import { SearchForm, Pin, ConditionGroup } from "@/components/questions";
import { Component, Watch } from "vue-property-decorator";
import { mixins } from "vue-class-component";
import PageMixin from "@/@core/mixins/searchDataMixin";
import { PageModule } from "@/store/modules/page";
@Component({
  components: {
    QuestionItem: () => import("@/components/questions/QuestionItem.vue"),
    BFormInput,
    BFormGroup,
    BForm,
    SearchForm,
    BButton,
    Pin,
    ConditionGroup,
  },
  created() {
    this.questionId = parseInt(this.$route.query.id, 10);
    if (this.questions.length > 0) this.getQuestion();
  },
})
export default class ResultPage extends mixins(PageMixin) {
  question = null;
  questionId = null;
  answers = null;
  conditionLevel = 1;
  selectedCondition = [];
  async getQuestion() {
    // fake data to store
    this.question = await PageModule.getAnswerFromQuestion(this.questionId);
  }
  get conditionGroup() {
    return this.question.conditions.slice(0, this.conditionLevel);
  }

  get getAnswer() {
    return this.question.conditions && this.question.conditions.length > 0
      ? this.answers
      : this.question.answers;
  }

  get showResult() {
    return (this.question.answers?.length === 1 &&
      this.question.conditions.length === 0) ||
      (this.question.answers.length === 1 &&
        this.question.conditions.length > 0)
      ? true
      : false;
  }

  conditionChange(event) {
    this.selectedCondition = [...this.selectedCondition, event];
    this.selectedLevelChange(event);
    this.answers = this.getAnswerFromCondition(
      this.question.answers,
      this.selectedCondition
    );
    if (this.answers.length > 1) this.conditionLevel++;
  }

  selectedLevelChange(event) {
    this.conditionLevel = event.level;
    if (event.level <= this.selectedCondition.length) {
      this.selectedCondition = this.selectedCondition.slice(0, event.level - 1);
      this.selectedCondition.push(event);
    }
  }

  getAnswerFromCondition(answers, conditions) {
    let answerResult = [];
    conditions.forEach((condition) => {
      let conditionAnswers = [];
      answers.forEach((element) => {
        for (const key in element.answerConditionMap) {
          if (
            element.answerConditionMap[key].conditionGroup.id ===
              condition.conditionGroupId &&
            element.answerConditionMap[key].condition.find(
              (x) => x.id === condition.conditionId
            ) !== undefined
          ) {
            conditionAnswers.push(element);
          }
        }
      });
      if (answerResult.length === 0) answerResult = [...conditionAnswers];
      else if (conditionAnswers.length > 0)
        answerResult = this.getArraysIntersection(
          answerResult,
          conditionAnswers
        );
    });
    // return answers.filter(x=>x.answerConditionMap.find(y=>y.conditionGroup.id===condition.conditionGroupId&&y.condition.find(z=>z.id===event.conditionId)!==undefined)!==undefined)
    return answerResult;
  }

  getArraysIntersection(a1, a2) {
    return a1.filter((n) => {
      return a2.indexOf(n) !== -1;
    });
  }

  @Watch("questions")
  onQuestionChange(newValue) {
    if (newValue.length > 0) {
      this.getQuestion();
    }
  }

  @Watch("$route")
  onRouteChange(newValue) {
    this.questionId = parseInt(newValue.query.id);
    this.getQuestion();
  }
}
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