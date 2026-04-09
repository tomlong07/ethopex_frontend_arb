import api_v2 from '@/core/api_v2'

export const ctr_permission_settings = {
  PermissionSettings: async (path?: string) => {
    return (
      (await api_v2.request({
        url: 'permission/settings',
        data: { path: path || helper.truePath() },
      })) || {}
    )
  },

  PermissionFilters: async (path: string) => {
    if (!path) return
    return (
      (await api_v2.request({
        url: `/fe-settings/filters${path}`,
      })) || {}
    )
  },

  PermissionConfigs: async (path: string) => {
    if (!path) return

    return (
      (await api_v2.request({
        url: `/fe-settings/configs${path}`,
      })) || {}
    )
  },

  PermissionColumns: async (path: string) => {
    if (!path) return

    return (
      (await api_v2.request({
        url: `/fe-settings/columns${path}`,
      })) || {}
    )
  },

  PermissionAsync: async (path: string) => {
    if (!path) return

    return (
      (await api_v2.request({
        url: `/fe-settings/async${path}`,
      })) || {}
    )
  },
}
