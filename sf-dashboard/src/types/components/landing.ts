import { DS, ONOFF } from '@/enum/campaign'
import { dataThumb } from './gallery'
import { AdFormats } from './dialog'
import { convertImageToFigure, wrapTablesWithResponsive } from '@/utils/utils'
import { CB, CREATE_BY } from '@/enum/landing'
import { URL_UPLOAD } from '@/constants/urls'

export interface landingType {
  cvr: number
  demand_source: string
  id: number
  main_keyword: string
  keywords: string
  name: string
  slug?: string
}

export class StatusState {
  showModal: boolean = false
  updateCK: number = 0
  createLanding: boolean = false
  creating: boolean = false

  constructor(data?: any) {
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
  changeShowModal(value: boolean) {
    this.showModal = value
  }

  updateCKNow() {
    if (this.createLanding) return // Chế độ tạo thẳng ở campaign ko cập nhật lại CK
    this.updateCK = Date.now()
  }

  showModalSaveForm = false
  isLoading = true
  readyWatch = false

  isLoadPermission = true
}

interface PermissionLanding {
  action: string
}

export class PermissionLandingManage {
  permission: PermissionLanding[] = []

  constructor() {}

  changePermission(value: PermissionLanding[]) {
    this.permission = value
  }

  permissionsAccept() {
    return this.permission?.map((item) => item.action)
  }

  isStop() {
    return !this.permissionsAccept() || !this.permissionsAccept().length
      ? true
      : false
  }

  isAcceptAICreate() {
    return this.permissionsAccept().includes('add_gpt')
  }

  isOnlyAcceptAICreate() {
    return this.isAcceptAICreate() && !this.isAcceptNormalCreate()
  }

  isAcceptNormalCreate() {
    return this.permissionsAccept().includes('add')
  }

  isAcceptFullCreate() {
    return this.isAcceptAICreate() && this.isAcceptNormalCreate()
  }

  isAcceptUpdate() {
    return this.permissionsAccept().includes('update')
  }

  notAcceptUpdate() {
    return !this.isAcceptUpdate()
  }
}

export interface landing_page_meta {
  keyword: string
  image?: string
}

export interface baseColor {
  txtColor?: string
  bgColor?: string
  hoverColor?: string
}
export interface shortcutWidgetListButton extends baseColor {
  id: string
  label?: string
  child: shortcutWidgetChild[]
  icon?: shortcutWidgetIcon
  smallDescription?: string
  href?: string
}

export interface shortcutWidgetChild {
  label?: string
  href?: string
  title?: string
  content?: string
  img?: string
}

export interface shortcutWidgetIcon {
  html: string
  position: string
}

export interface shortcutWidget {
  listButton?: shortcutWidgetListButton[]
  button?: shortcutWidgetListButton[]
  collapseContent?: shortcutWidgetListButton[]
  slider?: shortcutWidgetListButton[]
  ads?: shortcutWidgetListButton[]
}

export interface quizConfigItem {
  title: string
  result?: boolean
  answers?: quizConfigItem[]
}

const newJob = (recom?: boolean, textMore?: string): prelanderJobs => {
  return new prelanderJobs({
    title: 'Title',
    description: 'Description',
    company: 'Company',
    location: 'Location',
    rating: 4.5,
    numberRating: 100,
    numberLiving: 500,
    timePosted: '2 days ago',
    isRecommended: recom || false,
    recommendLabel: 'Recommended',
    buttonText: recom ? 'Check Now' : textMore || 'Expired',
  })
}
export class AnchorAdFormats {
  status?: string
  floor_price?: number

  constructor(data?: any) {
    this.status = 'off'
    this.floor_price = 0

    if (data) {
      for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
          const value = data[key]
          switch (key) {
            case 'status':
              this.status = value === 'on' ? 'on' : 'off'
              break
            case 'floor_price':
              this.floor_price = typeof value === 'number' ? value : 0
              break
            default:
              break
          }
        }
      }
    }
  }
}

export class prelanderConfigs {
  sponsored_title?: string
  layout?: number | null = 96 // 1: theme 1, 2: theme 2
  jobs?: prelanderJobs[]
  title_dropdown?: string | null
  list_company?: CompanyInfo[]
  keyword_macro?: string
  ad_config?: adConfigs
  content?: string
  unlock_content?: AdFormats
  anchor?: AnchorAdFormats
  interstitial?: AnchorAdFormats

  constructor(data?: any) {
    if (data) {
      for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
          const element = data[key]

          switch (key) {
            case 'jobs':
              if (Array.isArray(element)) {
                this.jobs = element.map((job) => new prelanderJobs(job))
              } else {
                this.jobs = []
              }
              break

            case 'ad_config':
              this.ad_config = new adConfigs(element)
              break

            case 'list_company':
              if (Array.isArray(element)) {
                this.list_company = element.map(
                  (company) => new CompanyInfo(company)
                )
              } else {
                this.list_company = [new CompanyInfo()]
              }
              break

            case 'unlock_content':
              this.unlock_content = new AdFormats(element)
              break

            case 'anchor':
              this.anchor = new AnchorAdFormats(element)
              break

            default:
              this[key as keyof this] = element

              break
          }
        }
      }
    }
  }

  addJob() {
    if (!this.jobs) {
      this.jobs = []
    }

    const job = newJob(false, this.textMore())
    switch (true) {
      case this.IsTheme1():
        job.isExpired = true
        break

      case this.IsTheme2():
        job.isExpired = false
        break

      case this.IsTheme3():
        job.isExpired = false
        job.reward = false
        break

      default:
        job.isExpired = false
    }

    this.jobs.push(job)
  }

  addCompany() {
    if (!this.list_company) {
      this.list_company = []
    }
    this.list_company.push(new CompanyInfo())
  }

  addCompanyDefault() {
    if (!this.list_company) {
      this.list_company = []
    }
    this.list_company.push(
      new CompanyInfo({ name: 'Forest River, Inc.', numberOfJobs: '5 jobs' })
    )
    this.list_company.push(
      new CompanyInfo({ name: 'Streamline Company', numberOfJobs: '3 jobs' })
    )
  }

  recomendedJob() {
    if (!this.jobs) return null
    return this.jobs.find((job) => job.isRecommended === true) || null
  }

  normalJobs() {
    if (!this.jobs) return []
    return this.jobs.filter((job) => !job.isRecommended)
  }

  openJobs() {
    if (!this.jobs) return 0
    return this.jobs.filter((job) => !job.isExpired).length
  }

  IsTheme1() {
    return this.layout === 96
  }

  IsTheme2() {
    return this.layout === 97
  }

  IsTheme3() {
    return this.layout === 99
  }

  IsLayout100() {
    return this.layout === 100
  }

  IsShowAdConfig() {
    return this.IsTheme3() || this.IsLayout100()
  }

  textMore() {
    return this.IsTheme1() ? 'Expired' : 'Continue'
  }
  IsInsertType() {
    return this.ad_config?.insert_type === 'before' ? true : false
  }
}

export class adConfigs {
  enable: boolean
  ad_position: string | number[]
  ad_mode: string
  ad_type: string

  insert_type: string
  status?: boolean

  constructor(data?: Partial<adConfigs>) {
    this.enable = true
    this.ad_position = []
    this.ad_mode = 'gam'
    this.ad_type = 'banner'

    this.insert_type = 'after'
    this.status = true

    if (data) {
      Object.assign(this, data)
    }
  }

  IsModeAdsense() {
    return this.ad_mode === 'adsense'
  }
  AdTypeBanner() {
    return (this.ad_type = 'banner')
  }
  IsStatusAdOFF() {
    return this.status === false
  }
}

export class CompanyInfo {
  name?: string
  numberOfJobs?: string

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

export class prelanderJobs {
  title?: string
  description?: string
  company?: string
  location?: string
  rating?: number
  numberRating?: number
  numberLiving?: number
  isRecommended?: boolean
  isExpired?: boolean
  recommendLabel?: string
  timePosted?: string
  reward?: boolean
  buttonText?: string

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

  numberLivingText() {
    return helper.formatNumber(this.numberLiving || 0)
  }

  numberRatingText() {
    return helper.formatNumber(this.numberRating || 0)
  }

  getStarFill = (index: number): number => {
    const displayRating = this?.rating || 0
    const fullStars = Math.floor(this.rating || 0)
    const decimal = displayRating - fullStars

    if (index < fullStars) return 100
    if (index === fullStars) return decimal * 100
    return 0
  }
}

export const defaultPrelanderConfigs = () => {
  return new prelanderConfigs({
    layout: 96,
    sponsored_title: 'Sponsored Title',
    jobs: [newJob(true)],
  })
}

export interface quizConfig {
  subtitle_quiz?: string
  question?: string
  bgColor?: string
  bgQuizColor?: string
  txtColor?: string
  answerBgColor?: string
  hoverAnswerColor?: string
  question_quiz: quizConfigItem[]
  lineStep1Color?: string
  lineStep2Color?: string
}

export const defaultListButton = () => {
  return {
    id: '',
    txtColor: 'rgba(0, 0, 0, 1)',
    bgColor: '#f9ac2f',
    hoverColor: '#a4a3a2',
    child: [],
  } as shortcutWidgetListButton
}

export const defaultButton = () => {
  return {
    id: '',
    label: '',
    txtColor: '#ffffff',
    bgColor: '#f9ac2f',
    hoverColor: '#f1cb8d',
    icon: {
      html: '',
      position: 'left',
    },
    smallDescription: '',
    href: '',
  } as shortcutWidgetListButton
}

export const defaultCollapseContent = () => {
  return {
    id: '',
    child: [],
  } as shortcutWidgetListButton
}

export const defaultSlider = () => {
  return {
    id: '',
    txtColor: 'rgba(0, 0, 0, 1)',
    bgColor: '#f9ac2f',
    hoverColor: '#a4a3a2',
    child: [],
  } as shortcutWidgetListButton
}

export const defaultAds = () => {
  return {
    id: '',
  } as shortcutWidgetListButton
}

export const LB = {
  JOB_POSTING_CARD: 'Job Posting Card',
  PRICE_OFFER_CARD: 'Price Offer Card',
  BUTTON_BLOCK: 'Button Block',
  APP_DOWNLOAD_CARD: 'App Download Card',
  PROMO_CAROUSEL_CARD: 'Promo Carousel Card',
  QUESTION_ANSWER_BLOCK: 'Question Answer Block',
  AD_BLOCK: 'Ad Block',
}
export type LB = (typeof LB)[keyof typeof LB]

export interface Button_Block {
  buttonText?: string
  buttonUrl?: string
  buttonColor?: string
  buttonTextColor?: string
  configReward?: 'on' | 'off'
}

export interface App_Download_Card {
  heading?: string
  subHeading?: string
  textRating?: string
  textDownload?: string
  textUse?: string
  imageUrl?: string
  buttonUrl?: string
  buttonText?: string
  buttonColor?: string
  configReward?: 'on' | 'off'
}

export interface Promo_Carousel_Card {
  imageUrl?: string
  title?: string
  description?: string
}

export interface Question_Answer_Block {
  question: string
  answer: string
}

export interface Ad_Block {
  adMode?: string
  adType?: string
}

export class blockCode {
  id?: string
  template?: string
  items?: {
    title?: string
    description?: string
    timePosted?: string
    jobType?: string
    amount?: string
    imageUrl?: string
    buttonText?: string
    buttonUrl?: string
    company?: string
  } | null;

  [CB.BUTTON_BLOCK]?: Button_Block[];
  [CB.APP_DOWNLOAD_CARD]?: App_Download_Card;
  [CB.PROMO_CAROUSEL_CARD]?: Promo_Carousel_Card[];
  [CB.QUESTION_ANSWER_BLOCK]?: Question_Answer_Block[];
  [CB.AD_BLOCK]?: Ad_Block[]
}

export class landingTypeClass {
  jobBlocks?: blockCode[] = []

  id?: number
  demand_source?: DS | null
  status?: string = 'pending' // pending, on, off
  account?: string
  user_id?: number
  name?: string
  landing_page?: string
  clone_id?: number // lưu id của cũ landing page đc duplicate
  fixed_title?: string
  main_keyword?: string
  landing_pages_type?: string
  type?: string
  content_type?: string
  description?: string
  keywords?: string
  language?: string
  slug?: string
  title?: string
  content?: string
  image?: string
  landing_page_meta: landing_page_meta[] = []
  prelander?: ONOFF
  prelander_id?: number
  preview?: string
  direct_link?: ONOFF
  email?: string
  category_id?: number[]
  main_category?: number
  log_id?: number

  display_model?: string
  user_selected_model?: string

  shortcutWidget?: shortcutWidget
  quizConfig?: quizConfig
  prelander_configs?: prelanderConfigs
  create_by?: CREATE_BY
  thumbnails?: dataThumb[]
  t?: number

  reason?: string
  keyword_search?: string
  category_iab?: number | null
  tier_1?: string
  tier_2?: string
  tier_3?: string
  tier_4?: string

  constructor(data: any) {
    if (data) {
      for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
          switch (key) {
            case 'prelander_configs':
              if (data[key]) {
                this.prelander_configs = new prelanderConfigs(data[key])
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

    if (this.IsShowPrelanderConfigs() && !this.prelander_configs) {
      this.prelander_configs = defaultPrelanderConfigs()
    }
  }

  IsDemandAdsense() {
    return this.demand_source === DS.ADSENSE
  }

  IsDemandPubPower() {
    return this.demand_source === DS.PUBPOWER
  }

  IsDemandArbCore() {
    return this.demand_source === DS.ARBCORE
  }

  IsDemandCJ() {
    return this.demand_source === DS.CJ
  }

  IsDemandTonic() {
    return this.demand_source === DS.TONIC
  }

  IsDirectLinkOn() {
    return this.direct_link === ONOFF.ON
  }

  IsDirectLinkOff() {
    return this.direct_link === ONOFF.OFF
  }

  IsShowQuizConfig() {
    //Van bao: ko dung nua 29/05/25
    return false
    return this.IsDemandAdsense() && this.prelander === ONOFF.ON
  }

  IsShowPrelanderConfigs() {
    return (
      (this.IsDemandAdsense() && this.prelander === ONOFF.ON) ||
      this.IsDemandPubPower() ||
      this.IsDemandArbCore()
    )
  }

  IsShowContentBox() {
    return (
      this.IsDemandAdsense() ||
      (this.IsDemandPubPower() && this.IsDirectLinkOff()) ||
      (this.IsDemandArbCore() && this.IsDirectLinkOff())
    )
  }

  IsShowContentDescription() {
    if (this.IsDemandAdsense() && this.prelander === ONOFF.OFF) return true
    if (this.IsDemandPubPower() && this.IsDirectLinkOff()) return true
    if (this.IsDemandArbCore() && this.IsDirectLinkOff()) return true
    if (this.prelander_configs?.IsLayout100()) return true

    return false
  }

  IsCreateByGPT() {
    return this.create_by === CREATE_BY.GPT || false
  }

  IsCreateByManual() {
    return this.create_by === CREATE_BY.MANUAL || false
  }

  IsDisabledEdit() {
    return this.IsCreateByGPT() && this.t !== 0
  }

  IsCreateByCrawl() {
    return this.create_by === CREATE_BY.CRAWL_CAMPAIGN || false
  }

  IsAcceptNotCategory() {
    return this.IsCreateByGPT() || this.IsCreateByCrawl()
  }

  SetCreateByGPT() {
    this.create_by = CREATE_BY.GPT
  }

  SetDemandAdsense() {
    this.demand_source = DS.ADSENSE
  }

  SetDefaultForShortCutWidget() {
    if (this.shortcutWidget) {
      if (!this.shortcutWidget.listButton) {
        this.shortcutWidget.listButton = [defaultListButton()]
      }

      if (!this.shortcutWidget.button) {
        this.shortcutWidget.button = [defaultButton()]
      }

      if (!this.shortcutWidget.collapseContent) {
        this.shortcutWidget.collapseContent = [defaultCollapseContent()]
      }

      if (!this.shortcutWidget.slider) {
        this.shortcutWidget.slider = [defaultSlider()]
      }

      if (!this.shortcutWidget.ads) {
        this.shortcutWidget.ads = [defaultAds()]
      }
    }
  }

  SetPrelanderOFF() {
    this.prelander = ONOFF.OFF
  }

  SetDirectLinkON() {
    this.direct_link = ONOFF.ON
  }

  SetDirectLinkOFF() {
    this.direct_link = ONOFF.OFF
  }

  RepairContent() {
    if (!this.content) return
    const idsToRemove = ['professor_prebid-root', 'gtx-trans'] //Xóa bỏ id của google translate và prebid

    this.content = helper.updateSandboxAttribute(this.content)

    this.content = helper.removeElementsById(this.content, idsToRemove)
  }

  RepairDescription() {
    if (!this.description) return
    const idsToRemove = ['professor_prebid-root', 'gtx-trans'] //Xóa bỏ id của google translate và prebid

    this.description = helper.updateSandboxAttribute(this.description)

    this.description = helper.removeElementsById(this.description, idsToRemove)
  }

  CleanStyleHTML() {
    if (this.description) {
      const cleanedHtmlString = this.description?.replace(/style="[^"]*"/g, '')
      this.description = cleanedHtmlString
    }

    if (this.content) {
      const cleanedHtmlString1 = this.content?.replace(/style="[^"]*"/g, '')
      this.content = cleanedHtmlString1
    }
  }

  DeleteCreateBy() {
    this.create_by = undefined
  }

  Payload(isAddPage: boolean) {
    let landingTemp = helper.clone(this)

    if (!this.category_id) {
      landingTemp.category_id = []
    }
    const adConfig = landingTemp.prelander_configs?.ad_config

    if (adConfig && typeof adConfig.ad_position === 'string') {
      adConfig.ad_position = adConfig.ad_position
        .split(',')
        .map((s: any) => parseInt(s.trim(), 10))
        .filter((n: any) => !isNaN(n))
    }

    if (this.IsDemandAdsense()) {
      landingTemp.name = landingTemp.title
    }
    if (this.thumbnails?.length) {
      landingTemp.thumbnails = this.thumbnails
        ?.filter(
          (item) => item.path !== '' && item.IsSuccess() && !item.loading
        ) // Lọc bỏ các item có path rỗng
        .map((item) => item.path) // Map sang path
    }

    if (this.IsShowQuizConfig()) {
      if (landingTemp.quizConfig?.question_quiz?.length) {
        if (
          landingTemp.quizConfig?.question_quiz.filter(
            (item: any) => !item.title || !item.title.trim()
          ).length
        ) {
          window.message.error('Please fill all quiz question')
          return
        }

        for (
          let index = 0;
          index < landingTemp.quizConfig?.question_quiz.length;
          index++
        ) {
          const element = landingTemp.quizConfig?.question_quiz[index]
          if (
            !element.answers ||
            !element.answers.length ||
            element.answers.filter(
              (item: any) => !item.title || !item.title.trim()
            ).length
          ) {
            window.message.error('Please fill all question answer')
            return
          }
        }
      }
    } else {
      landingTemp.quizConfig = undefined
    }

    const idsToRemove = ['professor_prebid-root', 'gtx-trans'] //Xóa bỏ id của google translate và prebid

    if (landingTemp.content) {
      landingTemp.content = helper.updateSandboxAttribute(landingTemp.content)

      landingTemp.content = helper.removeElementsById(
        landingTemp.content,
        idsToRemove
      )
      landingTemp.content = convertImageToFigure(landingTemp.content)
      landingTemp.content = wrapTablesWithResponsive(landingTemp.content)
    }

    if (landingTemp.description) {
      landingTemp.description = helper.updateSandboxAttribute(
        landingTemp.description
      )

      landingTemp.description = helper.removeElementsById(
        landingTemp.description,
        idsToRemove
      )
      landingTemp.description = convertImageToFigure(landingTemp.description)
      landingTemp.description = wrapTablesWithResponsive(
        landingTemp.description
      )
    }

    const unlockDialog = landingTemp.prelander_configs?.unlock_content?.dialog
    if (unlockDialog?.image) {
      const host = URL_UPLOAD
      if (unlockDialog.image.startsWith(host)) {
        unlockDialog.image = unlockDialog.image.replace(host, '')
      }
    }

    if (isAddPage) {
      const parser = new DOMParser()
      const contentTableDes = parser.parseFromString(
        landingTemp.description,
        'text/html'
      )
      const contentTableContent = parser.parseFromString(
        landingTemp.content,
        'text/html'
      )

      const tablesDes = contentTableDes.querySelectorAll('[id^="table"]')
      const tablesContent =
        contentTableContent.querySelectorAll('[id^="table"]')

      if (tablesDes.length === 0) {
        const cleanedHtmlString = landingTemp.description?.replace(
          /style="[^"]*"/g,
          ''
        )
        landingTemp.description = cleanedHtmlString
      }

      if (tablesContent.length === 0) {
        const cleanedHtmlString = landingTemp.content?.replace(
          /style="[^"]*"/g,
          ''
        )
        landingTemp.content = cleanedHtmlString
      }
    } else {
      //Ko gửi trường create_by khi edit

      landingTemp.create_by = undefined
    }

    return landingTemp
  }
}

export function newLanding() {
  return new landingTypeClass({
    id: 0,
    demand_source: DS.ADSENSE,
    status: 'pending',
    content_type: 'n2s',
    landing_page_meta: [
      {
        image: '',
        keyword: '',
      },
    ],
    prelander: 'off',
    direct_link: 'on',
    category_id: [],
    create_by: CREATE_BY.MANUAL,
    thumbnails: [],
  })
}
