<template lang="">
  <div class="search-form">
    <div class="search-title">
      <div class="search-icon">
        <feather-icon size="16" icon="SearchIcon" />
      </div>
      <span>Search by Keyword</span>
    </div>
    <div class="search-container">
      <div class="search">
        <!-- tag category -->
        <tag
          v-if="
            selectedCategory &&
            selectedCategory !== null &&
            selectedCategory.isActive
          "
          :data="selectedCategoryTag"
          :isSelectedTag="true"
          @click="unActiveFilter"
        />
        <!-- tag key word -->
        <tags
          v-if="selectedTag.length > 0"
          :tags="selectedTag"
          :isSelectedTag="true"
        />
        <auto-complete-input
          v-model="text"
          @enter="submit"
          @delete="onDeleteText"
          ref="input"
          @input="onTextChange"
          class="search-input"
          @focus="onInputFocus"
          placeholder="What is your question?"
        />
      </div>
    </div>
    <tags
      :tags="filterTag"
      :title="tagTitle"
      :isSelectedTag="false"
    />
    <image-tag v-if="!this.selectedTag||!this.selectedTag.length" :data="imageTag"/>
    <search-result ref="result" v-if="searchProcess" />

  </div>
</template>
<script>
import { BFormInput } from 'bootstrap-vue'
import SearchResult from './SearchResult.vue'
import PageMixin from '@/@core/mixins/searchDataMixin'
import Tags from './Tags.vue'
import Tag from './Tag.vue'
import ImageTag from "./ImageTag.vue"
import AutoCompleteInput from './AutoCompleteInput.vue'
import { PageModule } from '@/store/modules/page'
import { CategoryModule } from '@/store/modules/category'
import { Component } from 'vue-property-decorator'
import { mixins } from 'vue-class-component'
@Component({
  components: {
    BFormInput,
    SearchResult,
    Tags,
    Tag,
    ImageTag,
    AutoCompleteInput,
  },
  destroyed() {
    PageModule.updateProcess(false)
  },
})
export default class SearchForm extends mixins(PageMixin) {
  text = ''
  timeStopTyping = 0
  tick = 100
  intervalAnalytic = null
  // search result 
  result = null

  get selectedCategoryTag() {
    return {
      text: this.selectedCategory.texts.join('>'),
    }
  }

  get filterTag() {
    return !this.searchProcess&&this.tags?.length?this.tags:this.candidateTag.slice(0,5)
  }

  get tagTitle(){
  return !this.searchProcess?'Frequently Used Keywords':'Related keywords'
  }

  onInputFocus(event) {
    if (!this.config.SEARCH_BUTTON) {
      PageModule.updateProcess(event.isTrusted)
      if (!this.config.SEARCH_BUTTON) {
        let rect = this.$refs.input.$el.getBoundingClientRect()
        // eslint-disable-next-line no-unused-vars
        let maxHeight = document.body.clientHeight - rect.y
        this.$nextTick(() => {
          this.$refs.result.$el.style.maxHeight =
            maxHeight - rect.height - 10 + 'px'
        })
      }
    }
  }
  // filter question
  onTextChange() {
    // immediately submit search in FE
    this.submit()
    // delay send analytic
    this.timeStopTyping = this.config.TIME_DELAY_ANALYTIC
    clearInterval(this.intervalAnalytic)
    this.intervalAnalytic = setInterval(() => {
      this.timeStopTyping -= this.tick
      // stop typing about TIME_DELAY_ANALYTIC
      if (this.timeStopTyping <= 0) {
        clearInterval(this.intervalAnalytic)
        //call analytic api
        this.analytic()
      }
    }, this.tick)
  }
  analytic() {
    let text = this.text.toLowerCase().trim()
    // call analytics api
    if (window.sa && text.length > 0) {
      let data = {
        event_name: 'question_query',
        value: {
          query: text,
          result: this.result.length,
        },
        core_value: text,
        sub_value: this.result.length,
      }
      window.sa.send(data)
    }
  }
  async submit() {
    let text = this.text.toLowerCase().trim()
    PageModule.updateProcess(true)
    this.result = await PageModule.filterQuestions(text)
  }
  onDeleteText(event) {
    if (event.target.value.length === 0) {
      let selectedTags = this.tags.filter((x) => x.isSelected).reverse()
      let lastSelectedTag = selectedTags.find((x) => x.isSelected)
      if (lastSelectedTag) {
        PageModule.updateTagFilter({
          text: lastSelectedTag.text,
          isSelected: false,
        })
      }
      if (this.selectedCategory) CategoryModule.unActiveSelectedMenu()
    }
  }
  // unactive selected menu
  unActiveFilter(tag) {
    CategoryModule.unActiveSelectedMenu(tag)
    PageModule.unselectedtag(tag.text)
  }
}
</script>
<style lang="scss">
.search-form {
  position: relative;
  .search-title {
    padding: 10px 0px;
    display: flex;
    align-items: center;
    .search-icon {
      margin-right: 10px;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #fff;
      width: 26px;
      height: 26px;
      border-radius: 50%;
      background: #0062cc;
    }
  }
  .search-container {
    display: flex;
    border: 1px solid #ced4da;
    border-radius: 0.25rem;
    .search {
      flex: 1;
      display: flex;
      align-items: center;
      background: white;
      border-radius: 0.25rem;
      .search-input {
        border: 0px;
        box-shadow: none !important;
      }
      .category-tag {
        color: #fff;
        background: #138d75;
        padding: 0.25rem 0.5rem;
        margin: 5px;
        border-radius: 16px;
        cursor: pointer;
        font-size: 14px;
        white-space: nowrap;
        position: relative;
        .remove-tag {
          top: -1px;
          right: 0px;
          position: absolute;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: red;
          display: flex;
          justify-content: center;
          align-items: center;
        }
      }
    }
    .search-button {
      cursor: pointer;
      background: #0062cc;
      flex: 0 0 auto;
      height: 38px;
      width: 40px;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #fff;
      border-radius: 0rem 0.25rem 0.25rem 0rem;
      &:hover {
        background: #0069d9;
      }
    }
  }
}
</style>
