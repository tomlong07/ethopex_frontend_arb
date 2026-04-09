import api_v2 from '@/core/api_v2'

export const ctr_creative_request = {
  Add: async (payload: any) => {
    return (
      (await api_v2.request({
        url: '/creative-request/add',
        data: payload,
        method: 'Get',
      })) || {}
    )
  },

  Update: async (payload: any) => {
    return (
      (await api_v2.request({
        url: '/creative-request/edit',
        data: payload,
      })) || {}
    )
  },
  Remove: async (payload: any) => {
    return (
      (await api_v2.request({
        url: '/creative-request/delete',
        data: payload,
      })) || {}
    )
  },
  GetByID: async (payload: any) => {
    const result = await api_v2.request({
      url: '/creative-request/get-by-id',
      data: payload,
    })
    return result || {}
  },
  GetMediaByID: async (payload: any) => {
    const result = await api_v2.request({
      url: '/creative-request/get-by-media-id',
      data: { id: payload },
    })
    return result || {}
  },
  UpdateMedia: async (payload: any) => {
    return (
      (await api_v2.request({
        url: '/creative-request/build-media',
        data: payload,
      })) || {}
    )
  },
}
