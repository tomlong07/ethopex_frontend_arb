<template>
  <div class="bg-white shadow-sm p-4 mt-2 mb-2">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-semibold text-gray-800">
        Error Trends Over Time
      </h3>
    </div>

    <n-spin
      v-if="reportErrorStore.isLoadingChart"
      size="large"
      description="Loading chart data..."
      class="h-96 flex items-center justify-center"
    />

    <div v-else>
      <template v-if="reportErrorStore.chartData.length === 0">
        <div
          class="flex flex-col justify-center items-center h-96 w-96 mx-auto"
        >
          <DefaultChart />
          <div class="text-gray-500 text-lg font-medium mt-2">No Data</div>
        </div>
      </template>
      <template v-else>
        <div
          :id="reportErrorStore.chartId"
          style="height: 400px"
          class="chart-container custom-dark-mode-chart"
        ></div>

        <div class="grid grid-cols-4 gap-4 mt-4 pt-4 border-t border-gray-200">
          <div class="text-center">
            <div class="text-2xl font-bold text-red-500">
              {{ formatData(totalErrors) }}
            </div>
            <div class="text-sm text-gray-600">Total Errors</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-orange-500">
              {{ formatData(avgErrorsPerHour) }}
            </div>
            <div class="text-sm text-gray-600">Avg/{{ intervalText }}</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-green-500">{{ peakTime }}</div>
            <div class="text-sm text-gray-600">Peak {{ intervalText }}</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-blue-500">
              {{ formatData(peakErrors) }}
            </div>
            <div class="text-sm text-gray-600">Peak Errors</div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import DefaultChart from '@/assets/icons/DefaultChart.vue'
import { useReportError } from '@/store/report-error'

const reportErrorStore = useReportError()

const intervalText = computed(() => {
  switch (reportErrorStore.reportParams.interval) {
    case 'hour':
      return 'Hour'
    case 'day':
      return 'Day'
    case 'week':
      return 'Week'
    case 'month':
      return 'Month'
    case 'quarter':
      return 'Quarter'
    default:
      return 'Hour'
  }
})

const formatData = (value: number, precision: number = 0): string => {
  return (
    value?.toLocaleString(undefined, { maximumFractionDigits: precision }) ||
    '0'
  )
}

// Statistics computeds
const totalErrors = computed(() => {
  const series = reportErrorStore.processedChartData.series
  const totalErrorData = series.total_error_count || []
  return totalErrorData.reduce(
    (sum: number, val: number) => sum + (val || 0),
    0
  )
})

const avgErrorsPerHour = computed(() => {
  const series = reportErrorStore.processedChartData.series
  const totalErrorData = series.total_error_count || []
  return totalErrorData.length > 0
    ? Math.round(totalErrors.value / totalErrorData.length)
    : 0
})

const peakTime = computed(() => {
  const series = reportErrorStore.processedChartData.series
  const totalErrorData = series.total_error_count || []
  const xAxis = reportErrorStore.processedChartData.xAxis || []

  if (totalErrorData.length === 0) return 'N/A'

  const maxValue = Math.max(...totalErrorData)
  const maxIndex = totalErrorData.indexOf(maxValue)
  return xAxis[maxIndex] || 'N/A'
})

const peakErrors = computed(() => {
  const series = reportErrorStore.processedChartData.series
  const totalErrorData = series.total_error_count || []
  return totalErrorData.length > 0 ? Math.max(...totalErrorData) : 0
})
watch(
  () => reportErrorStore.updateClicked,
  async (isFetching) => {
    if (!isFetching) return

    if (reportErrorStore.isBothView || reportErrorStore.isChartView) {
      await reportErrorStore.fetchReportErrChart()
    }
  }
)

onMounted(async () => {
  if (reportErrorStore.isBothView || reportErrorStore.isChartView) {
    await reportErrorStore.fetchReportErrChart()
  }
})

onUnmounted(() => {
  reportErrorStore.destroyChart()
})
</script>
