<template lang="">
    <div class="tag" @click="$emit('click',data)">
        <div>
            <span>{{isSelectedTag?`${data.text}`: `#${data.text}`}}</span>
        <div v-if="isSelectedTag" class="remove-tag">
            <feather-icon size="12" icon="XIcon"/>
        </div>
        </div>
    </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
@Component({})
export default class Tag extends Vue {
  @Prop({ default: null })
  private data!: any;

  @Prop({ default: false })
  private isSelectedTag!: Boolean;
}
</script>
<style lang="scss">
 .tag {
      color: #fff;
      background: #138d75;
      padding: 0.25rem 0.5rem;
      margin: 5px;
      border-radius: 16px;
      cursor: pointer;
      font-size: 14px;
      white-space: nowrap;
      position: relative;
      .remove-tag {
        top: -1px;
        right: 0px;
        position: absolute;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: red;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
</style>