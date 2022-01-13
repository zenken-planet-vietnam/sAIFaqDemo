<template lang="">
    <div class="search-result" :class="{'result-modal':!config.SEARCH_BUTTON}">
        <tag v-if="!config.SEARCH_BUTTON" :tags="unSelectedTags" :isModal="!config.SEARCH_BUTTON"/>
        <div class='mt-2 result-title'>
          <span>{{'Question results:'}}</span>
        </div>
        <question-item v-for="item in  searchResults" :key="item.id" :data="item" type="result"/>
    </div>
</template>
<script lang="ts">
import QuestionItem from "./QuestionItem.vue";
import { Tag } from "@/components/questions";
// import Tag from "./Tag.vue";
import PageMixin from "@/@core/mixins/searchDataMixin";
import { Component } from "vue-property-decorator";
import { mixins } from "vue-class-component";
@Component({
  components: {
    QuestionItem,
    Tag,
  },
})
export default class SearchResult extends mixins(PageMixin) {
  get unSelectedTags() {
    return this.tags.filter((x) => !x.isSelected);
  }
}
</script>
<style lang="scss">
.search-result {
  width: 100%;
  overflow-y: auto;
  .result-title {
    padding-left: 20px;
    font-weight: 500;
    font-size: 21px;
  }
  &.result-modal {
    position: absolute;
    background: whitesmoke;
  }
}
</style>