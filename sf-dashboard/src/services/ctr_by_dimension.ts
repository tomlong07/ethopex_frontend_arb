import api_v2 from '@/core/api_v2'
import { PayloadDimension } from '@/types/components/types'

export const ctr_by_dimension = {
  GetSetting: async () => {
    return (await api_v2.request({ url: '/by-dimension/settings' })) || {}
  },

  OrderOptions: async () => {
    return (await api_v2.request({ url: '/by-dimension/order-options' })) || {}
  },

  GetReport: async (
    payload: PayloadDimension,
    config: { [key: string]: any } = {}
  ) => {
    let opts: { [key: string]: any } = {
      url: '/by-dimension/report',
      data: payload,
    }

    for (const key in config) {
      if (Object.prototype.hasOwnProperty.call(config, key)) {
        opts[key] = config[key]
      }
    }
    return (await api_v2.request(opts)) || {}
  },
}
