<script setup lang="ts">
import { ICellRendererParams } from 'ag-grid-community'

const props = defineProps({
  params: {
    type: Object as () => ICellRendererParams,
    default: () => {},
    required: false,
  },
})

let label = props.params.value
  ? helper.numberTranform(props.params.value, 0)
  : ''

const link = (props.params as any).columnConfig?.link
const linkLabel = link + props.params.data?.plk_campaign_by_label || ''
</script>

<template>
  <div class="truncate">
    <a
      class="text-blue-500 hover:text-red-500"
      :href="linkLabel"
      target="_blank"
      >{{ label }}</a
    >
  </div>
</template>
