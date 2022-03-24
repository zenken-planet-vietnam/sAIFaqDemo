<template lang="">
  <div @click="selectQuestion(data)" class="question-item">
    <div class="question-content">
      <feather-icon
        class="icon"
        :icon="type === 'result' ? 'HelpCircleIcon' : 'ClockIcon'"
        size="24"
      />
      <b-skeleton-wrapper :loading="loading">
         <template #loading>
          <div>
            <b-skeleton animation="fade" width="100%"></b-skeleton>
            <b-skeleton animation="fade" width="30%"></b-skeleton>
          </div>
      </template>
        <div v-if="!loading">
          <div v-if="type !== 'result'">
            <span>{{ data.label }}</span>
          </div>
          <div v-else>
            <high-light :text="data.label" :targets="getTargets" />
            <div class="pinned" v-if="data.isPinned" title="Result pinning">
              <feather-icon icon="StarIcon" size="16" style="fill: #99ff69" />
            </div>
          </div>
          <div v-if="data.categories.length > 0" class="question-category">
            <span
              v-for="(text, index) in data.categories[0].texts"
              :key="index"
            >
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
      </b-skeleton-wrapper>
    </div>
  </div>
</template>
<script lang="ts">
import HighLight from './HighLight.vue'
import QuestionMixin from '@/@core/mixins/questionMixin'
import { PageModule } from '@/store/modules/page'
import { Component, Prop } from 'vue-property-decorator'
import { mixins } from 'vue-class-component'
import { BSkeleton, BSkeletonWrapper } from 'bootstrap-vue'
@Component({
  components: {
    HighLight,
    BSkeleton,
    BSkeletonWrapper,
  },
})
export default class QuestionItem extends mixins(QuestionMixin) {
  @Prop({ default: null })
  private data!: object
  @Prop({ default: 'frequent' })
  private type!: String

  @Prop({ default: false })
  private loading!: boolean

  get getTargets() {
    return this?.searchWords
  }

  selectQuestion(data: any) {
    // call analytics api
    let sa = (window as any).sa
    if (sa) {
      let sendData = {
        event_name: 'question_click',
        value: {
          clicked_id: data.id,
          clicked_text: data.label,
        },
        core_value: data.id,
        sub_value: data.label,
      }
      sa.send(sendData)
    }
    PageModule.updateProcess(false)
    this.setRecentQuestion(data.id)
    this.$router.push({ name: 'result-page', query: { id: data.id } })
  }

  setRecentQuestion(id: any) {
    let recentQuestionIds: any = []
    let localData = localStorage.getItem('recent-faq')
    if (localData) recentQuestionIds = JSON.parse(localData)
    if (!recentQuestionIds?.length) recentQuestionIds = [id]
    else recentQuestionIds = [...new Set([id, ...recentQuestionIds])]
    recentQuestionIds = recentQuestionIds.slice(0, 5)
    localStorage.setItem('recent-faq', JSON.stringify(recentQuestionIds))
  }
}
</script>
<style lang="scss">
.question-item {
  padding: 10px 20px;
  border-bottom: 1px solid lightgray;
  cursor: pointer;
  position: relative;
  transition: all 0.5s ease;
  &:hover {
    padding-left: 2rem;
  }
  .question-content {
    display: flex;
    align-items: center;
    color: #1d9bf0;
    transition: color 0.3s ease-in-out;

    //font-size: 21px;
    font-weight: 600;
    &:hover {
      color: #0465b0;
    }
    .icon {
      color: #28c76f;
      margin-right: 10px;
    }
    .question-category {
      color: #637888;
      font-weight: 600;
      font-size: 12px;
    }
    .b-skeleton-wrapper{
      width: 100%;
    }
  }
  .pinned {
    color: #28c76f;
    position: absolute;
    right: 10px;
  }
}
</style>
