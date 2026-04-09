import api_v2 from '@/core/api_v2'

export const ctr_info_contact = {
  ChangeStatus: async (url: string, payload: any) => {
    return await api_v2.request({
      url: url,
      data: payload,
    })
  },
  AddNote: async (payload: any, id: any) => {
    if (!id) return {}

    return await api_v2.request({
      url: `/form-registration/${id}/add-note`,
      data: payload
    })
  },
  updateNote: async (payload: any, id: any, idNote: any) => {
    if (!id || !idNote) return {}

    return await api_v2.request({
      url: `/form-registration/${id}/update-note/${idNote}`,
      data: payload
    })
  },
  deleteNote: async (id: any, idNote: any) => {
    if (!id || !idNote) return {}

    return await api_v2.request({
      url: `/form-registration/${id}/delete-note/${idNote}`,
      method: 'POST',
      data: {}
    })
  },
  ChangeStatusApproved: async (payload: any) => {
    return await api_v2.request({
      url: `/form-registration/update-approved-status`,
      data: payload,
    })
  },
  ChangeSetUp: async (payload: any) => {
    return await api_v2.request({
      url: `/form-registration/update-set-up`,
      data: payload,
    })
  },
  ChangeContract: async (payload: any) => {
    return await api_v2.request({
      url: `/form-registration/update-contract`,
      data: payload,
    })
  },
  UpdateSystemEmail: async (payload: any) => {
    return await api_v2.request({
      url: `/form-registration/update-system-email`,
      data: payload,
    })
  },
}
