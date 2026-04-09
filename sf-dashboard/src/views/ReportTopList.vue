<script setup lang="ts">
const TopByDimension = defineAsyncComponent(
  () => import('@/components/report_top_list/TopByDimension.vue')
)

const TopByMetric = defineAsyncComponent(
  () => import('@/components/report_top_list/TopByMetric.vue')
)

const TopGroupFilter = defineAsyncComponent(
  () => import('@/components/report_top_list/TopGroupFilter.vue')
)

const TopLimit = defineAsyncComponent(
  () => import('@/components/report_top_list/TopLimit.vue')
)

import ChartReport from '@/components/report_top_list/ChartReport.vue'
import TopReportFilter from '@/components/report_top_list/TopReportFilter.vue'
import { useReportV2 } from '@/store/report/report-v2'
import useReportTopList from '@/store/useReportTopList'

const reportTopListStore = useReportTopList()
const reportStoreV2 = useReportV2(helper.truePath())()

const getListFilters = async () => {
  await reportStoreV2.fetchFilterOpts('/report/filter/opts', {
    path_url: '/',
  })
  reportStoreV2.reportFilterOpts.loading = false
}

onMounted(async () => {
  await getListFilters()

  await reportTopListStore.initData()

  Object.assign(
    reportStoreV2.filter,
    reportTopListStore.reportConditions.filter as any
  )
})

const gridColsClass = computed(() => {
  const length = reportTopListStore.dataReport?.length || 1
  return length <= 2 ? `grid-cols-${length}` : 'grid-cols-1 md:grid-cols-2'
})

let chartInstances: { col: string; chart: Highcharts.Chart }[] = []

const saveChartBeforRender = ({
  col,
  chart,
}: {
  col: string
  chart: Highcharts.Chart
}) => {
  const idx = chartInstances.findIndex((c) => c.col === col)
  if (idx === -1) {
    chartInstances.push({ col, chart })
  } else {
    chartInstances[idx].chart = chart
  }
  chartInstances = chartInstances.filter((item) =>
    reportTopListStore.reportConditions.cols?.includes(item.col)
  )

  chartInstances.forEach((c) => c.chart.reflow())
}
</script>

<template>
  <div class="flex flex-col px-3 flex-1 custom-bg-top-list-rp">
    <div
      class="flex flex-col mt-4 justify-between relative bg-gray-100 border report-container-wrapper"
    >
      <TopGroupFilter />
      <TopReportFilter page-type="report-top" />
      <TopByDimension />
      <TopByMetric />
      <div
        class="flex items-center justify-between p-2 mx-2 border-t border-gray-200"
      >
        <TopLimit />
      </div>
    </div>

    <div class="grid gap-4 mt-5" :class="gridColsClass">
      <ChartReport
        v-for="(item, index) in reportTopListStore.dataReport"
        :key="index"
        :report="item"
        :index="index"
        @save-chart-befor-render="saveChartBeforRender"
      />
    </div>
  </div>
</template>
