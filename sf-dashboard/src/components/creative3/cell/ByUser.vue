<script setup lang="ts">
import { ICellRendererParams } from 'ag-grid-community'
import { ColumnItem } from '@/types/state/general'

const props = defineProps({
  params: {
    type: Object as () => ICellRendererParams,
    default: () => {},
    required: false,
  },
})

const options = (props.params as any).options as ColumnItem


const urlAction = options?.action?.replace(':id', props.params.data.id) || ''
</script>
<template>
  <div class="flex justify-between items-center">
    <div class="flex flex-col w-full">
      <a
        class="text-xs cursor-pointer text-blue-500 font-medium overflow-hidden text-ellipsis"
        target="_blank"
        :class="{ 'cursor-not-allowed': !urlAction }"
        :href="urlAction"
        :title="props.params.data.name"
        v-if="urlAction && props.params.data.id"
      >
        {{ props.params.data.name }}
      </a>
      <div class="text-xs text-gray-400 overflow-hidden text-ellipsis">
        {{ props.params.data.user || props.params.data.publisher }}
      </div>
    </div>
  </div>
</template>
