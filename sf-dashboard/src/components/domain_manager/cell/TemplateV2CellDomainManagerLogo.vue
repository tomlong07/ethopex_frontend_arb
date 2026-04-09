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
  <div v-if="props.params.value" class="flex items-center justify-center">
    <n-image width="100" :src="props.params.value"></n-image>
  </div>
</template>
