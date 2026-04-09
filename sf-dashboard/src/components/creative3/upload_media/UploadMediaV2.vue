<script setup lang="ts">
import {
  creativeTypeClass,
  StatusCreativeManager,
} from '@/types/components/creative-v2'

import useUploadMediaCreativeStore from '@/store/useUploadMediaCreativeStore'
import { FULL_URL_MEDIA } from '@/constants/urls'

const useMediaStore = useUploadMediaCreativeStore()

const props = defineProps({
  cre: {
    type: Object as () => creativeTypeClass,
    required: true,
  },
  status: {
    type: Object as () => StatusCreativeManager,
    required: true,
  },
  label: {
    type: String,
    default: '',
  },
})

const beforeUpload = async (file: any) => {
  const ok = await useMediaStore.beforeUpload(file, props.cre, props.status)
  if (ok) {
    await useMediaStore.uploadListMedia(props.cre, props.status)
  }

  return false
}
</script>
<template>
  <div v-if="props.label" class="font-bold">{{ props.label }}</div>
  <n-upload
    multiple
    directory-dnd
    :action="FULL_URL_MEDIA"
    class="mb-2"
    :show-file-list="false"
    :disabled="
      props.status.isUploading ||
      useMediaStore.isReachMaxFileUpload(props.cre, props.status)
    "
    :default-upload="false"
    :on-before-upload="beforeUpload"
  >
    <n-upload-dragger>
      <n-text style="font-size: 16px">
        Drag and drop files or click to upload
      </n-text>
    </n-upload-dragger>
  </n-upload>
</template>
