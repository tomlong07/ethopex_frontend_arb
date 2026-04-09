import api_v2 from '@/core/api_v2'
import axios from 'axios'

export const ctr_recapcha_config = {
  AllRecapchaConfig: async () => {
    return (await api_v2.request({ url: `recapchaConfig` })) || {}
  },

  SaveRecapchaConfigConfig: async (payload: any) => {
    return (
      (await api_v2.request({
        url: `recapchaConfig/save-recapcha-config`,
        data: payload,
      })) || {}
    )
  },

  getLimitTime: async () => {
    try {
      let result = await axios.get(
        'https://search.gotolike.com/api/v1/re-captcha'
      )

      return { status: true, data: result.data }
    } catch (ex: any) {
      window.message.error(`getLimitTime failed: ${ex.message}`)

      return {}
    }
  },
}
