import { ReportColumn } from '@/types/state/report'
import { CellComponent } from 'tabulator-tables'
import { render } from 'vue'
import QuickSelect from './QuickSelect.vue'
import { useReportV2 } from '@/store/report/report-v2'
const reportStoreV2 = useReportV2(helper.truePath())()
type TabulatorFormatter = (cell: CellComponent, formatterParams?: any) => any
export function withQuickSelectFormatter(
  baseFormatter: TabulatorFormatter,
  opts: ReportColumn
): TabulatorFormatter {
  switch (opts?.KeyFormat()) {
    case 'campaign':
    case 'publisher':
    case 'traffic_source':
    case 'demand_source':
    case 'label':
    case 'category':
    case 'domain':
    case 'geo':
    case 'landing_page_id':
    case 'account_supply_id':
    case 'manage_id':
    case 'traffic_source_acc_id':
    case 'layout_id':
    case 'tags':
      return (cell: CellComponent) => {
        const el = document.createElement('div')
        el.className = ' group w-full'

        const baseEl = baseFormatter(cell)
        if (baseEl instanceof HTMLElement) {
          el.appendChild(baseEl)
        } else if (typeof baseEl === 'string') {
          el.insertAdjacentHTML('beforeend', baseEl)
        }

        const qsMount = document.createElement('div')
        el.appendChild(qsMount)
        render(
          h(QuickSelect, {
            class: 'absolute right-0 top-0 opacity-0 group-hover:opacity-100',
            field: cell.getField(),
            rowData: cell.getRow().getData(),
            onSelect: (payload: any) => {
              reportStoreV2.quickSelect(payload)
            },
          }),
          qsMount
        )

        return el
      }

    default:
      return baseFormatter
  }
}
