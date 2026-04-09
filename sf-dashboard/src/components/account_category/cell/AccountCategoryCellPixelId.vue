<script setup lang="ts">
import { ICellRendererParams } from 'ag-grid-community'

const props = defineProps({
  params: {
    type: Object as () => ICellRendererParams,
    default: () => {},
    required: false,
  },
})
const arrayValue = computed<any>(() => {
  return props.params.value
})
</script>
<template>
  <span class="capitalize">
    {{ arrayValue.name }}
  </span>
</template>
