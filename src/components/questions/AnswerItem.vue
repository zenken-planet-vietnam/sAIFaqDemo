<template lang="">
    <div class="answer-item">
      <transition name="fade">
       <span>
           {{"-"}} {{data.text }}
        </span>
      </transition>
    </div>
</template>
<script>
export default {
  props: {
    data: {
      type: Object,
      default: () => null,
    },
  },
};
</script>
<style lang="scss">
.answer-item {
  transition: all 0.5s ease-in-out;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter,
.fade-leave-to
/* .fade-leave-active in <2.1.8 */ {
  opacity: 0;
}
</style>