<template lang="">
    <div class="search-form">
       <div class="search-container">
          <div class="search">
          <div v-if="selectedTags.length>0" class="search-tags">
           <tag :tags="selectedTags" :isSelectedTag="true" />
          </div>
          <!-- <b-form-input v-model='text' @keyup.enter="submit"  @keyup.delete="onDeleteText" ref="input" @input="onTextChange" class="search-input" @focus="onInputFocus"  placeholder="What is your question?"/> -->
          <auto-complete-input v-model='text' @enter="submit"  @delete="onDeleteText" ref="input" @input="onTextChange" class="search-input" @focus="onInputFocus"  placeholder="What is your question?"/>
        </div>
         <div v-if="config.SEARCH_BUTTON" @click="submit" class="search-button"> 
            <feather-icon icon="SearchIcon"></feather-icon>
          </div>
       </div>
        <search-result ref="result" v-if="searchProcess"/>
    </div>
</template>
<script>
import { BFormInput } from "bootstrap-vue";
import SearchResult from "./SearchResult.vue";
import PageMixin from "@/@core/mixins/searchDataMixin";
import Tag from "./Tag.vue";
import AutoCompleteInput from "./AutoCompleteInput.vue";
import { PageModule } from "@/store/modules/page";
import { Component } from "vue-property-decorator";
import { mixins } from "vue-class-component";
@Component({
  components: {
    BFormInput,
    SearchResult,
    Tag,
    AutoCompleteInput,
  },
  destroyed() {
    PageModule.updateProcess(false);
  },
})
export default class SearchForm extends mixins(PageMixin) {
  text = "";
  get selectedTags() {
    return this.tags.filter((x) => x.isSelected == true);
  }

  onInputFocus(event) {
    if (!this.config.SEARCH_BUTTON) {
      PageModule.updateProcess(event.isTrusted);
      if (!this.config.SEARCH_BUTTON) {
        let rect = this.$refs.input.$el.getBoundingClientRect();
        // eslint-disable-next-line no-unused-vars
        let maxHeight = document.body.clientHeight - rect.y;
        this.$nextTick(() => {
          this.$refs.result.$el.style.maxHeight =
            maxHeight - rect.height - 10 + "px";
        });
      }
    }
  }
  // filter question
  onTextChange() {
    if (!this.config.SEARCH_BUTTON) this.submit();
  }
  async submit() {
    let text = this.text.toLowerCase().trim();
    PageModule.updateProcess(true);
    let result = await PageModule.filterQuestions(text);
    // call analytics api
    if (window.sa && text.length > 0) {
      let data = {
        event_name: "question_query",
        value: {
          query: text,
          result: result.length,
        },
      };
      window.sa.send(data);
    }
  }
  onDeleteText(event) {
    if (event.target.value.length === 0) {
      let selectedTags = this.tags.filter((x) => x.isSelected).reverse();
      let lastSelectedTag = selectedTags.find((x) => x.isSelected);
      if (lastSelectedTag) {
        PageModule.updateTagFilter({
          text: lastSelectedTag.text,
          isSelected: false,
        });
      }
    }
  }
}
</script>
<style lang="scss">
.search-form {
  position: relative;
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