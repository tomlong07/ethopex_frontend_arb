<script setup lang="ts">
import { TypeQuestionOptions } from '@/options/question_management'
import { ICellRendererParams } from 'ag-grid-community'

const props = defineProps({
  params: {
    type: Object as () => ICellRendererParams,
    default: () => {},
    required: false,
  },
})

const value =
  TypeQuestionOptions.find((option) => option.value === props.params.data.type)
    ?.label || ''
</script>
<template>
  <div class="truncate">{{ value }}</div>
</template>
