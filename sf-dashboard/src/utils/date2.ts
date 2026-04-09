import {
  format,
  // startOfYesterday,
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
import { formatInTimeZone, utcToZonedTime } from 'date-fns-tz'
const OUTPUT_FORMAT = 'yyyy-MM-dd'

export default {
  today(timeZone: string = 'UTC') {
    return formatInTimeZone(new Date(), timeZone, OUTPUT_FORMAT)
  },

  yesterday(timeZone: string = 'UTC') {
    return formatInTimeZone(subDays(new Date(), 1), timeZone, OUTPUT_FORMAT)
  },

  startMonth(timeZone: string = 'UTC') {
    const zonedNow = utcToZonedTime(new Date(), timeZone)
    return format(startOfMonth(zonedNow), OUTPUT_FORMAT)
  },

  endMonth(timeZone: string = 'UTC') {
    const zonedNow = utcToZonedTime(new Date(), timeZone)
    return format(endOfMonth(zonedNow), OUTPUT_FORMAT)
  },

  last3Days(timeZone: string = 'UTC') {
    return formatInTimeZone(subDays(new Date(), 3), timeZone, OUTPUT_FORMAT)
  },

  last6Days(timeZone: string = 'UTC') {
    return formatInTimeZone(subDays(new Date(), 6), timeZone, OUTPUT_FORMAT)
  },

  last7Days(timeZone: string = 'UTC') {
    return formatInTimeZone(subDays(new Date(), 7), timeZone, OUTPUT_FORMAT)
  },

  last14Days(timeZone: string = 'UTC') {
    return formatInTimeZone(subDays(new Date(), 14), timeZone, OUTPUT_FORMAT)
  },

  last30Days(timeZone: string = 'UTC') {
    return formatInTimeZone(subDays(new Date(), 30), timeZone, OUTPUT_FORMAT)
  },

  tomorrow(timeZone: string = 'UTC') {
    return formatInTimeZone(addDays(new Date(), 1), timeZone, OUTPUT_FORMAT)
  },

  nextDays(days: number, timeZone: string = 'UTC') {
    return formatInTimeZone(addDays(new Date(), days), timeZone, OUTPUT_FORMAT)
  },

  startLastMonth(timeZone: string = 'UTC') {
    const zonedNow = utcToZonedTime(new Date(), timeZone)
    return format(startOfMonth(subMonths(zonedNow, 1)), OUTPUT_FORMAT)
  },

  endLastMonth(timeZone: string = 'UTC') {
    const zonedNow = utcToZonedTime(new Date(), timeZone)
    return format(endOfMonth(subMonths(zonedNow, 1)), OUTPUT_FORMAT)
  },

  startFirstQuarter(timeZone: string = 'UTC') {
    const zonedNow = utcToZonedTime(new Date(), timeZone)
    return format(
      startOfQuarter(new Date(getYear(zonedNow), 0, 1)),
      OUTPUT_FORMAT
    )
  },

  endFirstQuarter(timeZone: string = 'UTC') {
    const zonedNow = utcToZonedTime(new Date(), timeZone)
    return format(
      endOfQuarter(new Date(getYear(zonedNow), 2, 1)),
      OUTPUT_FORMAT
    )
  },

  startSecondQuarter(timeZone: string = 'UTC') {
    const zonedNow = utcToZonedTime(new Date(), timeZone)
    return format(
      startOfQuarter(new Date(getYear(zonedNow), 3, 1)),
      OUTPUT_FORMAT
    )
  },

  endSecondQuarter(timeZone: string = 'UTC') {
    const zonedNow = utcToZonedTime(new Date(), timeZone)
    return format(
      endOfQuarter(new Date(getYear(zonedNow), 5, 1)),
      OUTPUT_FORMAT
    )
  },

  startThirdQuarter(timeZone: string = 'UTC') {
    const zonedNow = utcToZonedTime(new Date(), timeZone)
    return format(
      startOfQuarter(new Date(getYear(zonedNow), 6, 1)),
      OUTPUT_FORMAT
    )
  },

  endThirdQuarter(timeZone: string = 'UTC') {
    const zonedNow = utcToZonedTime(new Date(), timeZone)
    return format(
      endOfQuarter(new Date(getYear(zonedNow), 8, 1)),
      OUTPUT_FORMAT
    )
  },

  startFourthQuarter(timeZone: string = 'UTC') {
    const zonedNow = utcToZonedTime(new Date(), timeZone)
    return format(
      startOfQuarter(new Date(getYear(zonedNow), 9, 1)),
      OUTPUT_FORMAT
    )
  },

  endFourthQuarter(timeZone: string = 'UTC') {
    const zonedNow = utcToZonedTime(new Date(), timeZone)
    return format(
      endOfQuarter(new Date(getYear(zonedNow), 11, 1)),
      OUTPUT_FORMAT
    )
  },

  last3Months(timeZone = 'UTC') {
    const zonedNow = utcToZonedTime(new Date(), timeZone)

    return {
      start: format(subMonths(zonedNow, 3), OUTPUT_FORMAT),
      end: format(zonedNow, OUTPUT_FORMAT),
    }
  },
  allTime() {
    return format(startOfYear(new Date(2022, 8, 2, 11, 55)), 'yyyy-MM-dd')
  },

  getCurrentUtcTime(): string {
    const now = new Date()

    const year = now.getUTCFullYear()
    const month = String(now.getUTCMonth() + 1).padStart(2, '0')
    const day = String(now.getUTCDate()).padStart(2, '0')
    const hours = String(now.getUTCHours()).padStart(2, '0')
    const minutes = String(now.getUTCMinutes()).padStart(2, '0')

    return `${year}/${month}/${day} ${hours}:${minutes} UTC`
  },

  getNextUtcMidnight(): string {
    const now = new Date()

    // Tạo ngày mới dựa trên UTC
    const next = new Date(
      Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate() + 1, // cộng 1 ngày
        0,
        0,
        0,
        0
      )
    )

    const year = next.getUTCFullYear()
    const month = String(next.getUTCMonth() + 1).padStart(2, '0')
    const day = String(next.getUTCDate()).padStart(2, '0')
    const hours = String(next.getUTCHours()).padStart(2, '0')
    const minutes = String(next.getUTCMinutes()).padStart(2, '0')

    return `${year}/${month}/${day} ${hours}:${minutes} UTC`
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
