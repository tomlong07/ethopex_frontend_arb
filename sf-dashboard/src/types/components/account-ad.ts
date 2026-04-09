import { SelectOption } from 'naive-ui'
import useAccountAd from '@/store/useAccountAd'
import { ctr_category } from '@/services/ctr_category'
import { ctr_supply_account } from '@/services/ctr_supply_account'

const accountAdStore = useAccountAd()

export interface PayloadObjectLabel {
  label: string
  color: string
}

export class LabelModal {
  id?: string
  labels?: PayloadObjectLabel[]
  categories?: string[]
  label?: string
  color?: string
  isUpdate?: boolean

  labelOptions: SelectOption[] = []
  loadingLabel: boolean = false

  categoryOptions: SelectOption[] = []
  loadingCategory: boolean = false

  hasLabelUpdate: boolean = false

  constructor() {}

  async updateColorMap() {
    if (!this.hasLabelUpdate) return
    const rawOptions = await ctr_supply_account.GetLabel()
    accountAdStore.updateColorMap(rawOptions?.data || [])
  }

  async updateSelectOptions() {
    this.loadingLabel = true
    this.labelOptions = []

    const rawOptions = await ctr_supply_account.GetLabel()

    ;(rawOptions?.data || []).forEach((data: any) => {
      this.labelOptions.push({
        color: data.color,
        label: data.label,
        value: data.label,
      })
    })

    this.loadingLabel = false
  }

  async updateCategorySelectOptions() {
    this.loadingCategory = true
    this.categoryOptions = []
    const rawOptions = await ctr_category.getCategoryIAB()

    this.categoryOptions = rawOptions?.data || []

    this.loadingCategory = false
  }
}
