import {
  format,
  startOfYesterday,
  startOfMonth,
  endOfMonth,
  subDays,
  addDays,
  startOfYear,
  subMonths,
  addMonths,
  startOfQuarter,
  endOfQuarter,
  getYear,
  isSameDay,
  subQuarters,
  addQuarters,
  differenceInDays,
  subHours,
  addHours,
} from 'date-fns'

export default {
  today() {
    return format(
      new Date(new Date().toUTCString().substring(0, 25)),
      'yyyy-MM-dd'
    )
  },

  yesterday() {
    return format(startOfYesterday(), 'yyyy-MM-dd')
  },

  startMonth() {
    return format(
      startOfMonth(new Date(new Date().toUTCString().substring(0, 25))),
      'yyyy-MM-dd'
    )
  },

  endMonth() {
    return format(
      endOfMonth(new Date(new Date().toUTCString().substring(0, 25))),
      'yyyy-MM-dd'
    )
  },

  last7Days() {
    return format(
      subDays(new Date(new Date().toUTCString().substring(0, 25)), 7),
      'yyyy-MM-dd'
    )
  },

  last30Days() {
    return format(
      subDays(new Date(new Date().toUTCString().substring(0, 25)), 30),
      'yyyy-MM-dd'
    )
  },

  tomorrow() {
    const today = new Date()

    // Thêm 1 ngày vào ngày hiện tại để tính toán ngày mai
    const nextDay = addDays(today, 1)

    // Định dạng ngày mai theo định dạng 'yyyy-MM-dd'
    return format(nextDay, 'yyyy-MM-dd')
  },

  nextDays(days: number) {
    const today = new Date()

    // Thêm 1 ngày vào ngày hiện tại để tính toán ngày mai
    const nextDay = addDays(today, days)

    // Định dạng ngày mai theo định dạng 'yyyy-MM-dd'
    return format(nextDay, 'yyyy-MM-dd')
  },

  startLastMonth() {
    return format(
      startOfMonth(
        subMonths(new Date(new Date().toUTCString().substring(0, 25)), 1)
      ),
      'yyyy-MM-dd'
    )
  },

  endLastMonth() {
    return format(
      endOfMonth(
        subMonths(new Date(new Date().toUTCString().substring(0, 25)), 1)
      ),
      'yyyy-MM-dd'
    )
  },

  startFirstQuarter() {
    return format(
      startOfQuarter(new Date(getYear(new Date()), (1 - 1) * 3, 1)),
      'yyyy-MM-dd'
    )
  },

  endFirstQuarter() {
    return format(
      endOfQuarter(new Date(getYear(new Date()), 1 * 3 - 1, 1)),
      'yyyy-MM-dd'
    )
  },

  startSecondQuarter() {
    return format(
      startOfQuarter(new Date(getYear(new Date()), (2 - 1) * 3, 1)),
      'yyyy-MM-dd'
    )
  },

  endSecondQuarter() {
    return format(
      endOfQuarter(new Date(getYear(new Date()), 2 * 3 - 1, 1)),
      'yyyy-MM-dd'
    )
  },

  startThirdQuarter() {
    return format(
      startOfQuarter(new Date(getYear(new Date()), (3 - 1) * 3, 1)),
      'yyyy-MM-dd'
    )
  },

  endThirdQuarter() {
    return format(
      endOfQuarter(new Date(getYear(new Date()), 3 * 3 - 1, 1)),
      'yyyy-MM-dd'
    )
  },

  startFourthQuarter() {
    return format(
      startOfQuarter(new Date(getYear(new Date()), (4 - 1) * 3, 1)),
      'yyyy-MM-dd'
    )
  },

  endFourthQuarter() {
    return format(
      endOfQuarter(new Date(getYear(new Date()), 4 * 3 - 1, 1)),
      'yyyy-MM-dd'
    )
  },

  allTime() {
    return format(startOfYear(new Date(2022, 8, 2, 11, 55)), 'yyyy-MM-dd')
  },
}

export const compare = {
  isQuarterPicker(startDate: string, endDate: string) {
    const start = new Date(startDate)
    const end = new Date(endDate)

    // Calculate the start and end of the quarter for the start date
    const quarterStart = startOfQuarter(start)
    const quarterEnd = endOfQuarter(start)

    // Check if the start and end dates match the start and end of the quarter
    return isSameDay(start, quarterStart) && isSameDay(end, quarterEnd)
  },

  isMonthPicker(startDate: string, endDate: string): boolean {
    const start = new Date(startDate)
    const end = new Date(endDate)

    // Tính ngày đầu và ngày cuối của tháng dựa trên startDate
    const monthStart = startOfMonth(start)
    const monthEnd = endOfMonth(start)

    // Kiểm tra nếu startDate trùng với ngày đầu tháng và endDate trùng với ngày cuối tháng
    return isSameDay(start, monthStart) && isSameDay(end, monthEnd)
  },

  calculateDaysDifference(
    startDate: string,
    endDate: string,
    include: boolean = true
  ): number {
    const start = new Date(startDate)
    const end = new Date(endDate)

    if (include) return differenceInDays(end, start) + 1 //trả về cả ngày start và end
    return differenceInDays(end, start)
  },
}

export const create = {
  prevOneQuarter(dateValue: string) {
    const temp = subQuarters(
      new Date(new Date(dateValue).toUTCString().substring(0, 25)),
      1
    )

    return [
      format(startOfQuarter(temp), 'yyyy-MM-dd'),
      format(endOfQuarter(temp), 'yyyy-MM-dd'),
    ]
  },

  nextOneQuarter(dateValue: string) {
    const temp = addQuarters(
      new Date(new Date(dateValue).toUTCString().substring(0, 25)),
      1
    )
    return [
      format(startOfQuarter(temp), 'yyyy-MM-dd'),
      format(endOfQuarter(temp), 'yyyy-MM-dd'),
    ]
  },

  prevOneMonth(dateValue: string) {
    const temp = subMonths(
      new Date(new Date(dateValue).toUTCString().substring(0, 25)),
      1
    )
    return [
      format(startOfMonth(temp), 'yyyy-MM-dd'),
      format(endOfMonth(temp), 'yyyy-MM-dd'),
    ]
  },

  nextOneMonth(dateValue: string) {
    const temp = addMonths(
      new Date(new Date(dateValue).toUTCString().substring(0, 25)),
      1
    )
    return [
      format(startOfMonth(temp), 'yyyy-MM-dd'),
      format(endOfMonth(temp), 'yyyy-MM-dd'),
    ]
  },

  prevDays(dateValues: string[]) {
    const days = compare.calculateDaysDifference(dateValues[0], dateValues[1])

    return [
      format(
        subHours(
          new Date(new Date(dateValues[0]).toUTCString().substring(0, 25)),
          24 * days
        ),
        'yyyy-MM-dd'
      ),
      format(
        subHours(
          new Date(new Date(dateValues[1]).toUTCString().substring(0, 25)),
          24 * days
        ),
        'yyyy-MM-dd'
      ),
    ]
  },

  nextDays(dateValues: string[]) {
    const days = compare.calculateDaysDifference(dateValues[0], dateValues[1])

    return [
      format(
        addHours(
          new Date(new Date(dateValues[0]).toUTCString().substring(0, 25)),
          24 * days
        ),
        'yyyy-MM-dd'
      ),
      format(
        addHours(
          new Date(new Date(dateValues[1]).toUTCString().substring(0, 25)),
          24 * days
        ),
        'yyyy-MM-dd'
      ),
    ]
  },
}
