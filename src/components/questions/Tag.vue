<template lang="">
    <div class="tags-container" :class="{'selected-tags-container':isSelectedTag}"> 
        <span v-if="!isSelectedTag">
            {{"Popular key words:"}}
        </span>
        <div class="tags-wrapper">
            <div class="tag" @click="updateTagFilter(item)" v-for="item, index in tags" :key="index">
              <transition name="bounce">
              <div>
                 <span>{{isSelectedTag?`${item.text}`: `#${item.text}`}}</span>
                <div v-if="isSelectedTag" class="remove-tag">
                    <feather-icon size="12" icon="XIcon"/>
                </div>
              </div>
              </transition>
            </div>
        </div>
    </div>
</template>
<script>
export default {
  props: {
    tags: {
      type: Array,
      default: () => [],
    },
    isSelectedTag: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    updateTagFilter(tag) {
      this.$store.dispatch("page/updateTagFilter", {
        text: tag.text,
        isSelected: !this.isSelectedTag,
      });
    },
  },
};
</script>
<style lang="scss">
.bounce-enter-active {
  animation: bounce-in 0.5s;
}
.bounce-leave-active {
  animation: bounce-in 0.5s reverse;
}
@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.5);
  }
  100% {
    transform: scale(1);
  }
}
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