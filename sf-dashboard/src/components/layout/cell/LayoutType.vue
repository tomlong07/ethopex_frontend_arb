<script setup lang="ts">
import { LayoutTypeOptions } from '@/options/layout'
import { ICellRendererParams } from 'ag-grid-community'

const props = defineProps({
  params: {
    type: Object as () => ICellRendererParams,
    default: () => {},
    required: false,
  },
})

const value =
  LayoutTypeOptions.find((x) => x.value === props.params.value)?.label ||
  props.params.value
</script>
<template>
  {{ value }}
</template>
