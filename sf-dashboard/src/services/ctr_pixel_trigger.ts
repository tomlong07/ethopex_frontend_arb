import api_v2 from '@/core/api_v2'

export const ctr_pixel_trigger = {
  Add: async (payload: any) => {
    return (
      (await api_v2.request({ url: 'pixel_trigger/add', data: payload })) || {}
    )
  },

  Edit: async (id: number, payload: any) => {
    return (
      (await api_v2.request({
        url: 'pixel_trigger/edit/' + id,
        data: payload,
      })) || {}
    )
  },

  GetByID: async (id: number) => {
    return (
      (await api_v2.request({ url: `pixel_trigger/get-by-id/${id}` })) || {}
    )
  },

  Delete: async (link: string, payload: any) => {
    const result = await api_v2.request({
      url: `${link}/${payload.id}`,
      method: 'POST',
    })
    return result || {}
  },

  GetCampaignsByTrigger: async (payload: any) => {
    return (
      (await api_v2.request({
        url: 'pixel_trigger/get-campaigns-by-trigger',
        data: payload,
      })) || {}
    )
  },
}
