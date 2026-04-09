<script setup lang="ts">
import { ICellRendererParams } from 'ag-grid-community'

const props = defineProps({
  params: {
    type: Object as () => ICellRendererParams,
    default: () => {},
    required: false,
  },
})

let fullData: Record<string, any> = {}

try {
  fullData = JSON.parse(props.params.data?.extra_data || '{}')
} catch {
  fullData = {}
}
</script>
<template>
  <div class="flex flex-col">
    <div class="overflow-hidden text-ellipsis">
      {{ props.params.data?.translated_event_type || '-' }}
    </div>
    <div class="overflow-hidden text-ellipsis text-xs text-gray-400 py-2">
      {{ fullData?.type || '-' }}
    </div>
  </div>
</template>
