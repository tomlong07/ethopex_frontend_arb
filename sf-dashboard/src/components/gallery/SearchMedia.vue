<script setup lang="ts">
import SearchOutline from '@/assets/icons/SearchOutline.vue'
import {
  MediaLibraryClass,
  StatusMediaLibraryClass,
} from '@/types/components/gallery'
import { debounceV2 } from '@/utils'

const props = defineProps({
  dataMedia: {
    type: Object as () => MediaLibraryClass,
    required: true,
  },
  statusMedia: {
    type: Object as () => StatusMediaLibraryClass,
    required: true,
  },
})

const searchMedia = debounceV2(async (query: string = '') => {
  await props.dataMedia.fetchMedia(query, true)
}, 300)
</script>
<template>
  <div class="flex justify-center">
    <n-input placeholder="Search media" :on-update:value="searchMedia">
      <template #prefix> <n-icon :component="SearchOutline" /> </template
    ></n-input>
  </div>
</template>
