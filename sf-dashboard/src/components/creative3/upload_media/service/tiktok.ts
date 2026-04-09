import {
  checkTikTokImageRatio,
  checkVideoSizeAndRatio,
} from '@/components/creative3/helper'
import { PlatformHandler } from './types'
import { IMAGE_TYPE, VIDEO_TYPE } from '@/constants/media'
import { handleImageProcess } from './handleProcessImage'
import { useLocale } from '@/lang/messages'
import { LIMIT_IMAGE, LIMIT_VIDEO } from '@/constants/limits'
const Creative = useLocale(
  () => import('@/lang/vi/creative'),
  () => import('@/lang/en/creative')
)
export const TikTokHandler: PlatformHandler = {
  async beforeUpload({ file, data }) {
    const isVideo = VIDEO_TYPE.includes(file.type)
    const isImage = IMAGE_TYPE.includes(file.type)

    if (isImage) {
      if (file.size / 1024 / 1024 >= LIMIT_IMAGE) {
        window.message.error(`${Creative.value.max_img} ${LIMIT_IMAGE}MB`)
        return false
      }

      const ok = await checkTikTokImageRatio(file)
      if (!ok) {
        window.message.warning(
          'TikTok image must be 1:1,91, 1:1, or 9:16 ratio with minimum resolution'
        )
        return false
      }

      const processed = await handleImageProcess(file as File)
      if (!processed) return false

      data.file.file = processed
    }

    if (isVideo) {
      if (file.size / 1024 / 1024 >= LIMIT_VIDEO) {
        window.message.error(`${Creative.value.max_video} ${LIMIT_VIDEO}MB`)
        return false
      }
      const results = await Promise.all([
        checkVideoSizeAndRatio(file, 540, 960, 9 / 16, false),
        checkVideoSizeAndRatio(file, 960, 540, 16 / 9, false),
        checkVideoSizeAndRatio(file, 640, 640, 1, false),
      ])

      if (!results.some(Boolean)) {
        window.message.warning(
          'TikTok video must be 9:16, 16:9, or 1:1 ratio with minimum resolution'
        )
        return false
      }
    }

    return true
  },
}
