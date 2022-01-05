<template lang="">
    <div v-if="overviewData" class="analytic card">
        <div class="title">
            {{'Analytics'}}
        </div>
        <b-row class="mt-2">
            <b-col md="4">
                <span class="font-weight-500">
                   {{productName}}
                </span>
            </b-col>
            <b-col class="filter" md="8">
                <page-filter @submit="submitFilter" :filter="filter"/>
            </b-col>
        </b-row>
       <b-row class="mt-3 total-overview">
           <b-col md="4">
               <overview-item v-for="item,index in overviewItems" :key="index" :item="item" />
           </b-col>
           <b-col md="8">
                <line-chart :data="lineChartOption"/>
           </b-col>
       </b-row>
       <b-row class="mt-3">
            <b-col md="6">
                <top-queries class="table-card" :items="overviewData.query.top_queries"/>
            </b-col>
            <b-col  md="6">
                <top-question-click class="table-card" :items="overviewData.click.question_click.top_clicks"/>
            </b-col>
       </b-row>
       <b-row class="mt-3">
          <b-col  md="6">
                <recent-queries class="table-card" :items="overviewData.query.recent_queries"/>
          </b-col>
          <b-col  md="6">
                <top-queries-no-result class="table-card" :items="[]"/>
          </b-col>
       </b-row>
    </div>
</template>
<script>
import { BRow, BCol } from "bootstrap-vue";
import {
  LineChart,
  Filter,
  OverviewItem,
  TopQueries,
  TopQuestionClick,
  RecentQueries,
  TopQueriesNoResult,
} from "./analytics";
import analyticMixin from "@core/mixins/analyticMixin";
export default {
  components: {
    BRow,
    BCol,
    OverviewItem,
    LineChart,
    TopQueries,
    TopQuestionClick,
    RecentQueries,
    TopQueriesNoResult,
    "page-filter": Filter,
  },
  mixins: [analyticMixin],
  computed: {
    //   get list overview data
    overviewItems() {
      return !this.overviewData
        ? []
        : [
            {
              title: "Total queries",
              value: this.overviewData.query.total_queries,
              variant: "light-success",
              icon: "SearchIcon",
            },
            {
              title: "Total queries with no result",
              value: this.overviewData.query.total_queries_no_results,
              variant: "light-danger",
              icon: "BoxIcon",
            },
            {
              title: "Total click to question",
              value: this.overviewData.click.question_click.total_click,
              variant: "light-info",
              icon: "TrendingUpIcon",
            },
          ];
    },
    // get chart data
    lineChartOption() {
      if (this.overviewData) {
        let option = {
          chartOptions: {
            chart: {
              id: "overview-chart",
            },
            xaxis: {
              categories: this.getListDate(this.start, this.end),
            },
            stroke: {
              show: true,
              curve: "smooth",
              lineCap: "butt",
              width: 2,
              dashArray: [0, 2, 0],
            },
            colors: ["#28c76f", "#ea5455", "#00cfe8"],
          },
          series: [
            {
              name: "total queries",
              data: this.overviewData.query.queries_per_day,
            },
            {
              name: "total queries with no result",
              data: this.overviewData.query.queries_no_result_per_day,
            },
            {
              name: "total click to question",
              data: this.overviewData.click.question_click.click_per_day,
            },
          ],
        };
        return option;
      }
      return null;
    },
  },

  data() {
    return {
      filter: {
        start: null,
        end: null,
      },
      start: null,
      end: null,
      timeOfDay: 24 * 60 * 60 * 1000,
      productName: " Product demo",
    };
  },
  created() {
    this.$store.dispatch("analytic/getOverviewData");
    this.setDefaultIFilter();
  },
  methods: {
    //   set default start time,end time
    setDefaultIFilter() {
      this.filter.end = new Date();
      this.filter.start = new Date(
        this.filter.end.getTime() - 6 * this.timeOfDay
      );
      this.start = this.filter.start;
      this.end = this.filter.end;
    },
    // get list date from start to end date
    getListDate(start, end) {
      if (!(start instanceof Date)) start = new Date(start);
      if (!(end instanceof Date)) end = new Date(end);
      let items = [this.getDateFormat(start)];
      let newDate = new Date(start.getTime() + this.timeOfDay);
      while (newDate < end) {
        items.push(this.getDateFormat(newDate));
        newDate = new Date(newDate.getTime() + this.timeOfDay);
      }
      return items;
    },
    // get date format d/m
    getDateFormat(date) {
      return `${date.getDate()}/${date.getMonth() + 1}`;
    },
    // submit filter
    submitFilter() {
      this.start = this.filter.start;
      this.end = this.filter.end;
    },
  },
};
</script>
<style lang="scss">
.analytic {
  .title {
    font-size: 21px;
    font-weight: 600;
  }
  .table-card {
    background: #fafbfd;
    padding: 1rem;
    border-radius: 0.5rem;
    height: 100%;
    .table-content {
      max-height: 250px;
      overflow: auto;
    }
  }
}
</style>