<template lang="">
    <div>
       <analytic-table-header :data="header"/>
       <div class="table-content">
            <b-table :fields="fields" :items="items">
                <template #table-colgroup="scope">
                    <col
                    v-for="field in scope.fields"
                    :key="field.key"
                    :style="{ width: field.key === 'count_query' ? '100px' : '' }"
                    >
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
        title: "Top Queries",
        description: "Frequently searched queries",
        icon: "SearchIcon",
      },
    };
  },
};
</script>
<style lang="">
</style>