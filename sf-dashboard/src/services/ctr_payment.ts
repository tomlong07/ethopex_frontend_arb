import api_v2 from '@/core/api_v2'

export const ctr_payment = {
  GetAmountInvoicePending: async (
    id: any,
    isShowCensorship: boolean = false
  ) => {
    const url = `payment/amount` + (isShowCensorship ? `?user_id=${id}` : '')

    const result = await api_v2.request({ url: url })
    return result || {}
  },

  LoadInvoice: async (id: string) => {
    const result = await api_v2.request({ url: `payment/load-invoice/${id}` })
    return result || {}
  },
}
