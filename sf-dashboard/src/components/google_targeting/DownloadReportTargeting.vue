<script setup lang="ts">
import FileSaver from 'file-saver'

import { useTemplateV2 } from '@/store/templateV2Store'
import { ctr_daily_target } from '@/services/ctr_daily_target'
import ArrowDownload16Regular from '@/assets/icons/ArrowDownload16Regular.vue'

const templateV2Store = useTemplateV2(helper.truePath())()

const payload = computed(() => {
  return {
    filter: templateV2Store.filterList,
    sort: templateV2Store.sortInfoV2.sortNow,
    search: templateV2Store.search,
  }
})

const onDownload = async () => {
  const result = await ctr_daily_target.ExcelDownload(payload.value)

  if (!result || !result?.status === false) {
    window.message.error('Download failed')
    return
  }
  const data = new Blob([result], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8',
  })
  FileSaver.saveAs(data, 'report.xlsx')
}
</script>

<template>
  <div class="flex items-center mr-2">
    <n-tooltip trigger="hover">
      <template #trigger>
        <n-icon
          size="20"
          class="cursor-pointer hover:text-blue-500"
          @click="onDownload"
        >
          <ArrowDownload16Regular />
        </n-icon>
      </template>
      Export to Excel
    </n-tooltip>
  </div>
</template>
