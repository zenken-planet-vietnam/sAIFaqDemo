<template>
  <div>
    <b-modal
      :id="modalId"
      ref="modal"
      :title="modalTitle"
      @show="resetModal"
      @hidden="resetModal"
      @ok="handleOk"
    >
      <b-form @submit.stop.prevent="handleSubmit">
        <label for="feedback-user">Keyword</label>
        <b-form-input
          id="feedback-user"
          v-model="name"
          :state="validation"
          :placeholder="placeholder"
          required
        ></b-form-input>
        <b-form-invalid-feedback :state="validation">
          Keyword must be unique and cannot be empty!
        </b-form-invalid-feedback>
        <b-form-valid-feedback :state="validation">
          Looks Good.
        </b-form-valid-feedback>
      </b-form>
    </b-modal>
  </div>
</template>

<script lang="ts">
import {Component, Prop, Vue} from "vue-property-decorator";
import {BModal, BForm} from 'bootstrap-vue'

@Component({
  components: {
    BModal,
    BForm
  },
})
export default class ModalForm extends Vue {

  @Prop({ default: "" })
  private placeholder!: string;
  @Prop({ default: "create" })
  private formState!: string;

  name = ""
  nameState = null

  @Prop({ default: "" })
  private modalId!: string;
  @Prop({ default: "" })
  private modalTitle!: string;

  get validation() {
    if(this.formState == "edit") {
      return this.name.length > 0 && this.name != this.placeholder
    }
    return true
  }

  resetModal() {
    this.name = ''
    this.nameState = null
  }
  handleOk(bvModalEvt: any) {
    // Prevent modal from closing
    bvModalEvt.preventDefault()
    // Trigger submit handler
    this.handleSubmit()
  }
  handleSubmit() {
    if (!this.validation)
      return
    // Push the name to submitted names
    this.$emit("formSubmited", this.name)
    // Hide the modal manually
    this.$nextTick(() => {
      this.$bvModal.hide(this.modalId)
    })
  }
}

</script>
