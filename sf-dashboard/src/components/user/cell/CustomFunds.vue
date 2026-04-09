<script setup lang="ts">
import { ICellRendererParams } from 'ag-grid-community'

const props = defineProps({
  params: {
    type: Object as () => ICellRendererParams,
    default: () => {},
    required: false,
  },
})

const fundLabel = computed<string>(() => {
  const result = props.params.value
  return result
})
const compareFunds = (value: string) => {
  const numValue = parseFloat(value.replace(/\$/g, ''))
  if (numValue > 0) {
    return 'text-green-500'
  } else if (numValue < 0) {
    return 'text-red-500'
  } else {
    return '$0'
  }
}
</script>
<template>
  <span :class="compareFunds(fundLabel)">
    {{ fundLabel === '0' ? '$0' : fundLabel }}
  </span>
</template>
