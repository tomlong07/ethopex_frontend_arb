import api_v2 from '@/core/api_v2'

export const ctr_user = {
  LoginPost: async (payload: any) => {
    const result = await api_v2.request(
      {
        url: `login`,
        data: payload,
      },
      api_v2.clientLogin
    )
    return result || {}
  },

  QuickLoginAlt: async (payload: any) => {
    return (
      (await api_v2.request(
        { url: '/login/alt', data: payload },
        api_v2.clientLogin
      )) || {}
    )
  },

  GoogleCallbackHandler: async (data: any) => {
    const result = await api_v2.request(
      {
        url: `user/gg_callback_login`,
        data: data,
      },
      api_v2.clientLogin
    )
    return result || {}
  },

  Add: async (payload: any) => {
    return (await api_v2.request({ url: '/user/add', data: payload })) || {}
  },

  Edit: async (payload: any) => {
    return (await api_v2.request({ url: '/user/edit', data: payload })) || {}
  },

  GetAllAgency: async () => {
    return (await api_v2.request({ url: 'user/get-all-agency' })) || {}
  },

  GetAllLeader: async () => {
    return (await api_v2.request({ url: 'user/get-all-leader' })) || {}
  },

  GetByID: async (payload: any) => {
    const id: number = payload.id || 0

    return (
      (await api_v2.request({ url: `/user/get/${id}`, params: payload })) || {}
    )
  },

  Profile: async () => {
    return (await api_v2.request({ url: `user/profile` })) || {}
  },

  UpdateProfile: async (payload: any) => {
    return (
      (await api_v2.request({ url: '/user/update-profile', data: payload })) ||
      {}
    )
  },

  Billing: async () => {
    return (await api_v2.request({ url: '/user/get-billing' })) || {}
  },

  UpdateBilling: async (payload: any) => {
    return (
      (await api_v2.request({ url: '/user/update-billing', data: payload })) ||
      {}
    )
  },

  GetAllRole: async () => {
    return (await api_v2.request({ url: '/user/get-role' })) || {}
  },

  GetAllUser: async () => {
    const result = await api_v2.request({ url: 'user/get-all' })
    return result || {}
  },

  ChangePassword: async (payload: any) => {
    return (
      (await api_v2.request({ url: '/user/change-password', data: payload })) ||
      {}
    )
  },

  QuickLogin: async (payload: any) => {
    return (await api_v2.request({ url: '/quick-login', data: payload })) || {}
  },

  Lac: async (data: any) => {
    if (!helper.isObject(data)) {
      data = { action: data }
    }
    return (
      (await api_v2.requestSilent({ url: '/user/l-a-c', data: data })) || {}
    )
  },

  MessageLangChange: async (lang: string) => {
    if (!lang) {
      return
    }
    return (
      (await api_v2.request({
        url: 'user/lang/change',
        data: { key: lang },
      })) || {}
    )
  },

  MessageLang: async (data: any = {}) => {
    return (
      (await api_v2.request({
        url: '/user/lang',
        data: data,
      })) || {}
    )
  },

  GetFrontendSettings: async (path: string) => {
    return (
      (await api_v2.request({
        url: 'user/fe-settings',
        params: { path: path },
      })) || {}
    )
  },

  SaveFrontendSettingsByPath: async (payload: any) => {
    return (
      (await api_v2.request({
        url: 'user/save-fe-setting',
        data: payload,
      })) || {}
    )
  },

  SaveFrontendModeSettings: async (payload: any) => {
    return (
      (await api_v2.request({
        url: '/user/save-mode-setting',
        data: payload,
      })) || {}
    )
  },

  SaveFrontendRecentSettings: async (payload: any) => {
    return (
      (await api_v2.request({
        url: '/recent-settings/save',
        data: payload,
      })) || {}
    )
  },
  GetFrontendRecentSettings: async () => {
    return (
      (await api_v2.request({
        url: '/recent-settings/get',
      })) || {}
    )
  },

  ChangeLabelUser12: async (payload: any) => {
    return (
      (await api_v2.request({
        url: '/user/set-label',
        data: payload,
      })) || {}
    )
  },

  GetListPublisherByAccManager: async () => {
    return (
      (await api_v2.request({
        url: '/user/get-publisher-by-acc-manager',
      })) || {}
    )
  },
  ChangeStatus: async (payload: any) => {
    return await api_v2.request({
      url: '/user/update-status',
      data: payload,
    })
  },
  UpdateShowName: async (payload: any) => {
    return await api_v2.request({
      url: '/user/update-show-name',
      data: payload,
    })
  },

  SyncAccounts: async (payload: any) => {
    return await api_v2.request({
      url: '/user/update-by-config',
      data: payload,
    })
  },

  GetByEmail: async (email: any) => {
    return (await api_v2.request({ url: `user/get-by-email/${email}` })) || {}
  },

  GetAllAdminManager: async () => {
    return (
      (await api_v2.request({
        url: '/user/get-all-admin-manager',
      })) || {}
    )
  }
}
