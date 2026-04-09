<script setup lang="ts">
import { ICellRendererParams } from 'ag-grid-community'

const props = defineProps({
  params: {
    type: Object as () => ICellRendererParams,
    default: () => ({}),
    required: false,
  },
})
</script>
<template>
  <div class="whitespace-pre">{{ props.params.value }}</div>
</template>
