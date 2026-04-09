import { BIDDING_STRATEGY, ONOFF, TS } from '@/enum/campaign'
import { ctr_crawl_campaign } from '@/services/ctr_crawl_campaign'
import { defineStore } from 'pinia'
import { FeSettings } from '@/class/fe_settings'
import { LocationType } from '@/class/crawl_campaign'
import modalCrawlCamp from '../modalCrawlCamp'

export class TaboolaTemplateStruct {
  id?: number
  name?: string
  status?: ONOFF
  bidding_strategy?: string
  bidding?: string | null
  budget?: number
  cpc?: number | null
  label?: number | null = 0
  location: LocationType = new LocationType()

  landing_language?: string | null
  device?: string[]
  tags?: string[]

  // thêm các fields khác

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
            default:
              this[key as keyof this] = element
              break
          }
        }
      }
      if (!this.status) this.status = ONOFF.OFF
    } else {
      if (!this.status) this.status = ONOFF.ON
    }
  }

  IsBidControl() {
    return this?.bidding_strategy === BIDDING_STRATEGY.BIDCONTROL
  }

  IsMaxConversion() {
    return this?.bidding_strategy === BIDDING_STRATEGY.MAXCONVERSION
  }
}

export const useCrawlTaboolaTemplate = defineStore(
  'useCrawlTaboolaTemplate',
  () => {
    const storeModalCrawl = modalCrawlCamp()

    // State
    const isLoading = ref(true)
    const isSubmitBtnLoading = ref(false)
    const crawlDataTemplate = ref<TaboolaTemplateStruct>(
      new TaboolaTemplateStruct()
    )
    const feSettings = ref<FeSettings>()
    const isAddPage = computed(() => {
      return crawlDataTemplate.value.id ? false : true
    })

    const isEditPage = computed(() => {
      return crawlDataTemplate.value.id ? true : false
    })

    const isDuplicatePage = computed(() => {
      return Number(window.route.query.duplicate) || 0
    })

    const textShow = computed(() => {
      return isAddPage.value ||
        storeModalCrawl.typeDrawerPreset == 'create_preset'
        ? 'Add'
        : 'Edit'
    })

    const fetchDataTaboola = async (id: number) => {
      isLoading.value = true

      const result = await ctr_crawl_campaign.GetCampaignPresetByID(id)
      crawlDataTemplate.value = new TaboolaTemplateStruct(result?.data || {})
      isLoading.value = false
    }

    const submitForm = async () => {
      try {
        isSubmitBtnLoading.value = true
        if (!crawlDataTemplate.value.name) {
          window.message.error('Please enter a campaign preset name.')
          throw new Error('Please enter a campaign preset name.')
        }
        const result = await ctr_crawl_campaign.SaveCampaignPreset({
          ...crawlDataTemplate.value,
          object: 'config_' + TS.TABOOLA,
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

    const clearData = () => {
      crawlDataTemplate.value = new TaboolaTemplateStruct()
    }

    const initData = async () => {
      if (isEditPage.value) {
        await fetchDataTaboola(Number(window.route.params.id))
      } else {
        clearData()
        if (isDuplicatePage.value) {
          await fetchDataTaboola(isDuplicatePage.value)

          crawlDataTemplate.value = new TaboolaTemplateStruct({
            ...crawlDataTemplate.value,
            id: 0,
          })
        }
        isLoading.value = false
      }
    }

    return {
      // State
      isLoading,
      isSubmitBtnLoading,
      crawlDataTemplate,
      feSettings,

      // Getters

      // Actions
      fetchDataTaboola,
      clearData,
      submitForm,
      initData,
    }
  }
)
