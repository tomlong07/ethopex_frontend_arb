import {
  BIDSTRATEGY,
  ONOFF,
  PLACEMENT_FB_POSITION,
  PLACEMENT_INS_POSITION,
  PLACEMENT_MESSENGER_POSITION,
  PLACEMENT_NETWORK_POSITION,
  PLACEMENT_PLATFORM,
  PLACEMENT_THREAD,
  PLACEMENT_TYPE,
  TS,
} from '@/enum/campaign'
import { SelectOption } from 'naive-ui'
import { defineStore } from 'pinia'

import { ctr_crawl_campaign } from '@/services/ctr_crawl_campaign'
import { ctr_pixel } from '@/services/ctr_pixel'
import { FeSettings } from '@/class/fe_settings'
import { LocationType } from '@/class/crawl_campaign'
import { PurchaseValue } from '@/class/campaign'
import modalCrawlCamp from '../modalCrawlCamp'
export class FBTemplateStruct {
  id?: number
  name?: string
  status?: ONOFF
  performance_goal?: string | null
  conversion_event?: string | null
  pixel?: number | null
  bidding?: string | null
  ad_type?: string | null
  budget?: number | null
  ad_campaign?: number | null = 1
  location: LocationType = new LocationType()
  label?: number
  language?: string[] | null
  cost_per_result?: number | null
  landing_language?: string | null
  bid_strategy?: BIDSTRATEGY | null
  advantage_campaign_budget?: ONOFF
  extension?: ONOFF
  tags: string[] = []
  audience_type?: PLACEMENT_TYPE
  device?: string[]
  age_groups?: string[]
  placement_type?: string
  placements?: string[]
  placement_platform?: PLACEMENT_PLATFORM[]
  facebook_positions?: PLACEMENT_FB_POSITION[]
  instagram_positions?: PLACEMENT_INS_POSITION[]
  messenger_positions?: PLACEMENT_MESSENGER_POSITION[]
  audience_network_positions?: PLACEMENT_NETWORK_POSITION[]
  threads_positions?: PLACEMENT_THREAD[]

  click_through?: number = 1
  engaged_view?: number = -1
  view_through?: number = -1

  // thêm các fields khác
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
            default:
              this[key as keyof this] = element
              break
          }
        }
      }
      if (!this.status) this.status = ONOFF.OFF
      if (!this.advantage_campaign_budget)
        this.advantage_campaign_budget = ONOFF.OFF

      if (!this.extension) this.extension = ONOFF.OFF
      if (!this.audience_type) this.audience_type = PLACEMENT_TYPE.ADVANTAGE
      if (!this.placement_type) this.placement_type = PLACEMENT_TYPE.ADVANTAGE
      if (!this.age_groups) this.age_groups = ['min_18', 'max_65']
    } else {
      this.status = ONOFF.ON
      this.performance_goal = 'OFFSITE_CONVERSIONS'
      this.bidding = 'DAILY_BUDGET'
      this.advantage_campaign_budget = ONOFF.ON
      this.extension = ONOFF.OFF
      this.audience_type = PLACEMENT_TYPE.ADVANTAGE
      this.placement_type = PLACEMENT_TYPE.ADVANTAGE
      this.age_groups = ['min_18', 'max_65']
    }

    if (
      (window.arb.isAdmin() || window.arb.isDev() || window.arb.isAnt()) &&
      !this.purchase_value
    ) {
      this.purchase_value = new PurchaseValue()
    }

    if (this.IsFlexible()) {
      this.ad_campaign = null
    }
  }

  IsFlexible() {
    return this.ad_type === 'flexible'
  }

  IsManual() {
    return this.audience_type === PLACEMENT_TYPE.MANUAL
  }
}

export const useCrawlFacebookTemplate = defineStore(
  'crawlFacebookTemplate',
  () => {
    const storeModalCrawl = modalCrawlCamp()

    // State
    const isLoading = ref(true)
    const isSubmitBtnLoading = ref(false)
    const loadingConversionEvents = ref(false)
    const crawlFBTemplate = ref<FBTemplateStruct>(new FBTemplateStruct())
    const conversionEventOptions = ref<SelectOption[]>([])
    const feSettings = ref<FeSettings>()

    const typeObjective = {
      type: 'OUTCOME_SALES',
      IsAPI: () => true,
    } as unknown as any

    const isDuplicatePage = computed(() => {
      return Number(window.route.query.duplicate) || 0
    })

    const isAddPage = computed(() => {
      return crawlFBTemplate.value.id ? false : true
    })

    const isEditPage = computed(() => {
      return crawlFBTemplate.value.id ? true : false
    })

    const textShow = computed(() => {
      return isAddPage.value ||
        storeModalCrawl.typeDrawerPreset == 'create_preset'
        ? 'Add'
        : 'Edit'
    })

    const isOnCampaignBudget = computed(() => {
      return crawlFBTemplate.value.advantage_campaign_budget === ONOFF.ON
    })
    const isOffCampaignBudget = computed(() => {
      return crawlFBTemplate.value.advantage_campaign_budget === ONOFF.OFF
    })

    const isMaxNumberOfConv = computed(() => {
      return crawlFBTemplate.value.performance_goal === 'OFFSITE_CONVERSIONS'
    })

    const fetchFacebookTemplate = async (id: number) => {
      const result = await ctr_crawl_campaign.GetCampaignPresetByID(id)
      crawlFBTemplate.value = new FBTemplateStruct(result?.data)
    }

    const submitForm = async () => {
      try {
        isSubmitBtnLoading.value = true
        if (!crawlFBTemplate.value.name) {
          window.message.error('Please enter a campaign preset name.')
          throw new Error('Please enter a campaign preset name.')
        }

        // console.log({
        //   ...crawlFBTemplate.value,
        //   object: 'config_' + TS.FACEBOOK,
        // })
        // return
        const result = await ctr_crawl_campaign.SaveCampaignPreset({
          ...crawlFBTemplate.value,
          object: 'config_' + TS.FACEBOOK,
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

    const fetchConversionEvents = async () => {
      conversionEventOptions.value = []
      if (!crawlFBTemplate.value.pixel) return
      loadingConversionEvents.value = true

      const result = await ctr_pixel.ListEventFacebook(
        crawlFBTemplate.value.pixel
      )
      conversionEventOptions.value = result?.data || []
      loadingConversionEvents.value = false
    }

    const clearData = () => {
      crawlFBTemplate.value = new FBTemplateStruct()
    }

    const initData = async () => {
      isLoading.value = true

      clearData()

      if (isDuplicatePage.value) {
        await fetchFacebookTemplate(isDuplicatePage.value)
        crawlFBTemplate.value = new FBTemplateStruct({
          ...crawlFBTemplate.value,
          id: 0,
        })
      }

      if (window.route?.params?.id) {
        crawlFBTemplate.value.id = Number(window.route?.params?.id)
      }

      if (isEditPage.value && crawlFBTemplate.value.id) {
        await fetchFacebookTemplate(crawlFBTemplate.value.id)
      }

      isLoading.value = false
    }

    return {
      // State
      isLoading,
      isSubmitBtnLoading,
      crawlFBTemplate,
      conversionEventOptions,
      typeObjective,
      loadingConversionEvents,
      feSettings,

      // Getters
      isOnCampaignBudget,
      isOffCampaignBudget,
      isMaxNumberOfConv,

      // Actions
      submitForm,
      fetchFacebookTemplate,
      clearData,
      initData,
      fetchConversionEvents,
    }
  }
)
