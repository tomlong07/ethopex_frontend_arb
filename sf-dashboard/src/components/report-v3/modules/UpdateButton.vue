<script setup lang="ts">
import RotateRightSolid from '@/assets/icons/RotateRightSolid.vue'
import { useReportV2 } from '@/store/report/report-v2'

const reportStoreV2 = useReportV2(helper.truePath())()

const onUpdateReport = () => {
  reportStoreV2.isFetchingReport = true
  reportStoreV2.isLoadingChart = true

  reportStoreV2.updateClicked += 1

  console.log('repor', reportStoreV2.filter)
}
</script>
<template>
  <div class="flex flex-col gap-1">
    <div class="text-xs font-bold h-6 text-gray-500">&nbsp;</div>

    <n-button
      size="small"
      color="#f43f5e"
      :loading="reportStoreV2.isFetchingReport"
      @click="onUpdateReport"
    >
      <template #icon>
        <n-icon size="16">
          <RotateRightSolid />
        </n-icon>
      </template>
      Update
    </n-button>
  </div>
</template>
