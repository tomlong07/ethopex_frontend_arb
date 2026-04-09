<script setup lang="ts">
import { ICellRendererParams } from 'ag-grid-community'
const props = defineProps({
  params: {
    type: Object as () => ICellRendererParams,
    default: () => {},
    required: false,
  },
})
const listChannel = props.params.value
  ? props.params.value.slice(0, 50).join(', ')
  : ''
const total = Array.isArray(props.params?.value) ? props.params.value.length : 0
</script>

<template>
  <div class="flex items-center overflow-hidden max-w-full">
    <span class="whitespace-nowrap overflow-hidden text-ellipsis">
      {{ listChannel }}
    </span>
    <span class="text-xs text-[#8c0b0b] opacity-60 mr-[3px]">
      Total: {{ total }}
    </span>
  </div>
</template>
