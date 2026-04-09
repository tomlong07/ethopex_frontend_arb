import api_v2 from '@/core/api_v2'

export const ctr_domain = {
  Add: async (payload: any) => {
    const result = await api_v2.request({ url: `domain/add`, data: payload })
    return result || {}
  },

  GetByID: async (id: number) => {
    const result = await api_v2.request({
      url: `domain/get/${id}`,
      method: 'POST',
    })
    return result || {}
  },

  Update: async (id: number, payload: any) => {
    payload.id = id
    const result = await api_v2.request({
      url: `domain/update`,
      data: payload,
    })
    return result || {}
  },

  ChangeStatus: async (payload: any) => {
    const result = await api_v2.request({
      url: `domain/change-status`,
      data: payload,
    })
    return result || {}
  },

  GetAllDomain: async () => {
    const result = await api_v2.request({
      url: `domain/get-all`,
      method: 'POST',
    })
    return result || {}
  },

  GetAdsenseByDomain: async (domain_ids: number[]) => {
    const result = await api_v2.request({
      url: `domain/get-adsense-by-domain`,
      data: {
        domain_ids: domain_ids,
      },
    })
    return result || {}
  },

  GetDomainByAccount: async (accounts: number[]) => {
    const result = await api_v2.request({
      url: `accounts/adsense/get-domain`,
      data: {
        accounts: accounts,
      },
    })
    return result || {}
  },

  //"/domain/purge-cache"
  PurgeCache: async (url: string, payload: any) => {
    const result = await api_v2.request({
      url: url,
      method: 'POST',
      data: payload,
    })
    return result || {}
  },

  AddDomainConfig: async (payload: any) => {
    const result = await api_v2.request({
      url: 'domain-config/add',
      data: payload,
    })
    return result || {}
  },

  CheckUpdateDomainConfig: async (payload: any) => {
    const result = await api_v2.request({
      url: 'domain-config/check-update',
      data: payload,
    })
    return result || {}
  },

  UpdateDomainConfig: async (payload: any) => {
    const result = await api_v2.request({
      url: 'domain-config/update',
      data: payload,
    })
    return result || {}
  },

  DomainConfigByID: async (id: number) => {
    if (window.arb.debug) {
      return {
        status: true,
        data: {
          id: 158,
          domain_id: 170,
          domain_id_backup: 0,
          config_ab_test: [
            {
              domain: 0,
              account_adsense: 0,
              status: 'on',
              priority: 0,
            },
          ],
          traffics_ab_test: 0,
          status: 'on',
          name: 'Test Google - Outbound Value',
          description: '',
          traffic_sources_type: 'include',
          traffic_sources: ['google'],
          ad_accounts_type: 'include',
          ad_accounts: [
            '740-365-4358',
            '776-038-2991',
            '183-179-5043',
            '398-502-4584',
            '267-914-1750',
            '642-596-4590',
            '261-450-9741',
            '476-529-8429',
            '629-368-0005',
            '239-608-1296',
          ],
          labels_type: 'include',
          labels: [0, 28],
          adsense_accounts: [],
          adsense_accounts_backup: [],
          mcc_type: 'include',
          mcc: [],
          logs: '',
          logs_domain_config: [
            {
              id: 83,
              user_id: 483,
              domain_config_id: 158,
              log: 'tét',
              created_at: '2026-02-26T08:58:03Z',
            },
            {
              id: 84,
              user_id: 483,
              domain_config_id: 158,
              log: 'sd',
              created_at: '2026-02-26T09:03:26Z',
            },
          ],
          history_domain_config: [
            {
              campaign_number: 0,
              creative_number: 0,
              domain_id: 170,
              domain_name: 'dsxsss',
              created_at: '2026-02-26T09:03:26.799Z',
            },
            {
              campaign_number: 1695,
              creative_number: 20439,
              domain_id: 173,
              domain_name: '',
              created_at: '2026-02-26T08:58:03.731Z',
            },
          ],
        },
      }
    }
    const result = await api_v2.request({ url: `domain-config/${id}` })

    return result || {}
  },

  GetCampaignsByDomainConfig: async (payload: any) => {
    const result = await api_v2.request({
      url: `domain-config/get-campaigns`,
      data: payload,
    })
    return result || {}
  },

  GetAllLabels: async () => {
    const result = await api_v2.request({
      url: `domain/get-all-label`,
    })
    return result || {}
  },

  SubmitLabel: async (payload: any) => {
    const result = await api_v2.request({
      url: `domain/submit-label`,
      data: payload,
    })
    return result || {}
  },

  //"/domain/get-path-minio"
  GetPathMinio: async (url: string) => {
    const result = await api_v2.request({
      url: url,
    })
    return result || {}
  },

  ChangeStatusDomainAccount: async (url: string, payload: any) => {
    const result = await api_v2.request({
      url: url,
      data: payload,
    })
    return result || {}
  },

  GetPrelanderDomain: async () => {
    const result = await api_v2.request({
      url: '/domain/prelander-domain',
    })
    return result || {}
  },

  ChangeStatusSetup: async (payload: any) => {
    return await api_v2.request({
      url: `/domain/update-set-up`,
      data: payload,
    })
  },
}
