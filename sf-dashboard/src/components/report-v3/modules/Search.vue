<script setup lang="ts">
import { useReportV2 } from '@/store/report/report-v2'

const reportStoreV2 = useReportV2(helper.truePath())()
const onUpdateInput = () => {
  reportStoreV2.updateClicked += 1
}
</script>
<template>
  <div class="flex flex-col gap-1 w-36">
    <div class="text-xs font-bold h-6 text-gray-500">&nbsp;</div>

    <n-input
      size="small"
      v-model:value="reportStoreV2.search"
      type="text"
      placeholder="Searching"
      class="h-fit small-input-report"
      clearable
      @change="onUpdateInput"
    />
  </div>
</template>
