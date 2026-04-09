import { useLocale } from '@/lang/messages'
import { PlatformHandler } from './types'
import { handleImageProcess } from './handleProcessImage'
import { IMAGE_TYPE } from '@/constants/media'
import { LIMIT_IMAGE, LIMIT_VIDEO } from '@/constants/limits'

const Creative = useLocale(
  () => import('@/lang/vi/creative'),
  () => import('@/lang/en/creative')
)
export const PMaxHandler: PlatformHandler = {
  async beforeUpload({ file, data }) {
    const isImage = IMAGE_TYPE.includes(file.type)
    const isVideo = file.type === 'video/mp4'

    if (isVideo) {
      if (file.size / 1024 / 1024 >= LIMIT_VIDEO) {
        window.message.error(`${Creative.value.max_video} ${LIMIT_VIDEO}MB`)
        return false
      }
      window.message.warning(
        'Performance Max only supports images or YouTube links'
      )
      return false
    }

    if (isImage) {
      if (file.size / 1024 / 1024 >= LIMIT_IMAGE) {
        window.message.error(`${Creative.value.max_img} ${LIMIT_IMAGE}MB`)
        return false
      }

      const processed = await handleImageProcess(file as File)
      if (!processed) return false

      data.file.file = processed
    }
    return true
  },
}
