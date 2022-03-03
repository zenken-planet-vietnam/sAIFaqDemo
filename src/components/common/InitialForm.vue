<template lang="">
  <div>
    <b-modal
      centered
      class="enquete-modal"
      :id="id"
      hide-footer
      hide-header
      :no-close-on-backdrop="true"
      :no-close-on-esc="true"
    >
    <div class="initial-form">
        <div class="title">{{constantMessages.INITIAL_FORM_TITLE}}</div>
        <b-form-input class="user-input" v-model="name"/>
        <div class="description">{{constantMessages.INITIAL_FORM_CAPTION}}</div>
        <b-button :disabled="name.length<1" class="submit" variant="info" @click="submit">
            {{constantMessages.INITIAL_FORM_BUTTON_TEXT}}
        </b-button>
    </div>
    </b-modal>
  </div>
</template>
<script lang="ts">
import { BModal, BFormRow, BCol, BButton, BFormInput } from 'bootstrap-vue'
import { Component, Vue, Prop } from 'vue-property-decorator'
import {PageModule} from "@/store/modules/page"
@Component({
  components: {
    BModal,
    BFormRow,
    BCol,
    BButton,
    BFormInput,
  },
})
export default class InitialForm extends Vue {
  name=''
  sAIFaqClientKey='sAIFaqClient'
  @Prop({ default: 'initial-modal' })
  private id!: string

  get constantMessages(){
    return this.$store.state.config?.messages
  }
  submit(){
      PageModule.setUserInfo({user:{id:this.name}})
      this.$bvModal.hide(this.id)
  }
}
</script>
<style lang="scss">
.initial-form {
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .title{
      padding: 20px;
  }
  .user-input{
      width: auto;
  }
  .description{
      padding: 20px;
  }
}
</style>
