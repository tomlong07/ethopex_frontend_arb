import api_v2 from '@/core/api_v2'

export const ctr_authenticator = {
  GetCode: async () => {
    return (await api_v2.request({ url: `authenticator/get-code` })) || {}
  },
}
