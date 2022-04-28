<template>
  <div>
    <b-modal id="manual-modal-clone" title="Manual Clone" 
             @ok="handleOk" @hidden="handleClose"
    >
      <p class="">Copy to</p>
      <div class="mb-1">
<!--        <multiselect-->
<!--            id="feedback-user"-->
<!--            v-model="selectedQueries"-->
<!--            tag-placeholder="Add this as new query"-->
<!--            placeholder="Search or add a query"-->
<!--            label="value" track-by="text"-->
<!--            :options="cloneLabel" :multiple="true"-->
<!--            :taggable="true" @tag="addQuery"></multiselect>-->
<!--        <label class="typo__label form__label text-danger" v-show="!validation">Must have at least one value</label>-->
            <sai-multi-select :labels.sync="selectedQueries" :cloneLabel="cloneLabel"/>
      </div>
      <b-form-checkbox
        id="checkbox-manual-replace"
        name="checkbox-manual-replace"
        v-model="replace"
      >
        Replace
      </b-form-checkbox>

      <b-card no-body class="mb-1">
        <b-card-header header-tag="header" class="p-1" role="tab">
<!--          <b-form-checkbox class="mb-1" id="checkbox-promoted-all" name="checkbox-promoted-all"></b-form-checkbox>-->

          <b-button class="full-width" block v-b-toggle.accordion-1 variant="success">Promoted results</b-button>
        </b-card-header>
        <b-collapse id="accordion-1" visible accordion="my-accordion" role="tabpanel">
          <b-card-body>
            <b-card-text>
              <div v-for="(item, index) in selectedPromoted" :key="item.id" class="d-flex align-items-center mb-1">
                <b-form-checkbox
                  :id="'promoted-checkbox-'+index"
                  :name="'promoted-checkbox-'+index"
                  v-model="item.selected"
                  @click="handlePromotedChange(item, index)"
                >
                </b-form-checkbox>
                <span>{{ item.label }}</span>
              </div>
            </b-card-text>
          </b-card-body>
        </b-collapse>
      </b-card>
      <b-card no-body class="mb-1">
        <b-card-header header-tag="header" class="p-1" role="tab">
          <b-button class="full-width" block v-b-toggle.accordion-2 variant="danger">Hidden results</b-button>
        </b-card-header>
        <b-collapse id="accordion-2" accordion="my-accordion" role="tabpanel">
          <b-card-body>
            <b-card-text>
              <div v-for="(item, index) in selectedHidden" :key="item.id" class="d-flex align-items-center mb-1">
                <b-form-checkbox
                  :id="'hidden-checkbox-'+index"
                  :name="'hidden-checkbox-'+index"
                  v-model="item.selected"
                  @click="handleHiddenChange(item, index)"
                >
                </b-form-checkbox>
                <span>{{ item.label }}</span>
              </div>
            </b-card-text>
          </b-card-body>
        </b-collapse>
      </b-card>
    </b-modal>
  </div>
</template>

<script lang="ts">
import {Component, Prop} from "vue-property-decorator";
import {BModal, BForm} from 'bootstrap-vue'
import Multiselect from "vue-multiselect";
import {mixins} from "vue-class-component";
import SettingMixin from "@/@core/mixins/settingMixin";
import SaiMultiSelect from "../common/SaiMultiSelect.vue"

@Component({
  components: {
    BModal,
    BForm,
    Multiselect,
    SaiMultiSelect
  },
})
export default class ManualCloneModal extends mixins(SettingMixin) {
  @Prop({ default: [] })
  private cloneLabel!: []

  replace: any = false
  selectedLabel: any = ""
  selectedHidden: any = []
  selectedPromoted: any = []
  selectedQueries: any = []

  addQuery(newQuery: any) {
    this.selectedQueries.push({text:newQuery, value: newQuery, id: null})
  }

  get validation() {
    return this.selectedQueries.length > 0
  }

  handleOk(bvModalEvt: any) {
    if (!this.validation) {
      bvModalEvt.preventDefault()
      return
    }
    let promoted = this.selectedPromoted.filter((item: any) => item.selected).map((q: any) => (q.id))
    let hidden = this.selectedHidden.filter((item: any) => item.selected).map((q: any) => (q.id))

    this.$emit("handleManualClone", {
      replace: this.replace,
      selectedLabel: this.selectedQueries,
      promotedList: promoted,
      hiddenList: hidden
    })
    this.$nextTick(() => {
      this.resetForm()
      this.handleClose()
    })
  }
  resetForm() {
    this.replace = false
    this.selectedLabel = ""
  }

  created() {
    this.selectedPromoted = this.promotedQuestions.map((item: any) => ({...item, selected: true}))
    this.selectedHidden = this.hiddenQuestions.map((item: any) => ({...item, selected: true}))
  }

  handlePromotedChange(item: any, index: any) {
    this.selectedPromoted[index].selected = !this.selectedPromoted[index].selected
  }

  handleHiddenChange(item: any, index: any) {
    this.selectedHidden[index].selected = !this.selectedHidden[index].selected
  }

  handleClose() {
    this.$emit("toggleManualCloneModal", false)
  }

}

</script>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>

<style scoped>
.card {
  padding: 0 !important;
}
.full-width {
  width: 100%;
}
</style>