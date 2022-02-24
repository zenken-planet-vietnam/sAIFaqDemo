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
      <form ref="form" @submit.stop.prevent="handleSubmit">
        <b-form-group
          label="Name"
          label-for="name-input"
          invalid-feedback="Field is required"
          :state="nameState"
        >
          <b-form-input
            id="name-input"
            v-model="name"
            :state="nameState"
            :placeholder="placeholder"
            required
          ></b-form-input>
        </b-form-group>
      </form>
    </b-modal>
  </div>
</template>

<script lang="ts">
import {Component, Prop, Vue} from "vue-property-decorator";
import {BModal} from 'bootstrap-vue'

@Component({
  components: {
    BModal
  },
})
export default class ModalForm extends Vue {

  @Prop({ default: "" })
  private placeholder!: string;

  name = ""

  nameState = null

  @Prop({ default: "" })
  private modalId!: string;
  @Prop({ default: "" })
  private modalTitle!: string;

  checkFormValidity() {
    const valid = this.$refs.form.checkValidity()
    this.nameState = valid
    return valid
  }
  resetModal() {
    this.name = ''
    this.nameState = null
  }
  created() {
    if (this.value)
      this.name = this.value
  }
  handleOk(bvModalEvt: any) {
    // Prevent modal from closing
    bvModalEvt.preventDefault()
    // Trigger submit handler
    this.handleSubmit()
  }
  handleSubmit() {
    // Exit when the form isn't valid

    if (!this.checkFormValidity()) {
      return
    }
    // Push the name to submitted names
    this.$emit("formSubmited", this.name)
    // Hide the modal manually
    this.$nextTick(() => {
      this.$bvModal.hide(this.modalId)
    })
  }
}

</script>
