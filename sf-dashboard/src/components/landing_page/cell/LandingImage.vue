<script setup lang="ts">
import { URL_UPLOAD } from '@/constants/urls'
import { ICellRendererParams } from 'ag-grid-community'

const props = defineProps({
  params: {
    type: Object as () => ICellRendererParams,
    default: () => ({}),
    required: false,
  },
})

function resolveImageUrl(image?: string): string {
  if (!image) return ''

  if (/^https?:\/\//i.test(image) || /^data:image\//i.test(image)) {
    return image
  }

  if (image.startsWith('/data')) {
    return URL_UPLOAD + image
  }

  if (image.startsWith('data')) {
    return URL_UPLOAD + '/' + image
  }

  return URL_UPLOAD + '/' + image
}

const rawImage = computed(() => {
  const type = props.params.colDef?.field
  if (type === 'icon') {
    return props.params.data?.icon
  } else if (type === 'thumb') {
    return props.params.data?.thumb
  }
  return ''
})
const src = computed(() => resolveImageUrl(rawImage.value))
</script>

<template>
  <div class="flex pb-1 pt-1 w-full h-full">
    <n-image
      class="pb-1 pt-1"
      :img-props="{ style: { maxHeight: '150px' } }"
      width="150"
      :src="src"
    />
  </div>
</template>
