<template lang="">
    <div class="filter-container">
      <div class="input-wrapper">
           <b-row class="w-100">
                <b-col md="6">
                   <b-form-datepicker 
                     placeholder="Select date"
                     v-model="filter.start"
                      :date-format-options="dateFormat"
                    />
                </b-col>
                <b-col md="6">
                    <b-form-datepicker 
                     placeholder="Select date"
                     v-model="filter.end"
                     :date-format-options="dateFormat"
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
import { BButton, BFormDatepicker } from "bootstrap-vue";
import { Component, Vue, Prop } from "vue-property-decorator";
@Component({
  components: {
    BButton,
    BFormDatepicker,
  },
})
export default class Filer extends Vue {
  dateFormat = { year: "numeric", month: "numeric", day: "numeric" };
  config = {
    allowInput: true,
    dateFormat: "Y/m/d",
  };

  @Prop({ default: null })
  private filter!: object;
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