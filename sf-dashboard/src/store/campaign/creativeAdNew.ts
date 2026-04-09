import { ModalStateCreative } from '@/types/components/modal'
import { defineStore } from 'pinia'

import { adGroups, creativeStruct } from '@/types/components/campaign-v2'

export interface CreativeAdNewState {
  adgroup?: adGroups
  adcreative?: creativeStruct
}

export default defineStore('useCreativeAdNew', () => {
  const dataModal = ref<ModalStateCreative>({})
  const dataOriginal = ref<CreativeAdNewState>()

  return {
    dataModal,

    changeDataModal(value: ModalStateCreative) {
      dataModal.value = value
    },

    changeDataOriginal(info: CreativeAdNewState) {
      dataOriginal.value = info
    },
  }
})
