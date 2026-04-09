<script setup lang="ts">
import { ICellRendererParams } from 'ag-grid-community'

const props = defineProps({
  params: {
    type: Object as () => ICellRendererParams,
    default: () => {},
    required: false,
  },
})

const origin = window.location.origin || location.origin
</script>
<template>
  <div class="flex justify-between items-center">
    <a
      class="text-blue-500 no-underline hover:underline truncate block w-full"
      target="_blank"
      :href="`${origin}/campaign/${props.params.data.traffic_source}/${props.params.data.id}`"
      :title="props.params.data.name"
    >
      {{ props.params.data.name }}
    </a>
  </div>
</template>
