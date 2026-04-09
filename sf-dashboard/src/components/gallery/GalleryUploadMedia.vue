<script setup lang="ts">
import {
  MediaLibraryClass,
  StatusMediaLibraryClass,
} from '@/types/components/gallery'
import { UploadCustomRequestOptions } from 'naive-ui'

import { validateImageThumb } from '../creative3/helper'
import { ctr_creative } from '@/services/ctr_creative'

const props = defineProps({
  dataMedia: {
    type: Object as () => MediaLibraryClass,
    required: true,
  },
  statusMedia: {
    type: Object as () => StatusMediaLibraryClass,
    required: true,
  },
})

const beforeUpload = async (data: any) => {
  const ok = await validateImageThumb(data)
  if (!ok) {
    return false
  }

  if (
    props.statusMedia.pendingFiles + (props.dataMedia.items?.length || 0) >=
    props.dataMedia.MAX_MEDIA
  ) {
    //Chỉ thông báo 1 lần nếu upload nhiều files, nếu message đã hủy thì thông báo lại
    if (!props.statusMedia.warning) {
      props.statusMedia.updateWarning(
        window.message.warning(
          `Too many files. You can only upload up to ${props.dataMedia.MAX_MEDIA} files.`,
          {
            onAfterLeave: () => {
              // Callback khi message bị xóa
              props.statusMedia.updateWarning(undefined)
            },
          }
        )
      )
    }

    return false
  }

  props.statusMedia.addPendingFile()
  // Increase the count of files pending processing (add at the start to keep logic consistent)
  // If an error occurs, call reducePendingFile to decrease the count

  props.statusMedia.addMediaToQueue(data.file)

  return true
}

const uploadListMedia = async () => {
  props.statusMedia.startUploading()

  if (props.statusMedia.isHasPendingFile()) {
    props.statusMedia.reducePendingFile()

    // Khi tất cả file đã sẵn sàng, upload chúng
    if (props.statusMedia.isReadyToUpload()) {
      props.dataMedia.isProcessing = true
      let ajax = []

      for (let index = 0; index < props.statusMedia.fileList.length; index++) {
        const element = props.statusMedia.fileList[index]
        ajax.push(
          customRequest({ file: element } as UploadCustomRequestOptions)
        )
      }

      await Promise.all(ajax)

      await props.dataMedia.uploadToDB() //Lưu vào db và push ra chỗ hiển thị

      props.statusMedia.resetFileList()
      props.statusMedia.endUploading()
      await props.dataMedia.refreshGallery()
      props.dataMedia.isProcessing = false
    }
  }
}

const customRequest = async ({ file }: UploadCustomRequestOptions) => {
  if (file.file instanceof File && file.status === 'pending') {
    file.status = 'uploading'
    props.statusMedia.startUploading()

    const formData = new FormData()
    formData.append('file', file.file as File)

    const result = await ctr_creative.uploadImage(formData)

    if (result?.status === 'success') {
      try {
        if (result?.data_object?.thumb[0]) {
          const newItem = {
            path: result?.data_object?.thumb[0] || '',
            name: helper.getNameFromFileName(file?.file?.name || ''),
            object: 'landing_page',
          }

          props.dataMedia.addItem(newItem)
          file.status = 'finished'
        } else {
          file.status = 'error'
        }
      } catch (error) {
        console.error('Error:', error)

        file.status = 'error'
      }
    } else {
      try {
        window.message.error(JSON.stringify(result?.errors))
      } catch {
        window.message.error('Upload failed')
      }

      file.status = 'error'
    }
  }
}

const isDisabled = computed(() => {
  return props.dataMedia.isMaxMedia() || props.statusMedia.isUploading
})
</script>
<template>
  <div class="flex justify-center">
    <n-upload
      class="h-24 w-64"
      directory-dnd
      multiple
      :accept="'image/*'"
      :show-file-list="false"
      :default-upload="false"
      :on-before-upload="beforeUpload"
      :on-change="uploadListMedia"
      :disabled="isDisabled"
    >
      <n-upload-dragger class="w-64">
        <n-text> Drag and drop files or click to upload </n-text>
      </n-upload-dragger>
    </n-upload>
  </div>
</template>
