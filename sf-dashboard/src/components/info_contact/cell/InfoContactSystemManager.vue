<script setup lang="ts">
import { ICellRendererParams } from 'ag-grid-community'

const props = defineProps({
  params: {
    type: Object as () => ICellRendererParams,
    required: true,
  },
})
</script>

<template>
  <div class="truncate">
    {{ props.params?.data?.[props.params?.colDef?.field as string] }}
  </div>
</template>
