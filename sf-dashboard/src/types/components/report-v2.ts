export class ReportManagerCenter {
  alreadyInitFilters: boolean = false

  initCustom: number = 0
  plkCustomFilterData: { [key: string]: any } = {}

  constructor() {}

  initCustomFilters() {
    this.initCustom = Date.now()
  }
}
