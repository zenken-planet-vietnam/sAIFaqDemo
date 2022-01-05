<template lang="">
    <div>
       <analytic-table-header :data="header"/>
       <div class ="table-content">
        <b-table  responsive :fields="fields" :items="items" show-empty>
           <template #emptyfiltered="scope">
         <h4>{{ scope.emptyFilteredText }}</h4>
         </template>
          <template #table-colgroup="scope">
  <col
    v-for="field in scope.fields"
    :key="field.key"
    :style="{ width: field.key === 'action' ? '10px' : '' }"
  />
</template>
            
          <template #cell(action)>
  <div class="action">
    <feather-icon size="16" icon="EyeIcon" />
  </div>
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
        { key: "count_result", label: "queries" },
        { key: "action", label: "" },
      ],
      header: {
        title: "Recent Queries",
        description: "Recently searched queries",
        icon: "ActivityIcon",
      },
    };
  },
};
</script>
<style lang="scss">
.action {
  width: 50px;
  color: gray;
}
</style>