import { createComponent } from '@/components/report-v3/report_helpers'
import { CellComponent } from 'tabulator-tables'
import { ReportColumn } from '@/types/state/report'
import CampaignTooltip from '@/components/report-v3/cell/CampaignTooltip.vue'

export const tooltipNow = (opts?: ReportColumn) => {
  switch (opts?.key) {
    case 'campaign_name':
      return (e: any, cell: CellComponent) => {
        return createComponent({
          cell: cell,
          app: CampaignTooltip,
        })
      }
  }

  return
}
