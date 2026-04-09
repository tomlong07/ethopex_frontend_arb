<script setup lang="ts">
import {
  CreativeStateManager,
  creativeTypeClass,
  images as imgType,
  StatusCreativeManager,
} from '@/types/components/creative-v2'
import RemoveButton from '@/components/creative3/RemoveButton.vue'
import VideoIcon from '@/components/creative3/VideoIcon.vue'

import { SelectOption } from 'naive-ui'
import { ctr_creative } from '@/services/ctr_creative'
import { SiteNameStatus } from '@/options/creative'
import { URL_UPLOAD } from '@/constants/urls'
import ErrorIcon from '@/assets/icons/ErrorIcon.vue'
import useUploadMediaCreativeStore from '@/store/useUploadMediaCreativeStore'

const props = defineProps({
  cre: {
    type: Object as () => creativeTypeClass,
    required: true,
  },

  stateManager: {
    type: Object as () => CreativeStateManager,
    required: true,
  },

  status: {
    type: Object as () => StatusCreativeManager,
    required: true,
  },
})

const contentFromUrl = computed(() => {
  return window.route?.query?.content ?? null
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
  return !isVideo(i) && !isYoutube(i) && !isAudio(i)
}

const isAudio = (item: any) => {
  if (item.image && typeof item.image === 'string') {
    return item.image.includes('.mp3') || item.image.includes('.m4a')
  }

  return false
}

// kiểm tra nếu media summary = content từ URL
const isMediaHighlighted = (mediaItem: imgType): boolean => {
  if (!contentFromUrl.value || !mediaItem) return false
  const currentMedia = props.cre.ImageShow(mediaItem.image)
  const mediaSummary = currentMedia?.media_summary?.toString().toLowerCase()
  const content = contentFromUrl.value.toString().toLowerCase()

  return mediaSummary === content
}

const isUploading = ref<boolean>(false)

const handleUpdateValue = async (
  value: string,
  option: SelectOption,
  i: imgType
) => {
  isUploading.value = true
  const payload = {
    option: 'image',
    status: value,
    value: `${i.id}`,
    id: props.cre.id, //Thêm để log
  }
  const result = await ctr_creative.ChangeStatusOption(payload)
  if (result?.status) {
    window.message.success('Status updated successfully')
    i.status = value
  }
  isUploading.value = false
}
const useMediaStore = useUploadMediaCreativeStore()

const onRemoveImage = async (i: imgType) => {
  props.cre.images = props.cre.images.filter((item) => item.image !== i.image)
  if (props.status.previewItem?.image === i.image) {
    props.status.previewItem = undefined
  }

  props.status.base64Image = await helper.urlToBase64(src(i.image))
  useMediaStore.removeBase64(String(props.status.base64Image))
}

const onClickMedia = (index: number, e: Event) => {
  if (
    (e.target as HTMLElement).classList?.contains('remove-media') ||
    (e.target as HTMLElement).closest('.remove-media')
  ) {
    return
  }

  props.status.previewItem = props.cre.images[index]
  props.status.indexMedia = index
  const previewDiv = document.getElementById('preview')

  if (previewDiv) {
    previewDiv.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  const imageTransformDiv = document.getElementById('image-transform')

  if (imageTransformDiv) {
    if (props.status.previewItem?.image) {
      const goto = imageTransformDiv.querySelector(
        `img[src="${src(props.status.previewItem?.image)}"]`
      )

      if (goto) {
        goto.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    }
  }
}

const src = (path: string | undefined) => {
  if (path?.includes('http') || path?.includes('https')) {
    return path
  }
  return `${URL_UPLOAD}${
    path ? path : '/assets/img/thumb_007cc1f0c93c0758ea61a23e0888891a.png'
  }`
}

const buildThumbnailYoutube = (url: string) => {
  const videoId = helper.youtubeVideoID(url)
  if (!videoId) {
    window.message.error('Invalid YouTube video URL')
    return
  }

  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
}

const invalidImages = computed(() => {
  return (
    props.cre.ai_verify?.images
      ?.filter((element) => element.isError())
      ?.map((element) => helper.removeDomainAndParams(element.url)) || []
  )
})

const invalidVideos = computed(() => {
  return (
    props.cre.ai_verify?.videos
      ?.filter((element) => element.isError())
      ?.map((element) => helper.removeDomainAndParams(element.video)) || []
  )
})

const titleInvalid = (image: string) => {
  if (image.includes('.mp4')) {
    return props.cre.ai_verify?.videos?.find(
      (element) => helper.removeDomainAndParams(element.video) === image
    )?.explanation
  }

  return props.cre.ai_verify?.images?.find(
    (element) => helper.removeDomainAndParams(element.url) === image
  )?.explanation
}

const invalidItemMedia = (url: string) => {
  if (url.includes('.mp4')) {
    return invalidVideos.value.includes(helper.removeDomainAndParams(url))
  }
  return invalidImages.value.includes(helper.removeDomainAndParams(url))
}

const isDev = window.arb.isDev()

const mediaIsError = (item: imgType) => {
  return item.log && isDev
}

const getMediaItemClass = (item: any) => {
  const baseClasses = [
    'flex',
    'justify-between',
    'flex-col',
    'p-2',
    'mr-2',
    'mb-2',
    'border-2',
    'rounded-lg',
    'cursor-pointer',
    'relative',
    'items-center',
  ]

  // Nếu là audio, không thêm các class này
  if (!isAudio(item)) {
    baseClasses.push('w-44', 'hover:border-blue-300')
  } else {
    // Class riêng cho audio nếu cần
    baseClasses.push('w-auto', 'min-w-44') // hoặc class khác phù hợp với audio
  }

  // Conditional classes
  const conditionalClasses = []

  // Border color khi được select
  if (
    props.status.previewItem &&
    props.status.previewItem?.image === item.image
  ) {
    conditionalClasses.push('border-blue-500')
  }

  // Border color khi invalid
  if (invalidItemMedia(item.image)) {
    conditionalClasses.push('border-red-500')
  }

  if (isMediaHighlighted(item)) {
    conditionalClasses.push('border-blue-500', 'bg-blue-50')
  }
  if (mediaIsError(item)) {
    conditionalClasses.push('border-red-300')
  }

  return [...baseClasses, ...conditionalClasses]
}
</script>

<template>
  <n-spin :show="props.status.isUploading">
    <div class="flex flex-wrap justify-center">
      <div
        v-for="(i, index) in props.cre.images"
        :key="index + i.image"
        :class="getMediaItemClass(i)"
        :title="titleInvalid(i.image)"
        @click="onClickMedia(index, $event)"
      >
        <div class="media">
          <!-- image/video -->
          <div class="flex justify-center mt-2 max-h-40 media-item-element">
            <n-image
              v-if="isImage(i)"
              preview-disabled
              width="150"
              class="flex items-center shadow-md media-cr"
              :src="src(i.image)"
              object-fit="contain"
            />

            <video
              v-if="isVideo(i)"
              class="flex items-center shadow-md media-cre"
              width="150"
              :poster="i.thumb ? src(i.thumb) : undefined"
            >
              <source type="video/mp4" :src="src(i.image)" />
            </video>

            <n-image
              v-if="isYoutube(i)"
              preview-disabled
              width="150"
              class="flex items-center shadow-md media-cre"
              :src="buildThumbnailYoutube(i.image)"
              object-fit="contain"
            />

            <audio v-if="isAudio(i)" controls>
              <source :src="src(i.image)" />
            </audio>
          </div>

          <!-- detail -->
          <div>
            <div
              class="flex items-center my-2"
              v-if="
                props.stateManager.isEditPage() && !props.stateManager.isModalAd
              "
            >
              <div class="font-medium text-xs w-10">Status</div>
              <div class="w-28 ml-2" @click.stop>
                <n-select
                  v-model:value="i.status"
                  size="tiny"
                  :options="SiteNameStatus"
                  :loading="isUploading"
                  :disabled="!i.status || !i.id"
                  :on-update:value="(value: string, option: SelectOption) => handleUpdateValue(value, option, i)"
                />
              </div>
            </div>
          </div>
        </div>
        <div class="absolute top-1 left-1" v-if="mediaIsError(i)">
          <div
            class="size-5 rounded-full bg-red-100 flex items-center justify-center"
          >
            <n-tooltip trigger="hover">
              <template #trigger>
                <n-icon size="16" color="red" :component="ErrorIcon" />
              </template>
              <div class="max-w-xs">{{ i.log }}</div>
            </n-tooltip>
          </div>
        </div>

        <VideoIcon v-if="isVideo(i)" />
        <RemoveButton @onClick="() => onRemoveImage(i)" />
      </div>
    </div>
  </n-spin>
</template>

<style scoped>
.border-blue-400 {
  border-color: #fbbf24 !important;
  box-shadow: 0 0 8px rgba(251, 191, 36, 0.5);
}

.bg-blue-50 {
  background-color: #ebeefa !important;
}
</style>
