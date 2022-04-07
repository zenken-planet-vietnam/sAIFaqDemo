<template lang="">
  <div
    class="tags-container"
    :class="[
      isSelectedTag ? 'selected-tags-container' : '',
      !isModal ? 'none-background' : '',
    ]"
  >
    <span class="title" v-if="!isSelectedTag">
      {{ title }}
    </span>
    <div class="tags-wrapper">
      <tag
        @click="updateTagFilter($event)"
        v-for="(item, index) in tags"
        :isSelectedTag="isSelectedTag"
        :data="item"
        :key="index"
      />
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
import { PageModule } from '@/store/modules/page'
import { Component, Vue, Prop } from 'vue-property-decorator'
import Tag from './Tag.vue'
@Component({
  components: {
    Tag,
  },
})
export default class Tags extends Vue {
  @Prop({ default: [] })
  private tags!: Array<any>

  @Prop({ default: false })
  private isSelectedTag!: Boolean

  @Prop({ default: true })
  private isModal!: true

   @Prop({ default: 'true' })
  private title!: string

  updateTagFilter(tag: any) {
    let currrentTag = { text: tag.text }
    if (this.isSelectedTag) {
      PageModule.unselectedTag(currrentTag)
    } else {
      PageModule.updateTagFilter(currrentTag)
    }
  }
}
</script>
<style lang="scss">
.tags-container {
  padding: 10px 0px;
  //background: #ebedef;
  &.selected-tags-container {
    padding: 0px !important;
    background: transparent;
  }
  .title {
    font-weight: bold;
  }
  .tags-wrapper {
    display: flex;
    flex-direction: columns;
  }
}
</style>
