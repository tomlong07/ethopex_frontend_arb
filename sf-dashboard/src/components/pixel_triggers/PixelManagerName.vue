<script setup lang="ts">
import { ICellRendererParams } from 'ag-grid-community'

const props = defineProps({
  params: {
    type: Object as () => ICellRendererParams,
    default: () => {},
    required: false,
  },
})

const trafficSource = ref<string>(props.params.data.traffic_source)
const id = ref<string>(props.params.data.id)
</script>
<template>
  <a
    :href="`/campaign/${trafficSource}/${id}`"
    v-if="trafficSource && id"
    class="text-blue-500"
    target="_blank"
    >{{ props.params.value }}</a
  >
  <span v-else>{{ props.params.value }}</span>
</template>
