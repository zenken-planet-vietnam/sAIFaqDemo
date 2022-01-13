<template lang="">
    <div>
     <apexchart height="300"  type="line" :options="data.chartOptions" :series="data.series"></apexchart>
   </div>
</template>
<script lang="ts">
import VueApexCharts from "vue-apexcharts";
import { Component, Vue, Prop } from "vue-property-decorator";
@Component({
  components: {
    apexchart: VueApexCharts,
  },
})
export default class LineChart extends Vue {
  option = {
    stroke: {
      show: true,
      curve: "smooth",
      lineCap: "butt",
      width: 2,
    },
  };

  @Prop({ default: null })
  private data!: Object;
}
</script>
<style lang="">
</style>