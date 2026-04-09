<script setup lang="ts">
import { ICellRendererParams } from 'ag-grid-community'

const props = defineProps({
  params: {
    type: Object as () => ICellRendererParams,
    default: () => {},
    required: false,
  },
})

const data = props.params.data
</script>
<template>
  <div class="flex overflow-hidden max-w-full flex-col">
    <span
      class="whitespace-nowrap overflow-hidden text-ellipsis"
      v-if="data.name"
    >
      {{ data.name }}
    </span>

    <span
      class="text-xs text-gray-500 whitespace-nowrap overflow-hidden text-ellipsis"
    >
      {{ data.user || 'N/A' }}
    </span>
  </div>
</template>
