import { ctr_filter_v2 } from '@/services/ctr_filter_v2'
import { SelectOption } from 'naive-ui'

export class testBudgetType {
  user_id?: number
  status?: string
  amount?: number

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
      this.status = 'on'
    }
  }
}

export class testBudgetSelectOptions {
  loadingUser = ref<boolean>(true)
  users = ref<SelectOption[]>([])

  constructor() {}

  getUsersChild = async (q?: string, id?: string) => {
    this.loadingUser.value = true

    const result = await ctr_filter_v2.FilterPublisher({
      q: q,
      f: id,
      status: '1',
    })

    this.users.value = result?.data || []

    this.loadingUser.value = false
  }
}

export class testBudgetStatusManager {
  loadingAmount = ref<boolean>(true)
  errorAmount = ref<boolean>(false)
  constructor() {}
}
