<script setup lang="ts">
import { ICellRendererParams } from 'ag-grid-community'

const props = defineProps({
  params: {
    type: Object as () => ICellRendererParams,
    default: () => {},
    required: false,
  },
})
const status = props.params.data.status
const statusClass = status === 'on' ? 'text-green-500' : 'text-red-500'
</script>

<template>
  <span class="text-xs font-semibold opacity-70 uppercase" :class="statusClass">
    {{ status }}
  </span>
</template>
