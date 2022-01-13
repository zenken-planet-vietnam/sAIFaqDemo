<template lang="">
    <div class="pin" @click="pinChange" :class="{'pinned':isPin}">
          <feather-icon size="24" icon="StarIcon"/>
    </div>
</template>
<script lang='ts'>
import { Component, Vue, Prop } from "vue-property-decorator";
@Component({})
export default class Pin extends Vue {
  isPin = false;
  @Prop({ default: false })
  private value!: Boolean;

  pinChange() {
    this.isPin = !this.isPin;
  }
}
</script>
<style lang="scss" scoped >
.pin {
  color: gray;
  cursor: pointer;
  &.pinned {
    color: chocolate;
    svg {
      fill: chocolate;
    }
  }
}
</style>