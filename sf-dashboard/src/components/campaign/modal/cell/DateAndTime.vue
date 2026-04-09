<script setup lang="ts">
import { ICellRendererParams } from 'ag-grid-community'

const props = defineProps({
  params: {
    type: Object as () => ICellRendererParams,
    default: () => {},
    required: false,
  },
})
</script>
<template>
  <div
    class="flex items-center"
    :title="`Event time: ${props.params.data?.event_time || '-'}`"
  >
    {{ props.params.data?.date_time_in_timezone || '-' }}
  </div>
</template>
