import { createComponent } from '@/components/report-v3/report_helpers'
import { CellComponent } from 'tabulator-tables'
import HeaderTooltip from '@/components/report-v3/cell/HeaderTooltip.vue'
import { ReportColumn } from '@/types/state/report'

export const headerTooltipNow = (opts?: ReportColumn) => {
  if (opts?.headerTooltip) {
    return (cell: CellComponent, _formatterParams: any) => {
      return createComponent({
        cell: cell,
        app: HeaderTooltip,
        plus: { html: opts?.headerTooltip },
        class: 'text-white bg-gray-400',
      })
    }
  }

  return
}
