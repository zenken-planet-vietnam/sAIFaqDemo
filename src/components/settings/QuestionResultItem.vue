<template>
  <div class="question-item">
    <div class="question-content">
      <feather-icon
        class="icon"
        :icon="type === 'result' ? 'HelpCircleIcon' : 'ClockIcon'"
        size="24"
      />
      <div>
        <div v-if="type !== 'result'">
          <span>{{ data.label }}</span>
        </div>
        <high-light
          :textColor="'rgba(14,183,84,0.21)'"
          :text="data.label"
          :targets="getTargets"
          v-else
        />

        <div v-if="data.categories.length > 0" class="question-category">
          <span v-for="(text, index) in data.categories[0].texts" :key="index">
            {{ text }}
            <feather-icon
              v-if="
                data.categories[0].texts.length > 1 &&
                index < data.categories[0].texts.length - 1
              "
              icon="ChevronRightIcon"
              size="12"
            />
          </span>
        </div>
      </div>
    </div>
    <div>
      <b-button
        v-if="!isPromotingQuestion(data)"
        variant="outline-success"
        @click="promoteQuestionManual(data)"
        size="sm"
        class="mr-1"
        title="Promote this result"
      >
        <feather-icon icon="TrendingUpIcon"></feather-icon>
      </b-button>
      <b-button
        v-else
        variant="outline-danger"
        @click="unpinQuestion(data)"
        size="sm"
        class="mr-1"
        title="Demote this result"
      >
        <feather-icon icon="TrendingDownIcon"></feather-icon>
      </b-button>
      <b-button
        v-if="!isHidingQuestion(data)"
        variant="outline-danger"
        @click="hideQuestionManual(data)"
        size="sm"
        title="Hide this result"
      >
        <feather-icon icon="EyeOffIcon"></feather-icon>
      </b-button>
      <b-button
        v-else
        variant="outline-primary"
        @click="unpinQuestion(data)"
        size="sm"
        title="Show this result"
      >
        <feather-icon icon="EyeIcon"></feather-icon>
      </b-button>
    </div>
  </div>
</template>
<script lang="ts">
import HighLight from '@/components/questions/HighLight.vue'
import { PageModule } from '@/store/modules/page'
import SettingMixin from '@/@core/mixins/settingMixin'

import { Component, Prop } from 'vue-property-decorator'
import { mixins } from 'vue-class-component'
@Component({
  components: {
    HighLight,
  },
})
export default class QuestionResultItem extends mixins(SettingMixin) {
  @Prop({ default: null })
  private data!: object
  @Prop({ default: 'frequent' })
  private type!: String

  get getTargets() {
    return PageModule.searchWordsManual
  }

  isPromotingQuestion(data: any) {
    return !!this.promotedQuestions.find((item: any) => item.id == data.id)
  }

  isHidingQuestion(data: any) {
    return !!this.hiddenQuestions.find((item: any) => item.id == data.id)
  }

  promoteQuestionManual(data: any) {
    if (this.isHidingQuestion(data))
      this.unpinQuestion(data).then(() => this.promoteQuestion(data))
    else this.promoteQuestion(data)
  }

  hideQuestionManual(data: any) {
    if (this.isPromotingQuestion(data))
      this.unpinQuestion(data).then(() => this.hideQuestion(data))
    else this.hideQuestion(data)
  }
}
</script>
<style lang="scss">
.question-item {
  padding: 10px 20px;
  border-bottom: 1px solid lightgray;
  cursor: pointer;
  position: relative;
  transition: all 2s linear;
  display: flex;
  justify-content: space-between;
  .question-content {
    display: flex;
    align-items: center;
    .icon {
      color: #28c76f;
      margin-right: 10px;
    }
  }
  .pinned {
    color: #28c76f;
    position: absolute;
    right: 10px;
  }
}
</style>
