<script setup lang="ts">
import { SelectOption } from 'naive-ui'
import { ctr_traffic_source } from '@/services/ctr_traffic_source'
import { useCrawlTaboolaTemplate } from '@/store/details/crawlTaboolaTemplate'
import FloatingWrapper from '../common/FloatingWrapper.vue'

const crawlTaboolaTemplateStore = useCrawlTaboolaTemplate()
const isLoading = ref<boolean>(false)
const devicesOptions = ref<SelectOption[]>([])

const deviceOptionsShow = computed(() =>
  devicesOptions.value.map((device) => ({
    ...device,
    disabled: shouldDisableOption(String(device.value)),
  }))
)

const shouldDisableOption = (value: string) => {
  const selected = crawlTaboolaTemplateStore.crawlDataTemplate.device || []
  return selected.includes('ALL')
    ? value !== 'ALL'
    : value === 'ALL' && selected.length > 0
}

const handleDeviceChange = (value: string[]) => {
  if (value.includes('ALL')) {
    crawlTaboolaTemplateStore.crawlDataTemplate.device = ['ALL']
    return
  }
  crawlTaboolaTemplateStore.crawlDataTemplate.device = value
}

onMounted(async () => {
  isLoading.value = true
  try {
    const { data } = await ctr_traffic_source.GetDevice('taboola')
    devicesOptions.value = data?.devices || []
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <FloatingWrapper :name="'Device'" required>
    <n-select
      v-model:value="crawlTaboolaTemplateStore.crawlDataTemplate.device"
      multiple
      filterable
      value-field="value"
      label-field="name"
      :loading="isLoading"
      :options="deviceOptionsShow"
      @update:value="handleDeviceChange"
    />
  </FloatingWrapper>
</template>
