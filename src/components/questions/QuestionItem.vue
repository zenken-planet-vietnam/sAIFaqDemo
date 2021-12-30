<template lang="">
    <div @click="getAnswerFromQuestion(data.id)" class="question-item">
      <div class="question-content">
            <feather-icon
                    class="icon"
                    :icon="type==='result'?'HelpCircleIcon':'ClockIcon'"
                    size="18"
                  />
                  <span>{{data.id}}-</span>
          <div v-if="type!=='result'">
            <span>{{data.label}}</span>
          </div>
          <hight-light :text="data.label" :targets="getTargets" v-else/>
      </div>
      <transition name="slide-fade">
       <div v-if="data.answers &&data.isSelected">
         <div class="answer-container">
           <span class="font-weight-bold">
             {{"Answers:"}}
           </span>
            <div class="ml-1">
              <answer-item v-for="item in data.answers" :key="item.id" :data="item"/>
            </div>
         </div>
         
       </div>
       </transition>
    </div>
</template>
<script>
import AnswerItem from "./AnswerItem.vue";
import HightLight from "./HightLight.vue";
import searchDataMixin from "@core/mixins/searchDataMixin";
export default {
  mixins: [searchDataMixin],
  props: {
    data: {
      type: Object,
      default: () => null,
    },
    type: {
      type: String,
      default: "frequent",
    },
  },
  components: {
    AnswerItem,
    HightLight,
  },
  computed: {
    getTargets() {
      return this.searchWords;
    },
  },
  methods: {
    getAnswerFromQuestion(id) {
      this.$store.dispatch("page/getAnswerFromQuestion", id);
    },
  },
};
</script>
<style lang="scss">
.question-item {
  padding: 10px 20px;
  border-bottom: 1px solid lightgray;
  cursor: pointer;
  transition: all 2s linear;
  .question-content {
    display: flex;
    align-items: center;
    .icon {
      color: #28c76f;
      margin-right: 10px;
    }
  }
  /* Enter and leave animations can use different */
  /* durations and timing functions.              */
  .slide-fade-enter-active {
    transition: all 0.5s ease;
  }
  .slide-fade-leave-active {
    transition: all 0.1s cubic-bezier(1, 0.5, 0.8, 1);
  }
  .slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active below version 2.1.8 */ {
    transform: translateX(10px);
    opacity: 0;
  }
}
</style>