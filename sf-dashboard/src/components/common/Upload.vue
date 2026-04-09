<script setup lang="ts">
import { UploadFileInfo } from 'naive-ui'
import { ctr_creative } from '@/services/ctr_creative'
import ImgUrlUpload from './ImgUrlUpload.vue'
import EyeOutline from '@/assets/icons/EyeOutline.vue'
import Close from '@/assets/icons/Close.vue'
import { URL_UPLOAD } from '@/constants/urls'

const emit = defineEmits(['update:modelValue'])

const props = defineProps({
  modelValue: [String, Array],
  max: Number,
  accept: { type: String, default: '' },
  isUrls: { type: Boolean, default: false },
  multiple: { type: Boolean, default: false },
})
//props.multiple case muốn up max 1 nhưng vẫn là mảng string
const isMultiple = computed(
  () => props.multiple || (typeof props.max === 'number' && props.max > 1)
)
const maxComputed = computed(() => props.max ?? 1)
const internalFileList = ref<UploadFileInfo[]>([])
const acceptComputed = computed(() => {
  if (props.accept && props.accept.trim().length > 0) {
    return props.accept
  }
  return 'image/*' // mặc định
})

const detectFileType = (url: string): string => {
  const ext = url.split('.').pop()?.toLowerCase() || ''
  const videoExts = ['mp4', 'webm', 'ogg', 'm3u8']
  const imageExts = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'ico']

  if (videoExts.includes(ext)) {
    return `video/${ext === 'm3u8' ? 'mpegurl' : ext}`
  }

  if (imageExts.includes(ext)) {
    return `image/${ext === 'jpg' ? 'jpeg' : ext}`
  }

  return 'application/octet-stream'
}

watch(
  () => props.modelValue,
  (val) => {
    const toFullUrl = (path: string) => {
      return path?.startsWith('http')
        ? path
        : URL_UPLOAD + '/' + path.replace(/^\/+/, '')
    }

    if (!val || (Array.isArray(val) && val.length === 0)) {
      internalFileList.value = internalFileList.value.filter(
        (f) => f.status !== 'finished'
      )
      return
    }

    if (isMultiple.value) {
      const values = val as string[]
      const fullUrls = values.map(toFullUrl)

      const nextFiles: UploadFileInfo[] = []

      // 1. lấy từ props.modelValue
      for (const fullUrl of fullUrls) {
        const existing = internalFileList.value.find((f) => f.url === fullUrl)
        if (existing) {
          nextFiles.push(existing) // giữ nguyên status cũ
        } else {
          nextFiles.push({
            id: String(Date.now() + Math.random()),
            name: fullUrl.split('/').pop() || 'uploaded',
            url: fullUrl,
            thumbnailUrl: fullUrl,
            status: 'finished',
            type: detectFileType(fullUrl),
          })
        }
      }

      // 2. merge thêm các file đang tồn tại trong internalFileList.value mà không có trong props (ví dụ uploading/error)
      for (const f of internalFileList.value) {
        if (!fullUrls.includes(String(f.url))) {
          nextFiles.push(f)
        }
      }

      internalFileList.value = nextFiles
    } else {
      // single
      const path = val as string
      const fullUrl = toFullUrl(path)

      const existing = internalFileList.value.find((f) => f.url === fullUrl)

      if (existing) {
        internalFileList.value = [
          existing,
          ...internalFileList.value.filter((f) => f.url !== fullUrl),
        ]
      } else {
        internalFileList.value = [
          {
            id: String(Date.now()),
            name: fullUrl.split('/').pop() || 'uploaded',
            url: fullUrl,
            thumbnailUrl: fullUrl,
            status: 'finished',
            type: detectFileType(fullUrl),
          },
          ...internalFileList.value,
        ]
      }
    }
  },
  { immediate: true }
)

const handlePreview = (url?: string) => {
  const name = url?.toLowerCase() || ''
  const isVideo =
    name.endsWith('.mp4') ||
    name.endsWith('.webm') ||
    name.endsWith('.ogg') ||
    name.match(/\.(mp4|webm|ogg)(\?.*)?$/i)

  if (isVideo) {
    // Preview video
    const videoWindow = window.open('', '_blank')
    if (videoWindow) {
      videoWindow.document.write(`
         <video src="${url}" controls autoplay ></video>
      `)
    }
  } else {
    window.open(url, '_blank')
  }
}

const removeFile = (index: number) => {
  if (index === -1) return
  internalFileList.value?.splice(index, 1)
  emitModelValue()
}

const handleChange = ({ fileList }: { fileList: UploadFileInfo[] }) => {
  internalFileList.value = [...fileList]
}

const fakeFile = (url: string, thumbnail?: string): UploadFileInfo => {
  const type = detectFileType(url)
  const isVideo = type.startsWith('video')

  return {
    id: String(Date.now() + Math.random()),
    name: url.split('/').pop() || (isVideo ? 'uploaded.mp4' : 'uploaded.jpg'),
    url,
    file: undefined,
    thumbnailUrl: thumbnail ?? url,
    status: 'uploading',
    type,
  }
}

const emitModelValue = () => {
  const stripDomain = (url: string) => {
    return url.startsWith(URL_UPLOAD) ? url.replace(URL_UPLOAD, '') : url
  }

  if (isMultiple.value) {
    const urls = internalFileList.value
      .filter((f) => f.url && f.status !== 'error')
      .map((f) => stripDomain(f.url as string))

    emit('update:modelValue', urls)
  } else {
    const url = internalFileList.value[0]?.url || ''
    emit('update:modelValue', stripDomain(url))
  }
}

const updateTarget = (target: UploadFileInfo) => {
  if (!target) return

  if (isMultiple.value) {
    const filterStatus =
      internalFileList.value?.filter((item) => item.status !== 'error') || []

    const allFinished = filterStatus.every(
      (f) => f.status === 'finished' && f.url
    )
    if (allFinished) emitModelValue()
  } else {
    emitModelValue()
  }
}

const handleFinish = (
  {
    file,
    event,
  }: {
    file: UploadFileInfo
    event?: ProgressEvent
  },
  isUrl?: boolean
) => {
  if (!event) return
  try {
    const response = JSON.parse((event.target as XMLHttpRequest).response)
    let fullUrl = ''
    let thumbUrl = ''

    const target = internalFileList.value.find((f) => f.id === file.id)
    if (!target) return

    // video
    if (response?.data_object?.video_url) {
      fullUrl = URL_UPLOAD + response.data_object.video_url
      thumbUrl = response.data_object?.thumb?.[0]
        ? URL_UPLOAD + response.data_object.thumb[0]
        : ''

      target.url = fullUrl
      target.thumbnailUrl = thumbUrl
      target.status = 'finished'
      target.name = fullUrl.split('/').pop() || 'uploaded'
    }

    // ảnh
    if (
      response?.data_object?.thumb?.[0] &&
      !response?.data_object?.video_url
    ) {
      fullUrl = URL_UPLOAD + response.data_object.thumb[0]

      target.url = fullUrl
      target.thumbnailUrl = fullUrl
      target.status = 'finished'
    }

    // Cập nhật lại emptyImages + emit
    updateTarget(target)
  } catch (e) {
    console.error('Error parsing response:', e)
  }
}

const uploadFile = async (file: UploadFileInfo) => {
  const formData = new FormData()
  formData.append('file', file.file as File)

  const isVideo = (file.file as File).type.startsWith('video/')

  if (isVideo) {
    formData.append('thumb_number', '2')
    return await ctr_creative.uploadVideo(formData)
  } else {
    return await ctr_creative.uploadImage(formData)
  }
}

//  upload ảnh từ URL
const uploadUrl = async (url: string) => {
  const formData = new FormData()
  formData.append('url', url)
  return await ctr_creative.uploadImage(formData)
}

const handleUpload = async (
  {
    file,
    onError,
  }: { file?: UploadFileInfo | any; onError?: (err: any) => void },
  field: 'file' | 'url' = 'file'
) => {
  try {
    const res =
      field === 'file'
        ? await uploadFile(file!)
        : await uploadUrl(file?.url as string)
    const data = res || {}
    const fakeEvent = {
      target: { response: JSON.stringify(data) },
    } as any
    if (!data?.status || data?.status === 'error') {
      window.message.error(data?.errors?.[0]?.message || 'Upload failed!')
    }
    if (file) {
      handleFinish(
        { file: file as UploadFileInfo, event: fakeEvent as ProgressEvent },
        field === 'url'
      )
    }
  } catch (err) {
    console.error('Upload failed:', err)
    if (file) file.status = 'error'
    onError?.(err)
  }
}

const handleUpLoadUrls = async (urls: string[]) => {
  if (!urls || urls.length === 0) return

  const currentCount = internalFileList.value.length
  const allowed = props.max ? props.max - currentCount : urls.length

  if (allowed <= 0) {
    window.message.warning(`You can only upload up to ${props.max} media`)
    return
  }

  const limitedUrls = urls.slice(0, allowed)
  for (const url of limitedUrls) {
    const file = fakeFile(url) as UploadFileInfo
    internalFileList.value.push(file)

    try {
      await handleUpload({ file }, 'url')
    } catch {
      file.status = 'error'
    }
  }

  if (urls.length > allowed) {
    window.message.warning(`You can only upload up to ${props.max} media!`)
  }
}

onUnmounted(() => {
  internalFileList.value = []
})
</script>

<template>
  <div class="flex flex-col w-full gap-2">
    <div class="flex">
      <div class="flex flex-wrap gap-2">
        <div
          v-for="(file, index) in internalFileList"
          :key="file.id"
          class="w-24 h-24 bg-gray-100 flex items-center justify-center relative rounded overflow-hidden mr-2"
        >
          <div
            class="w-24 h-24 flex items-center justify-center bg-gray-100 rounded"
            v-if="file.status === 'pending'"
          >
            <n-spin size="small" />
          </div>
          <div
            v-else
            class="w-24 h-24 relative group"
            :class="{ 'border border-red-600': file.type === 'error' }"
          >
            <!-- Video -->
            <video
              v-if="file.type?.startsWith('video')"
              class="w-full h-full object-cover"
              controls
              muted
              playsinline
            >
              <source :src="file.url || ''" :type="file.type || 'video/mp4'" />
            </video>
            <!-- Image -->
            <n-image
              v-else
              :src="String(file.url)"
              class="w-full h-full object-cover rounded"
              preview-disabled
            />

            <!-- Overlay hover -->
            <div
              class="absolute inset-0 bg-black/30 transition-opacity opacity-0 group-hover:opacity-100 duration-200 flex items-center justify-center gap-2"
            >
              <button
                class="cursor-pointer rounded hover:bg-gray-400 hover:shadow-sm transition-colors leading-none"
                style="width: auto; height: auto"
                @click="removeFile(index)"
              >
                <n-icon :component="Close" size="18" class="text-white" />
              </button>

              <!-- Preview Button -->
              <button
                @click="handlePreview(file.url || '')"
                class="cursor-pointer rounded hover:bg-gray-400 hover:shadow-sm transition-colors leading-none"
              >
                <n-icon :component="EyeOutline" size="18" class="text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>
      <n-upload
        class="w-fit"
        :key="internalFileList.length"
        :custom-request="handleUpload"
        :default-upload="true"
        :max="maxComputed"
        :accept="acceptComputed"
        :multiple="isMultiple"
        :show-file-list="false"
        @finish="handleFinish"
        @change="handleChange"
      >
        <template #default>
          <div
            v-if="internalFileList.length < maxComputed"
            class="w-24 h-24 border border-dashed border-gray-300 rounded flex items-center justify-center cursor-pointer hover:border-gray-400 transition-colors"
          >
            <span class="text-gray-400 text-2xl">+</span>
          </div>
        </template>
      </n-upload>
    </div>
    <ImgUrlUpload
      @update-urls="handleUpLoadUrls"
      class="mb-2"
      v-if="isUrls"
      :max="props.max"
    />
  </div>
</template>
<style scoped>
:deep(.n-upload-file-list.n-upload-file-list--grid) {
  flex-wrap: wrap !important;
}

:deep(.n-upload-file) {
  display: none !important;
}
</style>
