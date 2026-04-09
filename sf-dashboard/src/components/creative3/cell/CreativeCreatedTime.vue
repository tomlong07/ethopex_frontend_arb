<script setup lang="ts">
import { ICellRendererParams } from 'ag-grid-community'

const props = defineProps({
  params: {
    type: Object as () => ICellRendererParams,
    default: () => {},
    required: false,
  },
})
const createdAt = props.params?.data?.Creative?.created_at || ''
const created_time = computed<string>(() => {
  return helper.convertTimeV2(createdAt)
})
</script>
<template>
  <div class="truncate">
    <span class="text-xs text-gray-400"><b>Created at: </b> </span>
    <span>{{ created_time }}</span>
  </div>
</template>
