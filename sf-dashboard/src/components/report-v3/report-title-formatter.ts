import { createComponent } from '@/components/report-v3/report_helpers'
import { CellComponent } from 'tabulator-tables'
import TitleRealTime from '@/components/report-v3/cell/TitleRealTime.vue'
import { ReportColumn } from '@/types/state/report'

export const titleFormatterNow = (opts?: ReportColumn) => {
  if (opts?.IsRealTime()) {
    return (cell: CellComponent, _formatterParams: any) => {
      return createComponent({
        cell: cell,
        app: TitleRealTime,
      })
    }
  }

  return undefined
}
