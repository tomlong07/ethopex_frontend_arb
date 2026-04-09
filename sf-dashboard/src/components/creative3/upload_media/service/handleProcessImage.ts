import Logging from '@/utils/Log'
import { processImage } from '../../helper'
import { useLocale } from '@/lang/messages'

const Creative = useLocale(
  () => import('@/lang/vi/creative'),
  () => import('@/lang/en/creative')
)

export const handleImageProcess = async (
  file: File,
  width: number = 620,
  height: number = 1103
): Promise<File | false> => {
  try {
    const processedImage = await processImage(file, width, height)
    if (processedImage) {
      arb?.infof(Creative.value.img_small, {}, file.name)
      return processedImage as File
    }

    return file
  } catch (error) {
    Logging.error('Upload', error)
    window.message.error(Creative.value.img_err)
    return false
  }
}
