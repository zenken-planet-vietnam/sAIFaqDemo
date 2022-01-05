<template lang="">
    <div>
       <analytic-table-header :data="header"/>
        <div class="table-content">
          <b-table :fields="fields" :items="items" show-empty>
          <template #emptyfiltered="scope">
         <h4>{{ scope.emptyFilteredText }}</h4>
         </template>
        </b-table>
        </div>
    </div>
</template>
<script>
import { BTable } from "bootstrap-vue";
import AnalyticTableHeader from "./AnalyticTableHeader.vue";
export default {
  components: {
    BTable,
    AnalyticTableHeader,
  },
  props: {
    items: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      fields: [
        { key: "query", label: "Search term" },
        { key: "count_query", label: "queries" },
      ],
      header: {
        title: "Top Queries with no result",
        description: "No result queries",
        icon: "BoxIcon",
      },
    };
  },
};
</script>
<style lang="">
</style>