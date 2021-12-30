<template lang="">
    <div class="search-result" :class="{'result-modal':!config.SEARCH_BUTTON}">
        <tag v-if="!config.SEARCH_BUTTON" :tags="unSelectedTags" :isModal="!config.SEARCH_BUTTON"/>
        <div class='mt-2 result-title'>
          <span>{{'Question results:'}}</span>
        </div>
        <question-item v-for="item in  searchResults" :key="item.id" :data="item" type="result"/>
    </div>
</template>
<script>
import Tag from "./Tag.vue";
import QuestionItem from "./QuestionItem.vue";
import searchDataMixin from "@/@core/mixins/searchDataMixin";
import configMixin from "@/@core/mixins/configMixin";
export default {
  components: {
    Tag,
    QuestionItem,
  },
  mixins: [searchDataMixin, configMixin],
  data() {
    return {};
  },
  computed: {
    unSelectedTags() {
      return this.tags.filter((x) => !x.isSelected);
    },
  },
};
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