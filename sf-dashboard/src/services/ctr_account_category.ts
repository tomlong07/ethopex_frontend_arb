import api_v2 from '@/core/api_v2'

export const ctr_account_category = {
  Submit: async (ad_account: any, payload: any) => {
    return (
      (await api_v2.request({
        url: `account-category/submit/${ad_account}`,
        data: payload,
      })) || {}
    )
  },
  GetAdAccount: async (ad_account: string) => {
    return (
      (await api_v2.request({
        url: `account-category/get-account/${ad_account}`,
      })) || {}
    )
  },

  GetPixelsByAdAccount: async (id: number) => {
    return (
      (await api_v2.request({
        url: `account-category/get-pixel-by-account/${id}`,
      })) || {}
    )
  },

  GetPixelsByAdAccountV2: async (
    traffic_source: string,
    ad_account_id: string
  ) => {
    return (
      (await api_v2.request({
        url: `/traffic-source/get-pixel-account/${traffic_source}/${ad_account_id}`,
      })) || {}
    )
  },
  
  SyncPixelsByAdAccount: async (
    traffic_source: string,
    ad_account_id: string
  ) => {
    return (
      (await api_v2.request({
        url: `/traffic-source/sync-pixel-account/${traffic_source}/${ad_account_id}`,
        method: 'POST',
      })) || {}
    )
  },

  ListCategory: async () => {
    return (
      (await api_v2.request({
        url: `google-app-category/list-category`,
        method: 'POST',
      })) || {}
    )
  },

  SubmitAccountGoogleCategory: async (data: any) => {
    return (
      (await api_v2.request({
        url: `google-app-category/submit`,
        data,
      })) || {}
    )
  },

  GetBlockAppCategoryByID: async (id: any) => {
    return (
      (await api_v2.request({
        url: `google-app-category/${id}`,
      })) || {}
    )
  },

  ListExclude: async () => {
    return (
      (await api_v2.request({
        url: `/google-app-category/list-exclude`,
        method: 'POST',
      })) || {}
    )
  },
}
