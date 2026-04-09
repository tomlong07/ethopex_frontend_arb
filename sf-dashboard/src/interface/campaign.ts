import { DS, ONOFF, TS } from '@/enum/campaign'
import { StringLiteralLike } from 'typescript'

export interface ScheduleEntry {
  dayOfWeek?: string
  startHour?: number
  endHour?: number
  startMinute?: string
  endMinute?: string
}

export interface LandingOptionInterface {
  demand_source: DS
  q?: string
  prelander?: ONOFF
  f?: any
  id?: boolean
}
export interface CreativeOptionInterface {
  traffic_source?: TS
  q?: string
  id?: StringLiteralLike
}
