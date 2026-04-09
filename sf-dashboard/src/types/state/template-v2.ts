import type { SortDirection } from 'ag-grid-community'

export class SortTable {
  field: string = ''
  dir: SortDirection = 'desc'

  constructor(data: any = null) {
    if (data) {
      for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
          const element = data[key]
          this[key as keyof this] = element
        }
      }
    }

    if (!this.dir) {
      this.dir = 'desc'
    }
  }

  get sortNow() {
    if (this.isEmpty()) return null
    return [
      {
        field: this.field,
        dir: this.dir,
      },
    ]
  }

  isEmpty() {
    return !this.field || !this.dir
  }
}
