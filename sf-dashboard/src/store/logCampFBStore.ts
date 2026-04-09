import { ctr_campaign } from '@/services/ctr_campaign'
import { GridApi } from 'ag-grid-community'
import { defineStore } from 'pinia'
export const useLogCampFB = defineStore('logCampFB', () => {
  const showModal = ref(false)
  const idCampaign = ref<number>()
  const data = ref<any[]>([])
  const isLoading = ref(true)
  const search = ref('')
  const gridApi = ref<GridApi | null>(null)

  const getLogCampaignFB = async () => {
    isLoading.value = true
    const result = await ctr_campaign.HistoryByTrafficSource(idCampaign.value)

    data.value = result?.data || []

    isLoading.value = false
  }

  const resetData = () => {
    data.value = []
    search.value = ''

    try {
      gridApi.value?.setGridOption('quickFilterText', '')
    } catch {}
  }

  return {
    showModal,
    idCampaign,
    data,
    isLoading,
    search,
    gridApi,
    getLogCampaignFB,
    resetData,
  }
})
