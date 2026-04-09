<script lang="ts" setup>
import { ref, onMounted, watch } from 'vue'
import Highcharts from 'highcharts'

import useReportTopList from '@/store/useReportTopList'
import noDataToDisplay from 'highcharts/modules/no-data-to-display'
noDataToDisplay(Highcharts)
const chartContainer = ref<Highcharts.Chart | null>(null)
const reportTopListStore = useReportTopList()
const props = defineProps<{
  report: {
    col?: any
    items: any[]
    isLoading: boolean
  }
  index: number
}>()

const emits = defineEmits(['saveChartBeforRender'])
const idChart = `chart-id-${props.report.col}` as any
const optionChart = computed((): Highcharts.Options => {
  return {
    chart: {
      type: 'pie',
      zooming: {
        type: 'xy',
      },
      panning: {
        enabled: true,
        type: 'xy',
      },
      panKey: 'shift',
      spacingBottom: 50,
    },
    accessibility: {
      enabled: false,
    },
    lang: {
      noData: 'No Data Report Chart',
    },
    noData: {
      style: {
        fontWeight: 'bold',
        fontSize: '14px',
        color: '#999',
      },
    },
    title: undefined,
    tooltip: {
      useHTML: true,
      formatter: function () {
        const point = this.point

        const yValue = reportTopListStore.makeValueAxistY(
          point.y,
          props.report.col
        )
        return `${point.name}<br>${yValue}`
      },
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: {
          enabled: true,
          formatter: function () {
            if (this.point.name === 'Other') {
              return 'Other'
            }
            return `(${this.point.percentage?.toFixed(1)}%)`
          },
        },
        showInLegend: true,
      },
    },
    legend: {
      useHTML: true,
      enabled: true,
      labelFormatter: function (this: Highcharts.Point | Highcharts.Series) {
        const point = this as Highcharts.Point

        const yValue = reportTopListStore.makeValueAxistY(
          point.y,
          props.report.col
        )

        return `<span style="color:${point.color}"></span>${
          point.name
        }<br>${yValue} - <strong>(${point.percentage?.toFixed(1)}%)</strong>`
      },
      padding: 20,
      maxHeight: 200,
      width: 'auto',
      itemMarginBottom: 4,
      verticalAlign: 'bottom',
      itemWidth: undefined,
      symbolPadding: 10,
      itemStyle: {
        fontWeight: 'normal',
        lineHeight: '1.4',
      },
      navigation: {
        arrowSize: 15,
      },
    },

    series: [
      {
        type: 'pie',
        name: 'Value',
        data: reportTopListStore.makeDataChart(
          props.report?.items,
          props.report.col
        ),
      },
    ],
    credits: {
      enabled: false,
    },
  }
})

const renderChart = () => {
  if (reportTopListStore.dataReport[props.index]?.isRender) return
  chartContainer.value = Highcharts.chart(idChart, optionChart.value)

  reportTopListStore.dataReport[props.index].isRender = true
  emits('saveChartBeforRender', {
    col: props.report.col,
    chart: chartContainer.value,
  })
}

onMounted(renderChart)

watch(() => reportTopListStore.dataReport, renderChart, { deep: true })

const findNameMetric = (value: any) => {
  return reportTopListStore.metricReportCols?.find((item) => item.key === value)
    ?.title
}

const reportTitle = computed(() => {
  const report = 'Report'
  const by = props.report.col ? `By ${findNameMetric(props.report.col)}` : ''
  return [report, by].filter(Boolean).join(' ')
})

const handleClose = () => {
  reportTopListStore.dataReport = reportTopListStore.dataReport?.filter(
    (item) => item.col !== props.report.col
  )
  reportTopListStore.reportConditions.cols =
    reportTopListStore.reportConditions.cols?.filter(
      (item) => item !== props.report.col
    )
}
</script>

<template>
  <n-card
    hoverable
    :closable="reportTopListStore.dataReport?.length > 1"
    @close="handleClose"
  >
    <template #header>
      <span> {{ reportTitle }} </span>
    </template>
    <div
      class="h-[600px] flex justify-center items-center"
      v-show="report.isLoading"
    >
      <n-spin size="medium" />
    </div>
    <div
      v-show="!report.isLoading"
      class="flex justify-start h-[600px]"
      :id="idChart"
    ></div>
  </n-card>
</template>
