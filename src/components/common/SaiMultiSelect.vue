<template>
  <div>
    <div class="search-container">
      <tag-query-list
        v-if="queryLabels.length > 0"
        :tags="queryLabels"
        :isSelectedTag="true"
        @deleteQueryTag="deleteQueryTag"
      />
      <b-form-input autocomplete="off" v-model="text"
                    @keyup.enter="addLabel(text)" @keydown.delete="removeLabel"
                    @blur="blur" class="search-input" @click="clickFormInput"
                    placeholder="Type something and press enter"/>

      <div v-show="displayQueryList" class="sai-multiselect-wrapper">
        <ul v-if="filterCloneLabel.length > 0" class="sai-multiselect-list">
          <li v-for="(label, index) in filterCloneLabel" :key="index" @mousedown="addLabel(label.value)" class="sai-multiselect-item">
            <div class="d-flex align-items-center justify-content-between">
              <span>{{ label.value }}</span>
              <span class="text-hint">Click to select</span>
            </div>
          </li>
        </ul>
        <ul class="sai-multiselect-list" v-else>
          <li class="sai-multiselect-item" @mousedown="addLabel(text)">
            <div class="d-flex align-items-center justify-content-between">
              <span>{{ text }}</span>
              <span class="">Add this as new query</span>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {Component, Prop, Vue} from "vue-property-decorator";
import TagQueryList from "../settings/TagQueryList.vue";


@Component({
  components: {
    TagQueryList
  },
})
export default class QuickstartForm extends Vue {
  @Prop({ default: [] })
  private cloneLabel!: []
  @Prop({ default: true })
  private onlySelect!: boolean
  @Prop({ default: [] })
  private labels!: Array<string>

  text: any = ""
  isFocused = false;
  displayQueryList: any = false

  blur() {
    this.isFocused = false;
    this.displayQueryList = false
  }

  clickFormInput() {
    this.displayQueryList=true
  }

  get filterCloneLabel() {
    return this.cloneLabel.filter((str: any) => {
      return str.value.includes(this.text) && !this.labels.find(
          (query: any) => str.text === query)
    })
  }
  get queryLabels() {
    return this.labels
  }

  addLabel(label: any) {
    if (label && this.labels.length <= 10) {
      if(!this.labels.find((item: any) => item === label)) {
        this.$emit("update:labels", [...this.labels,label])
        // this.labels.push(label)
      }
      this.text = ""
    }
  }

  removeLabel() {
    if (this.text == "") {
      if(this.labels.length > 0)
        this.labels.pop()
    }
  }

  deleteQueryTag(tag: any) {
    this.labels.splice((this.labels).indexOf(tag), 1);
  }
}
</script>

<style scoped lang="scss">

 .search-container {
   display: flex;
   border: 1px solid #ced4da;
   border-radius: 0.25rem;
   position: relative;
 }

.search-input {
  border: 0;
  box-shadow: none !important;
}

.sai-multiselect-wrapper {
  position: absolute;
  background: #fff;
  width: 100%;
  max-height: 240px;
  overflow: auto;
  border: 1px solid #e8e8e8;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
  z-index: 50;
  top: 100%
}
.sai-multiselect-list {
  list-style: none;
  display: inline-block;
  padding: 0;
  margin: 0;
  min-width: 100%;
  vertical-align: top;
}
.sai-multiselect-item {
  display: block;
  min-height: 40px;
  line-height: 16px;
  padding: 12px;
  text-decoration: none;
  text-transform: none;
  vertical-align: middle;
  position: relative;
  cursor: pointer;
  white-space: nowrap;
  .text-hint {
    display: none;
  }
  &:hover {
    background-color: #477cea;
    color: white;
    .text-hint{
      display: block !important;
    }
  }

}
</style>