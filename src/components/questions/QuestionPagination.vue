<template lang="">
  <div class="question-pagination" v-if="questions">
    <question-item
      v-for="(item, index) in questionPagination"
      :key="index"
      :data="item"
      :type="type"
      :loading="loading"
    />
    <div class="see-more-wrapper">
      <button
        v-if="questions.length > pagination.pageNumber * pagination.pageSize"
        class="btn-see-more"
        @click="showMore"
      >
        <feather-icon icon="ChevronsDownIcon" />
        See more
      </button>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import QuestionItem from '@/components/questions/QuestionItem.vue'
@Component({
  components: {
    QuestionItem,
  },
})
export default class QuestionPagination extends Vue {
  pagination = {
    pageSize: 5,
    pageNumber: 1,
  }

  @Prop({ default: [] })
  private questions!: Array<any>
  @Prop({ default: '' })
  private type!: string

  @Prop({ default: false })
  private loading!: boolean

  @Prop({ default: 5 })
  private pageSize!: number

  @Watch('questions')
  onQuestionChange() {
    this.pagination.pageNumber = 1
  }

  @Watch('pageSize')
  onPageSizeChange() {
    this.pagination.pageSize = this.pageSize
  }

  get questionPagination() {
    return this.questions.slice(
      0,
      this.pagination.pageNumber * this.pagination.pageSize
    )
  }

  showMore() {
    this.pagination.pageNumber++
  }
}
</script>
<style lang="scss">
.question-pagination {
  transition: height 3s ease-in-out;
  .see-more-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .btn-see-more {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 1rem;
    border: 1px solid #1d9bf0;
    border-radius: 0.75rem;
    background: transparent;
    color: #1d9bf0;
    width: auto;
    // font-weight: bold;
    font-size: 12px;
    &:hover {
      color: #0465b0;
      border-color: #0465b0;
    }
  }
}
</style>
