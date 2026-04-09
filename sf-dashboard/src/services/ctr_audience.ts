import api_v2 from '@/core/api_v2'

export const ctr_audience = {
  Filter: async (data: any) => {
    const result = await api_v2.request({
      url: 'audience',
      data: data,
    })
    return result || {}
  },

  Add: async (data: any) => {
    if (data.id) {
      data.id = undefined
    }
    const result = await api_v2.request({
      url: 'audience/add',
      data: data,
    })
    return result || {}
  },

  Edit: async (data: any) => {
    const result = await api_v2.request({
      url: 'audience/edit',
      data: data,
    })
    return result || {}
  },

  Duplicate: async (data: any) => {
    const result = await api_v2.request({
      url: 'audience/duplicate',
      data: data,
    })
    return result || {}
  },

  GetByID: async (id: number) => {
    const result = await api_v2.request({
      url: `audience/get-by-id/${id}`,
    })
    return result || {}
  },

  GetLookalikeGoogle: async (accountId: number) => {
    const result = await api_v2.request({
      url: `audience/get-lookalike-google/${accountId}`,
    })
    return result || {}
  },

  AddAudienceSegment: async (data: any) => {
    const result = await api_v2.request({
      url: '/audience-segment/add',
      data: data,
    })
    return result || {}
  },

  EditAudienceSegment: async (data: any) => {
    const result = await api_v2.request({
      url: '/audience-segment/edit',
      data: data,
    })
    return result || {}
  },

  GetAudienceSegmentByID: async (id: number) => {
    const result = await api_v2.request({
      url: `audience-segment/get-by-id/${id}`,
    })
    return result || {}
  },
  GetAudienceSegment: async (data: any) => {
    const result = await api_v2.request({
      url: '/audience-segment',
      data: data,
    })
    return result || {}
  },
}
