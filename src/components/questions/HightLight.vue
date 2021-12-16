<template lang="">
    <div v-html="htmlString" />
</template>
<script>
export default {
  props: {
    text: {
      type: String,
      default: "",
    },
    targets: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    htmlString() {
      if (!this.targets || !this.targets.length) {
        return this.text;
      }

      const patternStr = "(?:" + this.targets.join("|") + ")";
      const caseInsensitiveMatching = new RegExp(patternStr, "gi");
      return this.text.replace(
        caseInsensitiveMatching,
        (matched) => `<span class="hl">${matched}</span>`
      );
    },
  },
};
</script>
<style lang="scss" scoped>
/deep/ .hl {
  background: red;
}
</style>