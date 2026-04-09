<script setup lang="ts">
import { ICellRendererParams } from 'ag-grid-community'

const props = defineProps({
  params: {
    type: Object as () => ICellRendererParams,
    default: () => {},
    required: false,
  },
})
const value = computed<string>(() => {
  return props.params.value
    ? helper.buildCustomHtml(
        helper.currencyFormatter(props.params.value),
        'span',
        'text-red-500'
      ) +
        helper.buildCustomHtml(
          ' (' + rate.value + ')',
          'span',
          `text-xs text-purple-500`
        )
    : '-'
})

const rate = computed<string>(() => {
  if (!props.params.data?.revenue_report) {
    return 'N/A'
  }

  try {
    return helper.getPercent(
      (props.params.value / props.params.data?.revenue_actual) * 100,
      2
    )
  } catch {
    return '-'
  }
})
</script>
<template>
  <div class="text-right" v-html="value"></div>
</template>
