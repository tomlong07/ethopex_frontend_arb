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
  <div class="flex items-center gap-2" title="Double click to edit">
    <div class="cursor-pointer text-blue-500 hover:text-red-500">
      {{ props.params.value }}
    </div>
  </div>
</template>
