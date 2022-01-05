<template lang="">
    <div>
       <analytic-table-header :data="header"/>
       <div class ="table-content">
        <b-table  responsive :fields="fields" :items="items">
          <template #table-colgroup="scope">
            <col
              v-for="field in scope.fields"
              :key="field.key"
              :style="{ width: field.key === 'action' ? '10px' : '' }"
            >
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
        description: "A view into queries happening right now.",
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