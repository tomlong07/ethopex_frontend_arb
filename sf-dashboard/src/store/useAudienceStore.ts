import { defineStore } from 'pinia'
import baseModalStore from './baseModalStore'
import { ModalState } from '@/types/components/modal'

export default defineStore('useAudienceStore', () => {
  const baseStore = baseModalStore()

  const dataModal = ref<ModalState>({})

  return {
    ...baseStore,
    dataModal,

    changeDataModal(value: ModalState) {
      dataModal.value = value
    },
  }
})
