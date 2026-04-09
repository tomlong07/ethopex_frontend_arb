import { ModalStateCreative } from '@/types/components/modal'
import { defineStore } from 'pinia'
import baseModalStore from './baseModalStore'

import { adGroups, creativeStruct } from '@/types/components/campaign-v2'

export interface CreativeModalInfo {
  callback: Function
  adgroup?: adGroups
  adcreative?: creativeStruct
}

export default defineStore('useCreativeModal', () => {
  const baseStore = baseModalStore()

  const dataModal = ref<ModalStateCreative>({})
  const dataOriginal = ref<CreativeModalInfo>()

  return {
    ...baseStore,
    dataModal,

    changeDataModal(value: ModalStateCreative) {
      dataModal.value = value
    },

    changeDataOriginal(info: CreativeModalInfo) {
      dataOriginal.value = info
    },

    changeDataOriginalV2(adcreative: creativeStruct, callback: Function) {
      dataOriginal.value = {
        adcreative: adcreative,
        callback: callback,
      }
    },

    callback() {
      try {
        if (baseStore.resultModal?.value.data) {
          dataOriginal.value?.adgroup?.creatives?.push({
            creative_id: baseStore.resultModal?.value.data,
          })

          if (dataOriginal.value?.adcreative) {
            dataOriginal.value.adcreative.creative_id =
              baseStore.resultModal?.value.data
          }
        }
        dataOriginal.value?.callback()
      } catch (error) {
        console.error(error)
      }
    },
  }
})
