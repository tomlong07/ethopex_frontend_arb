import { defineStore } from 'pinia'
import { BlockSectionAdd } from '@/types/components/blocksection'

export default defineStore('blockSectionStore', () => {
  const isGettingSource = ref<boolean>(false)
  const trafficSelected = ref<string>()
  const isGetting = ref<boolean>(false)
  const isSubmitBtnLoading = ref<boolean>(false)
  const dataSection = {
    section: '',
    section_network: '',
    section_remove_network: '',
    total_section: 0,
    total_section_network: 0,
    total_section_remove_network: 0,
  }
  const sectionData = ref<BlockSectionAdd>({ ...dataSection })
  const cleartData = () => {
    sectionData.value = dataSection
  }
  return {
    sectionData,
    isGettingSource,
    trafficSelected,
    isGetting,
    isSubmitBtnLoading,
    cleartData,
  }
})
