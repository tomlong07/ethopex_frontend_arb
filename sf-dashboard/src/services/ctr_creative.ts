import axios from 'axios'
import api_v2 from '@/core/api_v2'
import {
  FULL_URL_AUDIO,
  FULL_URL_MEDIA,
  FULL_URL_VIDEO,
} from '@/constants/urls'

export const ctr_creative = {
  GetAllCreative: async (payload: any) => {
    const result = await api_v2.request({
      url: `creative/get-all`,
      params: payload.params,
    })
    return result || {}
  },

  Add: async (payload: any) => {
    const result = await api_v2.request({
      url: 'creative/add',
      data: payload,
    })
    return result || {}
  },

  Clone: async (payload: any) => {
    const result = await api_v2.request({
      url: 'creative/clone',
      data: payload,
    })
    return result || {}
  },

  CloneV2: async (url: string, payload: any) => {
    const result = await api_v2.request({
      url: url,
      data: payload,
    })
    return result || {}
  },

  Edit: async (payload: any) => {
    const result = await api_v2.request({
      url: 'creative/edit',
      data: payload,
    })
    return result || {}
  },

  UpdateAds: async (payload: any) => {
    const result = await api_v2.request({
      url: 'adgroup/update-ads',
      data: payload,
    })
    return result || {}
  },

  GetByID: async (payload: any) => {
    const result = await api_v2.request({
      url: 'creative/get-by-id',
      data: payload,
    })
    return result || {}
  },

  GetAdTypeByIDs: async (ids: any) => {
    const result = await api_v2.request({
      url: '/creative/get-ad-type',
      params: { ids: ids },
    })
    return result || {}
  },

  Duplicate: async (id: number) => {
    const result = await api_v2.request({
      url: 'creative/duplicate/' + id,
    })
    return result || {}
  },

  Remove: async (payload: any) => {
    const result = await api_v2.request({
      url: 'creative/remove',
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

  ChangeStatusOption: async (payload: any) => {
    const result = await api_v2.request({
      url: 'creative/change-status-option',
      data: payload,
    })
    return result || {}
  },

  ChangeStatusOptionV2: async (url: string, payload: any) => {
    const result = await api_v2.request({
      url: url,
      data: payload,
    })
    return result || {}
  },

  GetAdByType: async (params: any) => {
    const result = await api_v2.request({
      url: 'creative/get-ad-by-type',
      params: params,
    })
    return result || {}
  },

  UploadImageSnapchat: async (payload: any) => {
    const result = await api_v2.request({
      url: 'creative/upload-image-snapchat',
      data: payload,
    })
    return result || {}
  },

  CallToActionByKeyword: async (params: any) => {
    const result = await api_v2.request({
      url: 'creative/get-call-to-action',
      params: params,
    })
    return result || {}
  },

  CallToAction: async (params: any) => {
    const result = await api_v2.request({
      url: 'traffic-source/get-cta',
      params: params,
    })
    return result || {}
  },

  uploadImage: async (payload: any) => {
    try {
      if (await helper.isAdBlockEnabled()) {
        window.message.warning(
          'Upload failed due to AdBlock. Please turn it off and retry.'
        )
        return
      }
      const apix = axios.create()
      const result = await apix.post(FULL_URL_MEDIA, payload)
      return result.data
    } catch (ex) {
      window.message.error(`Upload image failed: ${ex}`)
    }
  },
  uploadVideo: async (payload: any) => {
    try {
      if (await helper.isAdBlockEnabled()) {
        window.message.warning(
          'Upload failed due to AdBlock. Please turn it off and retry.'
        )
        return
      }
      const apix = axios.create({
        headers: {
          'v-token':
            'n/UblACuUP1M=wOq?QBaIi621TlVRpPHyaSyrT1-XMB7PwHn7C8OX1yovt=vJZtx',
        },
      })
      const result = await apix.post(FULL_URL_VIDEO, payload)

      if (
        !result.data?.status ||
        (result.data?.status && result.data.status === 'error')
      ) {
        try {
          window.message.error(result.data.errors[0].message)
        } catch {}
      }
      return result.data
    } catch (ex) {
      window.message.error(`Upload video failed: ${ex}`)
    }
  },

  uploadAudio: async (payload: any) => {
    try {
      const apix = axios.create({
        headers: {
          'v-token':
            'n/UblACuUP1M=wOq?QBaIi621TlVRpPHyaSyrT1-XMB7PwHn7C8OX1yovt=vJZtx',
        },
      })
      const result = await apix.post(FULL_URL_AUDIO, payload)

      if (
        !result.data?.status ||
        (result.data?.status && result.data.status === 'error')
      ) {
        try {
          window.message.error(result.data.errors[0].message)
        } catch {}
      }
      return result.data
    } catch (ex) {
      window.message.error(`Upload audio failed: ${ex}`)
    }
  },

  ToolAIGeneratedSuggest: async (payload: any) => {
    const result = await api_v2.request({
      url: 'landing-page/ai-generated-suggest',
      data: payload,
    })
    return result || {}
  },
  CheckValidateCreative: async (payload: any[]) => {
    const result = await api_v2.request({
      url: 'creative/validate',
      data: payload,
    })
    return result || {}
  },
  GetBusiness: async (payload: any) => {
    const result = await api_v2.request({
      url: 'creative/get-business',
      method: 'GET',
      params: payload,
    })
    return result || {}
  },
}
