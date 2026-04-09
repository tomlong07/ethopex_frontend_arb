<script setup lang="ts">
import { ICellRendererParams } from 'ag-grid-community'

const props = defineProps({
  params: {
    type: Object as () => ICellRendererParams,
    default: () => {},
    required: false,
  },
})

let value = props.params.value

try {
  value = JSON.parse(value)
} catch {}
</script>
<template>
  <div class="flex flex-col leading-tight">
    <span>{{ value?.name || 'N/A' }}</span
    ><span class="text-xs text-gray-500">{{ value?.id }}</span>
  </div>
</template>
