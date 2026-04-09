import api_v2 from '@/core/api_v2'

export const ctr_landing_page = {
  Add: async (payload: any) => {
    const result = await api_v2.request({
      url: 'landing-page/add',
      data: payload,
    })
    return result || {}
  },

  Edit: async (payload: any) => {
    const result = await api_v2.request({
      url: 'landing-page/edit',
      data: payload,
    })
    return result || {}
  },

  Remove: async (payload: any) => {
    const result = await api_v2.request({
      url: 'landing-page/remove',
      data: payload,
    })
    return result || {}
  },

  RemoveV2: async (url: string, payload: any) => {
    const result = await api_v2.request({
      url: url,
      data: payload,
    })
    return result || {}
  },

  ChangeStatus: async (payload: any) => {
    return await api_v2.request({
      url: 'landing-page/change-status',
      data: payload,
    })
  },

  ChangeStatusV2: async (url: string, payload: any) => {
    return await api_v2.request({
      url: url,
      data: payload,
    })
  },

  GetLandingPages: async (params: any) => {
    return await api_v2.request({
      url: 'landing-page/get-by-demand',
      params: params,
    })
  },

  GetByID: async (id: any) => {
    if (!id) return {}

    const result = await api_v2.request({
      url: `landing-page/get-by-id/${id}`,
    })

    return result || {}
  },

  DuplicateLanding: async (id: any) => {
    if (!id) return {}
    const result = await api_v2.request({
      url: `landing-page/duplicate/${id}`,
    })
    return result || {}
  },

  GetAllLanguage: async () => {
    const result = await api_v2.request({
      url: 'list-language',
    })
    return result || {}
  },

  UpdateCategory: async (category_id: number, landing_page_ids: number[]) => {
    if (!category_id || !landing_page_ids || !landing_page_ids.length) {
      return
    }
    return await api_v2.request({
      url: 'landing-page/update-category',
      data: { category_id: category_id, landing_page_ids: landing_page_ids },
    })
  },

  GetPermission: async () => {
    const result = await api_v2.request({
      url: 'landing-page/get-permission',
    })
    return result || {}
  },

  MakeByGPT: async (payload: any) => {
    const result = await api_v2.request({
      url: 'landing-page/make-by-gpt',
      data: payload,
    })
    return result || {}
  },

  GenerateThumbnail: async (payload: any) => {
    const result = await api_v2.request({
      url: 'landing-page/generate-thumbnail',
      data: payload,
    })
    return result || {}
  },

  GetKeywordsByLandingPage: async (payload: any) => {
    const result = await api_v2.request({
      url: 'landing-page/get-keyword-landing-page',
      data: payload,
    })
    return result || {}
  },

  // Thử lại nhiều do có thể lúc deploy service
  ResponseLandingPageByAI: async (payload: any) => {
    const result = await api_v2.request({
      url: 'landing-page/response-landing-page-ai',
      data: payload,
      'axios-retry': {
        retries: 50,
        retryDelay: (retryCount: number) => Math.min(1000 * retryCount, 8000), // tăng dần 1s, 2s, 3s... tối đa 8s
      },
    })
    return result || {}
  },

  LandingConfigs: async () => {
    return (
      (await api_v2.request({
        url: '/landing-page/settings',
      })) || {}
    )
  },
}
