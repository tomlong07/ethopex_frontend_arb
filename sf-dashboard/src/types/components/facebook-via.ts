import { ctr_filter_v2 } from '@/services/ctr_filter_v2'
import { SelectOption } from 'naive-ui'

export class FacebookViaType {
  id?: string
  object?: string
  status?: string

  name?: string
  email?: string
  user_id?: number
  ad_accounts?: string[]

  constructor(data?: any) {
    if (data) {
      for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
          const element = data[key]
          this[key as keyof this] = element
        }
      }

      if (!data.status) {
        this.status = 'off'
      }
    } else {
      //default cho trường hợp add
      this.status = 'on'

      this.object = 'facebook'
    }
  }
}

export class fbViaSelectOptions {
  loadingUser = ref<boolean>(true)
  loadingAdAccounts = ref<boolean>(true)
  users = ref<SelectOption[]>([])
  adAccounts = ref<SelectOption[]>([])

  constructor() {}

  getUsers = async (f?: number, q: string = '') => {
    this.loadingUser.value = true

    const result = await ctr_filter_v2.FilterPublisher({
      f: f?.toString(),
      q: q,
      status: '1',
    })

    this.users.value = result?.data || []

    this.loadingUser.value = false
  }

  getAdAccounts = async (q: string = '', supply_user: string = '') => {
    this.loadingAdAccounts.value = true

    const result = await ctr_filter_v2.FilterSupplyAccountAd({
      q: q,
      check_not_in: 'true',
      supply_user: supply_user,
    })

    this.adAccounts.value = result?.data || []

    this.loadingAdAccounts.value = false
  }
}
