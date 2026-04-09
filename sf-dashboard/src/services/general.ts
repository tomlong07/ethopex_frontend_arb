import { AxiosRequestConfig } from 'axios'
import api_v2 from '@/core/api_v2'

export const general = {
  fetchTable: async (
    url: string,
    payload: any,
    config: Partial<AxiosRequestConfig> = {}
  ) => {
    try {
      const pl: AxiosRequestConfig = { url, data: payload }

      Object.keys(config).forEach((key) => {
        const typedKey = key as keyof AxiosRequestConfig
        ;(pl[typedKey] as any) = config[typedKey]
      })

      if (!pl.params) {
        pl.params = {}
      }

      pl.params.pu = helper.truePath()

      const result = await api_v2.request(pl)

      return result || {}
    } catch (error) {
      console.error(error)
      return {}
    }
  },

  deleteRowById: async (link: string, payload: any) => {
    return (
      (await api_v2.request({
        url: link,
        data: payload,
      })) || {}
    )
  },

  fetchDataByOpts: async (opts: AxiosRequestConfig) => {
    return (await api_v2.request(opts)) || {}
  },
}
