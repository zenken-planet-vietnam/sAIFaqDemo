<template>
  <div>
    <b-row>
      <b-col md="2">
        <b-button v-b-toggle.sidebar-backdrop class="float-right" variant="outline-primary" size="sm">
          Add manually
        </b-button>
      </b-col>
    </b-row>
    <b-row class="mt-2">
      <b-col md="4">
        <b-card-group deck>
          <b-card
            border-variant="success"
            header-border-variant="success"
            header-text-variant="success"
            align="center"
          >
            <template #header>
              <div class="d-flex justify-content-between align-items-center">
                <div>Promoted Results <span class="sai-badges"> {{countPromotedQuestion}}</span></div>
                <b-dropdown size="sm" variant="outline-dark" no-caret id="dropdown-buttons">
                  <template #button-content>
                      <feather-icon icon="MoreVerticalIcon"></feather-icon>
                  </template>
                  <b-dropdown-item-button v-b-modal.modal-clone>Clone</b-dropdown-item-button>
                  <b-dropdown-item-button @click="deleteAll(1)" >Delete all</b-dropdown-item-button>
                </b-dropdown>
              </div>
            </template>
            <b-modal id="modal-clone" title="Clone">
              <span class="my-4">Copy to    </span>
              <b-form-select v-model="selected" :options="options"></b-form-select>
              <b-form-checkbox
                id="checkbox-1"
                name="checkbox-1"
                value="accepted"
                unchecked-value="not_accepted"
              >
                Replace
              </b-form-checkbox>
            </b-modal>

            <draggable
              class="list-group"
              :list="promotedQuestions"
              v-bind="dragOptions"
              @start="drag=true"
              @end="onDragEnd"
              @change="onChangeList($event, 1)"
            >
              <transition-group id="promotedList" type="transition" :name="!drag ? 'flip-list' : null">
                <div
                  class="list-group-item"
                  v-for="item in promotedQuestions"
                  :key="item.id"
                >
                  <span class="">
                    {{item.label }}
                  </span>
                </div>
              </transition-group>
            </draggable>
          </b-card>
        </b-card-group>
      </b-col>
      <b-col md="4">
        <b-card-group deck>
          <b-card
            border-variant="danger"
            header-border-variant="danger"
            header-text-variant="danger"
            align="center"
          >
            <template #header>
              <div class="d-flex justify-content-between align-items-center">
                <div>Hidden Results <span class="sai-badges"> {{countHiddenQuestion}}</span></div>
                <b-dropdown size="sm" variant="outline-dark" no-caret id="dropdown-buttons">
                  <template #button-content>
                      <feather-icon icon="MoreVerticalIcon"></feather-icon>
                  </template>
                  <b-dropdown-item-button>Clone</b-dropdown-item-button>
                  <b-dropdown-item-button @click="deleteAll(0)" >Delete all</b-dropdown-item-button>
                </b-dropdown>
              </div>
            </template>
            <draggable
              class="list-group"
              :list="hiddenQuestions"
              v-bind="dragOptions"
              @change="onChangeList($event, 0)"
              @end="onDragEnd"
            >
              <transition-group id="hiddenList" type="transition" :name="!drag ? 'flip-list' : null">
                <div
                  class="list-group-item"
                  v-for="item in hiddenQuestions"
                  :key="item.id"
                  :data-id="item.id"

                >
                  <span class="">
                     {{item.label }}
                  </span>
                </div>
              </transition-group>
            </draggable>
          </b-card>
        </b-card-group>
      </b-col>
      <b-col md="4">
        <b-card-group deck>
          <b-card
            border-variant="primary"
            header-bg-variant="primary"
            header-text-variant="white"
            align="center"
          >
            <template #header>
              <div>Top search by query "{{ $route.params.pinnedQueryLabel }}"
                <span class="sai-badges"> {{getQuestionSearchResult.length}}</span></div>
            </template>
            <draggable
              class="list-group"
              :list="getQuestionSearchResult"
              v-bind="dragOptions"
              @end="onDragEnd"
            >
              <transition-group id="searchList" type="transition" :name="!drag ? 'flip-list' : null">
                <div
                  class="list-group-item"
                  v-for="item in getQuestionSearchResult"
                  :key="item.id"
                  :data-id="item.id"
                >
                  <span class="">
                     {{item.label }}
                  </span>
                </div>
              </transition-group>
            </draggable>
          </b-card>
        </b-card-group>
      </b-col>
    </b-row>
  </div>
</template>

<script lang="ts">
import draggable from "vuedraggable";
import {Component} from "vue-property-decorator";
import SettingMixin from "@/@core/mixins/settingMixin";
import {mixins} from "vue-class-component";
import {BCol, BRow, BFormSelect} from "bootstrap-vue";
import {PageModule} from "@/store/modules/page";


@Component({
  components: {
    BCol,
    BRow,
    draggable,
    BFormSelect,
  },
})
export default class VerticalView extends mixins(SettingMixin) {
  drag = false
  executionStack: any = []
  selected: any = null
  options: any = [
    {value: 1, text: "children"},
    {value: 2, text: "ticket"},
    {value: 3, text: "where"},
    {value: 4, text: "lost"},
    {value: 5, text: "fare"}
  ]
  get dragOptions() {
      return {
        animation: 200,
        group: "description",
        disabled: false,
        ghostClass: "ghost"
      };
    }

  get getQuestionSearchResult() {
    const array = PageModule.fullQuestions
    return array.filter((elem: any) => !this.pinnedQuestionByQueryID.find(
        (question: any) => elem.id === question.id))
  }

  onChangeList(evt: any, type: any) {
    if(Object.prototype.hasOwnProperty.call(evt, "removed"))
    {
      const item = evt.removed.element
      this.executionStack.push({"func": this.unpinQuestion, "params": item})
    }
    if(Object.prototype.hasOwnProperty.call(evt, "added"))
    {
      const item = evt.added.element
      this.executionStack.push({"func": this.pinQuestion, "params": {...item, pinType: type}})
    }
    if (type == 1)
      if(Object.prototype.hasOwnProperty.call(evt, "moved"))
      {
        this.updateQuestionOrder(this.promotedQuestions)
      }
  }

  async onDragEnd() {
    this.drag = false
    while(this.executionStack.length > 0) {
      const {func, params} = this.executionStack.pop()
      await func(params)
    }
  }
  created() {
    // console.log(this.pinnedQueriesData.map((item: any) => {
    //         return {value: item.id, text: item.label}
    //     }
    // ).filter((item: any) => item.value != this.$route.params.pinnedQueryId ))
  }
  // filteringCloneQuery() {
  //   return this.pinnedQueriesData.map((item: any) => {
  //         if (item.id != this.$route.params.pinnedQueryId)
  //           return {value: item.id, text: item.label}
  //       }
  //   )
  // }

}
</script>

<style scoped>
.card {
  padding: 0 !important;
}
.list-group-item {
  height: 70px;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
  cursor: pointer;
}

.card-body {
  text-align: left;
}
</style>