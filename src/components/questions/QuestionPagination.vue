<template lang="">
  <div class="question-pagination" v-if="questions">
    <question-item
      v-for="item in selectQuestionPagination"
      :key="item.id"
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
 
  @Prop({ default: [] })
  private questions!: Array<any>
  @Prop({ default: '' })
  private type!: string

  @Prop({ default: false })
  private loading!: boolean

  @Prop({ default: 5 })
  private pageSize!: number

  pagination = {
    pageSize: this.pageSize,
    pageNumber: 1,
  }
 //list of question for pagination
  questionPagination:any=this.questions ?this.questions.slice(0,this.pagination.pageSize):[]

  @Watch('questions')
  onQuestionChange() {
    this.pagination.pageNumber = 1
    this.questionPagination=this.questions.slice(0,this.pagination.pageSize)
  }

 //return new lits of question  when pagination changing
  get selectQuestionPagination() {
    console.log('case 1');
    
    return this.questions.slice(
      0,
      this.pagination.pageNumber * this.pagination.pageSize
    )
  }
  //click show more button
  showMore() {
    // plus page number 1
    this.pagination.pageNumber++
    const start=this.pagination.pageSize*(this.pagination.pageNumber-1)
    const end=Math.min((start+this.pagination.pageSize),this.questions.length)
    //push new questions
    for (let i =start ; i < end; i++) {
      this.questionPagination.push(this.questions[i])
    }
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
