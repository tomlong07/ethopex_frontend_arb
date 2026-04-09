<script setup lang="ts">
import {
  creativeTypeClass,
  images as imgType,
  StatusCreativeManager,
} from '@/types/components/creative-v2'

import { UploadFileInfo, UploadCustomRequestOptions } from 'naive-ui'
import Logging from '@/utils/Log'

import {
  processImage,
  checkRatio,
  checkVideoSizeAndRatio,
  checkTikTokImageRatio,
} from '@/components/creative3/helper'
import { ctr_creative } from '@/services/ctr_creative'
import { renderAdFormatContent } from '@/composables/useAdFormatContent'
import {
  RATIO_DEMAND,
  RATIO_NEWSBREAK,
  SIZE_RATIO,
  SNAP_HEIGHT,
  SNAP_RATIO,
  SNAP_WIDTH,
} from '@/constants/media'
import {
  LIMIT_IMAGE,
  LIMIT_VIDEO,
  LIMIT_VIDEO_SNAPCHAT,
} from '@/constants/limits'
import { FULL_URL_MEDIA } from '@/constants/urls'
import { useLocale } from '@/lang/messages'

const Creative = useLocale(
  () => import('@/lang/vi/creative'),
  () => import('@/lang/en/creative')
)
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

const maxFileUpload = computed(() => {
  if (props.cre.IsAcceptMultipleCreatives()) {
    if (props.cre.IsFacebookSingleImage()) return 100
    if (props.status.uploadMultipleCreative) return 30
    return 1
  }
  return props.cre.IsDemandGenVideo() ? 2 : 100
})

const base64Files = ref<string[]>([]) // Mảng chứa các file ảnh đã được chuyển đổi sang base64

const pendingFiles = ref<number>(0) // Số lượng file đang chờ xử lý

const beforeUpload = async (data: any) => {
  if (
    pendingFiles.value + (props.cre.images.length || 0) >=
    maxFileUpload.value
  ) {
    window.message.warning(
      `Too many files. You can only upload up to ${maxFileUpload.value} files.`
    )
    return false
  }

  const imageTypes = ['image/jpeg', 'image/png', 'image/bmp', 'image/gif']
  const audioType = ['audio/mpeg', 'audio/x-m4a']
  const isVideo =
    data.file.type === 'video/mp4' || data.file.type === 'video/quicktime'
  const fileExtension = data.file.type?.toLowerCase()
  const isImage = fileExtension && imageTypes.includes(fileExtension)
  const isAudio = fileExtension && audioType.includes(fileExtension)

  // if (props.cre.IsTikTok() && !isVideo) {
  //   window.message.warning('TikTok supports only video')
  //   return false
  // }

  if (
    !props.cre.IsFacebook() &&
    data.file &&
    data.file.type === 'video/quicktime'
  ) {
    window.message.warning('Only Facebook platform supports MOV format')
    return false
  }

  if (props.cre.IsFacebookSingleImage() && isVideo) {
    window.message.warning('Facebook Single Image ad only supports images')
    return false
  }

  if (props.cre.IsFacebookSingleVideo() && isImage) {
    window.message.warning('Facebook Single Video ad only supports videos')
    return false
  }

  pendingFiles.value += 1
  // Increase the count of files pending processing (add at the start to keep logic consistent)
  // If an error occurs, call reducePendingFile to decrease the count

  if (isImage) {
    try {
      const base64 = await helper.convertImageToBase64(data.file.file)

      if (base64Files.value.includes(base64)) {
        window.message.warning(Creative.value.img_exist)
        reducePendingFile()
        return false
      }
    } catch {}
  }

  if (props.cre.IsDemandGen()) {
    let text = ''
    if (isImage && props.cre.IsDemandGenVideo()) text = 'video'

    if (isVideo && !props.cre.IsDemandGenVideo()) text = 'image'

    if (text) {
      window.message.warning(`Demand Gen ${text} supports only ${text}`)
      reducePendingFile()
      return false
    }
  }

  if (props.cre.IsPMax()) {
    if (isVideo) {
      window.message.warning(
        `Performance Max ads only support images or YouTube links`
      )
      reducePendingFile()
      return false
    }
  }

  if (!isVideo && !isImage && !isAudio) {
    arb?.error(Creative.value.media_format)
    reducePendingFile()
    return false
  }

  const fileSize = data.file.file?.size
  if (!fileSize) {
    window.message.error('File size is missing')
    reducePendingFile()
    return false
  }

  const limitSize = props.cre.IsSnapchat() ? LIMIT_VIDEO_SNAPCHAT : LIMIT_VIDEO

  if (isVideo && fileSize / 1024 / 1024 >= limitSize) {
    window.message.error(`${Creative.value.max_video} ${limitSize}MB`)
    reducePendingFile()
    return false
  }

  if (isImage && props.cre.IsResponsive()) {
    const ok = await validBannerImage(data.file.file)
    if (!ok) {
      reducePendingFile()
      return false
    }
    await getSizeBannerImage(data.file.file)
  }

  if (isImage && props.cre.IsPocpocBanner()) {
    const ok = await validBannerImage(
      data.file.file,
      ['300x250', '728x90', '160x600'],
      false
    )
    if (!ok) {
      reducePendingFile()
      return false
    }
    await getSizeBannerImage(data.file.file)
  }

  if (isImage && fileSize / 1024 / 1024 >= LIMIT_IMAGE) {
    window.message.error(`${Creative.value.max_img} ${LIMIT_IMAGE}MB`)
    reducePendingFile()
    return false
  }

  const isGif = fileExtension && fileExtension.startsWith('image/gif')

  if (
    isImage &&
    !isGif &&
    !props.cre.IsResponsive() &&
    !props.cre.IsPocpocBanner()
  ) {
    if (props.cre.IsTikTok()) {
      try {
        const validRatio = await checkTikTokImageRatio(data.file.file as File)

        if (!validRatio) {
          window.message.warning(
            'TikTok image must be 1:1,91, 1:1, or 9:16 ratio with minimum resolution'
          )
          reducePendingFile()
          return false
        }
      } catch {
        arb?.error('Failed to validate TikTok image')
        reducePendingFile()
        return false
      }
    }

    if (props.cre.IsSnapchat() || props.cre.IsNewsbreak()) {
      try {
        const checkBothRatios = props.cre.IsNewsbreak()
        const validRatio = await checkRatio(
          data.file.file as File,
          9,
          16,
          0.01,
          checkBothRatios
        )

        if (!validRatio) {
          if (checkBothRatios) {
            arb?.warning('Only support 9:16, 16:9')
          } else {
            arb?.warning(Creative.value.img_snap_9x16)
          }
          reducePendingFile()
          return false
        }
      } catch {}

      try {
        const processedImage = await processImage(
          data.file.file as File,
          1080,
          1920
        )

        if (processedImage) {
          arb?.infof(Creative.value.img_small, {}, data?.file?.file?.name)
          data.file.file = processedImage as File // Cập nhật tệp ảnh đã được xử lý
        }
        addMediaToQueue(data.file)
        return true
      } catch (error) {
        Logging.error('Upload', error)

        window.message.error(Creative.value.img_err)
        reducePendingFile()
        return false
      }
    } else {
      try {
        const processedImage = await processImage(
          data.file.file as File,
          620,
          1103
        )
        if (processedImage) {
          arb?.infof(Creative.value.img_small, {}, data?.file?.file?.name)
          data.file.file = processedImage as File // Cập nhật tệp ảnh đã được xử lý
        }

        addMediaToQueue(data.file)

        return true
      } catch (error) {
        Logging.error('Upload', error)

        window.message.error(Creative.value.img_err)
        reducePendingFile()
        return false
      }
    }
  }

  if (isVideo && props.cre.IsSnapchat()) {
    const ok = await checkVideoSizeAndRatio(
      data.file.file as File,
      SNAP_WIDTH,
      SNAP_HEIGHT,
      SNAP_RATIO,
      false
    )

    if (!ok) {
      arb?.error(Creative.value.video_snap)
      reducePendingFile()
      return false
    }
  }

  if (isVideo && props.cre.IsTikTok()) {
    const ratioChecks = await Promise.all([
      checkVideoSizeAndRatio(
        data.file.file as File,
        540,
        960,
        540 / 960,
        false
      ),
      checkVideoSizeAndRatio(
        data.file.file as File,
        960,
        540,
        960 / 540,
        false
      ),
      checkVideoSizeAndRatio(
        data.file.file as File,
        640,
        640,
        640 / 640,
        false
      ),
    ])

    const isValidTikTok = ratioChecks.some((result) => result === true)

    if (!isValidTikTok) {
      window.message.warning(
        'TikTok video must be 9:16, 16:9, or 1:1 ratio with minimum resolution'
      )
      reducePendingFile()
      return false
    }
  }

  if (isVideo && props.cre.IsNewsbreak()) {
    const okVideo = await checkVideoSizeAndRatio(
      data.file.file as File,
      500,
      500,
      9 / 16,
      true
    )

    if (!okVideo) {
      window.message.warning(
        'Newsbreak videos must have a 9:16 or 16:9 aspect ratio and a maximum size of 500MB'
      )
      reducePendingFile()
      return false
    }
  }

  addMediaToQueue(data.file)

  return true
}

const validBannerImage = (
  file: File,
  allowedSizes = [
    '200x200',
    '240x400',
    '250x250',
    '250x360',
    '300x250',
    '336x280',
    '580x400',
    '468x60',
    '728x90',
    '930x180',
    '970x90',
    '970x250',
    '980x120',
    '120x600',
    '160x600',
    '300x600',
    '300x1050',
    '300x50',
    '320x50',
    '320x100',
  ],
  notify = true
) => {
  const allowedTypes = ['image/gif', 'image/jpeg', 'image/png']
  const maxSizeKB = 150

  return new Promise<boolean>((resolve) => {
    if (!allowedTypes.includes(file.type)) {
      window.message.error('Banner image only supports GIF, JPG, and PNG')
      resolve(false)
      return
    }

    if (file.size / 1024 > maxSizeKB) {
      window.message.error(`Banner image must be less than ${maxSizeKB}KB`)
      resolve(false)
      return
    }

    const img = new Image()
    img.onload = () => {
      const key = `${img.width}x${img.height}`
      if (!allowedSizes.includes(key)) {
        if (notify) {
          window.message.warning(renderAdFormatContent)
        } else {
          window.message.warning('This size is not allowed')
        }
        resolve(false)
        return
      }
      resolve(true)
    }
    img.onerror = () => resolve(false)
    img.src = URL.createObjectURL(file)
  })
}

const sizeBannerImage = ref<string>('')

const getSizeBannerImage = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      const size = `${img.width}x${img.height}`
      sizeBannerImage.value = size
      URL.revokeObjectURL(img.src)
      resolve(size)
    }
    img.onerror = (err) => {
      console.error('Failed to load image for logging size', err)
      reject(err)
    }
    img.src = URL.createObjectURL(file)
  })
}

const customRequest = async ({ file }: UploadCustomRequestOptions) => {
  if (file.file instanceof File && file.status === 'pending') {
    file.status = 'uploading'
    props.status.isUploading = true
    const formData = new FormData()
    formData.append('file', file.file as File)

    let result: any = {}

    switch (file.file?.type) {
      case 'video/mp4':
      case 'video/quicktime':
        if (props.cre.IsTikTok()) {
          formData.append('traffic_source', 'tiktok')
        }
        if (props.cre.IsNewsbreak()) {
          formData.append('traffic_source', 'newsbreak')
        }
        result = await ctr_creative.uploadVideo(formData)
        if (result?.status === 'success') {
          props.cre.images.push({
            creative_id: props.cre.id,
            image: result?.data_object?.video_url,
            status: '',
            thumb: result?.data_object?.thumb,
          })
          file.status = 'finished'
        } else {
          file.status = 'error'
        }
        break

      case 'audio/mpeg':
      case 'audio/x-m4a':
        try {
          result = await ctr_creative.uploadAudio(formData) // Giả sử có method uploadAudio

          if (result?.status === 'success') {
            props.cre.images.push({
              creative_id: props.cre.id,
              image: result?.data_object?.audio_url, // URL của file audio
              status: '',
              thumb: result?.data_object?.thumb || '', // Có thể không có thumbnail cho audio
            })
            file.status = 'finished'
          } else {
            file.status = 'error'
            throw new Error(
              result.errors?.[0]?.message || 'Upload audio failed'
            )
          }
        } catch {
          file.status = 'error'
          throw new Error('Audio upload failed')
        }
        break

      default:
        result = await ctr_creative.uploadImage(formData)

        if (result?.status === 'success') {
          try {
            let objImage = {
              creative_id: props.cre.id,
              image: result?.data_object?.thumb[0],
              size: '',
              status: '',
              image_ratio: [],
            } as imgType

            let ratios: string[] = []

            if (props.cre.IsNewsbreak()) {
              ratios = RATIO_NEWSBREAK
            } else if (
              props.cre.IsDemandGen() ||
              props.cre.IsGoogleDisplay() ||
              props.cre.IsPMax()
            ) {
              ratios = RATIO_DEMAND
            } else if (!props.cre.IsTikTok()) {
              ratios = SIZE_RATIO
            }

            if (props.cre.IsNewsbreak()) {
              ratios.forEach((ratio) => {
                objImage.image_ratio?.push({
                  ratio,
                  change: false,
                  off: ratio === RATIO_NEWSBREAK[0] ? false : true,
                  by_ai: false,
                })
              })
            } else {
              ratios.forEach((ratio) => {
                objImage.image_ratio?.push({
                  ratio,
                  change: false,
                  off: false,
                  by_ai: false,
                })
              })
            }

            if (props.cre.IsResponsive() || props.cre.IsPocpocBanner()) {
              objImage.image_ratio = []
              objImage.size = sizeBannerImage.value
            }
            props.cre.images.push(objImage)

            const base64 = await helper.convertImageToBase64(file.file)
            base64Files.value.push(base64)

            file.status = 'finished'
          } catch {
            file.status = 'error'
          }
        } else {
          file.status = 'error'
          try {
            throw new Error(
              result.errors?.[0]?.message || 'Upload image failed'
            )
          } catch {
            throw new Error('Upload image failed')
          }
        }
        break
    }
  }
}
const fileList = ref<UploadFileInfo[]>([])
const addMediaToQueue = (file: UploadFileInfo) => {
  fileList.value.push(file)
}

const imageTypes = [
  'image/jpeg',
  'image/jpg',
  'image/bmp',
  'image/png',
  'image/gif',
]
const videoTypes = ['video/mp4']

const isVideoUploaded = computed(() => {
  for (let index = 0; index < props.cre.images?.length; index++) {
    if (videoTypes.includes(props.cre.images[index].image || '')) {
      return true
    }
  }

  return false
})

const isImageUploaded = computed(() => {
  for (let index = 0; index < props.cre.images?.length; index++) {
    if (imageTypes.includes(props.cre.images[index].image || '')) {
      return true
    }
  }

  return false
})

const isVideoNew = computed(() => {
  for (let index = 0; index < fileList.value?.length; index++) {
    if (videoTypes.includes(fileList.value[index].type || '')) {
      return true
    }
  }

  return false
})

const isImageNew = computed(() => {
  for (let index = 0; index < fileList.value?.length; index++) {
    if (imageTypes.includes(fileList.value[index].type || '')) {
      return true
    }
  }

  return false
})

//validate không cho up hỗn hợp video ảnh
const isOkListMedia = () => {
  if (props.cre.IsDemandGen()) {
    //Đã up video, up ảnh mới
    if (isVideoUploaded.value && isImageNew.value) {
      return false
    }

    //Đã up ảnh, up video mới
    if (isImageUploaded.value && isVideoNew.value) {
      return false
    }

    //Up hỗn hợp video, ảnh mới
    if (isImageNew.value && isVideoNew.value) {
      return false
    }
  }

  return true //Pass
}

// Giảm số lượng file chờ khi một file đã sẵn sàng
const reducePendingFile = () => {
  pendingFiles.value -= 1
}

const uploadListMedia = async () => {
  props.status.isUploading = true

  if (pendingFiles.value > 0) {
    reducePendingFile()

    // Khi tất cả file đã sẵn sàng, upload chúng
    if (pendingFiles.value === 0) {
      const ok = isOkListMedia()

      if (!ok) {
        window.message.warning(Creative.value.img_video)
        return
      }

      let ajax = []

      for (let index = 0; index < fileList.value.length; index++) {
        const element = fileList.value[index]
        ajax.push(
          customRequest({ file: element } as UploadCustomRequestOptions).catch(
            (err) => {
              window.message.error(err.message)
              fileList.value[index].type = undefined
              element.status = 'error'
            }
          )
        )
      }

      await Promise.all(ajax)

      const listImages = props.cre.images
      if (listImages?.length) {
        props.status.previewItem = helper.clone(
          listImages[listImages.length - 1]
        )

        props.status.editingImage = props.status.previewItem?.image
      }

      if (
        isImageNew.value &&
        !props.cre.IsSnapchat() &&
        !props.cre.IsTikTok() &&
        !props.cre.IsPocpocBanner()
      ) {
        props.status.showModal = true
      }

      fileList.value = []
      props.status.isUploading = false
    }
  }
}

const isReachMaxFileUpload = computed(() => {
  return props.cre.images?.length >= maxFileUpload.value
})

// Xóa file khỏi mảng base64Files khi file đã được xóa
watch(
  () => props.status.base64Image,
  (newValue, oldValue) => {
    if (newValue) {
      const index = base64Files.value.indexOf(newValue)
      if (index > -1) {
        // only splice array when item is found
        base64Files.value?.splice(index, 1)
      }
    }
  }
)
</script>
<template>
  <div v-if="props.label" class="font-bold">{{ props.label }}</div>
  <n-upload
    multiple
    directory-dnd
    :action="FULL_URL_MEDIA"
    class="mb-2"
    :show-file-list="false"
    :disabled="props.status.isUploading || isReachMaxFileUpload"
    :default-upload="false"
    :on-before-upload="beforeUpload"
    :on-change="uploadListMedia"
  >
    <n-upload-dragger>
      <n-text style="font-size: 16px">
        Drag and drop files or click to upload
      </n-text>
    </n-upload-dragger>
  </n-upload>
</template>
