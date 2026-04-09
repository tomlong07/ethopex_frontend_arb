<script setup lang="ts">
import { TType } from '@/enum/naiveui'
import { ICellRendererParams } from 'ag-grid-community'

const props = defineProps({
  params: {
    type: Object as () => ICellRendererParams,
    required: true,
  },
})

const value = props.params.value

const tagInfo = computed(() => {
  if (typeof value === 'boolean') {
    return {
      text: value ? 'AND' : 'OR',
      type: value ? 'success' : 'primary',
    }
  }

  switch (value) {
    case 'new':
      return { text: 'NEW', type: 'info' }
    case 'pending':
      return { text: 'PENDING', type: 'warning' }
    case 'running':
      return { text: 'RUNNING', type: '' }
    case 'done':
      return { text: 'DONE', type: 'success' }
    case 'error':
      return { text: 'ERROR', type: 'error' }
    default:
      return { text: value, type: 'default' }
  }
})
const shouldShowTag = computed(() => value !== undefined && value !== null)

const typeTag = computed(() => {
  return (tagInfo.value.type as TType) || null
})
</script>
<template>
  <div v-if="shouldShowTag">
    <n-tag :type="typeTag" size="small" round class="n-tag-exclude">
      {{ tagInfo.text }}
    </n-tag>
  </div>
</template>
<style lang="scss">
.ag-cell-wrapper {
  height: 100%;
}
</style>
