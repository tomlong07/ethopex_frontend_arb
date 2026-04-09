import api_v2 from '@/core/api_v2'

export default {
  GetDataDocumentApi: async () => {
    const result = await api_v2.clientLogin.request({
      url: 'v1/api-public-documentation/',
      method: 'GET',
    })
    return result.data || {}
  },
}
