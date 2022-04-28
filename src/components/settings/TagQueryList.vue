<template>
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
      <tag-query
        @click="updateTagFilter($event)"
        v-for="(item, index) in tags"
        :isSelectedTag="isSelectedTag"
        :data="item"
        :key="index"
      />
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import TagQuery from './TagQuery.vue'
@Component({
  components: {
    TagQuery,
  },
})
export default class TagQueryList extends Vue {
  @Prop({ default: [] })
  private tags!: Array<any>

  @Prop({ default: false })
  private isSelectedTag!: Boolean

  @Prop({ default: true })
  private isModal!: true

   @Prop({ default: 'true' })
  private title!: string

  updateTagFilter(tag: any) {
    this.$emit("deleteQueryTag", tag)
  }
}
</script>
<style lang="scss">
.tags-container {
  padding: 10px 0;
  //background: #ebedef;
  &.selected-tags-container {
    padding: 0 !important;
    background: transparent;
  }
  .title {
    font-weight: bold;
  }
  .tags-wrapper {
    display: flex;
  }
}
</style>
