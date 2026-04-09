import { AUDIO_TYPE, IMAGE_TYPE } from '@/constants/media'
import { PlatformHandler } from './types'
import { useLocale } from '@/lang/messages'
import { LIMIT_IMAGE, LIMIT_VIDEO } from '@/constants/limits'
import useUploadMediaCreativeStore from '@/store/useUploadMediaCreativeStore'
import { handleImageProcess } from './handleProcessImage'

const Creative = useLocale(
  () => import('@/lang/vi/creative'),
  () => import('@/lang/en/creative')
)

export const DefaultHandler: PlatformHandler = {
  async beforeUpload({ file, data, cre }) {
    const uploadMediaStore = useUploadMediaCreativeStore()
    const isVideo = file.type === 'video/mp4'
    const isImage = IMAGE_TYPE.includes(file.type)
    const isAudio = AUDIO_TYPE.includes(file.type)

    if (!isImage && !isVideo && !isAudio) {
      window.message.warning(Creative.value.media_format)
      return false
    }

    if (!file.size) {
      window.message.error('File size is missing')
      return false
    }

    if (isVideo && file.size / 1024 / 1024 >= LIMIT_VIDEO) {
      window.message.error(`${Creative.value.max_video} ${LIMIT_VIDEO}MB`)
      return false
    }

    if (isImage) {
      if (file.size / 1024 / 1024 >= LIMIT_IMAGE) {
        window.message.error(`${Creative.value.max_img} ${LIMIT_IMAGE}MB`)
        return false
      }
      if (cre.IsResponsive()) {
        const ok = await uploadMediaStore.validBannerImage(file)
        if (!ok) {
          return false
        }
        await uploadMediaStore.getSizeBannerImage(file)
      }

      if (cre.IsPocpocBanner()) {
        const ok = await uploadMediaStore.validBannerImage(
          file,
          ['300x250', '728x90', '160x600'],
          false
        )
        if (!ok) {
          return false
        }
        await uploadMediaStore.getSizeBannerImage(file)
      }

      const processed = await handleImageProcess(file as File)
      if (!processed) return false

      data.file.file = processed
    }

    return true
  },
}
