import { LIMIT_IMAGE } from '@/constants/limits'
import { URL_UPLOAD } from '@/constants/urls'

export async function processImage(
  imageInput: File | string,
  desiredWidth: number,
  desiredHeight: number
) {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.crossOrigin = 'Anonymous' // Đảm bảo bạn có quyền truy cập vào ảnh

    let imageName = ''
    let imageType = ''

    if (typeof imageInput === 'string') {
      if (!imageInput.includes('http')) {
        imageInput = URL_UPLOAD + imageInput
      }
      // Trường hợp imageInput là URL
      image.src = imageInput
      const urlParts = imageInput.split('/')
      const fileName = urlParts[urlParts.length - 1]
      const nameParts = fileName.split('.')
      imageName = fileName
      imageType = 'image/' + nameParts[nameParts.length - 1].toLowerCase()
    } else if (imageInput instanceof File) {
      // Trường hợp imageInput là tệp
      const reader = new FileReader()
      reader.onload = (event) => {
        image.src = event.target?.result as string
      }
      reader.onerror = () => {
        reject(new Error('Can not read file.'))
      }
      reader.readAsDataURL(imageInput)
      imageName = imageInput.name
      imageType = imageInput.type
    } else {
      reject(new Error('Input invalid.'))
      return
    }

    image.onload = () => {
      const { width, height } = image

      if (width >= desiredWidth && height >= desiredHeight) {
        resolve(null)
      } else {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        const aspectRatio = width / height

        let newWidth = width
        let newHeight = height

        if (width < desiredWidth) {
          newWidth = desiredWidth
          newHeight = newWidth / aspectRatio
        }

        if (newHeight < desiredHeight) {
          newHeight = desiredHeight
          newWidth = newHeight * aspectRatio
        }

        canvas.width = newWidth
        canvas.height = newHeight

        ctx?.drawImage(image, 0, 0, newWidth, newHeight)

        canvas.toBlob((blob) => {
          if (blob) {
            const newFile = new File([blob], '[Scaled] ' + imageName, {
              type: imageType,
            })

            resolve(newFile)
          } else {
            reject(new Error('Can not handle image.'))
          }
        }, imageType)
      }
    }

    image.onerror = () => {
      reject(new Error('Can not load image.'))
    }
  })
}
export function checkTikTokImageRatio(file: File) {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => {
      const imageWidth = img.width
      const imageHeight = img.height
      const imageRatio = imageWidth / imageHeight

      console.warn('TikTok Image Check:', {
        imageWidth,
        imageHeight,
        imageRatio,
      })

      const ratios = [
        { name: '9:16', ratio: 9 / 16 },
        { name: '1:1.91', ratio: 1 / 1.91 },
        { name: '1:1', ratio: 1 / 1 },
      ]

      const isValidRatio = ratios.some((config) => {
        const ratioMatch = Math.abs(imageRatio - config.ratio) <= 0.01

        if (ratioMatch) {
          console.warn(`Image matches ${config.name} ratio`)
          return true
        }
        return false
      })

      resolve(isValidRatio)
    }

    img.onerror = () => resolve(false)
    img.src = URL.createObjectURL(file)
  })
}
export async function checkRatio(
  file: File,
  width: number = 9,
  height: number = 16,
  ss: number = 0.01,
  checkBothRatios: boolean = true
) {
  return new Promise((resolve, reject) => {
    const img = new Image()

    img.onload = () => {
      const w = img.width
      const h = img.height
      const ratio = w / h

      const isTargetRatio = Math.abs(ratio - width / height) < ss

      let isValidRatio = isTargetRatio

      if (checkBothRatios) {
        const isInverseRatio = Math.abs(ratio - height / width) < ss
        isValidRatio = isTargetRatio || isInverseRatio
      }

      resolve(isValidRatio)

      // Cleanup
      URL.revokeObjectURL(img.src)
    }

    img.onerror = () => {
      alert('Failed to load image.')
      reject(new Error('Failed to load image'))
    }

    img.src = URL.createObjectURL(file as unknown as Blob)
  })
}

export function checkVideoSizeAndRatio(
  file: File,
  requiredWidth: number,
  requiredHeight: number,
  requiredRatio: number,
  isNewsBreak: boolean
) {
  return new Promise((resolve) => {
    const video = document.createElement('video')

    video.onloadedmetadata = () => {
      const videoWidth = video.videoWidth
      const videoHeight = video.videoHeight
      const videoRatio = videoWidth / videoHeight
      const fileSizeInMB = file.size / (1024 * 1024)

      fmt.Println({
        videoWidth,
        videoHeight,
        videoRatio,
        requiredRatio,
      })

      if (isNewsBreak) {
        if (Math.abs(videoRatio - requiredRatio) > 0.01 || fileSizeInMB > 500) {
          resolve(false)
          return
        }
      }

      if (
        videoWidth < requiredWidth ||
        videoHeight < requiredHeight ||
        Math.abs(videoRatio - requiredRatio) > 0.01
      ) {
        resolve(false)
        return
      }

      resolve(true)
    }

    video.src = URL.createObjectURL(file)
  })
}

export const validateImageThumb = async (
  data: any,
  isValidate: boolean = true
) => {
  const imageTypes = ['image/jpeg', 'image/png', 'image/bmp', 'image/gif']

  // Chuẩn hoá đối tượng file: một số caller truyền { file: File } hoặc { file: { file: File, ... } }
  const fileObj: File | undefined = (data?.file &&
    (data.file instanceof File ? data.file : data.file.file)) as
    | File
    | undefined

  const fileExtension = fileObj?.type?.toLowerCase()
  const isImage = fileExtension && imageTypes.includes(fileExtension)

  if (!isImage) {
    window.message.error('Only image files are allowed')
    return false
  }

  const fileSize = fileObj?.size
  if (!fileSize) {
    window.message.error('File size is missing')
    return false
  }

  const limitSize = LIMIT_IMAGE

  if (fileSize / 1024 / 1024 >= limitSize) {
    window.message.error(`Max: ${limitSize}MB`)
    return false
  }

  const options: CheckImageOptions = {
    file: fileObj as File,
    ratioWidth: 1,
    ratioHeight: 1,
    tolerance: 0.01,
    minWidth: 600,
    minHeight: 600,
  }

  try {
    const isValid = await ImageValidator.validate(options)
    if (!isValidate) {
      //bỏ qua validate ảnh 1:1
    } else {
      if (!isValid) {
        window.message?.warning(
          'The image must have a 1:1 ratio and be at least 600px by 600px'
        )
        return false
      }
    }
  } catch (error) {
    console.error('Error:', error)
    return false
  }

  return true
}

interface CheckImageOptions {
  file: File // File cần kiểm tra
  ratioWidth?: number // Tỉ lệ chiều rộng (mặc định là 9)
  ratioHeight?: number // Tỉ lệ chiều cao (mặc định là 16)
  tolerance?: number // Sai số cho phép của tỉ lệ (mặc định là 0.01)
  minWidth?: number // Chiều rộng tối thiểu (mặc định là 600)
  minHeight?: number // Chiều cao tối thiểu (mặc định là 600)
}

class ImageValidator {
  static async validate(options: CheckImageOptions): Promise<boolean> {
    const {
      file,
      ratioWidth = 9,
      ratioHeight = 16,
      tolerance = 0.01,
      minWidth = 600,
      minHeight = 600,
    } = options

    return new Promise((resolve, reject) => {
      const img = new Image()

      img.onload = () => {
        const w = img.width
        const h = img.height

        // Kiểm tra tỉ lệ
        const ratio = w / h
        const isValidRatio =
          Math.abs(ratio - ratioWidth / ratioHeight) < tolerance

        // Kiểm tra kích thước tối thiểu
        const isValidSize = w >= minWidth && h >= minHeight

        // Trả về kết quả
        resolve(isValidRatio && isValidSize)
      }

      img.onerror = () => {
        alert('Failed to load image.')
        reject(new Error('Failed to load image'))
      }

      img.src = URL.createObjectURL(file)
    })
  }
}
