import api_v2 from '@/core/api_v2'

export const ctr_gallery = {
  Filter: async (payload: any) => {
    const result = await api_v2.request({
      url: 'gallery',
      data: payload,
    })
    return result || {}
  },

  Edit: async (payload: any) => {
    const result = await api_v2.request({
      url: 'gallery/edit',
      data: payload,
    })
    return result || {}
  },

  SaveImages: async (payload: any) => {
    const result = await api_v2.request({
      url: 'gallery/save-images',
      data: payload,
    })
    return result || {}
  },
  Remove: async (payload: any) => {
    const result = await api_v2.request({
      url: 'gallery/remove',
      data: payload,
    })
    return result || {}
  },

  Permission: async () => {
    const result = await api_v2.request({
      url: 'gallery/permission',
    })
    return result || {}
  },
}
