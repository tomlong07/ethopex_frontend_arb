<script setup lang="ts">
import { ChartItemV2, useReportV2 } from '@/store/report/report-v2'
import DefaultChart from '@/assets/icons/DefaultChart.vue'
import ChartTypeComp from './chart/ChartTypeComp.vue'
import AddChart from './chart/AddChart.vue'
const reportStoreV2 = useReportV2(helper.truePath())()

watch(
  () => reportStoreV2.updateClicked,
  async (newValue) => {
    if (newValue) {
      if (!reportStoreV2.isShowChart) return

      await reportStoreV2.callReportChart()
      reportStoreV2.renderChartV2()
    }
  }
)

const isEmptyChart = (chart: ChartItemV2) => {
  return !chart.series || helper.isEmpty(chart.series)
}
</script>

<template>
  <div
    v-if="reportStoreV2.isShowChart"
    class="flex justify-between p-2 report-child-wrapper bg-white"
  >
    <div class="w-full mt-10">
      <div
        class="flex flex-wrap gap-4"
        :style="{
          'justify-content':
            reportStoreV2.reportSettingsNew.widthOfChart !== 100 &&
            !reportStoreV2.isOneChart
              ? 'flex-start'
              : 'center',
          gap: '16px',
        }"
      >
        <div
          v-for="(chart, chartKey) in reportStoreV2.chartV2"
          :key="chartKey"
          class="relative custom-default-chart-dark-mode"
          :style="{
            width:
              reportStoreV2.reportSettingsNew.widthOfChart !== 100
                ? 'calc(50% - 8px)'
                : '100%',
            boxSizing: 'border-box',
            minHeight: '300px',
          }"
        >
          <div
            v-if="
              chart.loading ||
              (!chart.loading &&
                !chart.colSelected.column?.length &&
                !chart.colSelected.spline?.length) ||
              isEmptyChart(chart)
            "
            class="flex flex-col items-center justify-center pl-2 pr-2 bg-gradient-to-r from-gray-50 to-gray-100 min-h-[300px]"
            :class="{ 'animate-pulse': chart.loading }"
          >
            <DefaultChart />

            <div
              class="text-xl font-semibold text-gray-600"
              v-if="!chart.loading"
            >
              {{
                isEmptyChart(chart)
                  ? `No Data Available`
                  : `Please select data to display the chart!!`
              }}
            </div>
          </div>

          <div
            v-else
            :id="String(chartKey)"
            class="w-full min-h-[300px] mb-5 chart-container"
          ></div>

          <ChartTypeComp :chart="chart" :chartKey="chartKey" />
        </div>
      </div>

      <AddChart />
    </div>
  </div>
</template>

<style lang="scss">
@use '@/css/ReportChart.scss';
</style>
