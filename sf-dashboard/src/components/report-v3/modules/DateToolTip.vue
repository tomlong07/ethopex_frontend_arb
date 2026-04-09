<script setup lang="ts">
import helper from '@/utils/helper'
import { NTooltip } from 'naive-ui'

const props = defineProps({
  timeVal: {
    type: String,
    required: true,
  },
})

const fetchSetting = () => {
  try {
    const raw = localStorage.getItem('activityModalStore')
    if (!raw) return null

    const setting = JSON.parse(raw)
    if (setting.language === '+7') {
      return '+7'
    }
    return setting.language || null
  } catch (e) {
    console.error('falied parse ', e)
    return null
  }
}
const timezone = computed(() => fetchSetting())
const timeDisplay = computed(() => {
  const isGMT7 = timezone.value === '+7'
  return {
    display: isGMT7 ? helper.convertToGMT7(props.timeVal) : props.timeVal,
    tooltip: isGMT7 ? props.timeVal : helper.convertToGMT7(props.timeVal),
  }
})
</script>

<template>
  <n-tooltip trigger="hover">
    <template #trigger>{{ timeDisplay.display }} </template>
    <div>{{ timeDisplay.tooltip }}</div>
  </n-tooltip>
</template>
