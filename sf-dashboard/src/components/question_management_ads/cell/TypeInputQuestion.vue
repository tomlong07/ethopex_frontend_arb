<script setup lang="ts">
import { TypeInputOptions } from '@/options/question_management'
import { ICellRendererParams } from 'ag-grid-community'

const props = defineProps({
  params: {
    type: Object as () => ICellRendererParams,
    default: () => {},
    required: false,
  },
})

const value =
  TypeInputOptions.find(
    (option) => option.value === props.params.data.type_input
  )?.label || ''
</script>
<template>
  <div class="truncate">{{ value }}</div>
</template>
