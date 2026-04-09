import api_v2 from '@/core/api_v2'

export const ctr_rule = {
  List: async (payload: any) => {
    return (await api_v2.request({ url: 'rule/list', data: payload })) || {}
  },

  AddPost: async (payload: any) => {
    return (await api_v2.request({ url: 'rule/add', data: payload })) || {}
  },

  Get: async (payload: any) => {
    return (
      (await api_v2.request({
        url: `rule/get/${payload.id}`,
        data: payload,
      })) || {}
    )
  },

  EditPost: async (id: number, payload: any) => {
    return (
      (await api_v2.request({ url: `rule/edit/${id}`, data: payload })) || {}
    )
  },

  ClonePost: async (id: number, payload: any) => {
    return (
      (await api_v2.request({ url: `rule/clone/${id}`, data: payload })) || {}
    )
  },

  ChangeStatus: async (payload: any) => {
    return (
      (await api_v2.request({ url: 'rule/change-status', data: payload })) || {}
    )
  },

  GetRuleType: async () => {
    return (await api_v2.request({ url: `rule/get-rule-type` })) || {}
  },

  GetCondition: async () => {
    return (await api_v2.request({ url: `rule/get-condition` })) || {}
  },

  GetAllRule: async () => {
    return (await api_v2.request({ url: `rule/get-all` })) || {}
  },

  GetRuleCheckCamp: async (payload: any) => {
    return (
      (await api_v2.request({ url: `/rule/check-camp`, data: payload })) || {}
    )
  },

  ClearPreview: async (url: string, data: any) => {
    return (await api_v2.request({ url: url, data: data })) || {}
  },

  GetRules: async (params?: {
    publisher?: string
    traffic_source?: string
    search?: string
    size?: number
  }) => {
    return (
      (await api_v2.request({
        url: '/rules',
        method: 'GET',
        params,
      })) || {}
    )
  },

  GetPublishers: async (params: { q?: string; f?: string }) => {
    return (
      (await api_v2.request({
        url: 'filter/publisher-v2',
        method: 'GET',
        params,
      })) || {}
    )
  },

  GetTrafficSources: async (params: { q?: string; f?: string }) => {
    return (
      (await api_v2.request({
        url: 'filter/traffic-source-v2',
        method: 'GET',
        params,
      })) || {}
    )
  },
  GetInterval: async () => {
    return (await api_v2.request({ url: `rule/get-interval` })) || {}
  }
}
