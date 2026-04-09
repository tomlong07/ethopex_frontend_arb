<script setup lang="ts">
import { UploadFileInfo } from 'naive-ui'
import CardImage from '@/assets/icons/CardImage.vue'
import { ctr_creative } from '@/services/ctr_creative'
import { URL_UPLOAD } from '@/constants/urls'

const props = defineProps({
  show: { type: Boolean, default: false },
  editImagePath: { type: String, default: '' },
})

const emit = defineEmits(['update:show', 'apply-image', 'open-gallery'])

const showModal = computed({
  get: () => props.show,
  set: (value) => emit('update:show', value),
})

const imageUrl = ref<string>('')
const previewImage = ref<string>('')
const isUploading = ref(false)
const isUrlLoading = ref(false)

const handleUrlSubmit = async () => {
  if (!isValidImageUrl(imageUrl.value)) {
    window.message.error('Please enter a valid image URL')
    return
  }

  isUrlLoading.value = true

  try {
    const host = URL_UPLOAD
    if (imageUrl.value.startsWith(host)) {
      previewImage.value = imageUrl.value
      imageUrl.value = imageUrl.value.replace(host, '')

      emit('apply-image', imageUrl.value)
    } else {
      const response = await fetch(imageUrl.value)
      const blob = await response.blob()
      const file = new File(
        [blob],
        imageUrl.value.split('/').pop() || 'url-img.jpg',
        {
          type: blob.type,
        }
      )

      await uploadFile({
        file: {
          file,
          name: file.name,
          status: 'pending',
          percentage: 0,
          type: file.type,
          url: '',
        } as UploadFileInfo,
      })
    }
  } catch {
    window.message.error(
      'This image URL may be blocked. Please download the image manually and upload it instead, or try a different URL.',
      { closable: true }
    )
  } finally {
    isUrlLoading.value = false
  }
}

const uploadFile = async ({ file }: { file: UploadFileInfo }) => {
  if (file.file instanceof File && file.status === 'pending') {
    isUploading.value = true
    const formData = new FormData()
    formData.append('file', file.file)

    try {
      const result = await ctr_creative.uploadImage(formData)
      if (result?.status === 'success') {
        const uploadedPath = result?.data_object?.thumb?.[0] || ''
        previewImage.value = helper.src(uploadedPath)
        emit('apply-image', uploadedPath)
      } else {
        window.message.error(JSON.stringify(result?.errors || 'Upload failed'))
      }
    } catch {
      window.message.error(
        'This image URL may be blocked. Please download the image manually and upload it instead, or try a different URL.',
        { closable: true }
      )
    } finally {
      isUploading.value = false
    }
  }
}

const handleCancel = () => {
  showModal.value = false
}

const handleModalClose = (value: boolean) => {
  if (!value) resetForm()
}

const openGallery = () => {
  emit('open-gallery')
}

const resetForm = () => {
  imageUrl.value = ''
  previewImage.value = ''
  isUploading.value = false
  isUrlLoading.value = false
}

watch(
  () => props.show,
  (visible) => {
    if (visible && props.editImagePath) {
      previewImage.value = helper.src(props.editImagePath)
      imageUrl.value = URL_UPLOAD + props.editImagePath
    } else if (!visible) {
      resetForm()
    }
  }
)

const isValidImageUrl = (url: string): boolean => {
  return /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp|svg)(\?.*)?$/i.test(url)
}
</script>

<template>
  <n-modal v-model:show="showModal" @update:show="handleModalClose">
    <n-card
      style="width: 65%; height: 90vh"
      title="Upload Image"
      size="huge"
      role="dialog"
      aria-modal="true"
      :bordered="false"
      class="card-flex-gap-4 overflow-auto relative"
    >
      <div class="flex flex-col gap-4">
        <!-- URL Input Section -->
        <div class="flex flex-col gap-2">
          <div class="flex gap-2">
            <n-input
              v-model:value="imageUrl"
              placeholder="Enter image URL"
              :disabled="isUploading"
              @keyup.enter="handleUrlSubmit"
            />
            <n-button
              type="primary"
              :disabled="!imageUrl || isUploading"
              :loading="isUrlLoading"
              @click="handleUrlSubmit"
            >
              Add from URL
            </n-button>
          </div>
        </div>

        <!-- Upload Section -->
        <n-upload
          class="h-18 w-full"
          directory-dnd
          :accept="'image/*'"
          :show-file-list="false"
          :default-upload="false"
          :on-change="uploadFile"
          :disabled="isUploading"
        >
          <n-upload-dragger class="w-full h-18 items-center">
            <n-text>Drag and drop files or click to upload</n-text>
          </n-upload-dragger>
        </n-upload>

        <div class="flex justify-end">
          <n-button size="medium" @click="openGallery" :disabled="isUploading">
            Gallery
          </n-button>
        </div>
        <!-- Loading -->
        <div v-if="isUploading" class="flex justify-center">
          <n-spin size="large" />
        </div>

        <!-- Preview Section -->
        <div class="flex flex-col gap-2">
          <div class="font-bold">Preview</div>

          <div class="flex justify-center">
            <div class="h-[27rem] w-full flex items-center justify-center">
              <n-image
                v-if="previewImage"
                :src="previewImage"
                object-fit="contain"
                class="max-w-full max-h-full"
              />
              <n-icon v-else size="440" class="text-gray-300"
                ><CardImage
              /></n-icon>
            </div>
          </div>
        </div>
      </div>

      <div class="flex justify-end sticky bottom-0 p-4">
        <n-button size="small" @click="handleCancel" :disabled="isUploading">
          Cancel
        </n-button>
      </div>
    </n-card>
  </n-modal>
</template>
