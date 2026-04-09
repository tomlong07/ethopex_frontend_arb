import api_v2 from '@/core/api_v2'

export default {
  Add: async (payload: any) => {
    const result = await api_v2.request({
      url: `keyword-manager/add`,
      data: payload,
    })
    return result || {}
  },
  Update: async (id: number, payload: any) => {
    payload.id = id
    const result = await api_v2.request({
      url: `keyword-manager/edit`,
      data: payload,
    })
    return result || {}
  },
  GetByID: async (id: number) => {
    const result = await api_v2.request({
      url: `keyword-manager/get/${id}`,
    })
    return result || {}
  },
  ChangeStatus: async (payload: any) => {
    const result = await api_v2.request({
      url: 'keyword-manager',
      method: 'PATCH',
      data: payload,
      timeout: 120000,
    })

    return result || {}
  },
}
