import { LOADING_THUMB_SIZE, MAX_THUMB_LANDING } from '@/constants/limits'
import { ctr_gallery } from '@/services/ctr_gallery'
import { UploadFileInfo } from 'naive-ui'

export interface MediaGalleryInfo {
  path?: string
  name?: string
  source?: string
  tags?: string[]
  object?: string
}

export class MediaLibraryClass {
  items: MediaGalleryInfo[] = [] //Lưu item path trước khi upload lên server

  media: MediaGalleryInfo[] = [] //List library
  MAX_MEDIA: number = 100

  permission: { add?: boolean; update?: boolean; delete?: boolean } = {}

  isLoadingPermission: boolean = false
  isProcessing: boolean = false
  isModal: boolean = false
  totalMedia: number = 0
  pageNow: number = 0

  constructor(data?: any) {
    if (data) {
      for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
          const element = data[key]
          this[key as keyof this] = element
        }
      }
    }
  }

  addItem = (item: { path: string; name: string; object: string }) => {
    if (!item.path || !item.name || !item.object) return
    this.items.push(item)
  }

  isMaxMedia() {
    return this.items.length >= this.MAX_MEDIA
  }

  isHasAddPermission() {
    return this.permission?.add
  }

  isHasUpdatePermission() {
    return this.permission?.update && !this.isModal
  }

  isHasDeletePermission() {
    return this.permission?.delete && !this.isModal
  }

  async uploadToDB() {
    const result = await ctr_gallery.SaveImages({ items: this.items })
    if (result?.status) {
      if (!this.media) this.media = []
      try {
        this.media = this.media.concat(this.items || [])
      } catch (error) {
        console.error('Error when concat media', error)
      }
    }

    this.items = []
  }

  async fetchMedia(q: string = '', search = false) {
    if (search) {
      this.pageNow = 0
      this.media = []
    }
    this.isProcessing = true
    this.pageNow++
    const result = await ctr_gallery.Filter({
      object: 'landing_page',
      search: q,
      page: this.pageNow,
      size: LOADING_THUMB_SIZE,
    })
    if (result?.status) {
      //Làm như thế này tránh trường hợp đang load user up thêm, sẽ bị ảnh trùng chỗ load ra
      for (let i = 0; i < result?.data?.gallery?.length; i++) {
        const element = result?.data?.gallery[i]
        const isExist = this.media.some((item) => item.path === element.path)
        if (!isExist) {
          if (!element.tags) element.tags = []
          this.media.push(element)
        }
      }

      this.totalMedia = result?.data?.records_total || 0
    }

    this.isProcessing = false
  }

  async fetchPermissionMediaLibrary() {
    const result = await ctr_gallery.Permission()
    if (result?.status) {
      this.permission = result?.data || {}
    }
  }

  async removeMedia(index: number) {
    this.isProcessing = true
    const result = await ctr_gallery.Remove({ path: this.media[index].path })
    if (result.status) {
      this.media?.splice(index, 1)
    }
    this.isProcessing = false
  }

  async refreshGallery() {
    this.pageNow = 0
    this.media = []
    await this.fetchMedia()
  }
}

export class StatusMediaLibraryClass {
  pendingFiles: number = 0
  fileList: UploadFileInfo[] = [] // Số lượng file đang chờ xử lý

  isUploading: boolean = false
  isLoading: boolean = true
  warning?: any

  constructor(data?: any) {
    if (data) {
      for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
          const element = data[key]
          this[key as keyof this] = element
        }
      }
    }
  }

  addMediaToQueue = (file: UploadFileInfo) => {
    this.fileList.push(file)
  }

  addPendingFile = () => {
    this.pendingFiles += 1
  }

  // Giảm số lượng file chờ khi một file đã sẵn sàng
  reducePendingFile = () => {
    if (this.pendingFiles === 0) {
      window.message.warning(
        'Has error no file to reducePendingFile, please check dev'
      )
      return
    }
    this.pendingFiles -= 1
  }

  resetFileList = () => {
    this.fileList = []
  }

  startUploading() {
    this.isUploading = true
  }

  endUploading() {
    this.isUploading = false
  }

  updateWarning(warn: any) {
    this.warning = warn
  }

  isHasPendingFile() {
    return this.pendingFiles > 0
  }

  isReadyToUpload() {
    return !this.isHasPendingFile()
  }
}

export class ModalGalleryInfo {
  isModal: boolean = false
  numberOfMediaSelected: number = 0
  selectedMedia: string[] = []
  singleSelection: boolean = false
  editorType: string = ''
  currentEditorId: string = ''

  constructor(data?: any) {
    if (data) {
      for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
          const element = data[key]
          this[key as keyof this] = element
        }
      }
    }
  }

  isMaxMedia() {
    return (
      this.numberOfMediaSelected + this.selectedMedia?.length >=
      MAX_THUMB_LANDING
    )
  }
}

export class dataThumb {
  prompt?: string
  title?: string
  path?: string
  status?: StatusThumb
  tags?: string[]
  isAi?: boolean
  loading: boolean = false

  constructor(data?: any) {
    if (data) {
      for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
          const element = data[key]
          this[key as keyof this] = element
        }
      }
    }
  }

  IsSuccess() {
    return this.status === StatusThumb.SUCCESS
  }

  IsError() {
    return this.status === StatusThumb.ERROR
  }

  IsOpenRecreate() {
    return this.isAi && (this.IsSuccess() || this.IsError())
  }

  SetSuccess() {
    this.status = StatusThumb.SUCCESS
  }

  SetPending() {
    this.status = StatusThumb.PENDING
  }

  SetError() {
    this.status = StatusThumb.ERROR
  }

  EndLoading() {
    this.loading = false
  }

  ColorClass() {
    switch (this.status) {
      case StatusThumb.PENDING:
        return 'warning'

      case StatusThumb.ERROR:
        return 'error'

      default:
        return 'default'
    }
  }
}

const StatusThumb = {
  PENDING: 'pending',
  SUCCESS: 'success',
  ERROR: 'error',
} as const
type StatusThumb = (typeof StatusThumb)[keyof typeof StatusThumb]

const newEmptyDataAI = (tags?: string[]) => {
  return new dataThumb({
    prompt: '',
    status: StatusThumb.PENDING,
    tags: tags || [],
    isAi: true,
  })
}

export class ModalThumbnailInfo {
  showModal: boolean = false
  dataAI: dataThumb[] = []
  newSubmit?: number = 0

  constructor(data?: any) {
    if (data) {
      for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
          const element = data[key]
          this[key as keyof this] = element
        }
      }
    }
  }

  submitToThumb() {
    this.newSubmit = Date.now()
  }

  changeShowModal(status: boolean) {
    this.showModal = status
  }

  resetDataAI() {
    this.dataAI = [newEmptyDataAI()]
  }

  addNewDataAI() {
    this.dataAI.push(newEmptyDataAI())
  }

  removeADataAI(index: number) {
    this.dataAI.splice(index, 1)
  }
}
