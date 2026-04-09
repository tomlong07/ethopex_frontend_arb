import { ReportColumn } from '@/types/state/report'
import { ColumnDefinition } from 'tabulator-tables'

export const styleNowV2 = (
  opts?: ReportColumn
): ColumnDefinition | undefined => {
  if (opts?.align) {
    return {
      hozAlign: opts.align,
      headerHozAlign: opts.align,
    } as ColumnDefinition
  }

  if (opts?.metric) {
    return {
      hozAlign: 'right',
      headerHozAlign: 'right',
    } as ColumnDefinition
  }

  return undefined
}
