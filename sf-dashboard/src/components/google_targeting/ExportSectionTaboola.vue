<script setup lang="ts">
import FileSaver from 'file-saver'

import { ctr_google_targeting } from '@/services/ctr_google_targeting'
import { useTemplateV2 } from '@/store/templateV2Store'
import ArrowDownload16Regular from '@/assets/icons/ArrowDownload16Regular.vue'

const templateV2Store = useTemplateV2(helper.truePath())()

const onDownloadSection = async () => {
  if (!templateV2Store.filterList?.type) {
    window.message.error('Please select a filter type')

    return
  }

  const result = await ctr_google_targeting.ExportSectionTaboolaWithType(
    templateV2Store.filterList?.type
  )

  if (result) {
    const data = new Blob([result], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8',
    })
    FileSaver.saveAs(data, 'section.xlsx')
  }
}
</script>

<template>
  <div class="flex items-center">
    <n-tooltip trigger="hover">
      <template #trigger>
        <n-icon
          size="20"
          class="cursor-pointer hover:text-blue-500"
          @click="onDownloadSection"
        >
          <ArrowDownload16Regular />
        </n-icon>
      </template>
      Export Section Taboola
    </n-tooltip>
  </div>
</template>
