import {
  checkRatio,
  checkVideoSizeAndRatio,
} from '@/components/creative3/helper'
import {
  SNAP_WIDTH,
  SNAP_HEIGHT,
  SNAP_RATIO,
  IMAGE_TYPE,
} from '@/constants/media'
import { PlatformHandler } from './types'
import { useLocale } from '@/lang/messages'
import { handleImageProcess } from './handleProcessImage'
import { LIMIT_IMAGE, LIMIT_VIDEO_SNAPCHAT } from '@/constants/limits'

const Creative = useLocale(
  () => import('@/lang/vi/creative'),
  () => import('@/lang/en/creative')
)
export const SnapchatHandler: PlatformHandler = {
  async beforeUpload({ file, data }) {
    const isVideo = file.type === 'video/mp4'
    const isImage = IMAGE_TYPE.includes(file.type)

    if (isImage) {
      if (file.size / 1024 / 1024 >= LIMIT_IMAGE) {
        window.message.error(`${Creative.value.max_img} ${LIMIT_IMAGE}MB`)
        return false
      }

      const ok = await checkRatio(file, 9, 16, 0.01)
      if (!ok) {
        window.message.warning(Creative.value.img_snap_9x16)
        return false
      }

      const processed = await handleImageProcess(file as File, 1080, 1920)
      if (!processed) return false
      data.file.file = processed
    }

    if (isVideo) {
      if (file.size / 1024 / 1024 >= LIMIT_VIDEO_SNAPCHAT) {
        window.message.error(
          `${Creative.value.max_video} ${LIMIT_VIDEO_SNAPCHAT}MB`
        )
        return false
      }

      const ok = await checkVideoSizeAndRatio(
        file,
        SNAP_WIDTH,
        SNAP_HEIGHT,
        SNAP_RATIO,
        false
      )

      if (!ok) {
        window.message.error(Creative.value.video_snap)
        return false
      }
    }

    return true
  },
}
