<template lang="">
    <div class="condition-group" >
     <div class="title">
       {{ data.conditionGroup.label }}
     </div>
     <condition @selectedChange="conditionChange" v-for="item in data.condition" :key="item.id" :data="item" :isSelected="getConditionSelected(item.id)"/>
    </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import Condition from "./Condition.vue";
@Component({
  components: {
    Condition,
  },
})
export default class ConditionGroup extends Vue {
  @Prop({ default: null })
  private data!: any;

  @Prop({ default: 1 })
  private levelIndex!: number;

  @Prop({ default: [] })
  private selectedCondition!: any;

  getConditionSelected(conditionId: number) {
    if (this.selectedCondition) {
      let condition = this.selectedCondition.find(
        (x: any) => x.conditionGroupId === this.data.conditionGroup.id
      );
      if (condition) return condition.conditionId === conditionId;
    }
    return false;
  }

  conditionChange(event: any) {
    this.$emit("selectedChange", {
      conditionGroupId: this.data.conditionGroup.id,
      conditionId: event,
      level: this.levelIndex,
    });
  }
}
</script>
<style lang="scss">
.condition-group {
  background-color: #f2f2f2;
  padding: 10px;
  margin-top: 10px;
  .title {
    background: #ffffff;
    font-size: 21px;
    padding: 0.5rem 1rem;
  }
}
</style>