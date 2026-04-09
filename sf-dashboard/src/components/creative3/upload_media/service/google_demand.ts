import { PlatformHandler } from './types'
import { handleImageProcess } from './handleProcessImage'
import { IMAGE_TYPE } from '@/constants/media'
import { LIMIT_IMAGE, LIMIT_VIDEO } from '@/constants/limits'
import { useLocale } from '@/lang/messages'
const Creative = useLocale(
  () => import('@/lang/vi/creative'),
  () => import('@/lang/en/creative')
)
export const DemandGenHandler: PlatformHandler = {
  async beforeUpload({ file, data, cre }) {
    const isVideo = file.type === 'video/mp4'
    const isImage = IMAGE_TYPE.includes(file.type)

    if (cre.IsDemandGenVideo() && isImage) {
      window.message.warning('Demand Gen video only supports video')
      return false
    }

    if (!cre.IsDemandGenVideo() && isVideo) {
      window.message.warning('Demand Gen image only supports image')
      return false
    }

    if (isVideo) {
      if (file.size / 1024 / 1024 >= LIMIT_VIDEO) {
        window.message.error(`${Creative.value.max_video} ${LIMIT_VIDEO}MB`)
        return false
      }
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
