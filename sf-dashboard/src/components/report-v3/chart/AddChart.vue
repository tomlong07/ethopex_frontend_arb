<script setup lang="ts">
import PlusSmall from '@/assets/icons/PlusSmall.vue'
import { useReportV2 } from '@/store/report/report-v2'

const reportStoreV2 = useReportV2(helper.truePath())()

const handleAddNewChart = () => {
  reportStoreV2.addNewChartV2()
  reportStoreV2.renderChartV2()
}
</script>

<template>
  <div class="flex justify-center items-center gap-4 custom-add-chart-button">
    <n-button
      :disabled="reportStoreV2.isMaxChart"
      class="p-2"
      round
      @click="handleAddNewChart()"
    >
      Add Chart
      <n-icon size="18" class="text-gray-500">
        <PlusSmall />
      </n-icon>
    </n-button>
  </div>
</template>
