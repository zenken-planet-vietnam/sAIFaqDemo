<template lang="">
    <div class="condition" :class="{'selected':isSelected}" @click="$emit('selectedChange', data.id)" >
       {{data.label}}
    </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
@Component({})
export default class Condition extends Vue {
  @Prop({ default: null })
  private data!: any;

  @Prop({ default: false })
  private isSelected!: any;
}
</script>
<style lang="scss">
.condition {
  background-color: #0d6efd;
  margin-top: 10px;
  padding: 0.5rem 1rem;
  color: #ffffff;
  border-radius: 0.375rem;
  cursor: pointer;
  &:hover {
    background-color: #0b5ed7;
  }
  &.selected {
    background-color: #0b5ed7;
    pointer-events: none;
  }
}
</style>