import api_v2 from '@/core/api_v2'

export default {
  GetPlacements: async ( id: number | string, payload: Record<string, any> = {} ) => {
    return (
      (await api_v2.request({
        url: `/google-list-exclude/${id}/get-placements`,
        method: 'POST',
        data: payload, 
      })) || {}
    )
  },

  CreatePlacements: async ( id: number | string, payload: Record<string, any> = {} ) => {
    return (
      (await api_v2.request({
        url: `/google-list-exclude/${id}/add-placements`,
        method: 'POST',
        data: payload,
      })) || {}
    );
  },

  DeletePlacements: async ( id: number | string, payload: Record<string, any> = {} ) => {
    return (
      (await api_v2.request({
        url: `/google-list-exclude/${id}/delete-placements`,
        method: 'DELETE',
        data: payload,
      })) || {}
    );
  },


  CreateGoogleExclude: async (payload: Record<string, any> = {}) => {
      return (
        (await api_v2.request({
          url: '/google-list-exclude/create',
          method: 'POST',
          data: payload, 
        })) || {}
      )
  },

  UpdateGoogleExclude: async (payload: Record<string, any> = {}) => {
      return (
        (await api_v2.request({
          url: '/google-list-exclude/update',
          method: 'POST',
          data: payload, 
        })) || {}
      )
  },

  GetGoogleExclude: async (id: number | string) => {
    return (
      (await api_v2.request({
        url: `/google-list-exclude/${id}`,
        method: 'GET',
      })) || {}
    )
  },

  GetCategory: async () => {
      return (
        (await api_v2.request({
          url: `google-app-category/list-category`,
          method: 'POST',
        })) || {}
      )
  }

  
}
