import api_v2 from '@/core/api_v2'
import axios from 'axios'

export const ctr_logging = {
  Filter: async (payload: any) => {
    const result = await api_v2.request({
      url: `/logging/filter`,
      data: payload,
    })
    return result || {}
  },

  Campaign: async (payload: any) => {
    const result = await api_v2.request({
      url: `/logging/campaigns`,
      data: payload,
    })

    return result || {}
  },

  SaveNote: async (payload: any) => {
    const result = await api_v2.request({
      url: `/logging/save-note`,
      data: payload,
    })
    return result || {}
  },

  getLogDataByID: async (payload: any) => {
    const apiLink = import.meta.env.VITE_END_POINT || ''
    const result = await axios.post(
      `${apiLink}/logging/handle-data-name`,
      payload,
      {
        headers: {
          'X-Token': 'bae21850c3b71f859664197e61ebe39c',
        },
      }
    )
    return result || {}
  },

  getLogDataByIDV2: async (payload: any) => {
    const result = await api_v2.request({
      url: '/logging/v2/handle-data-name',
      data: payload,
    })
    return result || {}
  },

  UpdateLog: async (id: string, data: any) => {
    const result = await api_v2.request({
      url: `/logging/${id}`,
      method: 'PATCH',
      data: data,
    })
    return result || {}
  },
}
