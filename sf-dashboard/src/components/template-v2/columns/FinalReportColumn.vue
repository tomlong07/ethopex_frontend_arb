<script setup lang="ts">
import { useTemplateV2 } from '@/store/templateV2Store'
import { ColumnItem } from '@/types/state/general'

import TrafficSource from '@/components/template-v2/cell/TrafficSource.vue'
import RevenueInvalid from '@/components/final_report/cell/RevenueInvalid.vue'
import ModeCols from '@/components/final_report/cell/ModeCols.vue'
import ManagerFinal from '@/components/final_report/cell/ManagerFinal.vue'
import ColorCurrency from '@/components/final_report/cell/ColorCurrency.vue'
import ColorCurrencyReverse from '@/components/final_report/cell/ColorCurrencyReverse.vue'
import PercentNumber from '@/components/final_report/cell/PercentNumber.vue'
import PublisherReport from '@/components/final_report/cell/PublisherReport.vue'
import ReportAccountDemand from '@/components/final_report/cell/ReportAccountDemand.vue'

const templateV2Store = useTemplateV2(helper.truePath())()

templateV2Store.componentMap = (column: ColumnItem) => {
  if (!column.field) return

  switch (column.field) {
    case 'traffic_source':
      return TrafficSource
    case 'profit_report':
    case 'profit_final':
    case 'net_profit_final':
      return ColorCurrency
    case 'net_revenue_invalid':
      return ColorCurrencyReverse
    case 'revenue_invalid':
      return RevenueInvalid
    case 'roi_final':
    case 'net_roi_final':
      return PercentNumber
    case 'user_id':
      return PublisherReport

    case 'manager_id':
      return ManagerFinal
    case 'account_demand_id':
      return ReportAccountDemand
    case 'mode':
      return ModeCols
  }
  return
}
</script>

<template></template>
