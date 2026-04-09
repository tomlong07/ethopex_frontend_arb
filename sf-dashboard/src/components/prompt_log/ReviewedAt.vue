<script setup lang="ts">
import helper from '@/utils/helper'
import { ICellRendererParams } from 'ag-grid-community'

const props = defineProps({
  params: {
    type: Object as () => ICellRendererParams,
    default: () => ({}),
  },
})
</script>

<template>
  <div v-if="props.params.data?.reviewed_at !== '0001-01-01T00:00:00Z'">
    {{ helper.convertToVNTime(props.params.data.reviewed_at) }}
  </div>
</template>
