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
      <div>
         <div class="reset-button" @click="$router.push({name:'search-page'})">
          <feather-icon
                    class="icon"
                    size="16"
                    icon="RefreshCwIcon"
                  />
                  <span>Reset</span>
       </div>
      </div>
        <pin class="question-pin"/>
        <div class="question-content">
           <div class="question-title">
                 <feather-icon
                    class="icon mr-1"
                    icon="HelpCircleIcon"
                    size="24"
                  />
                  <span>Question</span>
            </div>
           <div class="content">
              <span>{{question.label}}</span>
           </div>
        </div>
       <div v-if="activeConditions.length" class="mt-1">
         <condition-group v-for="item, index in activeConditions" :key="item.id" @selectedChange="conditionSelected" :data="item" :levelIndex="item.conditionGroup.level" :selectedConditions="selectedConditions"/>
       </div>
        <div v-if="answer" class="answer-content mt-1">
            <div class="answer-title">
                 <feather-icon
                    class="icon mr-1"
                    icon="InfoIcon"
                    size="24"
                  />
                  <span>Answer</span>
            </div>
         <div class="content">
            <div>
              <span>{{answer.text}}</span>
            </div>
         </div>
       </div>
        <div v-if="answer" class='result mt-2'>
          <b-button variant='primary'>
            <span>{{'Resolved'}}</span>
          </b-button>
          <b-button class='ml-1' variant='outline-primary'>
            <span>{{'Unresolved'}}</span>
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
})
export default class ResultPage extends mixins(PageMixin) {
  question = null;
  questionId = null;

  // the answers match selected conditions
  matchingAnswers = [];

  // the conditions that user selected
  selectedConditions = [];

  // the conditions are showing
  activeConditions = [];

  // the current condition's level is showing
  currentLevel = 0;

  hasNextCondtion = true;

  created() {
    this.questionId = parseInt(this.$route.query.id, 10);
    if (this.questions.length > 0) {
      this.getQuestion();
    }
  }

  async getQuestion() {
    this.question = await PageModule.getAnswerFromQuestion(this.questionId);

    // Display the first condition
    if (this.question.conditions?.length) {
      const firstCondition = this.question.conditions[0];
      if (firstCondition) {
        this.activeConditions.push(firstCondition);
        this.currentLevel = firstCondition.conditionGroup.level;
      }
    }
  }

  get answer() {
    if (this.question?.conditions?.length) {
      if (this.matchingAnswers.length === 1 || (!this.hasNextCondtion && this.matchingAnswers.length)) {
        return this.matchingAnswers[0];
      }
    } else if (this.question?.answers?.length) {
      return this.question.answers[0];
    }

    return null;
  }

  conditionSelected(event) {
    // Check if user select a level less than or equal current level
    if (event.level <= this.currentLevel) {
      this.checkReselectLevel(event.level);
    }

    this.currentLevel = event.level;

    // Update selected conditions
    this.selectedConditions.push(event);

    // Get answers match selected conditions
    this.matchingAnswers = this.findMatchingAnswers(
      this.question.answers,
      this.selectedConditions
    );

    if (this.matchingAnswers.length > 1) {
      const nextCondition = this.findNextConditionGroup(this.currentLevel);
      if (nextCondition) {
        this.activeConditions.push(nextCondition);
        this.currentLevel = nextCondition.conditionGroup.level;
      } else {
        this.hasNextCondtion = false;
      }
    }
  }

  findNextConditionGroup(currentLevel) {
    const conditionGroupIds = new Set();
    this.matchingAnswers.forEach((answer) => {
      const answerConditionGroupIds = Object.keys(answer.answerConditionMap);
      answerConditionGroupIds.forEach((i) => conditionGroupIds.add(i));
    });

    return this.question.conditions.find(
      (item) =>
        item.conditionGroup.level > currentLevel &&
        conditionGroupIds.has(item.conditionGroup.id + "")
    );
  }

  checkReselectLevel(selectedLevel) {
    this.hasNextCondtion = true;
    this.selectedConditions = this.selectedConditions.filter(
      (item) => item.level < selectedLevel
    );
    this.activeConditions = this.activeConditions.filter(
      (item) => item.conditionGroup.level <= selectedLevel
    );
  }

  findMatchingAnswers(answers, conditions) {
    return answers.filter((item) => {
      return conditions.every(({ conditionGroupId, conditionId }) => {
        const answerCondition = item.answerConditionMap[conditionGroupId];
        if (!answerCondition) {
          return false;
        }

        return answerCondition.condition.find((i) => i.id === conditionId);
      });
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
  padding-top: 20px;
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
  .reset-button {
    background: rgba(0, 207, 232, 0.12);
    display: inline-block;
    padding: 5px 10px;
    justify-content: center;
    align-items: center;
    color: #00cfe8;
    cursor: pointer;
    border-radius: 0.375rem;
    transition: all 0.5s ease;
    margin-bottom: 1rem;
    .icon {
      margin-right: 10px;
    }
  }
  .question-content {
    font-size: 18px;
    font-weight: 500;
    // background: rgba(0, 207, 232, 0.12);
    padding: 10px 5px;
    border-bottom: 3px solid #00cfe8;
    .content {
      padding-left: 50px;
    }
    .question-title {
      font-weight: bold;
      //  border-bottom: 3px solid #00cfe8;
      .icon {
        stroke: #00cfe8;
      }
    }
  }
  .answer-title {
    margin-bottom: 0.25rem;
    font-weight: bold;
    .icon {
      stroke: #138d75;
    }
  }
  .answer-content {
    // background: rgba(0, 207, 232, 0.12);
    padding: 10px 5px;
    // border-radius: 0.375rem;
    .content {
      padding-left: 50px;
    }
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
