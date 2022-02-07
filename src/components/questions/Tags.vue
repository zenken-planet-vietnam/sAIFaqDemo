<template lang="">
    <div class="tags-container" :class="[isSelectedTag?'selected-tags-container':'', !isModal?'none-background':'' ]"> 
        <span v-if="!isSelectedTag">
            {{"Popular key words:"}}
        </span>
        <div class="tags-wrapper">
          <tag class="tag" @click="updateTagFilter($event)" v-for="item, index in tags" :key="index"/>
            <!-- <div class="tag" @click="updateTagFilter(item)" v-for="item, index in tags" :key="index">
              <transition name="bounce">
              <div>
                 <span>{{isSelectedTag?`${item.text}`: `#${item.text}`}}</span>
                <div v-if="isSelectedTag" class="remove-tag">
                    <feather-icon size="12" icon="XIcon"/>
                </div>
              </div>
              </transition>
            </div> -->
        </div>
    </div>
</template>
<script lang="ts">
import { PageModule } from "@/store/modules/page";
import { Component, Vue, Prop } from "vue-property-decorator";
import Tag from "./Tag.vue"
@Component({components:{
  Tag
}})
export default class Tags extends Vue {
  @Prop({ default: [] })
  private tags!: Array<any>;

  @Prop({ default: false })
  private isSelectedTag!: Boolean;

  @Prop({ default: true })
  private isModal!: true;

  updateTagFilter(tag: any) {
    PageModule.updateTagFilter({
      text: tag.text,
      isSelected: !this.isSelectedTag,
    });
  }
}
</script>
<style lang="scss">
.tags-container {
  padding: 10px 20px;
  background: #ebedef;
  &.selected-tags-container {
    padding: 0px !important;
    background: transparent;
  }
  .tags-wrapper {
    display: flex;
    flex-direction: columns;
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
  }
}
</style>