<script lang="ts" setup>
import { campaignTypeClass } from '@/types/components/campaign-v2'
import { prelanderConfigs } from '@/types/components/landing'
import Upload from '@/assets/icons/Upload.vue'
import FloatingWrapper from '../common/FloatingWrapper.vue'
import { FULL_URL_MEDIA, URL_UPLOAD } from '@/constants/urls'

const id = computed<number>(() => Number(window.route.params.id || 0))
const isAddPage = computed<boolean>(() => id.value === 0)

const props = defineProps({
  campaign: {
    type: Object as () => campaignTypeClass,
    required: false,
  },
  landing: {
    type: Object as () => prelanderConfigs,
    required: false,
  },
})

// Computed để lấy unlock_content từ campaign hoặc landing
const unlockContent = computed(() => {
  return (
    props.campaign?.ad_formats?.unlock_content || props.landing?.unlock_content
  )
})

// Computed để lấy dialog từ unlock_content
const dialog = computed(() => {
  return unlockContent.value?.dialog
})
const isUrlLoading = ref(false)
const debounceTimeout = ref<NodeJS.Timeout | null>(null)

const isValidImageUrl = (url: string) => {
  if (!url) return false
  try {
    new URL(url)
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp']
    const urlLower = url.toLowerCase()
    return (
      imageExtensions.some((ext) => urlLower.includes(ext)) ||
      urlLower.includes('image') ||
      url.startsWith('data:image/') ||
      url.startsWith(URL_UPLOAD)
    )
  } catch {
    return false
  }
}

const beforeUpload = () => {
  return async (data: any) => {
    isUrlLoading.value = true
    const imageTypes = ['image/jpeg', 'image/png', 'image/svg+xml']
    const fileExtension = data.file.type?.toLowerCase()
    const isImage = fileExtension && imageTypes.includes(fileExtension)

    if (!isImage) {
      window.message.error('Only JPEG, PNG and SVG images are allowed.')
      isUrlLoading.value = false
      return false
    }

    const img = document.createElement('img')
    const isValidDimension = await new Promise((resolve) => {
      img.onload = () => resolve(img.naturalWidth / img.naturalHeight >= 1)
      img.onerror = () => resolve(false)
      img.src = URL.createObjectURL(data.file.file)
    })

    URL.revokeObjectURL(img.src)

    if (!isValidDimension) {
      window.message.error(
        'Image must be square or landscape (horizontal rectangle)',
        { closable: true }
      )
      isUrlLoading.value = false
      return false
    }
    return true
  }
}

const uploadFile = async (fileInfo: any) => {
  const formData = new FormData()
  formData.append('file', fileInfo.file.file)

  try {
    const response = await fetch(FULL_URL_MEDIA, {
      method: 'POST',
      body: formData,
    })

    const { status, data_object } = await response.json()

    if (status !== 'success' || !data_object?.thumb[0]) {
      throw new Error('Upload failed')
    }

    const fullUrl = URL_UPLOAD + data_object.thumb[0]

    // Cập nhật image cho both campaign và landing
    const dialogs = [
      props.campaign?.ad_formats?.unlock_content?.dialog,
      props.landing?.unlock_content?.dialog,
    ].filter((dialog): dialog is NonNullable<typeof dialog> => Boolean(dialog))

    dialogs.forEach((dialog) => (dialog.image = fullUrl))

    window.message.success('Image uploaded successfully!')
  } catch (error) {
    console.error('Upload error:', error)
    window.message.error('Failed to upload image')
  }
}

const handleUploadFinish = () => {
  return ({ file, event }: { file: any; event?: any }) => {
    try {
      const result = JSON.parse(event?.target?.response || '{}')

      if (result?.status === 'success' && result?.data_object?.thumb[0]) {
        const imageUrl = result.data_object.thumb[0]
        const fullUrl = URL_UPLOAD + imageUrl

        // Cập nhật image cho cả campaign và landing
        if (props.campaign?.ad_formats?.unlock_content?.dialog) {
          props.campaign.ad_formats.unlock_content.dialog.image = fullUrl
        }

        if (props.landing?.unlock_content?.dialog) {
          props.landing.unlock_content.dialog.image = fullUrl
        }

        window.message.success('Image uploaded successfully!')
      } else {
        window.message.error('Upload failed, please try again.')
      }
    } catch (error) {
      console.error('Upload error:', error)
      window.message.error('Failed to upload image')
    } finally {
      isUrlLoading.value = false
    }
  }
}
// Hàm xử lý URL submit với debounce (tự động)
const processImageUrl = async (url: string) => {
  if (!url || !isValidImageUrl(url) || url.startsWith(URL_UPLOAD))
    return

  if (!isValidImageUrl(url)) {
    window.message.error('Please enter a valid image URL')
    return
  }

  isUrlLoading.value = true

  try {
    const response = await fetch(url)
    if (!response.ok) throw new Error('Failed to fetch image')

    const blob = await response.blob()
    const fileName = url.split('/').pop() || 'url-img.jpg'
    const file = new File([blob], fileName, { type: blob.type })

    await uploadFile({
      file: {
        file,
        name: fileName,
        status: 'pending',
        percentage: 0,
        type: file.type,
        url: '',
      },
    })
  } catch {
    window.message.error(
      'This image URL may be blocked. Please download the image manually and upload it instead, or try a different URL.',
      { closable: true }
    )
    imageUrl.value = ''
  } finally {
    isUrlLoading.value = false
  }
}

// Debounced function để xử lý URL
const handleUrlChange = (newUrl: string) => {
  // Clear timeout cũ nếu có
  if (debounceTimeout.value) {
    clearTimeout(debounceTimeout.value)
  }

  // Set timeout mới với delay 1.5 giây
  debounceTimeout.value = setTimeout(() => {
    processImageUrl(newUrl)
  }, 1500)
}

const imageUrl = computed({
  get: () => dialog.value?.image || '',
  set: (value: string) => {
    if (props.campaign?.ad_formats?.unlock_content?.dialog) {
      props.campaign.ad_formats.unlock_content.dialog.image = value
    }
    if (props.landing?.unlock_content?.dialog) {
      props.landing.unlock_content.dialog.image = value
    }

    // Tự động xử lý URL với debounce khi user nhập
    handleUrlChange(value)
  },
})

const loadFullImageUrl = () => {
  const img = dialog.value?.image
  if (!img || isAddPage.value) return

  const isExternalUrl =
    img.startsWith('http://') ||
    img.startsWith('https://') ||
    img.startsWith('data:image/')

  if (!isExternalUrl && !img.startsWith(URL_UPLOAD)) {
    const fullUrl = URL_UPLOAD + img

    if (props.campaign?.ad_formats?.unlock_content?.dialog) {
      props.campaign.ad_formats.unlock_content.dialog.image = fullUrl
    }
    if (props.landing?.unlock_content?.dialog) {
      props.landing.unlock_content.dialog.image = fullUrl
    }
  }
}

watch(
  () => dialog.value?.image,
  (newImage) => {
    if (
      newImage &&
      !isAddPage.value &&
      !newImage.startsWith(URL_UPLOAD)
    ) {
      loadFullImageUrl()
    }
  },
  { immediate: false }
)

onMounted(() => {
  loadFullImageUrl()
})

onUnmounted(() => {
  if (debounceTimeout.value) {
    clearTimeout(debounceTimeout.value)
  }
})

const name = 'Image'
</script>

<template>
  <div class="flex items-center mb-2">
    <div class="flex flex-row place-items-center gap-4 flex-1 min-w-0">
      <div class="flex-1 min-w-0">
        <!-- Image Upload Section -->
        <div class="flex flex-col gap-2" v-if="unlockContent">
          <div class="flex flex-row gap-2 items-center">
            <div class="flex-1 min-w-0 relative">
              <FloatingWrapper :name="name" medium rounded :placeholder="true">
                <n-input
                  v-model:value="imageUrl"
                  placeholder="Image URL (auto-upload external URLs)"
                  class="w-full"
                  :loading="isUrlLoading"
                />
              </FloatingWrapper>
            </div>

            <n-upload
              :action="FULL_URL_MEDIA"
              :show-file-list="false"
              accept="image/png, image/jpeg, image/svg+xml"
              :on-before-upload="beforeUpload()"
              :on-finish="handleUploadFinish()"
              class="w-[97px] flex-shrink-0"
            >
              <n-button
                secondary
                type="info"
                :loading="isUrlLoading"
                :disabled="isUrlLoading"
              >
                <template #icon>
                  <n-icon>
                    <Upload />
                  </n-icon>
                </template>
                Upload
              </n-button>
            </n-upload>
          </div>

          <!-- Image Preview -->
          <div v-if="dialog?.image" class="mt-2">
            <img
              :src="dialog.image"
              alt="Preview"
              class="max-w-xs max-h-32 object-cover rounded border"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
