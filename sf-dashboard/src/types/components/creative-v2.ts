import { ModalStateCreative } from './modal'
import { RouteLocationNormalizedLoaded } from 'vue-router/dist/vue-router'
import { AIVerifyClass } from '@/types/components/creative-class'
import {
  CONTENT_SAFETY,
  CRE_TYPE,
  CreativeMediaType,
  VERIFY_MANUAL,
} from '@/enum/creative'
import { DEFAULT_ICON } from '@/constants/urls'
import { RATIO_NEWSBREAK, SIZE_RATIO } from '@/constants/media'
import { useLocale } from '@/lang/messages'
const Creative = useLocale(
  () => import('@/lang/vi/creative'),
  () => import('@/lang/en/creative')
)

export const newCreativeClass = (moreInfo?: ModalStateCreative) => {
  const newData = {
    site_name: '',
    name: '',
    site_name_status: '',
    site_icon: '',
    titles: [
      {
        title: '',
        description: '',
        ttArray: [''],
        lhArray: [''],
        dArray: [''],
      },
    ],
    images: [],
    ad_type: '' as string | null,
    type: CRE_TYPE.NATIVE,
    email: '',
  }

  if (moreInfo) {
    if (moreInfo.type) {
      ;(newData.type as any) = moreInfo.type as CRE_TYPE
    }
    if (moreInfo.ad_type) {
      newData.ad_type = moreInfo.ad_type
    } else {
      newData.ad_type = null
    }
  }
  return new creativeTypeClass(newData) as creativeTypeClass
}

export class Summaries {
  url?: string
  media_summary?: string
  content_safety?: CONTENT_SAFETY
  rule_violated?: string
  advertising_text?: string
  audio_transcript?: string

  constructor(data: any) {
    if (data) {
      for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
          const element = data[key]
          if (!element) continue
          this[key as keyof this] = element
        }
      }
    }
  }
}

export class creativeTypeClass {
  email?: string //Get by id

  id?: number

  name?: string
  status?: string
  type: CRE_TYPE | null
  titles: titlesStruct[]
  site_name?: string
  site_name_status?: string
  site_icon?: string
  images: images[]
  display_path?: string[]
  site_link?: string[]
  info_image?: SnapData[]
  ad_type?: string
  size?: string
  creative_media?: number | null
  display_link?: string | null
  call_to_action?: string | null

  ai_verify?: AIVerifyClass
  input_verify?: any
  output_verify?: any
  example_verify?: any
  reason?: string
  verify_manual?: string
  final_url?: string
  url?: string
  summaries?: Summaries[]

  constructor(data: any) {
    this.type = CRE_TYPE.NATIVE
    this.titles = []
    this.images = []
    if (data) {
      for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
          switch (key) {
            case 'ai_verify':
              try {
                this.ai_verify = new AIVerifyClass(data[key])
              } catch (error) {
                console.error(error)
              }
              break

            case 'summaries':
              this.summaries = []

              if (Array.isArray(data[key])) {
                this.summaries = data[key].map(
                  (element: any) => new Summaries(element)
                )
              }

              break

            default:
              const element = data[key]
              this[key as keyof this] = element
              break
          }
        }
      }
    }

    if (this.IsGoogle() && !this.site_icon) {
      this.SetIconDefault()
    }
  }

  setMedia(value: images[]) {
    // this.images.length = 0
    this.images.push(...value)
  }
  AI_Input_JSON() {
    if (!this.input_verify) return ''
    return this.input_verify
  }

  AI_Output_JSON() {
    if (!this.output_verify) return ''
    try {
      return JSON.parse(this.output_verify) // parse string
    } catch {
      return this.output_verify
    }
  }

  AI_Example_JSON() {
    if (!this.example_verify) return ''
    try {
      return JSON.parse(this.example_verify) // parse string
    } catch {
      return this.example_verify
    }
  }

  SummariesList() {
    if (!this.summaries) return []

    const list = this.summaries
      .filter((e) => e.media_summary)
      .map((e) => e.media_summary)

    // Lọc trùng bằng Set
    return [...new Set(list)] as string[]
  }

  ImageShow(previewImage: string) {
    const imagesList = this.images || []
    if (!previewImage || !imagesList.length) return {} as images

    const thisImage = imagesList.find((img) => img.image === previewImage)
    if (!thisImage) return {} as images

    const matchedSummary = (this.summaries || []).find((s: Summaries) => {
      return (
        helper.removeDomainAndParams(s.url) ===
        helper.removeDomainAndParams(previewImage)
      )
    })

    if (matchedSummary) {
      thisImage.media_summary = matchedSummary.media_summary
      thisImage.content_safety = matchedSummary.content_safety
      thisImage.rule_violated = matchedSummary.rule_violated
      thisImage.advertising_text = matchedSummary.advertising_text
      thisImage.audio_transcript = matchedSummary.audio_transcript
    }

    return thisImage
  }

  CheckButon(): boolean {
    // Kiểm tra lhArray, ttArray có ít nhất 1 giá trị không rỗng
    return this.titles.every((element) => {
      const ttArray = element.ttArray || []
      const lhArray = element.lhArray || []
      const hasValidTt = ttArray.some((item) => item && item.trim() !== '')
      const hasValidLh = lhArray.some((item) => item && item.trim() !== '')
      return hasValidTt && hasValidLh
    })
  }

  isAIRejected() {
    return this.ai_verify?.compliance_status?.toLowerCase() === 'no'
  }

  IsNative(): boolean {
    return this?.type === CRE_TYPE.NATIVE
  }

  IsTikTok(): boolean {
    return this?.type === CRE_TYPE.TIKTOK
  }
  IsGoogleSearch(): boolean {
    return this?.type === CRE_TYPE.GGSEARCH
  }

  IsShowIcon(): boolean {
    return (
      this.IsGoogleSearch() ||
      this.IsTikTok() ||
      this.IsDemandGen() ||
      this.IsPMax() ||
      this.IsGoogleDisplay() ||
      this.IsNewsbreak()
    )
  }

  IsSnapchat(): boolean {
    return this?.type === CRE_TYPE.SNAPCHAT
  }
  IsNewsbreak(): boolean {
    return this?.type === CRE_TYPE.NEWSBREAK
  }
  IsFacebook(): boolean {
    return this?.type === CRE_TYPE.FACEBOOK
  }

  IsFacebookSingleImage(): boolean {
    return this.IsFacebook() && this.ad_type === CreativeMediaType.SINGLE_IMAGE
  }

  IsFacebookSingleVideo(): boolean {
    return this.IsFacebook() && this.ad_type === CreativeMediaType.SINGLE_VIDEO
  }

  IsFacebookCarousel(): boolean {
    return this.IsFacebook() && this.ad_type === CreativeMediaType.CAROUSEL
  }

  IsFacebookFlexible(): boolean {
    return this.IsFacebook() && this.ad_type === CreativeMediaType.FLEXIBLE
  }

  IsAcceptMultipleCreatives(): boolean {
    return this.IsFacebookSingleImage() || this.IsFacebookSingleVideo()
  }

  IsDemandGen(): boolean {
    return this?.type === CRE_TYPE.DEMANDGEN
  }
  IsPocpocBanner(): boolean {
    return this?.type === CRE_TYPE.PP_BANNER
  }
  IsPocpocBannerHtml(): boolean {
    return this?.type === CRE_TYPE.PP_BANNER && this?.ad_type === 'html'
  }

  IsDemandGenVideo(): boolean {
    return this.IsDemandGen() && this?.ad_type === 'video'
  }

  IsPMax(): boolean {
    return this?.type === CRE_TYPE.PMAX
  }

  IsGoogleDisplay(): boolean {
    return this?.type === CRE_TYPE.GG_DISPLAY
  }

  IsResponsive(): boolean {
    return this.IsGoogleDisplay() && this?.ad_type === 'responsive'
  }

  IsTitleDesType1(): boolean {
    return this.IsNative() || this.IsNewsbreak()
  }

  IsGoogle(): boolean {
    return (
      this.IsGoogleSearch() ||
      this.IsDemandGen() ||
      this.IsPMax() ||
      this.IsGoogleDisplay()
    )
  }

  IsTitleDesType2(): boolean {
    return (
      this.IsGoogleSearch() ||
      this.IsDemandGen() ||
      this.IsPMax() ||
      this.IsGoogleDisplay()
    )
  }

  IsIconDefault(): boolean {
    return this?.site_icon === DEFAULT_ICON
  }

  Invalid(): boolean {
    return (
      this.IsInValidDemandGenVideo() ||
      this.IsInValidPMax() ||
      this.IsInvalidGoogleInfo() ||
      this.IsInValidGoogleDisplay()
    )
  }

  IsInValidDemandGenVideo(): boolean {
    const MAX_VIDEO = 5
    if (this.IsDemandGenVideo() && this.images.length > MAX_VIDEO) {
      window.message.error(
        `Demand Gen video can only have ${MAX_VIDEO} videos.`
      )

      return true
    }

    return false
  }

  IsInValidPMax(): boolean {
    if (this.IsPMax() && this.images?.length) {
      let imageFound = false
      for (let index = 0; index < this.images.length; index++) {
        const element = this.images[index]
        const videoId = helper.youtubeVideoID(element.image)

        if (!videoId) {
          imageFound = true
          break
        }
      }

      if (!imageFound) {
        window.message.error('Performance Max must have at least 1 image.')
        return true
      }
    }

    if (this.IsPMax() && this.titles?.length) {
      const shortDes = this.titles[0]?.short_description
      if (shortDes) {
        const isDuplicate = this.titles?.some((title) =>
          title?.dArray?.some((des) => des === shortDes)
        )

        if (isDuplicate) {
          window.message.error(
            'Description and Short Description must be different.'
          )
          return true
        }
      }
    }

    return false
  }

  IsInValidGoogleDisplay(): boolean {
    if (this.IsGoogleDisplay() && this.images?.length) {
      let imageFound = false
      for (let index = 0; index < this.images.length; index++) {
        const element = this.images[index]
        const videoId = helper.youtubeVideoID(element.image)

        if (!videoId) {
          imageFound = true
          break
        }
      }

      if (!imageFound) {
        window.message.error('Google Display must have at least 1 image.')
        return true
      }
    }
    return false
  }

  IsInvalidGoogleInfo(): boolean {
    if (this.IsTitleDesType2()) {
      const textErrors = document.querySelectorAll('.text-error-noti')

      for (let index = 0; index < textErrors.length; index++) {
        const element = textErrors[index]
        if (element.innerHTML != '') {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' })
          arb?.error(Creative.value.tit_des)

          return true
        }
      }

      return false
    }
    return false
  }

  IsHasChangeImageRatio(): boolean {
    for (let index = 0; index < this.images.length; index++) {
      if (this.images[index].image_ratio) {
        const ratio = this.images[index].image_ratio || []
        for (let i = 0; i < ratio.length; i++) {
          const e = ratio[i]
          if (e.change === true) {
            return true
          }
        }
      }
    }

    return false
  }

  JSON_DisplayPath(): string | undefined {
    return this.display_path && JSON.stringify(this.display_path)
  }

  JSON_SiteLink(): string | undefined {
    return this.site_link && JSON.stringify(this.site_link)
  }

  JSON_InfoImage(): string | undefined {
    return this.info_image && JSON.stringify(this.info_image)
  }

  PayloadTitles(): any[] {
    let titles: any[] = []

    switch (true) {
      case this.IsTitleDesType2():
        try {
          this.titles.forEach((element) => {
            let newElement: { [key: string]: any } = {
              id: element.id,
              creative_id: element.creative_id,
              status: element.status,
              title: JSON.stringify(element.ttArray),
              description: JSON.stringify(element.dArray),
            }

            if (
              this.IsDemandGenVideo() ||
              this.IsPMax() ||
              this.IsGoogleDisplay()
            ) {
              newElement.long_headline = JSON.stringify(element.lhArray)
            }

            if (this.IsPMax()) {
              newElement.short_description = element.short_description
            }
            titles.push(newElement)
          })
        } catch (error) {
          console.error(error)
        }
        break

      case this.IsFacebook():
        try {
          this.titles.forEach((element) => {
            let newElement: { [key: string]: any } = {
              id: element.id,
              creative_id: element.creative_id,
              status: element.status,
              primary_text: JSON.stringify(element.lhArray),
              title: JSON.stringify(element.ttArray),
              description: JSON.stringify(element.dArray),
            }

            titles.push(newElement)
          })
        } catch (error) {
          console.error(error)
        }
        break

      case this.IsTikTok():
        try {
          this.titles.forEach((element) => {
            let newElement: { [key: string]: any } = {
              id: element.id,
              creative_id: element.creative_id,
              status: element.status,
              title: JSON.stringify(element.ttArray),
            }

            titles.push(newElement)
          })
        } catch (error) {
          console.error(error)
        }
        break

      default:
        titles = this.titles

        break
    }

    return titles
  }
  Payload(): any {
    return {
      ...helper.clone(this),
      titles: this.PayloadTitles(),
      display_path: this.JSON_DisplayPath(),
      site_link: this.JSON_SiteLink(),
      info_image: this.JSON_InfoImage(),
      disable_ai_verify: helper.isDev() ? true : undefined,
    }
  }

  RemoveEmptyTitleDescription() {
    this.titles.forEach((element) => {
      element.ttArray = element.ttArray.filter((item) => item !== '')
      if (element.ttArray.length === 0) {
        element.ttArray.push('') // Add a default value or any placeholder value
      }

      element.lhArray = element.lhArray.filter((item) => item !== '')
      if (element.lhArray.length === 0) {
        element.lhArray.push('') // Add a default value or any placeholder value
      }

      element.dArray = element.dArray.filter((item) => item !== '')
      if (element.dArray.length === 0) {
        element.dArray.push('') // Add a default value or any placeholder value
      }
    })
  }

  //SET

  SetDemandGen() {
    this.type = CRE_TYPE.DEMANDGEN
  }
  SetSnapchat() {
    this.type = CRE_TYPE.SNAPCHAT
  }
  SetIconDefault() {
    this.site_icon = DEFAULT_ICON
  }
  SetDefaultInfoImage() {
    this.info_image = [
      { title: '', description: '', call_to_action: '', image: '' },
    ]
  }

  RepairInfoImages() {
    try {
      this.info_image = helper.isValidJSON(this.info_image)
        ? JSON.parse((this.info_image as unknown as string) || '')
        : this.info_image
    } catch (error) {
      console.error(error)

      this.SetDefaultInfoImage()
    }
  }

  SetDefaultSitelink() {
    this.site_link = ['', '', '', '']
  }

  RepairSiteLink() {
    try {
      this.site_link = JSON.parse((this.site_link as unknown as string) || '')
      this.site_link = helper.ensureArrayLength(this.site_link, 4)
    } catch {
      this.SetDefaultSitelink()
    }
  }

  SetDefaultDisplayPath() {
    this.display_path = ['', '']
  }

  SetDefaultTitles() {
    this.titles = [defaultTitleItem()]
  }

  RepairTitles() {
    const cloneTitles = helper.clone(this.titles)

    this.titles = cloneTitles.map((item: any) => {
      const ttArray = helper.isValidJSON(item.title)
        ? JSON.parse(item.title)
        : [item.title]
      const lhArray = helper.isValidJSON(item.long_headline)
        ? JSON.parse(item.long_headline)
        : [item.long_headline]
      const dArray = helper.isValidJSON(item.description)
        ? JSON.parse(item.description)
        : [item.description]

      return {
        id: item.id,
        creative_id: item.creative_id,
        status: item.status,
        title: item.title,
        ttArray: ttArray.length ? ttArray : [''],
        lhArray: lhArray.length ? lhArray : [''],
        dArray: dArray.length ? dArray : [''],
        short_description: item.short_description || '',
      }
    })
  }
  RepairTitlesFB() {
    const parseToArray = (value: any) => {
      if (!value) return ['']
      if (helper.isValidJSON(value)) {
        try {
          const arr = JSON.parse(value)
          return Array.isArray(arr) && arr.length ? arr : ['']
        } catch {
          return ['']
        }
      }
      return [value]
    }

    this.titles = helper.clone(this.titles).map((item: any) => ({
      id: item.id,
      creative_id: item.creative_id,
      status: item.status,
      title: item.title,
      ttArray: parseToArray(item.title),
      lhArray: parseToArray(item.primary_text),
      dArray: parseToArray(item.description),
    }))
  }

  RepairDisplayPath() {
    try {
      this.display_path = JSON.parse(this.display_path as unknown as string)
    } catch {
      this.SetDefaultDisplayPath()
    }
  }

  SetDefaultImages() {
    this.images = []
  }

  SetDefaultImageRatio(index: number) {
    const size = this.IsNewsbreak() ? RATIO_NEWSBREAK : SIZE_RATIO

    this.images[index].image_ratio = []

    size.forEach((element) => {
      this.images[index].image_ratio?.push({
        ratio: element,
        change: false,
        off: false,
        by_ai: false,
      })
    })
  }

  RepairImageRatio() {
    for (let index = 0; index < this.images.length; index++) {
      const img = this.images[index] as any

      if (img.image_ratio) {
        if (helper.IsString(img.image_ratio)) {
          img.image_ratio = JSON.parse(img.image_ratio)
        }
      }
      if (!img.image_ratio || !img.image_ratio.length) {
        this.SetDefaultImageRatio(index)
      }
    }
  }

  DeleteImageInfo() {
    this.images.forEach((element) => {
      element.id = undefined
      element.creative_id = undefined
    })
  }

  IsVerifyStatusPending() {
    return this.verify_manual === VERIFY_MANUAL.PENDING
  }
  ToEncodedQuery(): string {
    const collectData: string[] = []

    if (this.display_link) {
      collectData.push(this.display_link)
    }

    for (const element of this.titles) {
      // gom các array lại, lọc null/undefined
      const arrays = [element.ttArray, element.lhArray, element.dArray].filter(
        Boolean
      ) as string[][]

      for (const arr of arrays) {
        collectData.push(...arr.filter((item) => item.trim() !== ''))
      }
    }

    if (this.site_link) {
      collectData.push(...this.site_link.filter((item) => item.trim() !== ''))
    }

    if (this.call_to_action) {
      try {
        //Lấy text hiển thị, nếu ko có thì lấy value
        collectData.push(
          document.querySelector(
            '.cta-option-for-get .n-base-selection-input__content'
          )?.textContent || this.call_to_action
        )
      } catch {}
    }

    collectData.push(...this.SummariesList())

    return encodeURIComponent(collectData.join('.').replace(/\n/g, ''))
  }
}
export interface images {
  id?: number
  creative_id?: number
  image: string
  size?: string
  status?: string
  thumb?: string
  image_ratio?: imageRatio[]
  off?: boolean
  media_summary?: string //Lấy từ summaries
  rule_violated?: string
  advertising_text?: string
  audio_transcript?: string
  content_safety?: CONTENT_SAFETY
  log?: string

  headline?: string
  primary_text?: string
  description?: string
  website_url?: string
  creative_media?: number
  url_error?: boolean
}

export interface SnapData {
  title?: string
  description?: string
  call_to_action?: string
  image?: string
  coordinates?: coordinatesType
}

export interface imageRatio {
  ratio: string
  image?: string
  width?: number
  height?: number
  name?: string
  category?: string
  coordinates?: coordinatesType
  change: boolean
  off: boolean
  by_ai: boolean
  zoom?: number
}

export interface coordinatesType {
  x: number
  y: number
  width: number
  height: number
  rotate: number
  scaleX: number
  scaleY: number
}

export const defaultTitleItem = () => {
  return {
    title: '',
    description: '',
    ttArray: [''],
    lhArray: [''],
    dArray: [''],
  } as titlesStruct
}

export const defaultTitleItemFB = () => {
  return {
    title: '',
    description: '',
    ttArray: ['', ''],
    lhArray: ['', ''],
    dArray: [''],
  } as titlesStruct
}

export interface titlesStruct {
  id?: number
  creative_id?: number
  title?: string
  status?: string
  description?: string
  short_description?: string
  ttArray: string[]
  lhArray: string[]
  dArray: string[]
}

export class FreezeCre {
  id: number
  isModal: boolean
  disabledType: boolean

  constructor(obj: { id: string; isModal: boolean; disabledType: boolean }) {
    this.id = Number(obj.id) || 0
    this.isModal = obj.isModal
    this.disabledType = obj.disabledType
  }

  isAddPage() {
    return this.id === 0 || this.isModal === true
  }

  isEditPage() {
    return !this.isAddPage()
  }

  isDisableType() {
    return this.disabledType === true || this.isEditPage()
  }

  isNormalMode() {
    return this.isModal === false
  }

  isModalMode() {
    return this.isModal === true
  }
}

export const isMedia = {
  video: (url?: string) => url?.match(/\.(mp4|webm|ogg)$/) !== null,
  youtube: (url?: string) => helper.youtubeVideoID(url) !== null,
  any: (url?: string) => url && (isMedia.video(url) || isMedia.youtube(url)),
} as const

export class StatusCreativeManager {
  isLoading?: boolean
  isUploading?: boolean
  isUploadingThumbnail?: boolean
  isSubmitting?: boolean
  showModalSaveForm?: boolean
  isTransforming?: boolean

  uploadMultipleCreative?: boolean = false // Allow uploading multiple creatives automatically based on images (Facebook single_image mode)

  showModal?: boolean //show modal crop ảnh ở creative
  isChangeData?: boolean // Mark to indicate image crop has been edited in order to show confirm before closing modal
  editingImage?: string
  previewItem?: images
  createImageSnapchat?: number
  showEditPreview?: boolean
  base64Image?: string // Used to remove the base64 of the image when deleted to avoid duplicate warnings if uploading the same image again
  indexMedia?: number // Index of the image currently being edited
  permissionCreative?: PermissionCreative = new PermissionCreative()
  constructor(data?: any) {
    this.isLoading = true
    this.isUploading = false
    this.isUploadingThumbnail = true
    this.isSubmitting = false
    this.isTransforming = false
    this.showModal = false
    this.isChangeData = false
    this.showModalSaveForm = false
    this.showEditPreview = true
    this.editingImage = ''
    this.previewItem = {} as images
    this.createImageSnapchat = 0

    if (data) {
      for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
          switch (key) {
            default:
              const element = data[key]
              this[key as keyof this] = element
              break
          }
        }
      }
    }
  }
}

export class PermissionCreative {
  approvedCreative?: boolean

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
}

export class CreativeStateManager {
  dataModal?: ModalStateCreative
  disabledType?: boolean
  isModalAd?: boolean
  route?: RouteLocationNormalizedLoaded

  constructor(data: any) {
    if (data) {
      for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
          const element = data[key]
          this[key as keyof this] = element
        }
      }
    }
  }

  createInfoModal() {
    return {
      type: this.dataModal?.type,
      ad_type: this.dataModal?.ad_type,
      traffic_source: this.dataModal?.traffic_source,
    } as ModalStateCreative
  }

  isModalMode() {
    return this.dataModal !== undefined
  }

  isNormalMode() {
    return !this.isModalMode()
  }

  id() {
    return this.isModalMode()
      ? Number(this.dataModal?.id) || 0
      : Number(this.route?.params.id) || 0
  }

  idString() {
    return this.id() ? this.id().toString() : ''
  }

  isAddPage() {
    return this.id() === 0
  }

  isEditPage() {
    return !this.isAddPage()
  }

  isDuplicatePage() {
    return this.duplicateId() !== 0 && !this.isModalMode()
  }

  duplicateId() {
    return this.isModalMode() ? 0 : Number(window.route.query.duplicate) || 0
  }

  isDisableType() {
    return this.disabledType === true || this.isEditPage()
  }
  CreativeMediaRequest() {
    if (this.route?.query?.creative_media) {
      return Number(this.route.query.creative_media) || null
    }
    return null
  }

  CreativeRequest() {
    if (this.route?.query?.request_id) {
      return Number(this.route.query.request_id) || null
    }
    return null
  }
}
