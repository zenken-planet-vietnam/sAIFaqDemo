<template>
  <div>
    <b-row v-if="promotedQuestions.length > 0" class="d-flex align-items-center justify-content-between">
      <b-col md="8" class="settings-title mt-1 mb-1">
        <span>{{ promotedQuestions.length }}</span>
          Promoted results
      </b-col>
      <b-col md="4" v-if="promotedQuestions.length > 0" >
        <b-button class="ml-1 float-right" variant="outline-danger" @click="deleteAll(1)" size="sm">
          Demote all
        </b-button>
        <b-button v-b-toggle.sidebar-backdrop class="float-right" variant="outline-primary" size="sm">
          Add manually
        </b-button>
      </b-col>
    </b-row>
    <b-row v-else class="mt-1 mb-1 d-flex flex-column justify-content-center align-items-center">
      <b-col md="6" class="d-flex justify-content-center">
        <div class="instruction-title">
          Promote your result always on top.
        </div>
      </b-col>
      <b-col md="6" class="mt-1 d-flex justify-content-center">
        <b-button v-b-toggle.sidebar-backdrop variant="outline-primary" size="sm" class="m2-1">
          <feather-icon icon="PlusIcon"></feather-icon> Add manually
        </b-button>
      </b-col>
    </b-row>

    <b-row>
      <b-col md="12">
        <draggable
          class="row-border"
          v-model="promotedQuestions"
          v-bind="dragOptions"
          @start="drag = true"
          @end="drag = false"
        >
          <transition-group type="transition" :name="!drag ? 'flip-list' : null">
            <div
              v-for="item in promotedQuestions"
              :key="item.id"
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
import {BCol, BRow} from "bootstrap-vue";
import SettingMixin from "@/@core/mixins/settingMixin";
import {mixins} from "vue-class-component";

@Component({
  components: {
    BRow,
    BCol,
    draggable,
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

  get dragOptions() {
      return {
        animation: 200,
        group: "description",
        disabled: false,
        ghostClass: "ghost"
      };
    }
}
</script>

<style scoped>
.button {
  margin-top: 35px;
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
.float-right {
  float: right;
}
.instruction-title {
  color: #817a7a;
}
</style>