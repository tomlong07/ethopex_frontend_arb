<script setup lang="ts">
import CardImage from '@/assets/icons/CardImage.vue'
import { useImagePropertiesStore } from '@/store/useImageProperties'

// Use store directly
const store = useImagePropertiesStore()

// Computed để lấy data từ store
const imageData = computed(() => store.imageData)
const linkData = computed(() => store.linkData)
</script>

<template>
  <n-card>
    <div class="sticky top-0">
      <div
        class="border bg-gray-50 flex justify-center overflow-auto min-h-[200px] preview-container"
        :class="{
          'items-center': !imageData.url,
        }"
      >
        <div
          v-if="imageData.url"
          class="p-4 w-full h-full flex items-center justify-center"
        >
          <component
            :is="linkData.url ? 'a' : 'div'"
            :href="linkData.url || undefined"
            :target="linkData.url ? linkData.target : undefined"
          >
            <img
              :src="imageData.url"
              :alt="imageData.alt"
              :width="imageData.width || undefined"
              :height="imageData.height || undefined"
              :style="{
                width: imageData.width ? `${imageData.width}px` : 'auto',
                height: imageData.height ? `${imageData.height}px` : 'auto',
              }"
              @error="() => {}"
            />
          </component>
        </div>
        <div v-else class="text-center text-gray-500">
          <div class="flex justify-center mb-3">
            <CardImage class="w-10 h-10 text-gray-400" />
          </div>
          <p class="text-sm dark-mode-text">No image selected</p>
          <p class="text-xs mt-1 dark-mode-text">
            Upload or select an image to see preview
          </p>
        </div>
      </div>
    </div>
  </n-card>
</template>

<style scoped>
.overflow-auto::-webkit-scrollbar {
  width: 3px;
}

.preview-container {
  max-height: 500px;
}

@media screen and (min-height: 1070px) {
  .preview-container {
    max-height: 800px;
  }
}
</style>
