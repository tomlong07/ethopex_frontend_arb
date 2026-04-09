<script setup lang="ts">
import Settings from '@/components/report-v3/modules/Settings.vue'
import ToggleChart from '@/components/report-v3/modules/ToggleChart.vue'
import AutoSync from '@/components/report-v3/modules/AutoSync.vue'
import ClearFilter from '@/components/report-v3/modules/ClearFilter.vue'
import { useReportV2 } from '@/store/report/report-v2'

const ReportSettingsModal = defineAsyncComponent(
  () => import('@/components/report-v3/ReportSettingsModal.vue')
)

const reportStoreV2 = useReportV2(helper.truePath())()

const showModalSettings = computed<boolean>(
  () => reportStoreV2.showModalSettings
)

watch(
  () => reportStoreV2.showModalSettings,
  (newValue) => {
    if (newValue) {
      reportStoreV2.isReload = false
      reportStoreV2.isReloadChart = false
    } else {
      if (reportStoreV2.isReload) {
        reportStoreV2.isReload = false
        reportStoreV2.updateClicked++
      }

      if (reportStoreV2.isReloadChart) {
        reportStoreV2.isReloadChart = false
        reportStoreV2.renderChartV2()
      }
    }
  }
)
</script>

<template>
  <div
    class="flex flex-wrap px-4 py-2 gap-2 report-child-wrapper custom-setting-report"
  >
    <Settings />
    <ToggleChart />
    <AutoSync />
    <ClearFilter />
    <div class="flex ml-auto items-center gap-2"></div>
    <!-- <ReportSettingsModal v-if="showModalSettings" /> -->
    <ReportSettingsModalV2 v-if="showModalSettings" />
  </div>
</template>
