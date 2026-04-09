<script setup lang="ts">
import FileSaver from 'file-saver'

import ArrowDownload16Regular from '@/assets/icons/ArrowDownload16Regular.vue'
import { ctr_supply_account } from '@/services/ctr_supply_account'

const isDownloading = ref<boolean>(false)

const onDownloadAccountAd = async () => {
  isDownloading.value = true

  const result = await ctr_supply_account.ExportExcelAccountAd()

  if (result) {
    const data = new Blob([result], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8',
    })
    FileSaver.saveAs(data, 'account_ad.xlsx')
  }
}
</script>

<template>
  <div class="flex items-center">
    <n-tooltip trigger="hover">
      <template #trigger>
        <n-button text :disabled="isDownloading" @click="onDownloadAccountAd">
          <template #icon>
            <n-icon size="20" class="cursor-pointer hover:text-blue-500">
              <ArrowDownload16Regular />
            </n-icon>
          </template>
        </n-button>
      </template>
      Export Account Ad
    </n-tooltip>
  </div>
</template>
