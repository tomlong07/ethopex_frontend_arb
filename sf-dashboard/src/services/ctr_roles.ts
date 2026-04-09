import api_v2 from '@/core/api_v2'

export const ctr_roles = {
  PreCreate: async () => {
    const result = await api_v2.request({
      url: 'roles/pre-create',
    })
    return result || {}
  },

  GetPermissionName: async () => {
    const result = await api_v2.request({
      url: 'roles/permission-name',
    })
    return result || {}
  },

  Get: async (id: number) => {
    const result = await api_v2.request({
      url: `roles/get/${id}`,
    })
    return result || {}
  },

  Duplicate: async (id: number) => {
    const result = await api_v2.request({
      url: `roles/duplicate/${id}`,
    })
    return result || {}
  },

  Create: async (payload: any) => {
    const result = await api_v2.request({ url: 'roles/create', data: payload })
    return result || {}
  },

  Update: async (id: number, payload: any) => {
    const result = await api_v2.request({
      url: `roles/update/${id}`,
      data: payload,
    })
    return result || {}
  },
}
