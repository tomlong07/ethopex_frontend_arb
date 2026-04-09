<script setup lang="ts">
import { NTooltip } from 'naive-ui'

const props = defineProps({
  percent: {
    type: String,
    required: true,
  },

  originalValue: {
    type: String,
    required: true,
  },

  tooltipPercentByMetric: {
    type: String,
    required: false,
  },
})

const textTooltip = computed(() => {
  if (!props.tooltipPercentByMetric) return `${props.percent}`

  try {
    return props.tooltipPercentByMetric
      .replaceAll('{{percent}}', props.percent)
      .replaceAll('{{value}}', props.originalValue)
  } catch {}

  return `${props.percent}`
})
</script>

<template>
  <n-tooltip trigger="hover" :show-arrow="false">
    <template #trigger>
      <span class="text-xxs text-gray-500"> &nbsp;({{ props.percent }})</span>
    </template>
    <span class="text-xs">{{ textTooltip }}</span>
  </n-tooltip>
</template>
