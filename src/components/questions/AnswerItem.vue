<template lang="">
    <div class="answer-item">
      <transition name="fade">
       <span>
           {{"-"}} {{data.text }}
        </span>
      </transition>
    </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component({})
export default class AnswerItem extends Vue {
  @Prop({ default: {} })
  private data!: object;
}
</script>
<style lang="scss">
.answer-item {
  transition: all 0.5s ease-in-out;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter,
.fade-leave-to
/* .fade-leave-active in <2.1.8 */ {
  opacity: 0;
}
</style>