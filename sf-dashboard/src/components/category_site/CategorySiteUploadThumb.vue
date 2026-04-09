<script setup lang="ts">
import useCategorySite from '@/store/useCategorySite'
import { storeToRefs } from 'pinia'
import Upload from '../common/Upload.vue'

const categorySiteStore = useCategorySite()
const { categorySite } = storeToRefs(categorySiteStore)

const handleChange = (data: any) => {
  if (data) {
    categorySite.value.thumb = data
  }
}
</script>

<template>
  <div class="flex-column items-center space-y-1">
    <div class="text-gray-400 font-medium">Upload Thumbnail</div>
    <div class="flex-1 min-w-0 flex flex-col gap-1">
      <Upload v-model="categorySite.thumb" />
      <CategorySitePromptImage @change="handleChange" type="thumb" />
    </div>
  </div>
</template>
