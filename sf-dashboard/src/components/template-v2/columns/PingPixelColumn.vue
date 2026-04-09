<script setup lang="ts">
import { useTemplateV2 } from '@/store/templateV2Store'
import { ColumnItem } from '@/types/state/general'

import Campaign from '@/components/ping_pixel/cell/Campaign.vue'
import TrafficSource from '@/components/template-v2/cell/TrafficSource.vue'
import TemplateV2CellDemandSource from '@/components/template-v2/cell/TemplateV2CellDemandSource.vue'
import Round from '@/components/template-v2/cell/Round.vue'

const templateV2Store = useTemplateV2(helper.truePath())()

templateV2Store.componentMap = (column: ColumnItem) => {
  if (!column.field) return

  switch (column.field) {
    case 'campaign_id':
      return Campaign
    case 'traffic_source':
      return TrafficSource
    case 'demand_source':
      return TemplateV2CellDemandSource
    case 'status_pixel':
      return Round
  }
  return
}
</script>

<template></template>
