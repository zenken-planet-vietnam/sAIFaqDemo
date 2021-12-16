<template lang="">
    <div class="search-result">
        <tag :tags="unSelectedTags"/>
        <question-item v-for="item in  searchResults" :key="item.id" :data="item" type="result"/>
    </div>
</template>
<script>
import Tag from "./Tag.vue";
import QuestionItem from "./QuestionItem.vue";
import searchDataMixin from "@/@core/mixins/searchDataMixin";
export default {
  components: {
    Tag,
    QuestionItem,
  },
  mixins: [searchDataMixin],
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
  position: absolute;
  background: whitesmoke;
  width: 100%;
  overflow-y: auto;
}
</style>