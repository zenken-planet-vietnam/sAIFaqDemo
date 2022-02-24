<template>
  <div>
    <b-row v-if="pinnedPromotedQuestionList.length > 0" class="d-flex align-items-center justify-content-between">
      <b-col md="8" class="settings-title mt-1 mb-1">
        <span>{{ pinnedPromotedQuestionList.length }}</span>
          Promoted results
      </b-col>
      <b-col md="4" v-if="pinnedPromotedQuestionList.length > 0" >
        <b-button class="ml-1 float-right" variant="outline-danger" @click="unpinAllQuestions" size="sm">
          Demote all
        </b-button>
        <b-button class="float-right" variant="outline-primary" @click="pinQuestionManually" size="sm">
          Add manually
        </b-button>
      </b-col>
    </b-row>
    <b-row v-else class="mt-1 mb-1 d-flex flex-column justify-content-center align-items-center">
      <b-col md="6" class="d-flex justify-content-center">
        <div class="instruction-title">
          Promote your search result always on top
        </div>
      </b-col>
      <b-col md="6" class="mt-1 d-flex justify-content-center">
        <b-button variant="outline-primary" @click="pinQuestionManually" size="sm" class="m2-1">
          <feather-icon icon="PlusIcon"></feather-icon> Add manually
        </b-button>
      </b-col>
    </b-row>

    <b-row>
      <b-col md="12">
        <draggable
          class="row-border"
          v-model="pinnedPromotedQuestionList"
          v-bind="dragOptions"
          @start="drag = true"
          @end="drag = false"
        >
          <transition-group type="transition" :name="!drag ? 'flip-list' : null">
            <div
              v-for="item in pinnedPromotedQuestionList"
              :key="item.question_id"
            >
              <div class="d-flex justify-content-between align-items-center question-section-item">
                #{{ item.display_order }} {{item.label }}
                <b-button variant="outline-danger"  @click="unpinQuestion(item)" size="sm">
                  <feather-icon icon="TrashIcon"></feather-icon>
                </b-button>
              </div>
            </div>
          </transition-group>
        </draggable>
      </b-col>
    </b-row>
  </div>
</template>

<script lang="ts">
import draggable from "vuedraggable";
import {Component} from "vue-property-decorator";
import {BCol, BRow, BTable, BTabs} from "bootstrap-vue";
import SettingMixin from "@/@core/mixins/settingMixin";
import {mixins} from "vue-class-component";
import {SettingModule} from "@/store/modules/setting";
import {PageModule} from "@/store/modules/page";

@Component({
  components: {
    BRow,
    BCol,
    BTable,
    draggable,
    BTabs
  },
})
export default class PromotedResults extends mixins(SettingMixin) {
  message = [
    "vue.draggable",
    "draggable",
    "component",
    "for",
    "vue.js 2.0",
    "based",
    "on",
    "Sortablejs"
  ];
  drag = false
  isLoading = false

  async fetchDataPinnedQuestion(queryId: any) {
    await SettingModule.getPinnedQuestionByQuery(queryId)
  }

  get dragOptions() {
      return {
        animation: 200,
        group: "description",
        disabled: false,
        ghostClass: "ghost"
      };
    }

  get getTargets() {
      return PageModule.searchWords;
  }

  get pinnedPromotedQuestionList() {
    return this.pinnedQuestionByQueryID.filter((item: any) => item.pin_type)
  }

  set pinnedPromotedQuestionList(value: any) {
    SettingModule.updatePinnedQuestionOrder({
      queryId: this.$route.params.pinnedQueryId, value:value
    })
  }

  async pinQuestion(item: any) {
    this.$store.state.config.isLoading = true;
    await SettingModule.addPinnedQuestionToQuery({
      queryId: this.$route.params.pinnedQueryId,
      question_id: item.id,
      order: this.pinnedQuestionByQueryID.length + 1,
      pin_type: 1,
    })
    this.$store.state.config.isLoading = false;
  }

  async unpinQuestion(item: any) {
    this.$store.state.config.isLoading = true;
    await SettingModule.unpinQuestionByQuery({questionId: item.question_id,
      queryId:this.$route.params.pinnedQueryId,
    })
    this.$store.state.config.isLoading = false;
  }

  async unpinAllQuestions() {
    this.$store.state.config.isLoading = true;
    await SettingModule.unpinAllQuestionsByQuery({
      queryId: this.$route.params.pinnedQueryId,
      pinType: 1
    })
    this.$store.state.config.isLoading = false;

  }

  pinQuestionManually() {

  }
}


</script>

<style scoped>
.button {
  margin-top: 35px;
}

.flip-list-move {
  transition: transform 0.5s;
}

.no-move {
  transition: transform 0s;
}

.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}

.list-group {
  min-height: 20px;
}

.list-group-item {
  cursor: move;
}

.list-group-item i {
  cursor: pointer;
}
.question-section-item {
  border-radius: 3px;
  box-shadow: 0 1px 2px rgb(0 0 0 / 0.2);
  padding: 10px;
  margin: 10px;
  background-color: #FFF;
  cursor: pointer;
  border: 1px solid #ebe3e3;
}
.row-border {
  border-radius: 6px;
  border: 1px solid #d3dae6;
  background-color: #e6f1fa;
}
.settings-title {
  font-size: 21px;
  font-weight: 600;
}
a {
  text-decoration: none;
  color: #0071c2 !important;
  font-weight: 600;
}
.float-right {
  float: right;
}

.question-title {
  font-size: 20px;
}
.instruction-title {
  color: #817a7a;
}
</style>