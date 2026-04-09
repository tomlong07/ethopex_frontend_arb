<script setup lang="ts">
import { ICellRendererParams } from 'ag-grid-community'

const props = defineProps({
  params: {
    type: Object as () => ICellRendererParams,
    default: () => {},
    required: false,
  },
})
const created_time = computed<string>(() => {
  return helper.convertTimeV2(props.params.data.created_at)
})

const updated_time = computed(() => {
  return helper.convertTimeV2(props.params.data.updated_at)
})
</script>
<template>
  <div>
    <div class="flex items-center leading-snug py-[1px]" v-if="created_time">
      <span class="text-xs text-gray-400 mr-1"><b>Created at: </b></span>
      <span class="truncate" :title="created_time">
        {{ created_time }}
      </span>
    </div>

    <div class="flex leading-none py-[1px]" v-if="updated_time">
      <span class="text-xs text-gray-400 mr-1"><b>Updated at: </b></span>
      <span class="truncate" :title="updated_time">
        {{ updated_time }}
      </span>
    </div>
  </div>
</template>
