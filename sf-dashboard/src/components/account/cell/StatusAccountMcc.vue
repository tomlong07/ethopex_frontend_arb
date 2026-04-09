<template>
  <n-tag
    round
    class="cursor-pointer py-2 rounded"
    size="medium"
    :color="{
      color: colorNowV2(status).color,
      textColor: colorNowV2(status).textColor,
    }"
    type="primary"
  >
    {{ status.toUpperCase() }}
  </n-tag>
</template>

<script setup lang="ts">
import { ICellRendererParams } from 'ag-grid-community'

const props = defineProps<{
  params: ICellRendererParams
}>()

const status = props.params.value || 'unknown'

function colorNowV2(status: string) {
  const normalized = status.toLowerCase()
  switch (normalized) {
    case 'new':
      return { color: '#fcbf49', textColor: '#000000' } // vàng cảnh báo
    case 'success':
      return { color: '#52c41a', textColor: '#ffffff' } // xanh thành công
    default:
      return { color: '#d9d9d9', textColor: '#000000' } // mặc định xám
  }
}
</script>
