import { defineStore } from 'pinia'
import { campaignTypeClass, adGroups } from '@/types/components/campaign-v2'

export const usePresetLocations = defineStore('usePresetLocations', () => {
  const showModalLocation = ref(false)
  const adgroup = ref<adGroups | null>(null)
  const editPreset = ref<any | null>(null)
  const status = ref(false) // true = tab Edit, false = tab Add
  const isModal = ref(false)

  // Đổi tab sẽ cập nhật status
  const handleTabChange = (value: string) => {
    status.value = value === 'edit'
  }

  const setEditPreset = (p: any | null) => {
    editPreset.value = p
  }
  const clearEditPreset = () => {
    editPreset.value = null
  }

  const setAdgroup = (g: adGroups | null) => {
    adgroup.value = g as any
  }

  // Áp preset vào campaign (và adgroup nếu có)
  const savePresetLocation = (data: any, targetCampaign: campaignTypeClass) => {
    if (!data?.locations) {
      window.message.error('No locations data provided')
      return
    }
    if (!targetCampaign) {
      window.message.error('No campaign provided')
      return
    }

    try {
      const locationsToApply = Array.isArray(data.locations)
        ? data.locations
        : []
      if (locationsToApply.length === 0) {
        window.message.error('No locations to apply')
        return
      }

      if (!targetCampaign.location) {
        targetCampaign.location = { value: [], type: 'include' }
      }

      targetCampaign.location.value = locationsToApply

      const agList: any[] | undefined = (targetCampaign as any)?.ad_groups
      if (adgroup.value && Array.isArray(agList)) {
        const getId = (o: any) => o?.ads_adgroup ?? o?.id
        const vId = getId(adgroup.value)
        const match = agList.find((a: any) => getId(a) === vId)
        if (match) {
          match.location = {
            value: [...locationsToApply],
            type: match.location?.type || 'include',
          }
        }
      }

      targetCampaign.location_preset = {
        name: data.name,
        locations: locationsToApply,
        traffic_source: data.traffic_source,
      }

      showModalLocation.value = false
      window.message.success('Location preset applied successfully')
    } catch {
      window.message.error('Failed to save preset location')
    }
  }

  return {
    showModalLocation,
    openModal: () => (showModalLocation.value = true),
    savePresetLocation,
    editPreset,
    setEditPreset,
    setAdgroup,
    adgroup,
    status,
    handleTabChange,
    clearEditPreset,
    isModal,
  }
})
