import api_v2 from '@/core/api_v2'

export const ctr_google_performance_rule = {
  Add: async (payload: any) => {
    return (
      (await api_v2.request({
        url: 'google-performance-rule',
        data: payload,
      })) || {}
    )
  },

  GetConfig: async () => {
    return (
      (await api_v2.request({
        url: `google-performance-rule/config`,
        method: 'GET',
      })) || {}
    )
  },

  Update: async (payload: any) => {
    return (
      (await api_v2.request({
        url: `google-performance-rule/update`,
        data: payload,
      })) || {}
    )
  },

  GetByID: async (id: number) => {
    return (
      (await api_v2.request({
        url: `google-performance-rule/${id}`,
        method: 'GET',
      })) || {}
    )
  },
  ApplyRule: async (id: number) => {
    return (
      (await api_v2.request({
        url: `google-performance-rule/apply-rule/${id}`,
        method: 'POST',
      })) || {}
    )
  },
  RemoveRule: async (id: number) => {
    return (
      (await api_v2.request({
        url: `/google-performance-rule/delete/${id}`,
        method: 'DELETE',
      })) || {}
    )
  },
  StartRule: async (id: number) => {
    return (
      (await api_v2.request({
        url: `google-performance-rule/start-rule/${id}`,
        method: 'POST',
      })) || {}
    )
  },
  Satify: async (payload: any) => {
    return (
      (await api_v2.request({
        url: `google-performance-rule/placement-satisfy`,
        data: payload,
      })) || {}
    )
  },
}
