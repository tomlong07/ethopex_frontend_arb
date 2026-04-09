<script setup lang="ts">
import { ICellRendererParams } from 'ag-grid-community'
import { CellFormaterCore } from '@/aggrid/cellv2'
const props = defineProps({
  params: {
    type: Object as () => ICellRendererParams,
    default: () => {},
    required: false,
  },
})

const formaterValue = computed(() => {
  return CellFormaterCore({
    type: 'currency-empty',
    value: props.params.value,
  })
})
</script>
<template>
  <div
    :class="`${
      props.params.value == 0
        ? ''
        : props.params.value < 0
        ? 'text-red-500'
        : 'text-green-500'
    }`"
  >
    {{ formaterValue }}
  </div>
</template>
