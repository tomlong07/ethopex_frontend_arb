<script setup lang="ts">
import CardImage from '@/assets/icons/CardImage.vue'
import Upload from '@/assets/icons/Upload.vue'
const props = defineProps<{
  onBeforeUpload: (fileInfo: any) => Promise<boolean>
  onSelectFromGallery: () => void
}>()

// const modelValue = defineModel<string>()
</script>
<template>
  <div class="mb-2 font-bold">Image</div>
  <div class="flex gap-2 mb-4">
    <n-upload
      :max="1"
      :show-file-list="false"
      accept="image/*"
      :default-upload="false"
      @before-upload="props.onBeforeUpload"
      class="flex-1 p-1 border-dashed border rounded-sm flex justify-center"
    >
      <n-button size="small" class="text-[#414141] w-full" tertiary>
        <template #icon
          ><n-icon><Upload /></n-icon
        ></template>
        Upload Image
      </n-button>
    </n-upload>
    <div class="flex-1 p-1 border-dashed border rounded-sm flex justify-center">
      <n-button
        size="small"
        class="w-full"
        tertiary
        @click="props.onSelectFromGallery"
      >
        <template #icon
          ><n-icon><CardImage /></n-icon
        ></template>
        Gallery
      </n-button>
    </div>
  </div>
</template>
