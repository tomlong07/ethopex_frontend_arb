import api_v2 from '@/core/api_v2'
import { TS } from '@/enum/campaign'

export const ctr_crawl_campaign = {
  SaveCampaignPreset: async (data: any) => {
    return (
      (await api_v2.request({
        url: '/campaign-preset/save',
        data: data,
      })) || {}
    )
  },

  GetCampaignPresetByID: async (id: any) => {
    return (
      (await api_v2.request({
        url: 'campaign-preset/' + id,
        method: 'POST',
      })) || {}
    )
  },

  GetGlobalConfig: async () => {
    return (
      (await api_v2.request({
        url: '/crawl-campaign/global-config',
      })) || {}
    )
  },

  SaveGlobalConfig: async (payload: any) => {
    const result = await api_v2.request({
      url: '/crawl-campaign/save-global-config',
      data: payload,
    })
    return result || {}
  },

  ChangeStatus: async (url: string, data: any) => {
    return (
      (await api_v2.request({
        url: url,
        data: data,
      })) || {}
    )
  },

  AddCrawlCampaignKeyword: async (data: any) => {
    return (
      (await api_v2.request({
        url: '/crawl-campaign/keyword/add',
        data: data,
      })) || {}
    )
  },

  SetGeoFixed: async (url: string) => {
    return (
      (await api_v2.request({
        url: url,
      })) || {}
    )
  },
  GetAllConfigDefault: async (ts: TS) => {
    return (
      (await api_v2.request({
        url: `/config-default/get-all/?traffic_source=${ts}`,
      })) || {}
    )
  },
  GetDefaultAccount: async (data: any) => {
    return (
      (await api_v2.request({
        url: `default-account/get-by-user`,
        data: data,
      })) || {}
    )
  },

  GetImagePrompt: async () => {
    if (window.arb.debug) {
      return {
        status: true,
        data: [
          {
            image:
              '/data/image/thumb_1762526755211132255_dfb1706b6f8f4a3b5db83a58de8663a5.jpg',
            api: 'https://api-chatgpt.adful.io/api/gemerate_images?headline= Read More About&text=The Benefits of Dental Clips for Replacing Missing Teeth Naturally&call_to_action=Learn More&call_to_action_style=fill&url_images=https://arb-ul.pubpowerplatform.io/data/image/thumb_1762521737426329069_f1d85a2d46724e3f6605463d4a61149b.png&style=01&background_color=%23ff0000',
          },

          {
            image:
              'https://arb-ul.pubpowerplatform.io/data/image/thumb_1758342475096806716_495d8c186b3e61c5c15574038f470519.jpg',
            prompt: 36,
          },
        ],
      }
    }
    return (
      (await api_v2.request({
        url: `/traffic-source/get-image-prompt`,
      })) || {}
    )
  },
  SaveImagePrompt: async (payload: any) => {
    return (
      (await api_v2.request({
        url: `/traffic-source/save-image-prompt`,
        data: payload,
      })) || {}
    )
  },

  CampaignPresetSettings: async () => {
    return (
      (await api_v2.request({
        url: `/campaign-preset/settings`,
      })) || {}
    )
  },
}
