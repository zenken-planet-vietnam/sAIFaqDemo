<template lang="">
    <div v-html="htmlString" />
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
@Component({})
export default class HighLight extends Vue {
  @Prop({ default: "" })
  private text!: String;
  @Prop({ default: "" })
  private targets!: Array<any>;
  @Prop({default: "red"})
  private textColor!: String;

  // get text highlight
  get htmlString() {
    if (!this.targets || !this.targets.length) {
      return this.text;
    }
    const patternStr = "(?:" + this.targets.join("|") + ")";
    const caseInsensitiveMatching = new RegExp(patternStr, "gi");
    const style = `background: ${this.textColor};`
    return this.text.replace(
      caseInsensitiveMatching,
      (matched) => `<span style="${style}" class="hl">${matched}</span>`
    );
  }
}
</script>
<style lang="scss" scoped>
</style>
