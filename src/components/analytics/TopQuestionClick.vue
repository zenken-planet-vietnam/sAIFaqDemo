<template lang="">
    <div>
       <analytic-table-header :data="header"/>
        <div class="table-content">
          <b-table :fields="fields" :items="items" show-empty>
          <template #table-colgroup="scope">
                <col
                v-for="field in scope.fields"
                :key="field.key"
                :style="{ width: field.key === 'count_click' ? '100px' : '' }"
                >
           </template>
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
        { key: "clicked_text", label: "Question Content" },
        { key: "count_click", label: "Clicks" },
      ],
      header: {
        title: "Top Question Click",
        description: "Frequently clicked questions",
        icon: "MousePointerIcon",
      },
    };
  },
};
</script>
<style lang="">
</style>