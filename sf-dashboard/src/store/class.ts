import { SelectOption } from 'naive-ui'

export class SelectDataOption {
  options: SelectOption[] = []
  loading: boolean = false

  constructor() {}

  setOptions(options: SelectOption[]) {
    this.options = options
  }

  setLoading(loading: boolean) {
    this.loading = loading
  }
}
