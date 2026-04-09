import { defineStore } from 'pinia'
import { campaignTypeClass, adGroups } from '@/types/components/campaign-v2'
import { SelectOption } from 'naive-ui'
import { ctr_traffic_source } from '@/services/ctr_traffic_source'

export const usePresetCampaign = defineStore('usePresetCampaign', () => {
  const showModalLocation = ref(false)
  const isLoadingPixel = ref(false)
  const adgroup = ref<adGroups | null>(null)
  const editPreset = ref<any | null>(null)
  const status = ref(false)
  const pixelOptions = ref<SelectOption[]>([])

  const skipNextAccountFetch = ref<string | number | null>(null)

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

  const GetFbPixel = async (account_id: number, sync_traffic_source = '') => {
    if (!account_id) return

    try {
      isLoadingPixel.value = true
      const result = await ctr_traffic_source.GetFacebookPixel({
        account_id: account_id ? account_id : undefined,
        sync: sync_traffic_source ? sync_traffic_source : undefined,
      })
      pixelOptions.value = result?.data || []

      if (sync_traffic_source) {
        if (result?.data?.length) {
          window.message.success('Success')
        } else {
          window.message.warning('No pixel found')
        }
      }
    } finally {
      isLoadingPixel.value = false
    }
  }

  // Áp preset vào campaign (và adgroup nếu có)
  const savePresetCampaign = async (
    data: any,
    targetCampaign: campaignTypeClass
  ) => {
    if (!data.pixel) {
      window.message.error('No pixel provided')
      return
    }
    if (!targetCampaign) {
      window.message.error('No campaign provided')
      return
    }
    try {
      //Tắt tạm đợi Nguyễn Hiếu sửa theo logic mới
      // Đánh dấu để watcher không gọi GetFbPixel một lần nữa cho account này
      skipNextAccountFetch.value = data.ad_account || null
      targetCampaign.account_supply_id = data.ad_account || undefined
      await GetFbPixel(data.ad_account_name as number)
      // clear flag để watcher hoạt động bình thường
      skipNextAccountFetch.value = null
      const agList: any[] | undefined = (targetCampaign as any)?.ad_groups
      if (Array.isArray(agList) && agList.length > 0) {
        const updatedAgList = agList.map((current: any) => {
          const newAg = {
            ...current,
            pixel: data.pixel || undefined,
          }
          return newAg
        })
        ;(targetCampaign as any).ad_groups = updatedAgList
      }
      showModalLocation.value = false
      window.message.success('Preset applied successfully')
    } catch (error) {
      skipNextAccountFetch.value = null
      window.message.error(`Failed to save preset location: ${error}`)
    }
  }

  const confirmDefaultPreset = (dialog: any): Promise<boolean> => {
    return new Promise((resolve) => {
      let settled = false
      const safeResolve = (val: boolean) => {
        if (settled) return
        settled = true
        resolve(val)
      }
      dialog.warning({
        title: 'Confirm',
        content:
          'Enabling this preset will disable the currently active default preset. Do you want to continue?',
        positiveText: 'Yes',
        negativeText: 'Cancel',
        onPositiveClick: () => safeResolve(true),
        onNegativeClick: () => safeResolve(false),
        onClose: () => safeResolve(false),
        onMaskClick: () => safeResolve(false),
      })
    })
  }

  return {
    showModalLocation,
    openModal: () => (showModalLocation.value = true),
    savePresetCampaign,
    editPreset,
    setEditPreset,
    setAdgroup,
    adgroup,
    status,
    handleTabChange,
    clearEditPreset,
    confirmDefaultPreset,
    GetFbPixel,
    pixelOptions,
    isLoadingPixel,
    skipNextAccountFetch,
  }
})
