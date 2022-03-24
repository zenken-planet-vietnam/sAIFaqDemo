<template lang="">
  <div v-if="overviewData" class="analytic card">
    <div class="title">
      {{ 'Statictics' }}
    </div>
    <b-row class="mt-2">
      <b-col md="4">
        <span class="font-weight-500">
          {{ productName }}
        </span>
      </b-col>
      <b-col class="filter" md="8">
        <page-filter @submit="submitFilter" :filter="filter" />
      </b-col>
    </b-row>
    <b-row class="mt-3 total-overview">
      <b-col md="4">
        <overview-item
          v-for="(item, index) in overviewItems"
          :key="index"
          :item="item"
        />
      </b-col>
      <b-col md="8">
        <line-chart :data="lineChartOption" />
      </b-col>
    </b-row>
    <b-row class="mt-3">
      <b-col md="6">
        <top-queries
          class="table-card"
          :items="overviewData.query.question_query.top_queries"
        />
      </b-col>
      <b-col md="6">
        <top-queries-no-result
          class="table-card"
          :items="overviewData.query.question_query.top_no_result_queries"
        />
      </b-col>
    </b-row>
    <b-row class="mt-3">
      <b-col md="6">
        <top-question-click
          class="table-card"
          :items="
            overviewData.click.question_click
              ? overviewData.click.question_click.top_clicks
              : []
          "
        />
      </b-col>
      <b-col md="6">
        <recent-queries
          class="table-card"
          :items="overviewData.query.question_query.recent_queries"
        />
      </b-col>
    </b-row>
  </div>
</template>
<script lang="ts">
import { BRow, BCol } from 'bootstrap-vue'
import {
  LineChart,
  Filter,
  OverviewItem,
  TopQueries,
  TopQuestionClick,
  RecentQueries,
  TopQueriesNoResult,
} from '@/components/analytics'
import AnalyticMixin from '@/@core/mixins/analyticMixin'
import { Component } from 'vue-property-decorator'
import { mixins } from 'vue-class-component'
import { AnalyticModule } from '@/store/modules/analytic'
@Component({
  components: {
    BRow,
    BCol,
    OverviewItem,
    LineChart,
    TopQueries,
    TopQuestionClick,
    RecentQueries,
    TopQueriesNoResult,
    'page-filter': Filter,
  },
})
export default class Analytic extends mixins(AnalyticMixin) {
  filter: any = {
    start: null,
    end: null,
  }
  start: any = null
  end: any = null
  timeOfDay = 24 * 60 * 60 * 1000
  productName = ' Product demo'
  //   get list overview data
  get overviewItems() {
    return !this.overviewData
      ? []
      : [
          {
            title: 'Total queries',
            value:
              this.overviewData.query.question_query.total_queries[0].value,
            variant: 'light-success',
            icon: 'SearchIcon',
          },
          {
            title: 'Total queries with no result',
            value:
              this.overviewData.query.question_query.total_queries_no_results[0]
                .value,
            variant: 'light-danger',
            icon: 'BoxIcon',
          },
          {
            title: 'Total questions clicked',
            value: this.overviewData.click.question_click.total_clicks[0].value,
            variant: 'light-info',
            icon: 'TrendingUpIcon',
          },
        ]
  }
  // get chart data
  get lineChartOption() {
    if (this.overviewData) {
      let option = {
        chartOptions: {
          chart: {
            id: 'overview-chart',
            toolbar: {
              show: false,
            },
          },
          xaxis: {
            categories: this.getListDate(this.start, this.end),
            tickAmount: this.getTickAmount(this.start, this.end),
          },
          stroke: {
            show: true,
            curve: 'smooth',
            lineCap: 'butt',
            width: 2,
            dashArray: [0, 2, 0],
          },
          colors: ['#28c76f', '#ea5455', '#00cfe8'],
        },
        series: [
          {
            name: 'total queries',

            data: this.getDataPerDate(
              this.overviewData.query.question_query.queries_per_day,
              this.start,
              this.end
            ),
          },
          {
            name: 'total queries with no result',
            data: this.getDataPerDate(
              this.overviewData.query.question_query.queries_no_result_per_day,
              this.start,
              this.end
            ),
          },
          {
            name: 'total questions clicked',
            data: this.getDataPerDate(
              this.overviewData.click.question_click.clicks_per_day,
              this.start,
              this.end
            ),
          },
        ],
      }
      return option
    }
    return null
  }
  // init
  created() {
    this.setDefaultIFilter()
    this.getData()
  }

  //   set default start time,end time
  public setDefaultIFilter() {
    this.filter.end = new Date()
    this.filter.start = new Date(this.filter.end.getTime() - 6 * this.timeOfDay)
    this.start = this.filter.start
    this.end = this.filter.end
  }
  // get list date from start to end date
  getListDate(start: Date, end: Date) {
    // if (!(start instanceof Date)) start = new Date(start);
    // if (!(end instanceof Date)) end = new Date(end);
    let items = [this.getDateFormatForChart(start)]
    let newDate = new Date(start.getTime() + this.timeOfDay)
    while (newDate < end) {
      items.push(this.getDateFormatForChart(newDate))
      newDate = new Date(newDate.getTime() + this.timeOfDay)
    }
    return items
  }

  getTickAmount(start: any, end: any) {
    const days = Math.abs((end - start) / (1000 * 3600 * 24)) + 1
    // > 6 month => space of 2 tick is month
    if(days >30*6) return days/30
    // > 6 month => space of 2 tick is week
    if (days > 30) return days/7
    // > 14 day => space of 2 tick is 2 day
    if (days > 14) return days/2
    // space of 2 tick is a day
    return days
  }
  // get date format d/m
  getDateFormatForChart(date: Date) {
    return `${date.getMonth() + 1}/${date.getDate()}`
  }
  formatDate(date: Date) {
    if (!(date instanceof Date)) return date
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
  }
  // submit filter
  submitFilter() {
    this.start = new Date(this.filter.start)
    this.end = new Date(this.filter.end)
    this.getData()
  }
  async getData() {
    this.$store.state.config.isLoading = true
    await AnalyticModule.getOverviewData({
      start_date: this.formatDate(this.start),
      end_date: this.formatDate(this.end),
      size: 20,
    })
    this.$store.state.config.isLoading = false
  }
  getDataPerDate(data: any, start: Date, end: Date) {
    start.setHours(0, 0, 0, 0)
    end.setHours(0, 0, 0, 0)
    let newDate = start
    let dataPerDate = []
    while (newDate <= end) {
      const dataCurrentDate = data.find(
        (x: any) => new Date(x.day).toDateString() === newDate.toDateString()
      )
      dataPerDate.push(dataCurrentDate ? dataCurrentDate.count : 0)
      newDate = new Date(newDate.getTime() + this.timeOfDay)
    }
    return dataPerDate
  }
}
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
