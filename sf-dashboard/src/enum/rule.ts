/* eslint-disable no-unused-vars */
// @ts-nocheck

// Thêm để ko báo lỗi enum bị unused

export enum RuleVersion {
  V1 = 'v1',
  V2 = 'v2',
}

export enum RepeatMode {
  RuleRepeatModeTYPENone = 'none',
  RuleRepeatModeTYPEDaily = 'once_daily',
  RuleRepeatModeTYPEIntervalHour = 'interval_hour',
  RuleRepeatModeTYPEOnlyOnce = 'only_once',
}
