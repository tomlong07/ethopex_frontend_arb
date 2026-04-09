import { ONOFF } from '@/enum/campaign'
import { ctr_traffic_source } from '@/services/ctr_traffic_source'
import { ctr_crawl_campaign } from '@/services/ctr_crawl_campaign'
import { SelectOption } from 'naive-ui'
import { defineStore } from 'pinia'

import { TS } from '@/enum/campaign'
import { FeSettings } from '@/class/fe_settings'
import { LocationType } from '@/class/crawl_campaign'
import { ScheduleEntry } from '@/interface/campaign'
import { PurchaseValue } from '@/class/campaign'
import modalCrawlCamp from '../modalCrawlCamp'

export class GGTemplateStruct {
  id?: number
  name?: string
  status?: ONOFF
  location: LocationType = new LocationType()
  language: string[] = []
  bidding?: string
  budget?: number
  cpc?: number | null
  conversion_goals?: string
  search_themes: string[] = []
  audiences: string[] = []
  label?: number
  campaign_type?: string
  set_fixed?: ONOFF
  landing_language?: string
  tags: string[] = []
  schedule?: {
    google?: ScheduleEntry[]
  }

  //Chỉ sử dụng ở fe
  bidding_status?: boolean
  ai_audience: boolean = false //Sử dụng ở fe

  purchase_value?: PurchaseValue

  constructor(data?: any) {
    if (data) {
      for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
          const element = data[key]

          if (key === 'label' && element === 0) {
            this[key as keyof this] = element
          }
          if (!element) continue

          switch (key) {
            case 'location':
              this.location = new LocationType(element)

              break

            case 'purchase_value':
              this.purchase_value = new PurchaseValue(element)

              break
            default:
              this[key as keyof this] = element
              break
          }
        }
      }
      if (!this.status) this.status = ONOFF.OFF
      if (this.audiences?.length && this.audiences.includes('{AI_Audiences}')) {
        this.ai_audience = true
      }
    } else {
      this.status = ONOFF.ON
    }

    if (
      (window.arb.isAdmin() || window.arb.isDev() || window.arb.isAnt()) &&
      !this.purchase_value
    ) {
      this.purchase_value = new PurchaseValue()
    }

    if (this.cpc) {
      this.bidding_status = true
    } else {
      this.bidding_status = false
      this.cpc = null
    }
  }
}

export const useCrawlGoogleTemplate = defineStore(
  'useCrawlGoogleTemplate',
  () => {
    const storeModalCrawl = modalCrawlCamp()

    // State
    const isLoading = ref(true)
    const isSubmitBtnLoading = ref(false)
    const loadingLanguages = ref(false)

    const crawlGGTemplate = ref(new GGTemplateStruct())
    const languageOptions = ref<SelectOption[]>([])
    const feSettings = ref<FeSettings>()
    const isDuplicatePage = computed(() => {
      return Number(window.route.query.duplicate) || 0
    })

    const isAddPage = computed(() => {
      return crawlGGTemplate.value.id ? false : true
    })

    const isEditPage = computed(() => {
      return crawlGGTemplate.value.id ? true : false
    })

    const textShow = computed(() => {
      return isAddPage.value ||
        storeModalCrawl.typeDrawerPreset == 'create_preset'
        ? 'Add'
        : 'Edit'
    })

    const fetchGoogleTemplate = async (id: number) => {
      const result = await ctr_crawl_campaign.GetCampaignPresetByID(id)
      crawlGGTemplate.value = new GGTemplateStruct(result?.data)
    }

    const submitForm = async () => {
      try {
        isSubmitBtnLoading.value = true

        if (!crawlGGTemplate.value.name) {
          window.message.error('Please enter a campaign preset name.')
          throw new Error('Please enter a campaign preset name.')
        }
        const result = await ctr_crawl_campaign.SaveCampaignPreset({
          ...crawlGGTemplate.value,
          object: 'config_' + TS.GOOGLE,
        })

        if (result?.status) {
          window.message.success(`${textShow.value} successfully`)
          if (isAddPage.value && feSettings.value?.page_list) {
            window.router.push({ path: feSettings.value?.page_list })
          }
        }
        if (!result?.status) {
          throw new Error(result?.message)
        }
        return result
      } finally {
        isSubmitBtnLoading.value = false
      }
    }

    const fetchLanguages = async () => {
      loadingLanguages.value = true
      const result = await ctr_traffic_source.GetLanguage(TS.GOOGLE)
      languageOptions.value = result?.data?.languages || []
      loadingLanguages.value = false
    }

    const clearData = () => {
      crawlGGTemplate.value = new GGTemplateStruct()
    }

    const initData = async () => {
      isLoading.value = true

      clearData()

      if (isDuplicatePage.value) {
        await fetchGoogleTemplate(isDuplicatePage.value)
        crawlGGTemplate.value = new GGTemplateStruct({
          ...crawlGGTemplate.value,
          id: 0,
        })
      }

      if (window.route?.params?.id) {
        crawlGGTemplate.value.id = Number(window.route?.params?.id)
      }

      if (isEditPage.value && crawlGGTemplate.value.id) {
        await fetchGoogleTemplate(crawlGGTemplate.value.id)
      }

      isLoading.value = false
    }

    return {
      // State
      isLoading,
      isSubmitBtnLoading,
      crawlGGTemplate,
      languageOptions,
      loadingLanguages,
      feSettings,

      // Getters

      // Actions
      fetchGoogleTemplate,
      clearData,
      submitForm,
      initData,
      fetchLanguages,
    }
  }
)
