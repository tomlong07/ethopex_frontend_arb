<script setup lang="ts">
import { ICellRendererParams } from 'ag-grid-community'

const props = defineProps({
  params: {
    type: Object as () => ICellRendererParams,
    default: () => {},
    required: false,
  },
})
const src = ref(props.params.data.image)
const isVideo = (url: string) => {
  return url.endsWith('.mp4')
}
</script>
<template>
  <div size="tiny" class="flex pb-1 pt-1 w-full h-full">
    <template v-if="isVideo(src)">
      <video class="pb-1 pt-1" width="150" controls style="max-height: 150px">
        <source :src="src" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </template>
    <template v-else>
      <n-image
        class="pb-1 pt-1"
        :img-props="{ style: { maxHeight: '150px' } }"
        width="150"
        :src="src"
      />
    </template>
  </div>
</template>
