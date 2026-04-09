<script setup lang="ts">
import { TType } from '@/enum/naiveui'
import { ICellRendererParams } from 'ag-grid-community'

const props = defineProps({
  params: {
    type: Object as () => ICellRendererParams,
    required: true,
  },
})

const value = props.params.data.is_run_daily

const tagInfo = computed(() => {
  if (typeof value === 'boolean') {
    return {
      text: value ? 'YES' : 'NO',
      type: value ? 'success' : 'error',
    }
  }
  return {
    text: 'N/A',
    type: 'default',
  }
})
const shouldShowTag = computed(() => value !== undefined && value !== null)

const tagType = computed(() => {
  return (tagInfo.value.type as TType) || null
})
</script>
<template>
  <div v-if="shouldShowTag">
    <n-tag :type="tagType" size="small" round class="n-tag-exclude">
      {{ tagInfo.text }}
    </n-tag>
  </div>
</template>
<style lang="scss">
.ag-cell-wrapper {
  height: 100%;
}
</style>
