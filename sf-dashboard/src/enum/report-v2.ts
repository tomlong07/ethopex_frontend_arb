/* eslint-disable no-unused-vars */
// @ts-nocheck

// Thêm để ko báo lỗi enum bị unused

export enum DATE_RANGE {
  CURRENT = 'current',
  TODAY = 'today',
  YESTERDAY = 'yesterday',
  LAST_3_DAYS = 'last_3_days',
  LAST_7_DAYS = 'last_7_days',
  LAST_14_DAYS = 'last_14_days',
  LAST_30_DAYS = 'last_30_days',
  THIS_MONTH = 'this_month',
  LAST_MONTH = 'last_month',

  FIRST_QUARTER = 'first_quarter',
  SECOND_QUARTER = 'second_quarter',
  THIRD_QUARTER = 'third_quarter',
  FOURTH_QUARTER = 'fourth_quarter',
  LAST_3_MONTHS = 'last_3_months',
  ALL_TIME = 'all_time',
}

export enum TypeFormatter {
  TypePercent = 'percent',
  TypeMoney = 'money',
  TypeNumber = 'number',
}

export enum POSITION {
  LEFT = 'left',
  RIGHT = 'right',
}

export enum COLOR_FORMATTER {
  ColorDefault = 'default',
  ColorVer2 = 'v2',
  ColorVer3 = 'v3',
}

export enum ALIGN_FORMATTER {
  AlignRight = 'right',
  AlignCenter = 'center',
}

export enum CHART_TYPE {
  SPLINE = 'spline',
  COLUMN = 'column',
}
