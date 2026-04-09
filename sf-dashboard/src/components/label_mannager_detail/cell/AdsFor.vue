<script setup lang="ts">
import { AdsForOptions } from '@/options/label_manager'
import { ICellRendererParams } from 'ag-grid-community'

const props = defineProps({
  params: {
    type: Object as () => ICellRendererParams,
    default: () => {},
    required: false,
  },
})

let label = props.params.value || ''

if (label) {
  label =
    AdsForOptions.find((item) => item.value === props.params.value)?.label ||
    label
}
</script>

<template>
  <div class="truncate">{{ label }}</div>
</template>
