<template>
  <div class="settings card">
    <div class="title">
      Settings
    </div>
    <b-row class="mt-2 flex-row-reverse">
      <b-col md="3">
        <b-button v-b-modal="modalId" variant="primary" size="sm" style="float: right;">
          <feather-icon icon="PlusIcon"></feather-icon>
          Create a query
        </b-button>
        <modal-form @formSubmited="addNewQuery" :modalTitle="modalTitle"
                    :modalLabel="modalLabel" :modalId="modalId" :placeholder="'Type a query'"/>
      </b-col>
    </b-row>
    <b-row class="mt-2 row-border">
      <b-col md="12">
        <b-table ref="queryTable" hover :fields="fields" :items="this.pinnedQueriesData">
          <template #cell(keyword)="row">
            <b-link @click="$router.push({
            name:'pinnedQueryDetail',
            params: {'pinnedQueryId': row.item.id, 'pinnedQueryLabel': row.item.label}})">
              {{ row.item.label }}
            </b-link>
          </template>
          <template #cell(modified)="row">
            <span>{{ formatDatetime(row.item.modified) }}</span>
          </template>
          <template #cell(action)="row">
            <b-button v-b-modal="modalUpdateId" variant="outline-warning" size="sm" @click="updateQuery(row.item, row.index)" class="mr-1">
              <feather-icon icon="Edit2Icon"></feather-icon>
            </b-button>
            <b-button variant="outline-danger" size="sm" @click="deleteKeyword(row.item, row.index)">
              <feather-icon icon="TrashIcon"></feather-icon>
            </b-button>
          </template>
        </b-table>
      </b-col>
      <modal-form @formSubmited="updateFormSubmitted" :placeholder="selectedLabel" :modalTitle="modalUpdateTitle" :modalLabel="modalUpdateLabel" :modalId="modalUpdateId"/>
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
import ModalForm from "@/components/common/ModalForm.vue"

@Component({
  components: {
    BRow,
    BCol,
    BTable,
    PinnedQuestionDraggable,
    ModalForm,
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
  modalTitle = "Pinned a query"
  modalId = "modal-create-query"
  modalLabel = "Query"
  modalUpdateTitle = "Update a query"
  modalUpdateId = "modal-update-query"
  modalUpdateLabel = "Query"
  selectedLabel = ""
  edittingItem = null
  edittingIndex = null

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
    this.$bvModal.msgBoxConfirm('Please confirm that you want to delete.', {
      title: 'Please Confirm',
      size: 'sm',
      buttonSize: 'sm',
      okVariant: 'danger',
      okTitle: 'YES',
      cancelTitle: 'NO',
      footerClass: 'p-2',
      hideHeaderClose: false,
      centered: true
    })
      .then((isOk) => {
        if (isOk)
          SettingModule.deletePinnedQuery({pinnedQueryId: item.id, index: index})
      })
      .catch(() => {
      })

  }
  updateQuery(item: any, index: number) {
    this.selectedLabel = item.label
    this.edittingItem = item
    this.edittingIndex = index
  }
  updateFormSubmitted(data: any) {
    SettingModule.updatePinnedQuery({
      payload: {label: data},
      pinnedQueryId: this.edittingItem.id,
      index: this.edittingIndex,
    })
  }


  addNewQuery(data: any) {
    if (data) {
      SettingModule.addPinnedQuery({label: data})
    }
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