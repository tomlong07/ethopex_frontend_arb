<script setup lang="ts">
import { ICellRendererParams } from 'ag-grid-community'

const props = defineProps({
  params: {
    type: Object as () => ICellRendererParams,
    default: () => {},
    required: false,
  },
})
let showData = ''

try {
  if (props.params.data?.extra_data_handle) {
    showData = JSON.stringify(props.params.data?.extra_data_handle, null, 2)
  } else {
    showData = '-'
  }
} catch {}
</script>
<template>
  <div class="flex">
    {{ showData }}
  </div>
</template>
