<template lang="">
    <div class="pin" @click="pinChange" :class="{'pinned':isPin}">
          <feather-icon size="24" icon="StarIcon"/>
    </div>
</template>
<script>
export default {
  data() {
    return {
      isPin: false,
    };
  },
  props: {
    value: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    pinChange() {
      this.isPin = !this.isPin;
    },
  },
};
</script>
<style lang="scss" scoped >
.pin {
  color: gray;
  cursor: pointer;
  &.pinned {
    color: chocolate;
    svg {
      fill: chocolate;
    }
  }
}
</style>