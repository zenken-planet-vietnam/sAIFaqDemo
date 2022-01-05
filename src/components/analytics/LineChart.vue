<template lang="">
    <div>
     <apexchart height="300"  type="line" :options="data.chartOptions" :series="data.series"></apexchart>
   </div>
</template>
<script>
import VueApexCharts from "vue-apexcharts";
export default {
  components: {
    apexchart: VueApexCharts,
  },
  props: {
    data: {
      type: Object,
      default: () => null,
    },
  },

  //   computed: {
  //     chartOptions() {
  //       return this.data ? { ...this.data.chartOptions, ...this.option } : null;
  //     },
  //   },
  data() {
    return {
      option: {
        stroke: {
          show: true,
          curve: "smooth",
          lineCap: "butt",
          width: 2,
        },
      },
    };
  },
};
</script>
<style lang="">
</style>