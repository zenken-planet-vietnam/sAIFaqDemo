<template lang="">
  <div class="image-tag-container">
    <div v-for="(item, index) in data" :key="index" class="image-tag-wrapper">
      <div class="title">{{ item.title }}</div>
      <div class="image-tag-content">
        <div v-for="(tag, tindex) in item.tags" :key="tindex" @click="selectedTag(tag)" class="image-tag">
          <img :src="imgSrc(tag.icon)" />
          <div class="separator"></div>
          <div class="content">{{ tag.displayText }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { PageModule } from '@/store/modules/page'
import { Component, Vue, Prop } from 'vue-property-decorator'
@Component({})
export default class ImageTag extends Vue {
  @Prop({ default: [] })
  private data!: any

  @Prop({ default: false })
  private isSelectedTag!: Boolean

  imgSrc(icon: any) {
    return require(`@/assets/tag/${icon}`)
  }

  selectedTag(imageTag:any){
    PageModule.selectedImageTag({text: imageTag.displayText.toLowerCase()})
  }
}
</script>
<style lang="scss">
.image-tag-container {
  .image-tag-wrapper {
    .title {
      font-weight: bold;
    }
    .image-tag-content {
      display: flex;
      flex-wrap: wrap;
      .image-tag {
        cursor: pointer;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 6px;
        color: #1d9bf0;
        font-weight: bold;
        font-size: 14px;
        border: 1px solid #1d9bf0;
        //background: #138d75;
        padding: 0.5rem;
        margin: 5px;
        .separator {
          height: 16px;
          width: 1px;
          background: #1d9bf0;
          margin: 2px;
        }
        img {
          width: 24px;
        }
      }
    }
  }
}
</style>
