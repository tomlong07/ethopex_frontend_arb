import api_v2 from '@/core/api_v2'

export const ctr_time_zone = {
  List: async () => {
    return (await api_v2.request({ url: 'time-zone/list' })) || {}
  },
  GetTimezoneByTrafficSource: async (traffic_source: string) => {
    const result = await api_v2.request({
      url: 'traffic-source/get-timezone',
      params: { trafic_source: traffic_source },
    })
    return result || {}
  },
}
