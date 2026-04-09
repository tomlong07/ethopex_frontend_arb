<script setup lang="ts">
import { ICellRendererParams } from 'ag-grid-community'

// import { useRecommendation } from '@/store/campaignRecommendation'
import { NTag, NTooltip } from 'naive-ui'

// const rcmStore = useRecommendation()

const props = defineProps({
  params: {
    type: Object as () => ICellRendererParams,
    default: () => {},
    required: false,
  },
})

const data = props.params?.data || {}

// Computed để kiểm tra và định dạng delivery_status_reasons
const tooltipContent = computed<string | null>(() => {
  const reasons = props.params?.data?.delivery_status_reasons
  if (!reasons || reasons === 'null') {
    return null
  }

  try {
    const parsedReasons = JSON.parse(reasons)
    return Array.isArray(parsedReasons)
      ? parsedReasons.join(', ')
      : String(parsedReasons)
  } catch {
    return String(reasons)
  }
})

const classNow = computed<string>(() => {
  return helper.classRender(props.params?.value) || ''
})

const styleNow = computed<any>(() => {
  const value = props.params?.value.toLowerCase()
  switch (value) {
    case 'queue':
      return { color: 'white', textColor: '#48abf7', borderColor: '#48abf7' }
    case 'notfound':
      return {
        color: 'rgb(104, 97, 206)',
        textColor: 'white',
      }
    case 'running':
      return {
        color: 'rgb(0, 123, 255, 0.7)',
        textColor: 'white',
      }
  }
  return undefined
})
</script>

<template>
  <div class="flex flex-wrap items-center gap-2 my-2">
    <n-tooltip
      v-if="tooltipContent && props.params?.value && props.params?.value != ''"
      trigger="hover"
      placement="top"
    >
      <template #trigger>
        <n-tag
          size="small"
          class="n-tag-exclude"
          round
          :type="(classNow as any)"
          :color="styleNow"
        >
          {{ props.params?.value.toUpperCase() || '' }}
        </n-tag>
      </template>
      <div
        style="max-width: 200px; white-space: pre-wrap; word-break: break-word"
      >
        {{ tooltipContent }}
      </div>
    </n-tooltip>

    <n-tag
      size="small"
      class="n-tag-exclude"
      round
      :type="(classNow as any)"
      :color="styleNow"
      v-if="!tooltipContent && props.params?.value && props.params?.value != ''"
    >
      {{ props.params?.value.toUpperCase() || '' }}
    </n-tag>

    <n-tooltip trigger="hover" v-if="data.ad_status?.pending">
      <template #trigger>
        <n-tag type="warning" round size="small" class="n-tag-exclude">
          {{ data.ad_status?.pending }} Ad pending
        </n-tag>
      </template>
      Ad pending
    </n-tooltip>

    <n-tooltip trigger="hover" v-if="data.ad_status?.disapproved">
      <template #trigger>
        <n-tag type="error" round size="small" class="n-tag-exclude">
          {{ data.ad_status?.disapproved }} Ad disapproved
        </n-tag>
      </template>
      Ad disapproved
    </n-tooltip>
  </div>
</template>
