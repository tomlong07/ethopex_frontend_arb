import { campaignType } from '@/types/components/campaign'
import { defineStore } from 'pinia'

export default defineStore('useCopyCampaignStore', () => {
  const showModal = ref<boolean>(false)
  const sourceCopyCampaignV2 = ref<campaignType | undefined>(undefined)

  const changeModalCopyCampaignV2 = (
    status: boolean,
    source: campaignType | undefined = undefined
  ) => {
    showModal.value = status

    if (!status) {
      sourceCopyCampaignV2.value = undefined
      return
    }
    sourceCopyCampaignV2.value = source
  }

  return {
    showModal,
    sourceCopyCampaignV2,
    changeModalCopyCampaignV2,
  }
})
