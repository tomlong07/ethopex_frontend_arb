<template>
  <div class="w-full flex flex-col mt-2">
    <!-- Preview Image -->
    <div v-if="domainConfig.dataConfig.logo" class="mb-2">
      <img
        :src="domainConfig.Logo"
        alt="Logo Preview"
        class="h-16 object-cover rounded border"
      />
    </div>

    <!-- Input and Upload Button -->
    <div class="flex gap-2">
      <FloatingWrapper name="Logo" rounded>
        <n-input
          v-model:value="domainConfig.dataConfig.logo"
          :loading="domainConfig.isLoading"
          :disabled="domainConfig.isLoading || domainConfig.isDisable"
          placeholder="Or paste logo URL here..."
          clearable
        />
      </FloatingWrapper>

      <div>
        <n-upload
          :action="FULL_URL_MEDIA"
          :show-file-list="false"
          accept="image/png, image/jpeg, image/svg+xml"
          :on-before-upload="beforeUpload()"
          :on-finish="handleUploadFinish()"
        >
          <n-button
            class="my-1"
            type="primary"
            :loading="isUrlLoading"
            :disabled="
              isUrlLoading || domainConfig.isLoading || domainConfig.isDisable
            "
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
    </div>
  </div>
</template>

<script setup lang="ts">
import useDomainManagerStore from '@/store/details/useDomainManager'
import Upload from '@/assets/icons/Upload.vue'
import FloatingWrapper from '../common/FloatingWrapper.vue'
import { FULL_URL_MEDIA, URL_UPLOAD } from '@/constants/urls'

const domainConfig = useDomainManagerStore()
const isUrlLoading = ref<boolean>(false)

const beforeUpload = () => {
  return async (data: any) => {
    isUrlLoading.value = true

    // Kiểm tra file type
    const imageTypes = ['image/jpeg', 'image/png', 'image/svg+xml']
    const fileExtension = data.file.type?.toLowerCase()
    const isImage = fileExtension && imageTypes.includes(fileExtension)

    if (!isImage) {
      window.message.error('Only JPEG, PNG and SVG images are allowed.')
      isUrlLoading.value = false
      return false
    }

    // Kiểm tra kích thước file (optional - giới hạn 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (data.file.file.size > maxSize) {
      window.message.error('File size must be less than 5MB.')
      isUrlLoading.value = false
      return false
    }

    return true
  }
}

const handleUploadFinish = () => {
  return ({ file, event }: { file: any; event?: any }) => {
    try {
      const result = JSON.parse(event?.target?.response || '{}')

      if (result?.status === 'success' && result?.data_object?.thumb[0]) {
        const imageUrl = result.data_object.thumb[0]
        const fullUrl = URL_UPLOAD + imageUrl

        // Cập nhật logo cho domain config
        domainConfig.dataConfig.logo = fullUrl

        window.message.success('Logo uploaded successfully!')
      } else {
        window.message.error('Upload failed, please try again.')
      }
    } catch (error) {
      console.error('Upload error:', error)
      window.message.error('Failed to upload logo')
    } finally {
      isUrlLoading.value = false
    }
  }
}
</script>

<style scoped lang="scss">
// Có thể thêm custom styles nếu cần
</style>
