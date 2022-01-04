<template lang="">
    <div class="auto-complete-container">
        <b-form-input v-model="text" @keyup.enter="$emit('enter',$event)" autocomplete="true"  @keyup.delete="$emit('delete',$event)" ref="input" @blur="blur" @input="onTextChange" class="search-input" @focus="focus"  :placeholder="placeholder"/>
        <div v-if="isFocused&& autoCompleteData.length>0" class="auto-complete">
            <div class="auto-complete-item" v-for="item,index in autoCompleteData" :key="index" @mousedown="setText(item)">
                <span>{{item}}</span>
            </div>
        </div>
    </div>
    
</template>
<script>
import { BFormInput } from "bootstrap-vue";
export default {
  components: {
    BFormInput,
  },
  props: {
    placeholder: {
      type: String,
      default: "",
    },
    value: {
      type: String,
      default: "",
    },
  },
  watch: {
    text() {
      this.autoCompleteData =
        this.text.length > 0
          ? this.suggestText.filter(
              (x) => x.includes(this.text) && x !== this.text
            )
          : [];
    },
    value(newValue) {
      if (newValue !== this.text) this.text = newValue;
    },
  },
  data() {
    return {
      isFocused: false,
      suggestText: [
        "ticket is",
        "ticket for",
        "ticket and train",
        "fare is",
        "what is fare",
        "enough is",
      ],
      text: "",
      autoCompleteData: [],
    };
  },
  methods: {
    onTextChange(event) {
      this.$emit("input", event);
    },
    focus(event) {
      this.isFocused = true;
      this.$emit("focus", event);
    },
    blur() {
      this.isFocused = false;
    },
    setText(text) {
      this.$emit("input", text);
      this.$emit("enter");
    },
  },
};
</script>
<style lang="scss">
.auto-complete-container {
  position: relative;
  width: 100%;
}
.auto-complete {
  top: 40px;
  width: 100%;
  position: absolute;
  background: white;
  border: 1px solid lightgray;
  border-radius: 0.25rem;
  .auto-complete-item {
    padding: 5px 10px;
    &:hover {
      background: #f5f5f5;
    }
  }
}
</style>