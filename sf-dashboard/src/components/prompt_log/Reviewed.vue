<script setup lang="ts">
import { ICellRendererParams } from 'ag-grid-community'

const props = defineProps({
  params: {
    type: Object as () => ICellRendererParams,
    default: () => ({}),
  },
})
</script>

<template>
  <div>
    <n-tag
      class="n-tag-exclude"
      v-if="props.params.data.human_decision"
      type="success"
      round
      size="small"
      >Reviewed</n-tag
    >
    <n-tag class="n-tag-exclude" v-else type="warning" round size="small"
      >Pending</n-tag
    >
  </div>
</template>
