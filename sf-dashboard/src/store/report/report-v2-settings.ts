import { ctr_user } from '@/services/ctr_user'
import { defineStore } from 'pinia'
import { useReportV2 } from './report-v2'
import { ValueToggle } from '@/components/report-v3/reportSetting/SettingCollapse.vue'

export const useReportV2Setting = defineStore('useReportV2Setting', () => {
  const reportStoreV2 = useReportV2(helper.truePath())()
  const isLoading = ref(false)
  const activeKey = ref<ValueToggle[]>(['general'])
  const getThisFrontendSettings = async () => {
    const response = await ctr_user.GetFrontendSettings(window.route.path)

    handleUpdateSettings(response)
  }

  const handleUpdateSettings = (response: any) => {
    if (response.status && response.data?.path === window.route.path) {
      const newData = response.data?.settings
        ? JSON.parse(response.data.settings)
        : {}
      reportStoreV2.changeReportSettings(newData)
    }
  }

  const changeFrontendSettings = async (
    changeKey: string,
    value: any,
    options?: Record<string, any>
  ) => {
    isLoading.value = true

    const response = await ctr_user.SaveFrontendSettingsByPath(
      buildDataSend(changeKey, value)
    )

    handleUpdateSettings(response)

    if (changeKey === 'pageSize') {
      reportStoreV2.size = value
    }
    if (changeKey === 'widthOfChart') {
      reportStoreV2.width = value
    }
    if (changeKey === 'isProfitLossColoringDisabled') {
      reportStoreV2.reportSettingsNew.isProfitLossColoringDisabled = value
    }
    if (changeKey === 'smartStickyDate') {
      reportStoreV2.reportSettingsNew.smartStickyDate = value
    }

    if (changeKey === 'alertCamp') {
      reportStoreV2.reportSettingsNew.alertCamp = value
    }

    if (changeKey === 'sortRevenue') {
      reportStoreV2.reportSettingsNew.sortRevenue = value
    }
    isLoading.value = false

    if (options?.reload) {
      reportStoreV2.isReload = true
    }
    if (options?.reloadChart) {
      reportStoreV2.isReloadChart = true
    }
    if (options?.reloadTable) {
      reportStoreV2.isReloadTable = value
    }
  }

  const buildDataSend = (changeKey: string, value: any) => {
    let temp = helper.clone(reportStoreV2.reportSettingsNew)
    temp[changeKey] = value
    return {
      path: window.route.path,
      settings: JSON.stringify(temp),
    }
  }

  return {
    isLoading,
    activeKey,
    buildDataSend,
    changeFrontendSettings,
    getThisFrontendSettings,
  }
})
