<template>
  <div>
    <b-modal
      id="quickstart-form"
      ref="modal"
      title="Create query"
      @show="resetModal"
      @hidden="resetModal"
      @ok="handleOk"
      size="lg"
    >
      <b-form @submit.stop.prevent>
        <label for="feedback-label">Keyword</label>
        <div class="search-container">
          <tag-query-list
            v-if="labels.length > 0"
            :tags="labels"
            :isSelectedTag="true"
            @deleteQueryTag="deleteQueryTag"
          />
          <b-form-input id="feedback-label" :state="validation" autocomplete="off" v-model="text" @keyup.enter="addLabel" @keydown.delete="removeLabel"
                     @blur="blur" class="search-input"  placeholder="Type something and press enter"/>
        </div>
        <b-form-invalid-feedback :state="validation">
          Keyword must be unique and cannot be empty!
        </b-form-invalid-feedback>
        <b-form-valid-feedback :state="validation">
          Looks Good.
        </b-form-valid-feedback>
        <div class="mt-1">
          <b-form-checkbox
            id="check-clone"
            v-model="checkActivateClone"
          >
            Use Clone
          </b-form-checkbox>
        </div>

        <div v-if="checkActivateClone" class="mb-1">
          <div class="search-container">
            <tag-query-list
              v-if="selectedQueries.length > 0"
              :tags="selectedQueries"
              :isSelectedTag="true"
              @deleteQueryTag="deleteCloneQuery"
            />
            <b-form-input autocomplete="off" @click="displayQueryList=true"
                          @keyup.enter="onEnterCloneLabel"
                          v-model="inputCloneLabel" @keydown.delete="removeCloneQuery"
                          @blur="blur" class="search-input"  placeholder="Type something and press enter"/>
            <div v-show="displayQueryList" class="sai-multiselect-wrapper">
              <ul v-if="filterCloneLabel.length > 0" class="sai-multiselect-list">
                <li v-for="label in filterCloneLabel" :key="label.text" @mousedown="addCloneQuery(label.text)" class="sai-multiselect-item">
                  <div class="d-flex align-items-center justify-content-between">
                    <span>{{ label.text }}</span>
                    <span class="text-hint">Click to select</span>
                  </div>
                </li>
              </ul>
              <ul class="sai-multiselect-list" v-else><li class="sai-multiselect-item">No result!</li></ul>
            </div>
          </div>
          <b-form-checkbox
            id="checkbox-1"
            name="checkbox-1"
            v-model="replace"
          >
            Replace
          </b-form-checkbox>
        </div>

        <div class="mt-1 mb-1">
          <b-button v-b-modal.search-question-modal variant="primary" size="sm">
            <feather-icon icon="PlusIcon"></feather-icon>
            Pin question
          </b-button>
          <b-modal
            id="search-question-modal"
            ref="modal"
            title="Search question"
            size="lg"
          >
            <b-form>
              <label for="feedback-user1">Keyword</label>
              <b-form-input
                id="feedback-user1"
                v-model="searchQuery"
                :state="validationSearchForm"
                placeholder="Type something"
                @input="fetchDataQuestionByQuery"
                required
              ></b-form-input>
              <b-form-invalid-feedback :state="validationSearchForm">
                Keyword must be unique and cannot be empty!
              </b-form-invalid-feedback>
              <b-form-valid-feedback :state="validationSearchForm">
                Looks Good.
              </b-form-valid-feedback>

              <b-card v-if="getQuestionSearchResult.length > 0" no-body class="mt-2 mb-1">
                <b-card-header header-tag="header" class="p-1" role="tab">
                  <b-button class="full-width" block v-b-toggle.accordion-1 variant="success">Search results</b-button>
                </b-card-header>
                <b-collapse id="accordion-1" class="overflow-scroll-container" visible accordion="my-accordion" role="tabpanel">
                  <b-card-body>
                    <b-card-text>
                      <div v-for="item in getQuestionSearchResult" :key="item.id"
                           class="d-flex align-items-center justify-content-between mb-1">

                        <high-light class="question-title" :textColor="'rgba(14,183,84,0.21)'" :text="item.label" :targets="getTargets"/>
                        <div>
                          <b-button title="Promote this result" variant="outline-success" @click="promoteQuestion(item)" size="sm" class="mr-1">
                            <feather-icon icon="TrendingUpIcon"></feather-icon>
                          </b-button>
                          <b-button title="Hide this result" variant="outline-danger"  @click="hideQuestion(item)" size="sm">
                            <feather-icon icon="EyeOffIcon"></feather-icon>
                          </b-button>
                        </div>
                      </div>
                    </b-card-text>
                  </b-card-body>
                </b-collapse>
              </b-card>
            </b-form>
          </b-modal>
        </div>

        <b-card v-if="selectedPromotedQuestion.length > 0 || selectedHidden.length > 0"
                class="overflow-scroll-container" border-variant="info" header="Preview" align="center">
          <b-card-text>
            <p>Promoted results</p>
            <draggable
              class="list-group promoted-container"
              v-model="selectedPromotedQuestion"
              v-bind="dragOptions"
              @start="drag=true"
              @end="drag = false"
            >
              <transition-group id="promotedList" type="transition" :name="!drag ? 'flip-list' : null">
                <div
                  class="list-group-item d-flex align-items-center justify-content-between"
                  v-for="item in selectedPromotedQuestion"
                  :key="item.id"
                >
                  <div>
                    <feather-icon icon="AlignJustifyIcon"></feather-icon>
                    <span class="">
                      {{item.label }}
                    </span>
                  </div>

                  <b-button variant="outline-danger"  @click="demoteQuestion(item)" size="sm">
                    <feather-icon icon="TrashIcon"></feather-icon>
                  </b-button>
                </div>
              </transition-group>
            </draggable>
            <p class="mt-1">Hidden results</p>

            <div class="hidden-container">
              <div
                class="list-group-item d-flex align-items-center justify-content-between"
                v-for="item in selectedHidden"
                :key="item.id"
              >
                <span class="">
                  {{item.label }}
                </span>
                <b-button variant="outline-danger"  @click="unhideQuestion(item)" size="sm">
                  <feather-icon icon="TrashIcon"></feather-icon>
                </b-button>
              </div>
            </div>
          </b-card-text>
        </b-card>
      </b-form>
    </b-modal>
  </div>
</template>

<script lang="ts">
import draggable from "vuedraggable";
import {Component, Prop, Vue} from "vue-property-decorator";
import {BForm, BModal} from 'bootstrap-vue'
import {PageModule} from "@/store/modules/page";
import HighLight from "../questions/HighLight.vue";
import Multiselect from "vue-multiselect";
import TagQueryList from "./TagQueryList.vue";

@Component({
  components: {
    BModal,
    BForm,
    draggable,
    HighLight,
    Multiselect,
    TagQueryList
  },
})
export default class QuickstartForm extends Vue {
  @Prop({ default: [] })
  private cloneLabel!: []

  drag = false
  selectedQueries: any = []
  checkActivateClone: any = false
  labels: any = []
  selectedPromoted: any = []
  selectedHidden: any = []
  replace: any = false
  searchQuery: any = ""
  validationInputLabel: any = true
  text: any = ""
  isFocused = false;
  inputCloneLabel: any = ""
  displayQueryList: any = false

  blur() {
    this.isFocused = false;
    this.displayQueryList = false
  }

  get selectedPromotedQuestion() {
    return this.selectedPromoted
  }

  get filterCloneLabel() {
    return this.cloneLabel.filter((str: any) => {
      return str.value.includes(this.inputCloneLabel) && !this.selectedQueries.find(
          (query: any) => str.text === query)
    })
  }

  addLabel() {
    if (this.text && this.labels.length <= 10) {
      if(!this.labels.find((item: any) => item === this.text)) {
        this.labels.push(this.text)
        this.text = ""
        this.validationInputLabel = true
      } else {
        this.text = ""
        this.validationInputLabel = false
      }
    }
  }

  onEnterCloneLabel() {
    if(this.inputCloneLabel.length == 0
        || !this.cloneLabel.find((item: any) => item.value == this.inputCloneLabel
        && !this.selectedQueries.find((item: any) => item === this.inputCloneLabel))) {
        this.inputCloneLabel = ""
        return
      }
    this.selectedQueries.push(this.inputCloneLabel)
    this.inputCloneLabel = ""
  }

  addCloneQuery(query: any) {
    if (query && this.selectedQueries.length <= 10) {
      if(!this.selectedQueries.find((item: any) => item === query)) {
        this.selectedQueries.push(query)
      } 
      this.inputCloneLabel = ""
    }
  }

  removeLabel() {
    if (this.text == "") {
      if(this.labels.length > 0)
        this.labels.pop()
    }
  }
  removeCloneQuery() {
    if (this.inputCloneLabel == "") {
      if(this.selectedQueries.length > 0)
        this.selectedQueries.pop()
    }
  }

  deleteQueryTag(tag: any) {
    this.labels.splice((this.labels).indexOf(tag), 1);
  }
  
  deleteCloneQuery(query: any) {
      this.selectedQueries.splice((this.selectedQueries).indexOf(query), 1);
  }

  set selectedPromotedQuestion(value: any) {
    this.selectedPromoted = value
  }


  get dragOptions() {
      return {
        animation: 200,
        group: "description",
        disabled: false,
        ghostClass: "ghost"
      };
    }

  get validation() {
    return this.labels.length > 0
  }

  get validationSearchForm() {
    return this.searchQuery.length > 0
  }

  async fetchDataQuestionByQuery() {
    if(this.searchQuery) {
      let searchText = this.searchQuery.toLowerCase().trim();
      PageModule.updateProcess(true);
      PageModule.filterQuestions(searchText)
    }
  }

  get getTargets() {
      return PageModule.searchWords;
  }

  get getQuestionSearchResult() {
    let pinnedQuestions = [...this.selectedPromoted, ...this.selectedHidden]
    let array = PageModule.fullQuestions
    return array.filter((elem: any) => !pinnedQuestions.find(
        (question: any) => elem.id === question.id))
  }

  promoteQuestion(question: any) {
    this.selectedPromoted.push(question)
  }

  hideQuestion(question: any) {
    this.selectedHidden.push(question)
  }
  demoteQuestion(question: any) {
    const questionId = question.id
    this.selectedPromoted = this.selectedPromoted.filter((item: any) => item.id !== questionId)

    let countOrder:any = 1
    this.selectedPromoted = this.selectedPromoted.map((item: any) => {
        const question = {...item, order: countOrder, display_order: countOrder}
        countOrder++;
        return question;
    })
  }
  unhideQuestion(question: any) {
    const questionId = question.id
    this.selectedHidden = this.selectedHidden.filter((item: any) => item.id !== questionId)
  }

  resetModal() {
    this.labels = []
    this.searchQuery = ""
    this.selectedHidden = []
    this.selectedPromoted = []
    this.selectedQueries = []
    this.replace = false
    this.checkActivateClone = false
  }
  handleOk(bvModalEvt: any) {
    // Prevent modal from closing
    bvModalEvt.preventDefault()
    // Trigger submit handler
    this.handleSubmit()
  }
  handleSubmit() {
    if (!this.validation) {
      this.validationInputLabel = false
      return
    }
    // prepare data
    let data: any = {
      promoted_ids: this.selectedPromoted.map((item: any) => (item.id)),
      hidden_ids: this.selectedHidden.map((item: any) => (item.id)),
      labels: this.labels,
      use_clone: this.checkActivateClone,
      replace: this.replace,
      selected_queries: this.selectedQueries,
    }
    this.$emit("quickstartSubmit", data)
    // Hide the modal manually
    this.$nextTick(() => {
      this.$bvModal.hide("quickstart-form")
    })
  }
}
</script>

<style scoped lang="scss">
.card {
  padding: 0 !important;
}
.full-width {
  width: 100%;
}
.overflow-scroll-container {
  overflow: scroll;
  max-height: 400px;
}
.list-group-item {
  margin: 0.5rem;
  border-radius: 0.5rem;
  cursor: pointer;
}

.promoted-container {
  border-radius: 6px;
  border: 1px solid #d3dae6;
  background-color: #e6f1fa;
}
.hidden-container {
  border-radius: 6px;
  border: 1px solid #d3dae6;
  background-color: #e6f1fa;
}
 .search-container {
   display: flex;
   border: 1px solid #ced4da;
   border-radius: 0.25rem;
 }
.search-input {
  border: 0;
  box-shadow: none !important;
}

.sai-multiselect-wrapper {
  position: absolute;
  background: #fff;
  width: 96%;
  max-height: 240px;
  overflow: auto;
  border: 1px solid #e8e8e8;
  border-top: none;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
  z-index: 50;
  top: 64%;
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