import api_v2 from '@/core/api_v2'

export const ctr_test_budget = {
  SaveTrialBudget: async (data: any) => {
    return (await api_v2.request({ url: 'test-budget/save', data: data })) || {}
  },

  GetByUser: async (id: any) => {
    return (
      (await api_v2.request({ url: 'test-budget/get-by-user/' + id })) || {}
    )
  },

  Bonus: async (data: any) => {
    return (
      (await api_v2.request({ url: 'test-budget/bonus', data: data })) || {}
    )
  },

  AmountOfUser: async (user_id: any) => {
    return (
      (await api_v2.request({
        url: 'test-budget/amount-user',
        params: { user_id: user_id },
      })) || {}
    )
  },
}
