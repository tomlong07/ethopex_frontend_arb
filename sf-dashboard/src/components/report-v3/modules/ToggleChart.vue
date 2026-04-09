<script setup lang="ts">
import { useReportV2 } from '@/store/report/report-v2'
import CellularData120Filled from '@/assets/icons/CellularData120Filled.vue'
import CellularOff24Filled from '@/assets/icons/CellularOff24Filled.vue'

const reportStoreV2 = useReportV2(helper.truePath())()

const changeVisibilityChartV2 = async () => {
  reportStoreV2.isShowChart = !reportStoreV2.isShowChart

  reportStoreV2.saveForNewPlk()

  if (!reportStoreV2.isShowChart) return
  if (helper.isEmpty(reportStoreV2.chartV2)) {
    reportStoreV2.addNewChartDefault()
  }

  await reportStoreV2.callReportChart()
  reportStoreV2.renderChartV2()
}
</script>

<template>
  <n-tooltip trigger="hover">
    <template #trigger>
      <div
        class="flex items-center flex-col cursor-pointer p-2 bg-gray-200 hover:bg-gray-300 rounded-md"
        @click="changeVisibilityChartV2"
      >
        <template v-if="reportStoreV2.isShowChart">
          <n-icon size="18" class="text-gray-500" color="#1E90FF">
            <CellularData120Filled />
          </n-icon>
        </template>
        <template v-else>
          <n-icon size="18" class="text-gray-500">
            <CellularOff24Filled />
          </n-icon>
        </template>
      </div>
    </template>
    <div class="flex flex-col">
      <div class="flex">
        {{ reportStoreV2.isShowChart ? 'Hidden chart' : 'Show chart' }}
      </div>
    </div>
  </n-tooltip>
</template>
