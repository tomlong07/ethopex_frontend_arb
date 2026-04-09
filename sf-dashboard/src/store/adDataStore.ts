import { defineStore } from 'pinia'
import baseModalStore from './baseModalStore'
import { creativeStruct } from '@/types/components/campaign-v2'
import { AD_SETUP } from '@/enum/campaign'

export default defineStore('adDataStore', () => {
  const baseStore = baseModalStore()

  const dataModal = ref<any>({})
  const dataOrigin = ref<any>({})

  const showModalExist = ref<boolean>(false)
  const reloadFanpage = ref<number>(0) //reload lại cái option fanpage của campaign adgroup

  const adInfo = ref<any | null>()
  const campaignId = ref<number>()

  const showModalCreate = ref<boolean>(false)
  const reGetCampaign = ref<number>(0)

  const openModalAd = (value: creativeStruct) => {
    changeDataModal(value)
    if (value.ad_setup === AD_SETUP.USE_EXISTING_POST) {
      showModalExist.value = true
    } else {
      showModalCreate.value = true
    }
  }

  const payloadExist = computed(() => {
    return {
      fanpage: dataModal.value.fanpage,
      id: dataModal.value.id,
      post_id: dataModal.value?.post_id,
      ad_setup: dataModal.value?.ad_setup,
    }
  })

  const payloadCreate = computed(() => {
    return {
      fanpage: dataModal.value.fanpage,
      id: dataModal.value.id,
      ad_setup: dataModal.value?.ad_setup,
    }
  })

  const changeDataModal = (value: any) => {
    dataOrigin.value = value
    dataModal.value = helper.clone(value)
  }

  const changeOrigin = () => {
    for (const key in dataModal.value) {
      if (Object.prototype.hasOwnProperty.call(dataModal.value, key)) {
        dataOrigin.value[key] = dataModal.value[key]
      }
    }
  }
  return {
    ...baseStore,
    dataModal,
    payloadExist,
    payloadCreate,
    reloadFanpage,
    adInfo,
    campaignId,
    showModalExist,
    showModalCreate,
    reGetCampaign,
    changeDataModal,
    changeOrigin,
    openModalAd,
  }
})
