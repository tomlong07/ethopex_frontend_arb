<script setup lang="ts">
import { ctr_traffic_source } from '@/services/ctr_traffic_source'
import { useTemplateV2 } from '@/store/templateV2Store'
const templateV2Store = useTemplateV2(helper.truePath())()

const isLoading = ref<boolean>(false)

const syncPagesNow = async () => {
  if (!templateV2Store.asyncConfigs.syncButton) return
  isLoading.value = true
  const result = await ctr_traffic_source.SyncFacebookPageV2(
    templateV2Store.asyncConfigs.syncButton
  )
  if (result?.status) {
    window.message.success('Sync Pages Success!')
    templateV2Store.reInitTable()
  }
  isLoading.value = false
}
//
</script>

<template>
  <n-button
    color="#f43f5e"
    size="small"
    :loading="isLoading"
    @click="syncPagesNow"
  >
    Sync Pages
  </n-button>
</template>
