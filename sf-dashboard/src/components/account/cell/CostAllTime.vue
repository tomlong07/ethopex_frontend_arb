<script setup lang="ts">
import { ICellRendererParams } from 'ag-grid-community'

const props = defineProps({
  params: {
    type: Object as () => ICellRendererParams,
    default: () => {},
    required: false,
  },
})

const dataShow = helper.currencyFormatterAuto3(props.params.value)
</script>
<template>
  <span>
    {{ dataShow }}
  </span>
</template>
