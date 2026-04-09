<script setup lang="ts">
import Filter from '@/components/report_log_payment/Filter.vue'
import ReportTable from '@/components/report_log_payment/ReportTable.vue'
import useGeneralStore from '@/store/useGeneralStore'

import useReportSupplyKeyword from '@/store/useReportSupplyKeyword'

const reportSupplyKeywordStore = useReportSupplyKeyword()
const generalStore = useGeneralStore()

onMounted(async () => {
  await reportSupplyKeywordStore.onUpdateReport()
})

const isDark = computed(() => generalStore.isDark)
</script>

<template>
  <div class="flex flex-col flex-1 px-3" :class="{ 'bg-gray-100': isDark }">
    <div class="flex flex-col items-center w-full">
      <div
        class="w-2/3 mt-4 border report-container-wrapper rounded-lg"
        :class="{ 'bg-gray-100': !isDark }"
      >
        <Filter />
      </div>

      <div class="w-2/3 mt-4">
        <ReportTable />
      </div>
    </div>
  </div>
</template>
