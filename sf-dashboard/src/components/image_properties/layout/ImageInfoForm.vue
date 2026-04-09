<script setup lang="ts">
import { useImagePropertiesStore } from '@/store/useImageProperties'
import { IMAGE_PROPERTIES_CONSTANTS } from '@/types/components/image-properties'

// Use store directly
const store = useImagePropertiesStore()

// Computed để lấy data từ store
const imageData = computed(() => store.imageData)
const linkData = computed(() => store.linkData)

// Helper functions cho form validation và update
const updateImageData = (field: string, value: any) => {
  store.updateImageData({ [field]: value })
}

const updateLinkData = (field: string, value: any) => {
  store.updateLinkData({ [field]: value })
}
</script>
// Border, HSpace, VSpace, Alignment
<template>
  <n-card class="h-full">
    <div class="form-container">
      <!-- Image URL -->
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Image URL <span class="text-red-500">*</span>
        </label>
        <n-input
          :value="imageData.url"
          @update:value="(value: string) => updateImageData('url', value)"
          placeholder="Enter image URL or select from gallery"
          size="medium"
        />
      </div>

      <!-- Alternative Text -->
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Alternative Text
        </label>
        <n-input
          :value="imageData.alt"
          @update:value="(value: string) => updateImageData('alt', value)"
          placeholder="Describe the image"
          size="medium"
        />
      </div>

      <!-- Width and Height -->
      <div class="grid grid-cols-2 gap-3 mb-4">
        <div class="flex flex-col">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Width
          </label>
          <n-input-number
            :value="imageData.width"
            @update:value="(value: number | null) => updateImageData('width', value)"
            placeholder="Width in pixels"
            :min="1"
            :step="1"
            size="medium"
            class="w-full"
          />
        </div>
        <div class="flex flex-col">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Height
          </label>
          <n-input-number
            :value="imageData.height"
            @update:value="(value: number | null) => updateImageData('height', value)"
            placeholder="Height in pixels"
            :min="1"
            :step="1"
            size="medium"
            class="w-full"
          />
        </div>
      </div>

      <!-- Link Properties Section -->
      <div class="border-gray-200">
        <!-- Link URL -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Link URL
          </label>
          <n-input
            :value="linkData.url"
            @update:value="(value: string) => updateLinkData('url', value)"
            placeholder="https://example.com"
            size="medium"
          />
        </div>

        <!-- Link Target -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Link Target
          </label>
          <n-select
            :value="linkData.target"
            @update:value="(value: string) => updateLinkData('target', value)"
            :options="IMAGE_PROPERTIES_CONSTANTS.LINK_TARGET_OPTIONS"
            size="medium"
          />
        </div>
      </div>
    </div>
  </n-card>
</template>

<style scoped>
.form-container {
  max-height: calc(100vh - 250px);
  overflow-y: auto;
  padding-right: 8px;
  scroll-behavior: smooth;
}

/* Custom scrollbar */
.form-container::-webkit-scrollbar {
  width: 3px;
}

.form-container::-webkit-scrollbar-track {
  background: #f8f9fa;
  border-radius: 2px;
}

.form-container::-webkit-scrollbar-thumb {
  background: #cbd5e0;
  border-radius: 2px;
}

.form-container::-webkit-scrollbar-thumb:hover {
  background: #a0aec0;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .grid-cols-2 {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }

  .form-container {
    padding-right: 4px;
    max-height: calc(100vh - 300px);
  }

  .mb-4 {
    margin-bottom: 0.75rem;
  }

  .mt-6 {
    margin-top: 1rem;
  }
}

@media (max-width: 480px) {
  .form-container {
    max-height: calc(100vh - 350px);
  }

  .text-sm {
    font-size: 0.75rem;
  }

  .mb-2 {
    margin-bottom: 0.25rem;
  }

  .mb-4 {
    margin-bottom: 0.5rem;
  }

  .text-base {
    font-size: 0.875rem;
  }
}
</style>
