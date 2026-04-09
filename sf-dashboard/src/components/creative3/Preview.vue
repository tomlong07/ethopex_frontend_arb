<script setup lang="ts">
import {
  CreativeStateManager,
  creativeTypeClass,
  images as imgType,
  StatusCreativeManager,
} from '@/types/components/creative-v2'
import { UploadCustomRequestOptions, UploadFileInfo } from 'naive-ui'
import { ctr_creative } from '@/services/ctr_creative'
import ImageEditorIcon from '@/assets/icons/ImageEditorIcon.vue'
import { URL_UPLOAD } from '@/constants/urls'
import useGeneralStore from '@/store/useGeneralStore'

const generalStore = useGeneralStore()

import { useLocale } from '@/lang/messages'

const Creative = useLocale(
  () => import('@/lang/vi/creative'),
  () => import('@/lang/en/creative')
)

const MAX_THUMB = 950

const props = defineProps({
  cre: {
    type: Object as () => creativeTypeClass,
    required: true,
  },

  status: {
    type: Object as () => StatusCreativeManager,
    required: true,
  },

  stateManager: {
    type: Object as () => CreativeStateManager,
    required: true,
  },
})

const isVideo = (i?: imgType): boolean => {
  return i?.image?.includes('.mp4') || i?.image?.includes('.mov') || false
}

const isYoutube = (i?: imgType): boolean => {
  return (
    i?.image?.includes('youtube') || i?.image?.includes('youtu.be') || false
  )
}

const isImage = (i?: imgType): boolean => {
  return !isVideo(i) && !isYoutube(i)
}

const src = (path: string | undefined) => {
  if (path?.includes('http') || path?.includes('https')) {
    return path
  }
  const defaultImage = generalStore.isDark
    ? '/data/image/thumb_1763023664211892762_617e988c1936cd49eb1b6477c52b9f8a.png'
    : '/assets/img/thumb_007cc1f0c93c0758ea61a23e0888891a.png'
  return `${URL_UPLOAD}${path ? path : defaultImage}`
}

const isNotPreview = computed<boolean>(() => {
  return !props.status.previewItem || !props.status.previewItem?.image
})

const showImageEditor = () => {
  props.status.editingImage = helper.clone(props.status.previewItem?.image)
  props.status.showModal = true
}

const validateThumbnail = async (data: {
  file: UploadFileInfo
  fileList: UploadFileInfo[]
}) => {
  const isImage = data.file.type?.startsWith('image/')

  const fileData = data.file.file

  if (!isImage || !(fileData instanceof File)) {
    window.message.error(Creative.value.only_img)
    return false
  }

  const fileSize = fileData?.size

  if (!fileSize) {
    window.message.error('File size is missing')
    return false
  }
  if (fileSize / 1024 >= MAX_THUMB) {
    window.message.error(`${Creative.value.max_thumb} ${MAX_THUMB}KB.`)
    return false
  }

  return true
}

const isThumbUploading = ref<boolean>(false)

const customThumbnailRequest = async ({
  file,
}: UploadCustomRequestOptions & { index?: number }) => {
  if (file.file instanceof File && file.status === 'pending') {
    file.status = 'uploading'

    isThumbUploading.value = true
    props.status.isUploadingThumbnail = true
    const formData = new FormData()
    formData.append('file', file.file as File)

    const result = await ctr_creative.uploadImage(formData)

    if (result?.status === 'success') {
      if (props.status.previewItem) {
        props.status.previewItem.thumb = result.data_object.thumb[0]
      }
      file.status = 'finished'
    } else {
      file.status = 'error'
    }
    props.status.isUploadingThumbnail = false
    isThumbUploading.value = false
  }
}

const onRemoveThumbnail = () => {
  if (props.status.previewItem) {
    props.status.previewItem.thumb = ''
  }
}

const buildEmbedUrl = (url: string) => {
  const videoId = helper.youtubeVideoID(url)

  if (!videoId) {
    window.message.error('Invalid YouTube video URL:')
    return
  }

  return `https://www.youtube.com/embed/${videoId}`
}
const removeEdit = ['facebook', 'tiktok']

const isShowEditor = computed(() => {
  if (
    props.status.previewItem?.image &&
    props.status.showEditPreview &&
    (props.cre.type
      ? !removeEdit.includes(props.cre.type.toLowerCase())
      : false)
  ) {
    return true
  }

  return false
})
const displayPreview = computed(() => {
  if (props.cre.images && props.cre.images.length > 0) {
    const firstImage = props.cre.images[0]
    return firstImage.image?.includes('.mp3') ?? false
  }
  return false
})
</script>

<template>
  <n-card
    v-if="!props.cre.IsSnapchat() && !displayPreview"
    class="rounded-[5px] !border-gray2"
  >
    <template #header>
      <div class="flex justify-between items-center">
        <span>Preview</span>
        <n-button
          v-if="isShowEditor && isImage(props.status.previewItem)"
          type="info"
          size="small"
          ghost
          @click="showImageEditor"
        >
          <span class="flex flex-row gap-1 items-center">
            <n-icon size="16"><ImageEditorIcon /></n-icon>
            Editor
          </span>
        </n-button>
      </div>
    </template>

    <div id="preview" class="flex justify-center">
      <div
        v-if="isVideo(props.status.previewItem)"
        class="w-1/2 flex justify-center"
      >
        <div class="flex flex-col w-full">
          <video
            :key="src(props.status.previewItem?.image)"
            class="flex items-center w-full min-h-[300px] rounded-md"
            controls
            preload="none"
            :poster="
              props.status.previewItem?.thumb
                ? src(props.status.previewItem?.thumb)
                : undefined
            "
          >
            <source
              type="video/mp4"
              :src="src(props.status.previewItem?.image)"
            />
          </video>
        </div>
      </div>

      <div
        v-if="isYoutube(props.status.previewItem)"
        class="w-1/2 flex justify-center"
      >
        <div class="flex flex-col w-full">
          <iframe
            class="flex items-center shadow-md media-cre w-full"
            style="aspect-ratio: 16/9"
            :src="buildEmbedUrl(props.status?.previewItem?.image || '')"
            title="YouTube video player"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerpolicy="strict-origin-when-cross-origin"
            allowfullscreen
          ></iframe>
        </div>
      </div>

      <div v-if="isImage(props.status.previewItem)">
        <n-image
          class="flex items-center rounded-md"
          :src="src(props.status.previewItem?.image)"
          :preview-disabled="isNotPreview"
          :width="generalStore.isDark ? 130 : undefined"
          :height="generalStore.isDark ? 130 : undefined"
          style="overflow: hidden"
        />
      </div>
    </div>

    <div
      v-if="isVideo(props.status.previewItem)"
      class="font-medium mt-4 flex flex-col items-center"
    >
      <div class="flex flex-wrap">
        <p class="dark-mode-p">Thumbnail:</p>

        <template v-if="isThumbUploading">
          <n-spin size="small" />
        </template>

        <n-upload
          :show-file-list="false"
          :custom-request="
            ({ file }: UploadCustomRequestOptions) =>
              customThumbnailRequest({
                file,
              } as UploadCustomRequestOptions)
          "
          @before-upload="validateThumbnail"
        >
          <n-button class="ml-2 mb-4" size="small"> Upload thumbnail </n-button>
        </n-upload>
        <n-button class="ml-2 mb-4" size="small" @click="onRemoveThumbnail()">
          Remove thumbnail
        </n-button>
      </div>

      <n-image
        class="cursor-pointer img pl-0 h-52 rounded-md"
        object-fit="contain"
        v-if="props.status.previewItem?.thumb"
        :src="src(props.status.previewItem?.thumb)"
      />
    </div>
  </n-card>
</template>
