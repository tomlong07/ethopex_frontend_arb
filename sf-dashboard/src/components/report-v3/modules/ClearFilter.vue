<script setup lang="ts">
import TrashAltRegular from '@/assets/icons/TrashAltRegular.vue'
import { useReportV2 } from '@/store/report/report-v2'

const reportStoreV2 = useReportV2(helper.truePath())()
const clearFilter = () => {
  reportStoreV2.resetFilter()
  reportStoreV2.group_by = ['campaign']
}
</script>

<template>
  <n-tooltip trigger="hover">
    <template #trigger>
      <div
        class="flex items-center flex-col cursor-pointer p-2 bg-gray-200 hover:bg-gray-300 rounded-md"
        @click="clearFilter"
      >
        <n-icon size="18" class="text-gray-500">
          <TrashAltRegular />
        </n-icon>
      </div>
    </template>
    <div class="flex flex-col">
      <div class="flex">Clear All filter</div>
    </div>
  </n-tooltip>
</template>
