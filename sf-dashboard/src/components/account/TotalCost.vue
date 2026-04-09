<script setup lang="ts">
import { ICellRendererParams } from 'ag-grid-community'

const props = defineProps({
  params: {
    type: Object as () => ICellRendererParams,
    default: () => {},
    required: false,
  },
})
const displayTotalCost = computed(() => {
  const value = props.params.value || 0
  return helper.formatNumberV3(value, 2)
})
</script>
<template>
  <div class="flex h-full items-center cell-status">
    {{ displayTotalCost }}
  </div>
</template>
<style lang="scss">
.ag-cell-wrapper {
  height: 100%;
}
</style>
