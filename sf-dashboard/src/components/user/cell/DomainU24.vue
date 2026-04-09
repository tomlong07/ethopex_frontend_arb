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
  <a
    :href="`https://${props.params.value}`"
    target="_blank"
    class="text-blue-500"
    >{{ props.params.value }}</a
  >
</template>
