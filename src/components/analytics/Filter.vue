<template lang="">
    <div class="filter-container">
      <div class="input-wrapper">
           <b-row class="w-100">
                <b-col md="6">
                    <flat-pickr
                        placeholder="Select date"
                        class="form-control"
                        :config="config"
                        v-model="filter.start"
                        />
                </b-col>
                <b-col md="6">
                    <flat-pickr
                        placeholder="Select date"
                        class="form-control"
                        :config="config"
                        v-model="filter.end"
                        />
                </b-col>
            </b-row>
      </div>
        <div class="button-wrapper">
            <b-button @click="$emit('submit')"  variant="primary">
                <span>Filter</span>
            </b-button>
        </div>
    </div>
</template>
<script lang="ts">
import flatPickr from "vue-flatpickr-component";
import { BButton } from "bootstrap-vue";
import "flatpickr/dist/flatpickr.css";
import { Component, Vue, Prop } from "vue-property-decorator";
@Component({
  components: {
    flatPickr,
    BButton,
  },
})
export default class Filer extends Vue {
  @Prop({ default: null })
  private filter!: object;

  config = {
    allowInput: true,
    dateFormat: "Y/m/d",
  };
}
</script>
<style lang="scss" scoped>
.filter-container {
  display: flex;
  flex-direction: row;
  .input-wrapper {
    display: flex;
    flex: 1;
  }
  .button-wrapper {
    display: flex;
    flex: 0 0 auto;
  }
}
</style>