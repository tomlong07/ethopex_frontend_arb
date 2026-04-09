<script setup lang="ts">
import { ModeRp } from '@/options/final_report'
import { ICellRendererParams } from 'ag-grid-community'

const props = defineProps({
  params: {
    type: Object as () => ICellRendererParams,
    default: () => {},
    required: false,
  },
})

const value =
  ModeRp.find((option) => option.value === props.params.data.mode)?.label || ''
</script>
<template>
  <div class="truncate">{{ value }}</div>
</template>
