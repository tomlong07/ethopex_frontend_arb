import { defineStore } from 'pinia'
import baseModalStore from './baseModalStore'

export default defineStore('useFbManualAdsStore', () => {
  const baseStore = baseModalStore()

  const dataModal = ref<any>({})
  return {
    ...baseStore,
    dataModal,

    changeDataModal(value: any) {
      dataModal.value = helper.clone(value)
    },
  }
})
