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
<script lang="ts">
import { BTable } from "bootstrap-vue";
import AnalyticTableHeader from "./AnalyticTableHeader.vue";
import { Component, Vue, Prop } from "vue-property-decorator";
@Component({
  components: {
    BTable,
    AnalyticTableHeader,
  },
})
export default class TopQueriesNoResult extends Vue {
  fields = [
    { key: "query", label: "Search term" },
    { key: "count_query", label: "Queries" },
  ];
  header = {
    title: "Top Queries with no result",
    description: "No result queries",
    icon: "BoxIcon",
  };
  @Prop({ default: [] })
  private items!: Array<any>;
}
</script>
<style lang="">
</style>