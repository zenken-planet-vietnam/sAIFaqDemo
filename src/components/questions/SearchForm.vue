<template lang="">
    <div class="search-form">
        <div class="search">
          <div v-if="selectedTags.length>0" class="search-tags">
           <tag :tags="selectedTags" :isSelectedTag="true"/>
          </div>
          <b-form-input  @keyup.delete="onDeleteText" ref="input" @input="onTextChange" class="search-input" @focus="onInputFocus" @blur="onInputBlur" placeholder="What is your question?"/>
        </div>
        <search-result ref="result" v-if="searchProcess"/>
    </div>
</template>
<script>
import { BFormInput } from "bootstrap-vue";
import SearchResult from "./SearchResult.vue";
import searchDataMixin from "@/@core/mixins/searchDataMixin";
import Tag from "./Tag.vue";
export default {
  components: {
    BFormInput,
    SearchResult,
    Tag,
  },
  mixins: [searchDataMixin],
  computed: {
    selectedTags() {
      return this.tags.filter((x) => x.isSelected == true);
    },
  },
  methods: {
    // input lost focus
    onInputBlur() {
      //   this.$store.dispatch("page/updateProcess", false);
    },
    // input focus
    // eslint-disable-next-line no-unused-vars
    onInputFocus(event) {
      this.$store.dispatch("page/updateProcess", event.isTrusted);
      let rect = this.$refs.input.$el.getBoundingClientRect();
      // eslint-disable-next-line no-unused-vars
      let maxHeight = document.body.clientHeight - rect.y;
      this.$nextTick(() => {
        this.$refs.result.$el.style.maxHeight =
          maxHeight - rect.height - 10 + "px";
      });
    },
    // filter question
    onTextChange(event) {
      this.$store.dispatch("page/filterQuestions", event);
    },
    onDeleteText(event) {
      if (event.target.value.length === 0) {
        let selectedTags = this.tags.filter((x) => x.isSelected).reverse();
        let lastSelectedTag = selectedTags.find((x) => x.isSelected);
        if (lastSelectedTag) {
          this.$store.dispatch("page/updateTagFilter", {
            text: lastSelectedTag.text,
            isSelected: false,
          });
        }
      }
    },
  },
};
</script>
<style lang="scss">
.search-form {
  position: relative;
  .search {
    display: flex;
    align-items: center;
    border: 1px solid #ced4da;
    border-radius: 0.25rem;
    background: white;
    .search-input {
      border: 0px;
      box-shadow: none !important;
    }
  }
}
</style>