import { SelectOption } from 'naive-ui'

//new filter
export interface filterItemType {
  label: string
  value: string | number | boolean | string[] | number[] | boolean[] | null
  options?: SelectOption[]
  primary_key: string
  isMultiple?: boolean
  clearable?: boolean
  input?: boolean
  isShow?: boolean
  isMonthPicker?: boolean
  isReportCamp?: boolean
  clientFilter?: boolean
  custom?: boolean
  alone?: any
  isInput?: boolean
  ajax?: string
  url?: string
}
