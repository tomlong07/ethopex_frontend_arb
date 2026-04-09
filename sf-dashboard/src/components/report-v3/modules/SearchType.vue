<script setup lang="ts">
import { useReportV2 } from '@/store/report/report-v2'

const reportStoreV2 = useReportV2(helper.truePath())()

const isLoading = ref<boolean>(false)

onMounted(async () => {
  isLoading.value = true
  await reportStoreV2.fetchSearchTypeOptions()
  isLoading.value = false
})
</script>

<template>
  <div class="flex flex-col gap-1 w-28">
    <div class="text-xs font-bold h-6 text-gray-500">Search By</div>
    <n-select
      size="small"
      class="small-select-dropdown"
      :menu-props="{ class: 'small-select-dropdown' }"
      :loading="isLoading"
      placeholder="Default"
      v-model:value="reportStoreV2.searchType"
      :options="reportStoreV2.searchTypeOptions"
      :consistent-menu-width="false"
    />
  </div>
</template>
