import { defineStore } from 'pinia'
import baseModalStore from './baseModalStore'
import { adGroups } from '@/types/components/campaign-v2'

export interface AddMultipleInfo {
  fanpage?: string
  creative_ids?: number[]
  adgroup?: adGroups
  callback?: Function
}

export default defineStore('useCampaignAddMultiple', () => {
  const baseStore = baseModalStore()

  const dataModal = ref<AddMultipleInfo>({})

  return {
    ...baseStore,
    dataModal,

    changeAdGroup(value: adGroups) {
      dataModal.value.adgroup = value
    },

    changeOptionManager(value: Function) {
      dataModal.value.callback = value
    },
  }
})
