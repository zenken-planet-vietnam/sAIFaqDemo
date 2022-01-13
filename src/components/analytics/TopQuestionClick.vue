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
export default class TopQuestionClick extends Vue {
  fields = [
    { key: "clicked_text", label: "Question Content" },
    { key: "count_click", label: "Clicks" },
  ];
  header = {
    title: "Top Question Click",
    description: "Frequently clicked questions",
    icon: "MousePointerIcon",
  };
  @Prop({ default: null })
  private items!: Array<any>;
}
</script>
<style lang="">
</style>