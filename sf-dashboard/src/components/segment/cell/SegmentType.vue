<script setup lang="ts">
import { ICellRendererParams } from 'ag-grid-community'
import { SelectOption } from 'naive-ui'

const props = defineProps({
  params: {
    type: Object as () => ICellRendererParams,
    default: () => {},
    required: false,
  },
})

const options: SelectOption[] = [
  { label: 'Custom', value: 'custom' },
  { label: 'Lookalike', value: 'lookalike' },
  { label: 'YourData', value: 'yourdata' },
]

const text = computed(() => {
  return (
    options.find((item) => item.value === props.params.value)?.label ||
    props.params.value
  )
})
</script>
<template>
  <div>{{ text }}</div>
</template>
