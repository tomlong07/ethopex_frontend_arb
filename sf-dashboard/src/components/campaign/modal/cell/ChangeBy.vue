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
  <div class="flex flex-col">
    <div class="overflow-hidden text-ellipsis">
      {{ props.params.data?.actor_name || '-' }}
    </div>
    <div
      class="overflow-hidden text-ellipsis text-xs text-gray-400 py-2"
      v-if="props.params.data?.actor_id && props.params.data?.actor_id !== '0'"
    >
      {{ props.params.data?.actor_id }}
    </div>
  </div>
</template>
