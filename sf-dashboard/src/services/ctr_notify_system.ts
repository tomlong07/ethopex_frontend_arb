import api_v2 from '@/core/api_v2'

export default {

  Filter: async (payload: any) => {
    const result = await api_v2.request({
      url: 'list-notify-page',
      data: payload,
    })
    return result || {}
  },

  GetById: async (id: number | string) => {
    const result = await api_v2.request({
      url: `notify-page/${id}`, 
    })
    return result || {}
  },

  GetPermission: async (payload: any) => {
    const result = await api_v2.request({
      url: 'permission/notify-page',
      data: payload,
    })
    return result || {}
  },

  Add: async (payload: any) => {
    const result = await api_v2.request({
      url: 'notify-page/add',
      data: payload,
    })
    return result || {}
  },

  Edit: async (id: number | string, payload: any) => {
    const result = await api_v2.request({
      url: `notify-page/edit/${id}`,
      data: payload,
    })
    return result || {}
  },

  GetRole: async () => {
      return (await api_v2.request({ url: '/user/get-role' })) || {}
  },
  
  GetUser: async () => {
      const result = await api_v2.request({ url: 'user/get-all' })
      return result || {}
  },

  ChangeStatus: async (payload: { ids: number[]; status: string }) => {
    const result = await api_v2.request({
      url: 'notify-page/update-status',
      data: payload,
    })
    return result || {}
  },

 
}
