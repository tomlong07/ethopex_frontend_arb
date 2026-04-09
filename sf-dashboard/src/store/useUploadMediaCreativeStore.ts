import { resolvePlatformHandler } from '@/components/creative3/upload_media/service'
import { renderAdFormatContent } from '@/composables/useAdFormatContent'

import {
  IMAGE_TYPE,
  RATIO_DEMAND,
  RATIO_NEWSBREAK,
  SIZE_RATIO,
  VIDEO_TYPE,
} from '@/constants/media'
import { TS } from '@/enum/campaign'
import { CRE_TYPE } from '@/enum/creative'
import { useLocale } from '@/lang/messages'
import { ctr_creative } from '@/services/ctr_creative'
import {
  creativeTypeClass,
  StatusCreativeManager,
  images as imgType,
} from '@/types/components/creative-v2'
import Logging from '@/utils/Log'
import { UploadFileInfo } from 'naive-ui'
import { defineStore } from 'pinia'

export default defineStore('useUploadMediaCreativeStore', () => {
  const Creative = useLocale(
    () => import('@/lang/vi/creative'),
    () => import('@/lang/en/creative')
  )

  const pendingFiles = ref(0)
  const fileList = ref<UploadFileInfo[]>([])
  const base64Files = ref<string[]>([])
  const sizeBannerImage = ref('')

  const maxFileUpload = (
    cre: creativeTypeClass,
    status: StatusCreativeManager
  ) => {
    if (cre.IsAcceptMultipleCreatives()) {
      if (cre.IsFacebookSingleImage()) return 100
      if (status.uploadMultipleCreative) return 30
      return 1
    }
    return cre.IsDemandGenVideo() ? 2 : 100
  }

  const isReachMaxFileUpload = (
    cre: creativeTypeClass,
    status: StatusCreativeManager
  ) => {
    return cre.images?.length >= maxFileUpload(cre, status)
  }

  const isVideoUploaded = (cre: creativeTypeClass) => {
    return cre.images?.some((i) => VIDEO_TYPE.includes(i.image || ''))
  }

  const isImageUploaded = (cre: creativeTypeClass) => {
    return cre.images?.some((i) => IMAGE_TYPE.includes(i.image || ''))
  }

  const isVideoFile = computed(() => {
    return (type?: string) => VIDEO_TYPE.includes(type?.toLowerCase() || '')
  })

  const isVideoNew = computed(() =>
    fileList.value.some((f) => VIDEO_TYPE.includes(f.type || ''))
  )

  const isImageNew = computed(() =>
    fileList.value.some((f) => IMAGE_TYPE.includes(f.type || ''))
  )

  const reducePendingFile = () => {
    pendingFiles.value--
  }

  const addMediaToQueue = (file: UploadFileInfo) => {
    fileList.value.push(file)
  }

  const isOkListMedia = (cre: creativeTypeClass) => {
    if (!cre.IsDemandGen()) return true

    if (isVideoUploaded(cre) && isImageNew.value) return false
    if (isImageUploaded(cre) && isVideoNew.value) return false
    if (isImageNew.value && isVideoNew.value) return false

    return true
  }

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

  const beforeUpload = async (
    data: any,
    cre: creativeTypeClass,
    status: StatusCreativeManager
  ) => {
    if (isVideoFile.value(data.file.type) && cre.type === CRE_TYPE.GG_DISPLAY) {
      window.message.warning(
        'Google Display creatives only support image uploads.'
      )
      return false
    }
    if (pendingFiles.value + cre.images.length >= maxFileUpload(cre, status)) {
      window.message.warning(
        `Too many files. Max ${maxFileUpload(cre, status)}`
      )
      return false
    }

    if (
      !cre.IsFacebook() &&
      data.file &&
      data.file.type === 'video/quicktime'
    ) {
      window.message.warning('Facebook creatives only support MOV format.')
      return false
    }

    const fileExtension = data.file.type?.toLowerCase()
    const isImage = fileExtension && IMAGE_TYPE.includes(fileExtension)

    pendingFiles.value++

    const handler = resolvePlatformHandler(cre)

    if (handler) {
      const ok = await handler.beforeUpload({
        file: data.file.file,
        data,
        cre: cre,
      })

      if (!ok) {
        reducePendingFile()
        return false
      }
    }

    if (isImage) {
      const base64 = await helper.convertImageToBase64(data.file.file)
      if (base64Files.value.includes(base64)) {
        window.message.warning(Creative.value.img_exist)
        reducePendingFile()
        return false
      }
    }
    addMediaToQueue(data.file)
    return true
  }

  const customRequest = async (
    file: UploadFileInfo,
    cre: creativeTypeClass,
    status: StatusCreativeManager
  ) => {
    try {
      file.status = 'uploading'
      status.isUploading = true

      const formData = new FormData()
      formData.append('file', file.file as File)

      let result: any

      switch (file.file?.type) {
        case 'video/mp4':
        case 'video/quicktime':
          try {
            if (cre.IsTikTok()) {
              formData.append('traffic_source', TS.TIKTOK)
            }
            if (cre.IsNewsbreak()) {
              formData.append('traffic_source', TS.NEWSBREAK)
            }
            result = await ctr_creative.uploadVideo(formData)

            if (result?.status !== 'success') {
              throw new Error(
                result?.errors?.[0]?.message || 'Video upload failed'
              )
            }

            cre.images.push({
              creative_id: cre.id,
              image: result.data_object.video_url,
              thumb: result.data_object.thumb,
              status: '',
            })
            file.status = 'finished'
          } catch {
            file.status = 'error'
            // throw new Error('Video upload failed')
          }
          break

        case 'audio/mpeg':
        case 'audio/x-m4a':
          try {
            result = await ctr_creative.uploadAudio(formData) // Giả sử có method uploadAudio

            if (result?.status !== 'success') {
              throw new Error(
                result?.errors?.[0]?.message || 'Audio upload failed'
              )
            }

            cre.images.push({
              creative_id: cre.id,
              image: result?.data_object?.audio_url, // URL của file audio
              status: '',
              thumb: result?.data_object?.thumb || '', // Có thể không có thumbnail cho audio
            })
            file.status = 'finished'
          } catch {
            file.status = 'error'
            // throw new Error('Audio upload failed')
          }
          break

        default: {
          try {
            const result = await ctr_creative.uploadImage(formData)

            if (result?.status !== 'success') {
              throw new Error(
                result?.errors?.[0]?.message || 'Image upload failed'
              )
            }

            const obj: imgType = {
              creative_id: cre.id,
              image: result.data_object.thumb[0],
              size: sizeBannerImage.value,
              status: '',
              image_ratio: [],
            }

            let ratios: string[] = []

            if (cre.IsNewsbreak()) {
              ratios = RATIO_NEWSBREAK
            } else if (
              cre.IsDemandGen() ||
              cre.IsGoogleDisplay() ||
              cre.IsPMax()
            ) {
              ratios = RATIO_DEMAND
            } else if (!cre.IsTikTok()) {
              ratios = SIZE_RATIO
            }

            if (!cre.IsResponsive() && !cre.IsPocpocBanner()) {
              obj.image_ratio = ratios.map((ratio, index) => ({
                ratio,
                change: false,
                off: cre.IsNewsbreak() ? index !== 0 : false,
                by_ai: false,
              }))
            } else {
              obj.image_ratio = []
              obj.size = sizeBannerImage.value
            }

            cre.images.push(obj)
            file.status = 'finished'
          } catch {
            file.status = 'error'
          }
          break
        }
      }
      const base64 = await helper.convertImageToBase64(file.file)
      base64Files.value.push(base64)
    } catch (err) {
      Logging.error('Upload', err)
      file.status = 'error'
      throw err
    }
  }

  const uploadListMedia = async (
    cre: creativeTypeClass,
    status: StatusCreativeManager
  ) => {
    status.isUploading = true

    reducePendingFile()
    if (pendingFiles.value !== 0) {
      status.isUploading = false
      return
    }

    if (!isOkListMedia(cre)) {
      window.message.warning('Cannot mix image and video')
      status.isUploading = false
      return
    }
    await Promise.all(
      fileList.value.map((file) => customRequest(file, cre, status))
    )

    const listImages = cre.images

    if (listImages?.length) {
      status.previewItem = helper.clone(listImages[listImages.length - 1])

      status.editingImage = status.previewItem?.image
    }

    if (
      isImageNew.value &&
      !cre.IsSnapchat() &&
      !cre.IsTikTok() &&
      !cre.IsPocpocBanner()
    ) {
      status.showModal = true
    }

    fileList.value = []
    status.isUploading = false
  }

  const removeBase64 = (val: string) => {
    const idx = base64Files.value.indexOf(val)
    if (idx > -1) base64Files.value.splice(idx, 1)
  }

  const resetAllState = () => {
    pendingFiles.value = 0
    fileList.value = []
    base64Files.value = []
    sizeBannerImage.value = ''
  }
  return {
    // func
    maxFileUpload,
    isReachMaxFileUpload,
    removeBase64,
    beforeUpload,
    uploadListMedia,
    validBannerImage,
    getSizeBannerImage,
    resetAllState,
  }
})
