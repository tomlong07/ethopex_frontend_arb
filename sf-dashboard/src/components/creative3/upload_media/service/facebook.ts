import { useLocale } from '@/lang/messages'
import { handleImageProcess } from './handleProcessImage'
import { PlatformHandler } from './types'
import { LIMIT_IMAGE, LIMIT_VIDEO } from '@/constants/limits'
import { VIDEO_TYPE } from '@/constants/media'
const Creative = useLocale(
  () => import('@/lang/vi/creative'),
  () => import('@/lang/en/creative')
)
export const FacebookHandler: PlatformHandler = {
  async beforeUpload({ file, data, cre }) {
    // cho upload thêm video mov => video/quicktime
    const isVideo = VIDEO_TYPE.concat(['video/quicktime']).includes(file.type)
    const isImage = file.type.startsWith('image/')

    if (isVideo) {
      if (file.size / 1024 / 1024 >= LIMIT_VIDEO) {
        window.message.error(`${Creative.value.max_video} ${LIMIT_VIDEO}MB`)
        return false
      }

      if (cre.IsFacebookSingleImage()) {
        window.message.warning('Facebook Single Image ad only supports images')
        return false
      }
    }

    if (isImage) {
      if (cre.IsFacebookSingleVideo()) {
        window.message.warning('Facebook Single Video ad only supports videos')
        return false
      }

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
