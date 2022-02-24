<template>
  <div >
    <b-row v-if="this.hiddenQuestions.length > 0" class="d-flex align-items-center justify-content-between">
      <b-col md="8" class="settings-title mt-1 mb-1">
        <span>{{ this.hiddenQuestions.length }}</span>
          Hidden results
      </b-col>
      <b-col md="4" v-if="this.hiddenQuestions.length > 0" >
        <b-button class="ml-1 float-right" variant="outline-danger" @click="unpinAllQuestions" size="sm">
          Unhide all
        </b-button>
        <b-button class="float-right" variant="outline-primary" @click="pinQuestionManually" size="sm">
          Add manually
        </b-button>
      </b-col>
    </b-row>
    <b-row v-else class="mt-1 mb-1 d-flex flex-column justify-content-center align-items-center">
      <b-col md="6" class="d-flex justify-content-center">
        <div class="instruction-title">
          You haven't hidden any question
          Hide your unexpected result by clicking on eye-off button
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
        <div class="row-border">
          <div
            v-for="(item,index) in this.hiddenQuestions"
            :key="item.question_id"
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
import {BBadge, BCol, BRow, BTable, BTabs} from "bootstrap-vue";
import SettingMixin from "@/@core/mixins/settingMixin";
import {mixins} from "vue-class-component";
import {SettingModule} from "@/store/modules/setting";

@Component({
  components: {
    BRow,
    BCol,
    BTable,
    BBadge,
    BTabs
  },
})
export default class HiddenResults extends mixins(SettingMixin) {
  async unpinQuestion(item: any) {
    this.$store.state.config.isLoading = true;
    await SettingModule.unpinQuestionByQuery({questionId: item.question_id,
      queryId:this.$route.params.pinnedQueryId})
    this.$store.state.config.isLoading = false;
  }

  async unpinAllQuestions() {
    this.$store.state.config.isLoading = true;
    await SettingModule.unpinAllQuestionsByQuery({
      queryId: this.$route.params.pinnedQueryId,
      pinType: 0
    })
    this.$store.state.config.isLoading = false;

  }

  pinQuestionManually() {

  }

  async hideQuestion(item: any) {
    this.$store.state.config.isLoading = true;
    await SettingModule.addPinnedQuestionToQuery({
      queryId: this.$route.params.pinnedQueryId,
      question_id: item.id,
      order: 0,
      pin_type: 0,
    })
    this.$store.state.config.isLoading = false;  }
}


</script>

<style scoped>
.list-group-item i {
  cursor: pointer;
}
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