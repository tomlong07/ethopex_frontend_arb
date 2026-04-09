<script setup lang="ts">
import ImageInfoForm from './layout/ImageInfoForm.vue'
import ImagePreview from './layout/ImagePreview.vue'
import UploadTab from './layout/UploadTab.vue'
import GalleryTab from './layout/GalleryTab.vue'
import ModalFooter from './layout/ModalFooter.vue'
import TabHeader from './layout/TabHeader.vue'
import { useImagePropertiesStore } from '@/store/useImageProperties'
import Close from '@/assets/icons/Close.vue'

interface Props {
  show: boolean
  editorInstance: any
  editorId: string
  editorType?: string
  editingImageElement?: HTMLImageElement | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:show', value: boolean): void
  (e: 'imageSelected', imageSrc: string): void
}>()

// Use store
const store = useImagePropertiesStore()

// Computed để lấy data từ store
const activeTab = computed(() => store.activeTab)

// Event handlers - delegate to store
const handleClose = () => {
  emit('update:show', false)
  store.resetForm()
}

const handleOk = () => {
  const imageUrl = store.insertImageToEditor(
    props.editorInstance,
    props.editingImageElement
  )
  if (imageUrl) {
    emit('imageSelected', imageUrl)
    handleClose()
  }
}

watchEffect(() => {
  if (props.editorType) {
    store.dataModalGallery.editorType = props.editorType
  }
  if (props.editorId) {
    store.dataModalGallery.currentEditorId = props.editorId
  }

  // Load data khi modal mở
  if (props.show) {
    store.loadRecentlyUploadedImages()

    // Load image data nếu đang edit
    if (props.editingImageElement) {
      store.loadImageDataFromElement(props.editingImageElement)
    }
  }
})
</script>

<template>
  <n-modal
    v-model:show="props.show"
    :mask-closable="true"
    :auto-focus="false"
    @update:show="$emit('update:show', $event)"
    :closable="false"
    preset="card"
    style="width: calc(100vw - 20px); height: calc(100vh - 20px)"
    role="dialog"
    aria-modal="true"
    class="image-properties-modal"
  >
    <div
      class="modal-container flex flex-col"
      style="height: 100%; max-height: 90vh"
    >
      <!-- Header with Title and Close button -->
      <div class="flex items-center justify-between py-2">
        <h3 class="text-xl font-medium">
          {{
            props.editingImageElement
              ? 'Edit Image Properties'
              : 'Image Properties'
          }}
        </h3>
        <n-button quaternary circle @click="handleClose">
          <n-icon size="18" class="not-filter-icon">
            <Close />
          </n-icon>
        </n-button>
      </div>

      <TabHeader />

      <div class="flex-1 min-h-0 py-2">
        <div v-if="activeTab === 'info'">
          <div
            class="max-[1040px]:max-h-96 max-[1040px]:overflow-y-auto md:h-full md:overflow-visible"
          >
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
              <div class="lg:col-span-1">
                <ImageInfoForm />
              </div>

              <div class="lg:col-span-2">
                <ImagePreview />
              </div>
            </div>
          </div>
        </div>
        <UploadTab v-if="activeTab === 'upload'" />
        <GalleryTab v-if="activeTab === 'gallery'" />
      </div>
      <ModalFooter
        v-if="activeTab === 'info'"
        :editingImageElement="props.editingImageElement"
        :editorInstance="props.editorInstance"
        :onClose="handleClose"
        :onOk="handleOk"
      />
    </div>
  </n-modal>
</template>

<style scoped>
/* Custom scrollbar styles */
.overflow-y-auto::-webkit-scrollbar,
.overflow-auto::-webkit-scrollbar {
  width: 4px;
  height: 4px;
}

.overflow-y-auto::-webkit-scrollbar-track,
.overflow-auto::-webkit-scrollbar-track {
  background: #f8f9fa;
  border-radius: 2px;
}

.overflow-y-auto::-webkit-scrollbar-thumb,
.overflow-auto::-webkit-scrollbar-thumb {
  background: #cbd5e0;
  border-radius: 2px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover,
.overflow-auto::-webkit-scrollbar-thumb:hover {
  background: #a0aec0;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .grid-cols-2 {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }
  .grid-cols-3 {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }
}

:deep(.n-card__content) {
  padding-right: 8px !important;
}
</style>
