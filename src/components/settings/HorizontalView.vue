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
                  <b-dropdown-item-button @click="selectedPinType=1" v-b-modal.modal-clone>Clone</b-dropdown-item-button>
                  <b-dropdown-item-button @click="deleteAll(1)" >Delete all</b-dropdown-item-button>
                </b-dropdown>
              </div>
            </template>

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
                  <b-dropdown-item-button @click="selectedPinType=0" v-b-modal.modal-clone>Clone</b-dropdown-item-button>
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
      <clone-modal @toggleManualCloneModal="toggleManualCloneModal" :cloneLabel="cloneLabel" @handleQuickClone="handleQuickClone"></clone-modal>
      <manual-clone-modal
          @toggleManualCloneModal="toggleManualCloneModal"
          v-if="modalDisplay"
          :cloneLabel="cloneLabel" @handleManualClone="handleManualClone"></manual-clone-modal>

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
import CloneModal from "./CloneModal.vue";
import ManualCloneModal from "./ManualCloneModal.vue";

@Component({
  components: {
    BCol,
    BRow,
    draggable,
    BFormSelect,
    CloneModal,
    ManualCloneModal
  },
})
export default class VerticalView extends mixins(SettingMixin) {
  drag = false
  executionStack: any = []
  selectedPinType: any = null
  cloneLabel: any = []
  replace: any = false
  modalDisplay: any = false

  toggleManualCloneModal(value: any) {
    this.modalDisplay = value
    this.$nextTick(() => {
      if (value)
        this.$bvModal.show('manual-modal-clone')
      else
        this.$bvModal.hide('manual-modal-clone')
    })
  }

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
    this.cloneLabel = this.pinnedQueriesData.map((item: any) => {
            return {value: item.label, text: item.label, id: item.id}
        }
    ).filter((item: any) => item.id != this.$route.params.pinnedQueryId)
  }

  async handleQuickClone(data: any) {
    await this.cloneQuestions(data.selectedLabel, this.selectedPinType, data.replace)
  }

  async handleManualClone(data: any) {
    await this.manualCloneQuestions(data.selectedLabel, data.replace,
        data.promotedList, data.hiddenList)
  }

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