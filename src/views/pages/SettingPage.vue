<template>
  <div class="settings card">
    <div class="title">
      {{'Settings'}}
    </div>
    <b-row class="mt-2">
      <b-col md="2">
        <b-button variant="primary" size="sm" @click="addKeyword" class="mr-2">
          <feather-icon icon="PlusIcon"></feather-icon>
        </b-button>
      </b-col>
    </b-row>
    <b-row class="mt-2 row-border">
      <b-col md="12">
        <b-table hover :fields="fields" :items="this.pinnedQueriesData">
          <template #cell(keyword)="row">
            <b-link @click="detailKeyword(row.item)">{{ row.item.label }}</b-link>
          </template>
          <template #cell(modified)="row">
            <span>{{ formatDatetime(row.item.modified) }}</span>
          </template>
          <template #cell(action)="row">
            <b-button variant="outline-warning" size="sm" @click="updateKeyword(row.item, row.index)" class="mr-1">
              <feather-icon icon="Edit2Icon"></feather-icon>
            </b-button>

            <b-button variant="outline-danger" size="sm" @click="deleteKeyword(row.item, row.index)">
              <feather-icon icon="TrashIcon"></feather-icon>
            </b-button>
          </template>
        </b-table>
      </b-col>
      </b-row>
    <b-row v-if="this.isSelected" class="mt-2 row-border">
      <b-col class="">
        <pinned-question-draggable :queryItem="selectedQueryItem" :items="this.pinnedQuestionByQueryID"/>
      </b-col>
    </b-row>
  </div>
</template>

<script lang="ts">
import { BRow, BCol, BTable } from "bootstrap-vue";
import {
  PinnedQuestionDraggable
} from "@/components/settings";
import { Component } from "vue-property-decorator";
import SettingMixin from "@/@core/mixins/settingMixin";
import {SettingModule} from "@/store/modules/setting";
import { mixins } from "vue-class-component";

@Component({
  components: {
    BRow,
    BCol,
    BTable,
    PinnedQuestionDraggable,
  },
})
export default class Settings extends mixins(SettingMixin) {
  keyword: string = ""
  isSelected = false
  selectedQueryItem = null
  idValue = 5
  fields = ['keyword', 'modified', 'action']
  items = [

  ]
  created() {
    this.fetchingData()
  }
  //fetch data
  async fetchingData() {
    this.$store.state.config.isLoading = true;
    await SettingModule.getPinnedQueries({
    });
    this.$store.state.config.isLoading = false;
  }
  deleteKeyword(item: any, index: number) {
    console.log(item, index)
  }
  updateKeyword(item: any, index: number) {
    console.log(item, index)
  }
  formatDatetime(dt: any) {
    return new Date(dt).toLocaleString()
  }
  addKeyword() {
    if (this.keyword) {
      let newId = this.idValue + 1
      this.idValue = newId
      // this.items.push({id: newId, keyword:this.keyword, last_update: '2022-02-15 09:33:13'})
    }
  }
  async fetchDataPinnedQuestion(item: any) {
      await SettingModule.getPinnedQuestionByQuery(item, {})
  }
  detailKeyword(item: any) {
    this.isSelected = true
    this.fetchDataPinnedQuestion(item)
    this.selectedQueryItem = item
  }
}
</script>

<style scoped lang="scss">
.row-border {
  border-radius: 6px;
  border: 1px solid #d3dae6;
  padding: 15px;
}


.settings {
  .title {
    font-size: 21px;
    font-weight: 600;
  }
  .table-card {
    background: #fafbfd;
    padding: 1rem;
    border-radius: 0.5rem;
    height: 100%;
    .table-content {
      max-height: 250px;
      overflow: auto;
    }
  }
}
a {
  text-decoration: none;
  color: #0071c2 !important;
  font-weight: 600;
}
</style>