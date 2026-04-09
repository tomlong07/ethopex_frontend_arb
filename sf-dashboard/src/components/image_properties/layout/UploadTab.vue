<script setup lang="ts">
import Upload from '@/assets/icons/Upload.vue'
import { useImagePropertiesStore } from '@/store/useImageProperties'
import { imageUtils } from '@/types/components/image-properties'

const store = useImagePropertiesStore()
const uploadStatus = computed(() => store.uploadStatus)
const fileInputRef = ref<HTMLInputElement | null>(null)

// Xử lý file được chọn (từ click hoặc drag)
const handleFileUpload = async (file: File) => {
  const isValid = await store.validateBeforeUpload({ file })
  if (isValid) {
    await store.handleManualUpload(file)
  }
}

// Handle file selection từ input
const handleFileSelect = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]

  if (file) {
    await handleFileUpload(file)
    target.value = ''
  }
}

// Handle drag & drop
const handleDrop = async (event: DragEvent) => {
  event.preventDefault()
  const file = event.dataTransfer?.files?.[0]

  if (file) {
    await handleFileUpload(file)
  }
}

// Drag event handlers
const handleDragOver = (event: DragEvent) => event.preventDefault()
const handleDragEnter = (event: DragEvent) => event.preventDefault()
const handleDragLeave = (event: DragEvent) => event.preventDefault()

// Trigger file input click
const triggerFileInput = () => fileInputRef.value?.click()
</script>

<template>
  <div class="h-full flex flex-col">
    <!-- Upload Area -->
    <div class="flex-shrink-0 py-2">
      <input
        ref="fileInputRef"
        type="file"
        accept="image/*"
        @change="handleFileSelect"
        class="hidden"
      />

      <div
        class="border-exclude w-full min-h-[120px] sm:min-h-[100px] lg:min-h-[140px] flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400 transition-colors"
        @click="triggerFileInput"
        @drop="handleDrop"
        @dragover="handleDragOver"
        @dragenter="handleDragEnter"
        @dragleave="handleDragLeave"
      >
        <!-- Loading State -->
        <div v-if="uploadStatus.isUploading" class="text-blue-500">
          <div class="flex flex-col items-center space-y-3">
            <n-spin size="large" />
          </div>
        </div>

        <!-- Upload UI -->
        <div v-else class="text-gray-500 text-center">
          <div class="flex justify-center mb-3">
            <Upload class="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
          </div>
          <p class="text-sm sm:text-lg font-medium dark-mode-text">
            Click or drag files to this area to upload
          </p>
          <p class="text-xs sm:text-sm mt-2 text-gray-400 dark-mode-text">
            Files will be uploaded automatically
          </p>
        </div>
      </div>
    </div>

    <!-- Recently Uploaded -->
    <div
      v-if="uploadStatus.uploadedFiles.length > 0"
      class="flex-1 flex flex-col overflow-hidden"
    >
      <div class="flex justify-between items-center mb-3 flex-shrink-0">
        <h4 class="text-sm font-medium text-gray-700">Recently Uploaded:</h4>
      </div>

      <div
        class="flex-1 overflow-y-auto overflow-x-hidden recently-uploaded-scroll"
      >
        <div
          class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3"
        >
          <div
            v-for="(filePath, index) in uploadStatus.uploadedFiles"
            :key="index"
            class="relative group cursor-pointer border rounded-lg hover:shadow-md transition-shadow min-h-[70px]"
            @click="() => store.selectImageFromPath(filePath)"
          >
            <img
              :src="imageUtils.getImageSrc(filePath)"
              :alt="`Uploaded ${index + 1}`"
              class="w-full h-full object-cover aspect-square"
            />
            <div
              class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all flex items-center justify-center"
            >
              <span
                class="text-white px-2 py-1 rounded-xl bg-[#4460c7] opacity-0 group-hover:opacity-100 text-xs"
              >
                Use This
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Custom scrollbar chỉ cho phần Recently Uploaded */
.recently-uploaded-scroll::-webkit-scrollbar {
  width: 6px;
}

.recently-uploaded-scroll::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 3px;
}

.recently-uploaded-scroll::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.recently-uploaded-scroll::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>
