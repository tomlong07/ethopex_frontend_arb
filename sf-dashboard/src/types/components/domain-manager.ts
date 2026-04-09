import { ctr_domain } from '@/services/ctr_domain'

export class DomainManagerModal {
  id?: string
  labels?: string[]

  labelOptions: string[] = []
  loadingLabel: boolean = false

  constructor() {}
  async updateSelectOptions() {
    this.loadingLabel = true
    this.labelOptions = []
    const rawOptions = await ctr_domain.GetAllLabels()

    this.labelOptions = rawOptions?.data || []
    this.loadingLabel = false
  }
}
