import api_v2 from '@/core/api_v2'

export const ctr_pixel = {
  Add: async (payload: any) => {
    return (await api_v2.request({ url: 'pixel/add', data: payload })) || {}
  },

  Edit: async (id: number, payload: any) => {
    return (
      (await api_v2.request({ url: 'pixel/edit/' + id, data: payload })) || {}
    )
  },

  Remove: async (link: string, payload: any) => {
    return (await api_v2.request({ url: link, data: payload })) || {}
  },

  GetByID: async (id: number) => {
    return (await api_v2.request({ url: `pixel/get-by-id/${id}` })) || {}
  },

  GetAll: async (params: any = null) => {
    const result = await api_v2.request({
      url: `pixel/get-all`,
      params: params,
    })
    return result || {}
  },

  ListStep: async () => {
    return (await api_v2.request({ url: `pixel/list-step` })) || {}
  },

  ListEventTiktok: async (id: string) => {
    return (
      (await api_v2.request({
        url: '/pixel/list-event-tiktok/' + id,
      })) || {}
    )
  },

  ListEventFacebook: async (id: any) => {
    return (
      (await api_v2.request({
        url: '/pixel/list-event-facebook/' + id,
      })) || {}
    )
  },
}
