import {
  checkRatio,
  checkVideoSizeAndRatio,
} from '@/components/creative3/helper'
import { PlatformHandler } from './types'
import { IMAGE_TYPE } from '@/constants/media'
import { handleImageProcess } from './handleProcessImage'
import { useLocale } from '@/lang/messages'
import { LIMIT_IMAGE, LIMIT_VIDEO } from '@/constants/limits'
const Creative = useLocale(
  () => import('@/lang/vi/creative'),
  () => import('@/lang/en/creative')
)
export const NewsbreakHandler: PlatformHandler = {
  async beforeUpload({ file, data }) {
    const isVideo = file.type === 'video/mp4'
    const isImage = IMAGE_TYPE.includes(file.type)

    if (isImage) {
      if (file.size / 1024 / 1024 >= LIMIT_IMAGE) {
        window.message.error(`${Creative.value.max_img} ${LIMIT_IMAGE}MB`)
        return false
      }
      const ok = await checkRatio(file, 9, 16, 0.01, true)
      if (!ok) {
        window.message.warning('Only support 9:16 or 16:9')
        return false
      }

      const processed = await handleImageProcess(file as File, 1080, 1920)
      if (!processed) return false
      data.file.file = processed
    }

    if (isVideo) {
      if (file.size / 1024 / 1024 >= LIMIT_VIDEO) {
        window.message.error(`${Creative.value.max_video} ${LIMIT_VIDEO}MB`)
        return false
      }
      const ok = await checkVideoSizeAndRatio(file, 500, 500, 9 / 16, true)

      if (!ok) {
        window.message.warning(
          'Newsbreak videos must have a 9:16 or 16:9 aspect ratio and a maximum size of 500MB'
        )
        return false
      }
    }

    return true
  },
}
