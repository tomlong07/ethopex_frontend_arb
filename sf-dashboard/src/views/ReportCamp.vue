<script setup lang="ts">
import ReportCampTable from '@/components/report-campaign/ReportCampTable.vue'
import ReportCampDate from '@/components/report-campaign/ReportCampDate.vue'
import ReportCampFilter from '@/components/report-campaign/ReportCampFilter.vue'
import ReportCampGroupBy from '@/components/report-campaign/ReportCampGroupBy.vue'
import { useReportCamp } from '@/store/report-camp'

const reportCampStore = useReportCamp()

onMounted(async () => {
  await reportCampStore.initData(helper.truePath())
})
</script>

<template>
  <div class="flex flex-col bg-white px-3 flex-1">
    <div
      class="flex flex-col my-3 justify-between relative bg-base report-group-by border rounded-md"
    >
      <ReportCampDate />
      <ReportCampFilter />
      <ReportCampGroupBy />
    </div>
    <ReportCampTable />
  </div>
</template>
