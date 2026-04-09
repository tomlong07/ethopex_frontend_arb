import { defineStore } from 'pinia'
import { ModalState } from '@/types/components/modal'
import { campaignTypeClass } from '@/types/components/campaign-v2'
import { ctr_campaign } from '@/services/ctr_campaign'

export default defineStore('useCampaign2Store', () => {
  const showModalKeywordset = ref<boolean>(false)
  const isLoading = ref(false)
  const dataModal = ref<ModalState>({})

  const idKeywordSet = ref<number>(0)

  const updateKeywordList = ref<number>(0)
  const aiLog = ref<any>({})
  const showModalAd = ref<boolean>(false)
  const showModalAiLog = ref<boolean>(false)
  const adInfo = ref<any | null>()
  const campaign = ref<campaignTypeClass | null>()
  const idCampaign = ref<number>()
  const paging = ref({
    page: 1,
    size: 10,
  })

  const reGetCampaign = ref<number>(0)

  const changeModalKeywordset = (value: boolean) => {
    showModalKeywordset.value = value
  }

  const changeDataModal = (value: ModalState) => {
    dataModal.value = value

    if (!value.id) {
      value.id = 0
    }
  }

  const changeIdKeywordSet = (value: number) => {
    idKeywordSet.value = value
  }

  const updateKeywordListNow = () => {
    updateKeywordList.value = Date.now()
  }

  const fetchAILog = async () => {
    isLoading.value = true
    const { page, size } = paging.value
    const _payload = {
      search_type: '',
      search: '',
      page,
      size,
      sort: [
        {
          field: 'id',
          dir: 'desc',
        },
      ],
      filter: {
        campaigns: [idCampaign.value || 0],
      },
    }
    aiLog.value = await ctr_campaign.GetAILog(_payload)
    isLoading.value = false
  }

  return {
    showModalKeywordset,
    showModalAd,
    adInfo,
    campaign,
    dataModal,
    idKeywordSet,
    updateKeywordList,
    reGetCampaign,
    changeModalKeywordset,
    changeDataModal,
    changeIdKeywordSet,
    updateKeywordListNow,
    fetchAILog,
    aiLog,
    paging,
    isLoading,
    showModalAiLog,
    idCampaign,
  }
})
