<template>
    <div class="tag" :class="{'selected-tag':isSelectedTag}" @click="$emit('click',data)">
        <div>
            <span>{{isSelectedTag?`${data}`: `#${data}`}}</span>
          <div v-if="isSelectedTag" class="remove-tag">
              <feather-icon size="12" icon="XIcon"/>
          </div>
        </div>
    </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
@Component({})
export default class TagQuery extends Vue {
  @Prop({ default: null })
  private data!: any;

  @Prop({ default: false })
  private isSelectedTag!: Boolean;
}
</script>
<style lang="scss">
 .tag {
      color: #1d9bf0;
      border: 1px solid #1d9bf0;
      //background: #138d75;
      padding: 0.25rem 0.5rem;
      margin: 5px;
      border-radius: 0.375rem;
      cursor: pointer;
      font-size: 14px;
      white-space: nowrap;
      position: relative;
      font-weight: bold;
      transition: color 0.3s ease-in-out;
      &:hover{
        color: #0465b0;
        border-color: #0465b0;
      }
      &.selected-tag{
        background: #1d9bf0;
        color: #fff;
      }
      .remove-tag {
        top: -1px;
        right: 0px;
        position: absolute;
        width: 10px;
        height: 10px;
        border-radius: 50%;
       // background: #fff;
        color: #fff;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
</style>