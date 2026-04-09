import { DATE_RANGE } from '@/enum/report-v2'
import date2 from '@/utils/date2'

export class reportSettingsV2 {
  changeCompare?: boolean = false
  autoUpdate?: boolean = false
  pageSize?: number = 100
  campaignViewMode?: boolean = false
  saveLastView?: boolean = false
  selectBox?: boolean = false
  widthOfChart?: number = 100
  defaultSortDate?: boolean = false
  CampDownLoadJson?: boolean = false
  smartChart?: boolean = false
  autoProfile?: number
  dateOpen?: string = DATE_RANGE.CURRENT
  groupBy?: string
  showFullDate?: boolean = false
  showScroll?: boolean = false
  cellSpacing?: string = 'normal'
  isProfitLossColoringDisabled?: boolean = false
  smartStickyDate?: boolean = false
  alertCamp?: boolean = false
  sortRevenue?: boolean = false
  autoSaveReport?: boolean = false
  sortDirection?: boolean = false
  quickSelect?: boolean = false
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
  IsSortRevenue(): boolean {
    return !!this.sortRevenue
  }
}

export const GetDateByRange = (
  dataOpen: string,
  timezone?: string
): string[] => {
  switch (dataOpen) {
    case DATE_RANGE.TODAY:
      return [date2.today(timezone), date2.today(timezone)]
    case DATE_RANGE.YESTERDAY:
      return [date2.yesterday(timezone), date2.yesterday(timezone)]
    case DATE_RANGE.LAST_3_DAYS:
      return [date2.last3Days(timezone), date2.yesterday(timezone)]
    case DATE_RANGE.LAST_7_DAYS:
      return [date2.last7Days(timezone), date2.yesterday(timezone)]

    case DATE_RANGE.LAST_14_DAYS:
      return [date2.last14Days(timezone), date2.yesterday(timezone)]
    case DATE_RANGE.LAST_30_DAYS:
      return [date2.last30Days(timezone), date2.yesterday(timezone)]
    case DATE_RANGE.THIS_MONTH:
      return [date2.startMonth(timezone), date2.endMonth(timezone)]
    case DATE_RANGE.LAST_MONTH:
      return [date2.startLastMonth(timezone), date2.endLastMonth(timezone)]
    case DATE_RANGE.FIRST_QUARTER:
      return [
        date2.startFirstQuarter(timezone),
        date2.endFirstQuarter(timezone),
      ]
    case DATE_RANGE.SECOND_QUARTER:
      return [
        date2.startSecondQuarter(timezone),
        date2.endSecondQuarter(timezone),
      ]
    case DATE_RANGE.THIRD_QUARTER:
      return [
        date2.startThirdQuarter(timezone),
        date2.endThirdQuarter(timezone),
      ]
    case DATE_RANGE.FOURTH_QUARTER:
      return [
        date2.startFourthQuarter(timezone),
        date2.endFourthQuarter(timezone),
      ]
    case DATE_RANGE.ALL_TIME:
      return [date2.allTime(), date2.today()]

    default:
      return []
  }
}
