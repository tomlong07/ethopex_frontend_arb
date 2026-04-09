<script setup lang="ts">
import EyeOutline from '@/assets/icons/EyeOutline.vue'
import { ICellRendererParams } from 'ag-grid-community'

const props = defineProps({
  params: {
    type: Object as () => ICellRendererParams,
    default: () => {},
    required: false,
  },
})

const showValue = computed<string>(() => {
  if (!props.params.data.domain) {
    return ''
  }
  return `https://search.${props.params.data.domain}/read/${props.params.data.domain}/31/v1/kitchen-remodeling-trends-in-2023-might-surprise-you-130131.webm?__xxx=xxx`
})

const openPreview = () => {
  try {
    window.open(showValue.value, '_blank')
  } catch {}
}
</script>
<template>
  <n-icon
    size="30"
    class="flex items-center m-1 rounded-full p-2 cursor-pointer bg-gray-200 hover:bg-gray-300"
    title="Open Preview"
    :component="EyeOutline"
    @click="openPreview()"
  >
  </n-icon>
</template>
