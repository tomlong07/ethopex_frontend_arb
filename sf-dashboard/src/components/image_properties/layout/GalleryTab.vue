<script setup lang="ts">
import GalleryCard from '@/components/gallery/GalleryCard.vue'
import { useImagePropertiesStore } from '@/store/useImageProperties'

// Use store directly
const store = useImagePropertiesStore()

// Computed để lấy data từ store
const dataModalGallery = computed(() => store.dataModalGallery)
</script>

<template>
  <div class="gallery-wrapper">
    <div class="gallery-scroll-area">
      <GalleryCard :modalInfo="dataModalGallery" />
    </div>

    <div class="gallery-footer-fixed">
      <n-button
        type="primary"
        @click="store.selectImageFromGallery"
        :disabled="dataModalGallery.selectedMedia.length === 0"
      >
        Select Image
      </n-button>
    </div>
  </div>
</template>

<style scoped>
.gallery-wrapper {
  height: 100%;
  display: flex;
  flex-direction: column;
  max-height: calc(100vh - 180px);
}

.gallery-scroll-area {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  min-height: 100px;
  /* Trừ đi chiều cao của footer */
  padding-bottom: 60px;
}

.gallery-footer-fixed {
  position: absolute;
  bottom: 0;
  right: 0;
  left: 0;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding: 12px 16px;
  background: white;
  border-top: 1px solid #e5e7eb;
  z-index: 10;
}

@media (max-width: 640px) {
  .gallery-wrapper {
    max-height: calc(100vh - 150px);
  }
}

@media (min-width: 1024px) {
  .gallery-wrapper {
    max-height: calc(100vh - 120px);
  }
}

@media (min-width: 1536px) {
  .gallery-wrapper {
    max-height: calc(100vh - 160px);
  }
}
</style>
