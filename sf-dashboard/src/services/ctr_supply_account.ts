import api_v2 from '@/core/api_v2'

export const ctr_supply_account = {
  GetByAccountAdID: async (id: any) => {
    return (
      (await api_v2.request({
        url: 'supply-account/account-ad/get-by-id/' + id,
      })) || {}
    )
  },

  GetByAdvertiserID: async (id: any) => {
    return (
      (await api_v2.request({
        url: 'supply-account/advertiser/get-by-id/' + id,
      })) || {}
    )
  },

  UpdateNameAccountAd: async (id: any, data: any) => {
    return (
      (await api_v2.request({
        url: 'supply-account/account-ad/update-name/' + id,
        data: data,
      })) || {}
    )
  },

  UpdateLabelAccountAd: async (id: any, data: any) => {
    return (
      (await api_v2.request({
        url: 'supply-account/account-ad/update-label/' + id,
        data: data,
      })) || {}
    )
  },

  ExportExcelAccountAd: async () => {
    return (
      (await api_v2.request({
        url: 'supply-account/account-ad/export-excel',
        responseType: 'blob',
      })) || {}
    )
  },

  UpdateLabelAdvertiser: async (id: any, data: any) => {
    return (
      (await api_v2.request({
        url: 'supply-account/advertiser/update-label/' + id,
        data: data,
      })) || {}
    )
  },

  UpdateNameAdvertiser: async (id: any, data: any) => {
    return (
      (await api_v2.request({
        url: 'supply-account/advertiser/update-name/' + id,
        data: data,
      })) || {}
    )
  },

  GetLabel: async () => {
    return (
      (await api_v2.request({
        url: 'supply-account/get-label',
      })) || {}
    )
  },

  SaveSupplyUser: async (data: any) => {
    return (
      (await api_v2.request({
        url: 'supply-account/user/save',
        data: data,
      })) || {}
    )
  },

  GetSupplyUserByID: async (id: string) => {
    return (
      (await api_v2.request({
        url: 'supply-account/user/' + id,
      })) || {}
    )
  },

  UpdateBulk: async (payload: any) => {
    return (
      (await api_v2.request({
        url: 'supply-account/set-bulk-accounts',
        data: payload,
      })) || {}
    )
  },

  SaveLinkPage: async (data: any) => {
    return (
      (await api_v2.request({
        url: 'supply-account/pages/save',
        data: data,
      })) || {}
    )
  },

  GetLinkPageByID: async (id: string) => {
    return (
      (await api_v2.request({
        url: 'supply-account/pages/' + id,
        method: 'Post',
      })) || {}
    )
  },

  UpdateLabelsForAccountAds: async (payload: any) => {
    const result = await api_v2.request({
      url: 'supply-account/account-ad/update-label',
      data: payload,
      method: 'PUT',
    })
    return result || {}
  },
}
