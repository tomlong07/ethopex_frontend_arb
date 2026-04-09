import api_v2 from '@/core/api_v2'

export const ctr_label = {
  GetAll: async () => {
    const result = await api_v2.request({ url: 'label/get-all' })
    return result || {}
  },

  AddLabel: async (payload: any) => {
    const result = await api_v2.request({ url: 'label/add', data: payload })
    return result || {}
  },

  EditLabel: async (id: number, payload: any) => {
    const result = await api_v2.request({
      url: 'label/edit/' + id,
      data: payload,
    })
    return result || {}
  },

  GetByID: async (id: number) => {
    const result = await api_v2.request({ url: `label/get-by-id/${id}` })
    return result || {}
  },
}
