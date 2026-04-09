<script setup lang="ts">
import { ICellRendererParams } from 'ag-grid-community'

const props = defineProps({
  params: {
    type: Object as () => ICellRendererParams,
    default: () => {},
    required: false,
  },
})
</script>
<template>
  <div
    class="flex items-center gap-2 truncate"
    v-html="props.params.value"
  ></div>
</template>
