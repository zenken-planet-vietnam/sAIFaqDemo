<template>
  <div>
    <b-modal id="modal-clone" title="Clone" @ok="handleOk">
      <p class="">Copy to</p>
<!--      <div class="mb-1">-->
<!--        <multiselect-->
<!--            id="feedback-user"-->
<!--            v-model="selectedQueries"-->
<!--            tag-placeholder="Add this as new query"-->
<!--            placeholder="Search or add a query"-->
<!--            label="value" track-by="text"-->
<!--            :options="cloneLabel" :multiple="true"-->
<!--            :taggable="true" @tag="addQuery"></multiselect>-->
<!--        <label class="typo__label form__label text-danger" v-show="!validation">Must have at least one value</label>-->
<!--      </div>-->
      <sai-multi-select :labels.sync="selectedQueries" :cloneLabel="cloneLabel"/>
      <b-form-checkbox
        id="checkbox-1"
        name="checkbox-1"
        v-model="replace"
      >
        Replace
      </b-form-checkbox>
      <div>
        <b-link @click="openManualModal">
          <feather-icon icon="PlusIcon"></feather-icon><span>Manual Selection</span></b-link>
      </div>
    </b-modal>
  </div>
</template>

<script lang="ts">
import {Component, Prop, Vue} from "vue-property-decorator";
import {BModal, BForm} from 'bootstrap-vue'
import Multiselect from "vue-multiselect";
import SaiMultiSelect from "../common/SaiMultiSelect.vue"

@Component({
  components: {
    BModal,
    BForm,
    Multiselect,
    SaiMultiSelect
  },
})
export default class CloneModal extends Vue {
  @Prop({ default: [] })
  private cloneLabel!: []
  replace: any = false
  selectedQueries: any = []

  get validation() {
    return this.selectedQueries.length > 0
  }

  handleOk(bvModalEvt: any) {
    bvModalEvt.preventDefault()
    if (!this.validation)
      return
    this.$emit("handleQuickClone", {replace: this.replace, selectedLabel: this.selectedQueries})
    this.$nextTick(() => {
      this.resetForm()
      this.$bvModal.hide("modal-clone")
    })
  }
  resetForm() {
    this.replace = false
    this.selectedQueries = []
  }
  openManualModal() {
    this.$bvModal.hide('modal-clone')
    this.$emit("toggleManualCloneModal", true)
  }
}

</script>
