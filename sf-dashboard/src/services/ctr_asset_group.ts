import api_v2 from '@/core/api_v2'

export default {
  AddAssetGroup: async (data: any) => {
    return (
      (await api_v2.request({
        url: 'asset-group/save',
        data: data,
      })) || {}
    )
  },

  UpdateAssetGroup: async (data: any) => {
    return (
      (await api_v2.request({
        url: 'asset-group/edit',
        data: data,
      })) || {}
    )
  },

  GetByID: async (id: any) => {
    return (
      (await api_v2.request({
        url: '/asset-group/get-by-id/' + id,
      })) || {}
    )
  },
  GetAllAssetGroup: async (data: any) => {
    return (
      (await api_v2.request({
        url: '/asset-group',
        data: data,
      })) || {}
    )
  },

  GetByPublisher: async (email: any) => {
    return (
      (await api_v2.request({
        url: 'asset-group/get-by-publisher/' + email,
      })) || {}
    )
  },

  GetTrafficSource: async (email: any) => {
    return (
      (await api_v2.request({
        url: '/traffic-source/get-by-user?email=' + email,
      })) || {}
    )
  },
}
