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
  <a :href="props.params.value" target="_blank" rel="noopener">{{ props.params.value }}</a>
</template>
