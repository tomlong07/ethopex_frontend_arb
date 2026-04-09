<script setup lang="ts">
import GroupBy from '@/components/report-supply-keyword/GroupBy.vue'
import Metrics from '@/components/report-supply-keyword/Metrics.vue'
import ReportSupplyFilter from '@/components/report-supply-keyword/ReportSupplyFilter.vue'
import ReportTable from '@/components/report-supply-keyword/ReportTable.vue'
import useReportSupplyKeyword from '@/store/useReportSupplyKeyword'

const reportSupplyKeywordStore = useReportSupplyKeyword()

onMounted(async () => {
  await reportSupplyKeywordStore.onUpdateReport()
})
</script>

<template>
  <div class="flex flex-col px-3 flex-1">
    <div
      class="flex flex-col mt-4 justify-between relative bg-gray-100 border report-container-wrapper"
    >
      <ReportSupplyFilter />
      <GroupBy />
      <Metrics />
      <ReportTable />
    </div>
  </div>
</template>
