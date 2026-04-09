<script setup lang="ts">
import ReportErrorTable from '@/components/report_error/ReportErrorTable.vue'
import ReportErrorDate from '@/components/report_error/ReportErrorDate.vue'
import ReportErrorFilter from '@/components/report_error/ReportErrorFilter.vue'
import ReportErrorSelectTable from '@/components/report_error/ReportErrorSelectTable.vue'
import ReportChartError from '@/components/report_error/ReportChartError.vue'

import { useReportError } from '@/store/report-error'

const reportErrorStore = useReportError()
onMounted(async () => {
  reportErrorStore.initData()
})
</script>

<template>
  <div
    v-if="reportErrorStore.isSettingsLoaded"
    class="flex flex-col bg-base px-3 flex-1"
  >
    <div
      class="flex flex-col mt-6 justify-between relative bg-gray-100 report-group-by"
    >
      <ReportErrorDate />
      <ReportErrorFilter />
      <ReportErrorSelectTable />
    </div>

    <template
      v-if="!reportErrorStore.isChartView && !reportErrorStore.isTableView"
    >
      <div
        class="bg-white flex justify-center items-center h-96 text-gray-600 text-xl font-medium"
      >
        Please enable at least one view.
      </div>
    </template>

    <ReportChartError
      v-show="reportErrorStore.isChartView || reportErrorStore.isBothView"
    />
    <ReportErrorTable
      v-show="reportErrorStore.isTableView || reportErrorStore.isBothView"
    />
  </div>
</template>
