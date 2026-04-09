<script setup lang="ts">
import Upload from '@/components/common/Upload.vue'
import PromtDetail from '@/store/details/PromptDetail'

const usePromtDetail = PromtDetail()

const max = computed(() => {
  if (usePromtDetail.isPrompt52Media) return 1

  return 5
})
</script>

<template>
  <div class="flex gap-2 flex-col">
    <div class="font-bold text-xs">Media</div>
    <div class="flex gap-2">
      <Upload
        v-model="usePromtDetail.testData.image"
        :max="max"
        multiple
        accept="image/*,video/*"
        is-urls
      />
    </div>
  </div>
</template>

<style scoped>
::v-deep(.n-upload-file-list) {
  display: flex;
}
</style>
