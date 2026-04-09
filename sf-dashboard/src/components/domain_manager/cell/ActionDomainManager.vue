<script setup lang="ts">
import { ICellRendererParams } from 'ag-grid-community'
import DuplicateOutline from '@/assets/icons/DuplicateOutline.vue'
import EyeOutline from '@/assets/icons/EyeOutline.vue'

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
const urlDuplicate = computed(() => {
  let url = `/domain-manager/add?duplicate=${props.params.data.id}`
  return url
})
</script>
<template>
  <div class="flex w-full h-full items-center">
    <n-icon
      size="30"
      class="flex items-center m-1 rounded-full p-2 cursor-pointer bg-gray-200 hover:bg-gray-300"
      title="Open Preview"
      :component="EyeOutline"
      @click="openPreview()"
    >
    </n-icon>
    <a :href="urlDuplicate" target="_blank">
      <n-icon
        class="flex items-center m-1 rounded-full p-2 cursor-pointer bg-gray-200 hover:bg-gray-300"
        title="Duplicate"
        :component="DuplicateOutline"
        size="35"
      />
    </a>
  </div>
</template>
