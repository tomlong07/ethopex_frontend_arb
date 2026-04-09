import date2 from '@/utils/date2'

// Khai báo interface
interface SortOption {
  dir: 'asc' | 'desc'
  field: string
}

interface Filter {
  end_date?: string
  start_date: string
}

export class ReportQueryCls {
  filter?: Filter
  group_by?: string[]
  page?: number
  search?: string
  size?: number
  sort?: SortOption[]
  time_interval?: string
  timezone?: string
  search_type?: string
  auto_sync?: boolean
  orderBy?: string | null
  dateRange?: string
  type?: string
  cols?: string[]

  constructor(data?: any) {
    if (data) {
      for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
          const element = data[key]
          if (!element) continue
          this[key as keyof this] = element
        }
      }
    }
  }

  SetDefaultQuery() {
    this.page = 1
    this.size = 50
    this.time_interval = 'day'
    this.timezone = 'UTC'
    this.type = 'table'
    this.dateRange = 'today'
    this.filter = this.filter ?? { start_date: '', end_date: '' }
    this.filter.end_date = date2.today()
    this.filter.start_date = date2.today()
    this.group_by = ['campaign']
    this.cols = ['profit']
    return this
  }

  get dateDefaultValue(): [string, string] {
    return [this.filter?.start_date || '', this.filter?.end_date || '']
  }
}
