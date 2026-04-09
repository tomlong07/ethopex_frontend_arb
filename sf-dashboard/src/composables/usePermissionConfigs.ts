import { ctr_permission_settings } from '@/services/ctr_permission_settings'

export interface TabInfo {
  key: string
  name: string
}

export interface TabInfo2 extends TabInfo {
  logo?: string
}

interface PermissionConfigsResult {
  tabInfo: TabInfo[]
}

export function usePermissionConfigs() {
  const tabInfo = ref<TabInfo[]>([])
  const isLoading = ref(false)

  const getPermissionConfigs = async (pathUrl: string) => {
    isLoading.value = true
    try {
      const res = await ctr_permission_settings.PermissionConfigs(pathUrl)

      if (res.status && res.data) {
        tabInfo.value = res.data.tabInfo || []
        return res.data as PermissionConfigsResult
      }
      return null
    } catch (error) {
      console.error('Error fetching permission configs:', error)
      return null
    } finally {
      isLoading.value = false
    }
  }

  return {
    tabInfo,
    isLoading,
    getPermissionConfigs,
  }
}
