<template>
  <div >
    <b-row v-if="this.hiddenQuestions.length > 0" class="d-flex align-items-center justify-content-between">
      <b-col md="8" class="settings-title mt-1 mb-1">
        <span>{{ this.hiddenQuestions.length }}</span>
          Hidden results
      </b-col>
      <b-col md="4" v-if="this.hiddenQuestions.length > 0" >
        <b-button class="ml-1 float-right" variant="outline-danger" @click="deleteAll(0)" size="sm">
          Unhide all
        </b-button>
        <b-button v-b-toggle.sidebar-backdrop class="float-right" variant="outline-primary" size="sm">
          Add manually
        </b-button>
      </b-col>
    </b-row>
    <b-row v-else class="mt-1 mb-1 d-flex flex-column justify-content-center align-items-center">
      <b-col md="6" class="d-flex justify-content-center">
        <div class="instruction-title">
          You haven't hidden any question.
          Hide your unexpected result by clicking on eye-off button.
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
        <div class="row-border">
          <div
            v-for="(item,index) in this.hiddenQuestions"
            :key="item.id"
          >
            <div class="d-flex justify-content-between align-items-center question-section-item">
              #{{ index + 1 }} {{item.label }}
              <b-button variant="outline-danger"  @click="unpinQuestion(item)" size="sm">
                <feather-icon icon="TrashIcon"></feather-icon>
              </b-button>
            </div>
          </div>
        </div>
      </b-col>
    </b-row>
  </div>
</template>

<script lang="ts">
import {Component} from "vue-property-decorator";
import { BCol, BRow } from "bootstrap-vue";
import SettingMixin from "@/@core/mixins/settingMixin";
import {mixins} from "vue-class-component";

@Component({
  components: {
    BRow,
    BCol,
  },
})
export default class HiddenResults extends mixins(SettingMixin) {
}
</script>

<style scoped>
.question-section-item {
  border-radius: 3px;
  box-shadow: 0 1px 2px rgb(0 0 0 / 0.2);
  padding: 10px;
  margin: 10px;
  background-color: #FFF;
  /*cursor: pointer;*/
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