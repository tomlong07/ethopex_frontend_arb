import { ONOFF } from '@/enum/campaign'
import { CampaignKeyword } from '@/types/components/campaignkeywords'
import { defineStore } from 'pinia'

export const campaignKeywordsManagerStore = defineStore(
  'campaignKeywordsManagerStore',
  () => {
    const isSubmitBtnLoading = ref<boolean>(false)
    const selectedCampaignIds = ref<string[]>([])

    const getDefaultCampaignKeyword = (): CampaignKeyword => ({
      name: '',
      status: 'on',
      domain: '',
      keyword_campaigns: [
        {
          keyword: '',
          campaign: null,
          keyword_prelander: '',
          domain_prelander: null,
          status_prelander: ONOFF.ON,
        },
      ],
    })

    const campaignKeyword = ref<CampaignKeyword>(getDefaultCampaignKeyword())

    const clearData = () => {
      selectedCampaignIds.value = []
      campaignKeyword.value = getDefaultCampaignKeyword()
    }
    return {
      isSubmitBtnLoading,
      campaignKeyword,
      selectedCampaignIds,
      clearData,
    }
  }
)
