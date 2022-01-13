<template lang="">
    <div @click="getAnswerFromQuestion(data)" class="question-item">
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
          <high-light :text="data.label" :targets="getTargets" v-else/>
      </div>
    </div>
</template>
<script lang="ts">
import HighLight from "./HighLight.vue";
import PageMixin from "@/@core/mixins/searchDataMixin";
import { PageModule } from "@/store/modules/page";
import { Component, Prop } from "vue-property-decorator";
import { mixins } from "vue-class-component";
@Component({
  components: {
    HighLight,
  },
})
export default class QuestionItem extends mixins(PageMixin) {
  @Prop({ default: null })
  private data!: object;
  @Prop({ default: "frequent" })
  private type!: String;

  get getTargets() {
    return this?.searchWords;
  }

  getAnswerFromQuestion(data: any) {
    // call analytics api
    let sa = (window as any).sa;
    if (sa) {
      let sendData = {
        event_name: "question_click",
        value: {
          clicked_id: data.id,
          clicked_text: data.label,
        },
      };
      sa.send(sendData);
    }
    PageModule.updateProcess(false);
    this.$router.push({ name: "result-page", query: { id: data.id } });
  }
}
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