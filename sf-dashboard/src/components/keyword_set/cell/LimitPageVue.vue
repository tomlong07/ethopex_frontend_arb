<script setup lang="ts">
import { LIMIT_PAGE_VIEW } from '@/constants/limits'
import { ICellRendererParams } from 'ag-grid-community'

const props = defineProps({
  params: {
    type: Object as () => ICellRendererParams,
    default: () => {},
    required: false,
  },
})

const value =
  props.params.data?.keyword_ab_test && props.params.value === 0
    ? LIMIT_PAGE_VIEW
    : props.params.value

const formatValue = helper.formatNumber(value)
</script>
<template>
  <div>
    {{ formatValue }}
  </div>
</template>
