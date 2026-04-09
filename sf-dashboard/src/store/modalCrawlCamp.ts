import { DS, ONOFF } from '@/enum/campaign'
import { GENERATE_MODE, INPUT_SOURCE, TYPE_PROMPT } from '@/enum/crawl_campaign'
import { TS } from '@/enum/campaign'
import { defineStore } from 'pinia'
import { SelectOption } from 'naive-ui'
import { CrawlImagePrompt, LocationType } from '@/class/crawl_campaign'
import { ctr_crawl_campaign } from '@/services/ctr_crawl_campaign'
import { FBTemplateStruct } from './details/crawlFacebookTemplate'
import { GGTemplateStruct } from './details/crawlGoogleTemplate'
import { TaboolaTemplateStruct } from './details/crawlTaboolaTemplate'

export class CrawlCampKeyword {
  traffic_source?: TS
  default_account?: string | null
  demand_source?: string
  input_source?: INPUT_SOURCE | null = INPUT_SOURCE.TARGET_AUDIENCE
  keywords?: string | null
  location: LocationType = new LocationType()
  config_default?: number | null
  landing_language?: string | null
  target_audience_content?: string | null
  custom_name?: string
  link_ad?: string | null
  campaign_by_device?: ONOFF | null

  number_of_angles?: number | null
  number_of_variations?: number | null
  ai_image?: ONOFF | null = ONOFF.ON
  image_generate_mode?: GENERATE_MODE | null
  number_of_images?: number | null
  images?: string[] | null
  video_generator?: ONOFF | null = ONOFF.OFF

  ai_landing?: ONOFF | null = ONOFF.ON
  landing_generate_mode?: GENERATE_MODE | null
  number_of_landings?: number | null
  landing_page_id?: number | null
  keyword_set_id?: number | null
  tags?: string[]
  image_prompt: CrawlImagePrompt[] = []

  constructor(data?: any) {
    if (data) {
      for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
          const element = data[key]

          if (!element) continue
          switch (key) {
            case 'location':
              this.location = new LocationType(element)

              break
            case 'image_prompt':
              this.image_prompt = (element as any[]).map(
                (item) => new CrawlImagePrompt(item)
              )
              break
            default:
              this[key as keyof this] = element
              break
          }
        }
      }
    } else {
      this.traffic_source = TS.GOOGLE
      this.demand_source = DS.ADSENSE
    }

    if (!this.number_of_angles) this.number_of_angles = 1
  }

  Angles() {
    return this.number_of_angles || 0
  }

  Variations() {
    return this.number_of_variations || 0
  }

  Images() {
    return this.images?.length || 0
  }

  NumberOfImages() {
    return this.number_of_images || 0
  }

  AdCreativeImages() {
    let total = 0
    let text = ''
    if (this.ai_image) {
      if (this.IsOffAIImage()) {
        total = this.Angles() * this.Variations() * this.Images()
        text = `${this.Angles()} angles x ${this.Variations()} variations x ${this.Images()} images`
      }

      if (this.IsOnAIImage()) {
        switch (this.image_generate_mode) {
          case GENERATE_MODE.PER_ANGLE:
            total = this.Angles() * this.Variations() * this.Angles()
            text = `${this.Angles()} angles x ${this.Variations()} variations x ${this.Angles()} angles`
            break

          case GENERATE_MODE.PER_VARIATION:
            total =
              this.Angles() *
              this.Variations() *
              this.Angles() *
              this.Variations()
            text = `${this.Angles()} angles x ${this.Variations()} variations x ${this.Angles()} angles x ${this.Variations()} variations`
            break
          case GENERATE_MODE.GENERAL:
            total = this.Angles() * this.Variations() * this.NumberOfImages()
            text = `${this.Angles()} angles x ${this.Variations()} variations x ${this.NumberOfImages()} images`
            break
        }
      }
    }

    if (total === 0) return 'Total: 0'
    return `Total: ${total} (${text})`
  }

  Payload() {
    const pl = {
      ...this,
      keywords: this.keywords ? helper.stringToArray(this.keywords) : [],
    }

    //google & facebook set default
    if (this.IsGoogleTS() || this.IsFacebookTS()) {
      if (this.IsOnAIImage()) pl.image_generate_mode = GENERATE_MODE.PER_ANGLE
      if (this.IsOnAILanding())
        pl.landing_generate_mode = GENERATE_MODE.PER_ANGLE
    }
    return pl
  }

  IsTaboolaTS() {
    return this.traffic_source === TS.TABOOLA
  }
  IsGoogleTS() {
    return this.traffic_source === TS.GOOGLE
  }
  IsFacebookTS() {
    return this.traffic_source === TS.FACEBOOK
  }

  IsGoogleDS() {
    return this.demand_source === DS.ADSENSE
  }

  IsInputSourceKeywords() {
    return this.input_source === INPUT_SOURCE.KEYWORDS
  }

  IsInputSourceTargetAudience() {
    return this.input_source === INPUT_SOURCE.TARGET_AUDIENCE
  }

  IsOnAIImage() {
    return this.ai_image === ONOFF.ON
  }

  IsOffAIImage() {
    return this.ai_image === ONOFF.OFF
  }

  IsOnAILanding() {
    return this.ai_landing === ONOFF.ON
  }

  IsOffAILanding() {
    return this.ai_landing === ONOFF.OFF
  }

  SetInputSourceTargetAudience() {
    if (this.IsGoogleTS()) {
      if (!this.input_source) {
        this.input_source = INPUT_SOURCE.TARGET_AUDIENCE
      }

      return
    }

    if (this.IsFacebookTS()) {
      if (!this.input_source) {
        this.input_source = INPUT_SOURCE.TARGET_AUDIENCE
      }

      return
    }

    if (this.IsTaboolaTS()) {
      this.input_source = INPUT_SOURCE.TARGET_AUDIENCE

      this.ai_landing = ONOFF.OFF
      this.ai_image = ONOFF.OFF

      return
    }
  }

  SetDefaultLocation() {
    this.location = new LocationType()
  }

  IsCloneAd() {
    return this.input_source === INPUT_SOURCE.CLONE_AD
  }

  IsImageModeGeneral() {
    return (
      this.IsInputSourceTargetAudience() &&
      this.image_generate_mode === GENERATE_MODE.GENERAL
    )
  }

  IsLandingModeGeneral() {
    return (
      this.IsTaboolaTS() &&
      this.IsInputSourceTargetAudience() &&
      this.landing_generate_mode === GENERATE_MODE.GENERAL
    )
  }

  CurrentImagePrompt(item: CrawlImagePrompt) {
    return this.image_prompt.find((i) => i.KeyUnique() === item.KeyUnique())
  }
}

export default defineStore('modalCrawlCamp', () => {
  const showModal = ref<boolean>(false)
  const showDrawer = ref<boolean>(false)
  const showDrawerPreset = ref<boolean>(false)
  const typeDrawerPreset = ref<'create_preset' | 'edit_preset' | null>(null)
  const isLoading = ref<boolean>(false)
  const isCallapi = ref(false)

  const dataCrawlCamp = ref<CrawlCampKeyword>(new CrawlCampKeyword())
  const configDefaultOptions = ref<SelectOption[]>([])
  const typeDrawer = ref<TYPE_PROMPT | null>(null)

  const dataImageTotal = ref<CrawlImagePrompt[]>([])
  const dataImageDrawer = ref<CrawlImagePrompt[]>([])
  const optionsPrompt = ref<SelectOption[]>([])

  const isPrompt = computed(() => {
    return typeDrawer.value === TYPE_PROMPT.PROMPT
  })

  const isApi = computed(() => {
    return typeDrawer.value === TYPE_PROMPT.API
  })

  const itemsPrompt = computed(() =>
    dataImageTotal.value.filter((item) => {
      if (item.prompt && item.prompt !== 0) return true
      return false
    })
  )

  const itemsAPI = computed(() =>
    dataImageTotal.value.filter((item) => {
      if (item.api && item.api !== '') return true
      return false
    })
  )

  const payloadDataImagePrompts = computed(() => {
    if (isPrompt.value) {
      return dataImageDrawer.value.concat(itemsAPI.value)
    }

    if (isApi.value) {
      return dataImageDrawer.value.concat(itemsPrompt.value)
    }

    return dataImageTotal.value
  })

  const openModal = () => {
    showModal.value = true
    dataCrawlCamp.value.keywords = ''
  }

  const setData = (data: any, replace: boolean = false) => {
    if (!data) return
    // Khi replace === true, chỉ cập nhật `default_account` để tránh
    // ghi đè lên các trường khác (traffic_source / demand_source)
    // vì watch sẽ khiến call api liên tục
    if (replace) {
      if (Object.prototype.hasOwnProperty.call(data, 'default_account')) {
        dataCrawlCamp.value.default_account = data.default_account
      }
      return
    }

    dataCrawlCamp.value = new CrawlCampKeyword(data)
  }

  const getConfigDefaultByID = async (id: number) => {
    if (!id) return
    if (dataCrawlCamp.value.IsFacebookTS()) {
      const result = await ctr_crawl_campaign.GetCampaignPresetByID(id)

      const dbFB = new FBTemplateStruct(result?.data || {})

      dataCrawlCamp.value.location = new LocationType(dbFB.location)
      dataCrawlCamp.value.tags = dbFB.tags
      dataCrawlCamp.value.landing_language = dbFB.landing_language

      return
    }

    if (dataCrawlCamp.value.IsGoogleTS()) {
      const result = await ctr_crawl_campaign.GetCampaignPresetByID(id)
      const dbGG = new GGTemplateStruct(result?.data || {})

      dataCrawlCamp.value.location = new LocationType(dbGG.location)
      dataCrawlCamp.value.tags = dbGG.tags
      dataCrawlCamp.value.landing_language = dbGG.landing_language

      return
    }

    if (dataCrawlCamp.value.IsTaboolaTS()) {
      const result = await ctr_crawl_campaign.GetCampaignPresetByID(id)
      const dbTB = new TaboolaTemplateStruct(result?.data || {})

      dataCrawlCamp.value.location = new LocationType(dbTB.location)
      dataCrawlCamp.value.tags = dbTB.tags
      dataCrawlCamp.value.landing_language = dbTB.landing_language

      return
    }
  }

  const addNewImagePrompt = () => {
    dataImageDrawer.value?.push(new CrawlImagePrompt({ image: '' }))
  }

  const getDataImagePrompts = async () => {
    isLoading.value = true
    const result = await ctr_crawl_campaign.GetImagePrompt()
    dataImageTotal.value = []
    if (result?.data) {
      dataImageTotal.value = result.data.map(
        (item: any) => new CrawlImagePrompt(item)
      )
    }
    removeInvalidImagePrompts()

    isLoading.value = false
  }

  const removeInvalidImagePrompts = () => {
    const validImages = new Set(
      dataImageTotal.value.map((item) => item.KeyUnique())
    )

    dataCrawlCamp.value.image_prompt = dataCrawlCamp.value.image_prompt.filter(
      (item) => validImages.has(item.KeyUnique())
    )
  }

  const setDataDrawer = () => {
    dataImageDrawer.value = []

    switch (true) {
      case isPrompt.value:
        dataImageDrawer.value = itemsPrompt.value.map(
          (i) => new CrawlImagePrompt(i)
        )
        break

      case isApi.value:
        dataImageDrawer.value = itemsAPI.value.map(
          (i) => new CrawlImagePrompt(i)
        )

        break

      default:
        break
    }

    if (!dataImageDrawer.value.length) addNewImagePrompt()
  }

  const openDrawerCampaignPreset = (type: 'create_preset' | 'edit_preset') => {
    typeDrawerPreset.value = type
    showDrawerPreset.value = true
  }

  const closeDrawerCampaignPreset = () => {
    showDrawerPreset.value = false
    typeDrawerPreset.value = null
  }

  const isInsideDrawer = computed(() => showDrawerPreset.value || false)

  return {
    showModal,
    showDrawer,
    typeDrawerPreset,
    showDrawerPreset,
    dataCrawlCamp,
    isCallapi,
    configDefaultOptions,
    dataImageTotal,
    isLoading,
    typeDrawer,
    optionsPrompt,
    dataImageDrawer,

    isPrompt,
    isApi,
    payloadDataImagePrompts,
    itemsPrompt,
    itemsAPI,
    isInsideDrawer,

    openDrawerCampaignPreset,
    closeDrawerCampaignPreset,
    openModal,
    setData,
    getConfigDefaultByID,
    getDataImagePrompts,
    addNewImagePrompt,
    setDataDrawer,
    removeInvalidImagePrompts,
  }
})
