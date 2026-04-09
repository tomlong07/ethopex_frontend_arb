import { defineStore } from 'pinia'
import baseModalStore from './baseModalStore'
import { ModalStateSegment } from '@/types/components/modal'

export default defineStore('useSegmentModal', () => {
  const baseStore = baseModalStore()

  const dataModal = ref<ModalStateSegment>({})

  return {
    ...baseStore,
    dataModal,

    changeDataModal(value: ModalStateSegment) {
      dataModal.value = value
    },
  }
})
