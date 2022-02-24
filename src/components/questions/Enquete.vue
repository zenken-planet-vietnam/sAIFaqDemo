<template lang="">
  <div>
    <b-modal size="lg" centered class="enquete-modal"  :id="id" hide-footer :no-close-on-backdrop="true" :no-close-on-esc="true">
      <template #modal-title>
      <div class="titile" v-html="title"></div>
     </template>
      <div v-if="type" class="enquete">
        <div v-if="validateMessage" class="text-danger text-center">{{validateMessage}}</div>
        <div>
          <div v-for="(question,index) in enqueteQuestion" :key="index" class="enquete-question">
            <div class="enquete-title">
             <span>{{`Q${question.index}: `}}</span>
             <span>{{question.title}}</span>
            </div>
            <div class="choices" v-if="question.type==='radio'">
              <b-form-radio class="mr-1" v-for="(radio,rindex) in question.choices" :key="rindex" :name="question.index.toString()" @change="onChange($event,question,radio)">{{radio.label}}</b-form-radio>
            </div>
            <div class="choices" v-if="question.type==='checkbox'">
              <b-form-checkbox class="mr-1" v-for="(checkbox,cindex) in question.choices" :key="cindex" :name="question.index.toString()"  @change="onChange($event,question,checkbox )">{{checkbox.label}}</b-form-checkbox>
            </div>
            <div class="choices" v-if="question.type==='textarea'">
              <b-form-textarea  @input="onChange($event,question)"/>
            </div>
          </div>
        </div>
        <div class='submit'>
          <b-button @click="submit" variant="info">
            Submit
          </b-button>
        </div>
      </div>
    </b-modal>
    <b-modal :id="messageModalId"  centered :hide-header="true" :hide-footer="true" class="enquete-modal">
      <div class="text-center" v-html="afterSubmitMessage"></div>
       <div class='submit text-center mt-1'>
          <b-button @click="$bvModal.hide(messageModalId)" variant="info">
            Ok
          </b-button>
        </div>
    </b-modal>
  </div>
</template>
<script lang="ts">
import {
  BModal,
  BFormRow,
  BCol,
  BFormRadio,
  BFormCheckbox,
  BButton,
  BFormTextarea
} from "bootstrap-vue";
import { Component, Vue, Prop } from "vue-property-decorator";
@Component({
  components: {
    BModal,
    // eslint-disable-next-line vue/no-unused-components
    BFormRow,
    // eslint-disable-next-line vue/no-unused-components
    BCol,
    // eslint-disable-next-line vue/no-unused-components
    BFormRadio,
    BFormCheckbox,
    BButton,
    BFormTextarea
  },
})
export default class Enquete extends Vue {
  answerData:any={}
  validateMessage:any=null
  messageModalId="message-modal"
  @Prop({ default: "enquete-modal" })
  private id!: string;

  @Prop({ default: "resolve" })
  private type!: string;

  get enquete(){
    return  this.$store.state.config.enquete
    
  }

  get title(){
    return this.type==='resolve'? this.enquete.ENQUETE_RESOLVED_TITLE:this.enquete.ENQUETE_UNRESOLVED_TITLE
  }
  get enqueteQuestion(){
    return this.type==='resolve'?this.enquete.ENQUETE_SET.RESOLVED: this.enquete.ENQUETE_SET.UNRESOLVED
  }

  get afterSubmitMessage(){
    return this.type==='resolve'? this.enquete.ENQUETE_RESOLVED_MESSAGE:this.enquete.ENQUETE_UNRESOLVED_MESSAGE
  }

  onChange(event:any, question:any,choice:any){
    switch(question.type){
    case 'radio':
      this.answerData[question.index]=choice.value
      break;
      case 'checkbox':
        if(event===true){
         this.answerData[question.index]= !this.answerData[question.index]?[choice.value]: [...new Set([choice.value,...this.answerData[question.index]])]
        }
        else{
          this.answerData[question.index]=this.answerData[question.index].filter((x:any)=>x===event)
        }
      break;
      case 'textarea':
        this.answerData[question.index]=event
      break;
      }
  }

  submit(){
   if(!this.checkvalidate()){
        this.validateMessage="Please input the answer"
   }
   else{
     this.validateMessage=null
     this.$bvModal.hide(this.id)
     this.$bvModal.show(this.messageModalId)
   }
  }

  checkvalidate(){
    let requiredQuestion=this.enqueteQuestion.filter((x:any)=>x.required===true)
    let isValid=true;
    for (let i = 0; i < requiredQuestion.length; i++) {
      const question = requiredQuestion[i];
      let answer=this.answerData[question.index]
        switch(question.type){
        case 'radio':
          isValid=answer
          break;
          case 'checkbox':
          case 'textarea':
          isValid=answer?.length
          break;
      }
      if(!isValid) break;
    }
    return isValid
  }
}

</script>
<style lang="scss">
.enquete{
  .enquete-question{
  padding: 10px;
  border: 3px solid #0dcaf0;
  border-radius: 0.375rem;
  margin-top: 10px;
  .choices{
    display: flex;
  }
}
.text-danger{
    font-size: 12px;
    font-style: italic;
}
.submit{
  margin-top: 20px;
    display: flex;
    justify-content: center;
    align-content: center;
  }
}

</style>
