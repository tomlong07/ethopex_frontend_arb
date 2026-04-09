<script setup lang="ts">
import { ColumnItem } from '@/types/state/general'
import { ICellRendererParams } from 'ag-grid-community'

import { ctr_crawl_campaign } from '@/services/ctr_crawl_campaign'
import ArrowClockwise from '@/assets/icons/ArrowClockwise.vue'

const props = defineProps({
  params: {
    type: Object as () => ICellRendererParams,
    default: () => {},
    required: false,
  },
})

const options = (props.params as any).options as ColumnItem

const isRetry = ref(false)

const retryCrawl = async () => {
  if (!props.params.data?.id || !options.action) return

  isRetry.value = true

  const result = await ctr_crawl_campaign.ChangeStatus(options.action, {
    id: props.params.data.id,
    status: 'process',
  })

  if (result.status) {
    window.message.success('Retry success')
    const rowNode = props.params.node
    rowNode.setData({
      ...rowNode.data,
      status: 'process',
    })
  }

  isRetry.value = false
}
</script>
<template>
  <div
    class="flex gap-2 items-center"
    v-if="props.params.data?.status === 'error' && props.params.value"
  >
    <n-popover trigger="hover">
      <template #trigger>
        <n-button @click="retryCrawl()" :disabled="isRetry" text>
          <n-icon :component="ArrowClockwise" size="20"></n-icon>
        </n-button>
      </template>
      <span>Retry</span>
    </n-popover>

    <n-tooltip trigger="hover">
      <template #trigger>
        <span class="text-sm text-gray-700 truncate max-w-[270px]">
          {{ props.params.value }}
        </span>
      </template>
      {{ props.params.value }}
    </n-tooltip>
  </div>
</template>
