import api_v2 from '@/core/api_v2'
import { CampaignStatus } from '@/definitions/accounts/campaignStatus'

export const ctr_account = {
  GetByChannelStatus: async () => {
    return (
      (await api_v2.request({
        url: 'accounts/get-by-channel-status?status=success',
      })) || {}
    )
  },

  GroupByName: async (query: string, source: string = '') => {
    const params = {
      q: query,
      traffic_source: source,
    }

    return (
      (await api_v2.request({
        url: `accounts/group-by-name`,
        params: params,
      })) || {}
    )
  },

  Connect: async (traffic: string, payload: any) => {
    const result = await api_v2.request({
      url: `accounts/connect/${traffic}`,
      params: payload.params,
    })
    return result || {}
  },

  ReConnect: async (id: number, object: string, payload: any) => {
    const result = await api_v2.request({
      url: `accounts/re-connect/${object}/${id}`,
      data: payload,
    })
    return result || {}
  },

  Get: async (id: number) => {
    if (!id) return {}
    const result = await api_v2.request({ url: `accounts/get/${id}` })
    return result || {}
  },

  Add: async (payload: any) => {
    const result = await api_v2.request({ url: `accounts/add`, data: payload })
    return result || {}
  },

  SaveAccount: async (id: number, payload: any) => {
    const result = await api_v2.request({
      url: `accounts/save-account/${id}`,
      data: payload,
    })
    return result || {}
  },
  AddAccountMcc: async (payload: any) => {
    const result = await api_v2.request({
      url: '/accounts-api/add',
      data: payload,
    })
    return result || {}
  },
  SaveAccountAds: async (id: number, payload: any) => {
    const result = await api_v2.request({
      url: `accounts/save-account-ads/${id}`,
      data: payload,
    })
    return result || {}
  },
  AccountMcc: async (payload: any) => {
    const result = await api_v2.request({
      url: '/accounts-api/filter',
      data: payload,
    })
    return result || {}
  },
  AddAccountAds: async (id: number, payload: any) => {
    const result = await api_v2.request({
      url: `accounts/add-account-ads/${id}`,
      data: payload,
    })
    return result || {}
  },

  SyncAccountAds: async (id: number) => {
    const result = await api_v2.request({
      url: `accounts/sync-account-ads/${id}`,
      method: 'POST',
    })
    return result || {}
  },

  ChangeStatusAccountAds: async (id: number, payload: any) => {
    const result = await api_v2.request({
      url: `accounts/change-status-account-ads/${id}`,
      data: payload,
    })
    return result || {}
  },

  ChangeUseRootDomainAccountAds: async (id: number, payload: any) => {
    const result = await api_v2.request({
      url: `accounts/change-use-root-domain-account-ads/${id}`,
      data: payload,
    })
    return result || {}
  },

  GetAccountAdsense: async (id: number) => {
    const result = await api_v2.request({
      url: `accounts/adsense/${id}`,
    })
    return result || {}
  },

  AddAdsense: async (payload: any) => {
    const result = await api_v2.request({
      url: `accounts/add-adsense`,
      data: payload,
    })
    return result || {}
  },

  UpdateAdsense: async (id: number, payload: any) => {
    payload.id = id
    const result = await api_v2.request({
      url: `accounts/update-adsense`,
      data: payload,
    })
    return result || {}
  },

  GetAllMCC: async (query: string) => {
    const params = {
      q: query,
    }

    return (
      (await api_v2.request({ url: `accounts/get-all-mcc`, params: params })) ||
      {}
    )
  },

  GetAllParentMCC: async (query: string) => {
    const params = {
      q: query,
    }

    return (
      (await api_v2.request({
        url: `accounts/get-all-parent-mcc`,
        params: params,
      })) || {}
    )
  },

  //"/accounts/sync-blacklist-google"
  SyncBlackListGoogleAds: async (url: string) => {
    const result = await api_v2.request({
      url: url,
    })
    return result || {}
  },
  GetAccountAdsDetail: async (payload: any) => {
    const result = await api_v2.request({
      url: 'accounts/get-account-ads-by-detailed',
      data: payload,
    })
    return result || {}
  },

  GetListExcludeGoogle: async () => {
    let result = {}
    if (window.arb.debug) {
      result = { status: true, data: CampaignStatus }
    } else {
      result = await api_v2.request({
        url: 'accounts/list-exclude-scan',
      })
    }
    return result || {}
  },

  GetListLabel: async () => {
    let result = {}
    if (window.arb.debug) {
      result = { status: true, data: CampaignStatus }
    } else {
      result = await api_v2.request({
        url: 'accounts/supply-labels',
      })
    }
    return result || {}
  },

  UpdateOcid: async (data: any) => {
    const result = await api_v2.request({
      url: '/accounts/save-ocid',
      method: 'POST',
      data,
    })
    return result || {}
  },

  UpdateAccountcMCC: async (data: any) => {
    return await api_v2.request({
      url: '/accounts/change-account-mcc',
      method: 'POST',
      data,
    })
  },
}
