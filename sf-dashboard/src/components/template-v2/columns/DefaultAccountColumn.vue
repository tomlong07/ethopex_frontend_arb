<script setup lang="ts">
import { ColumnItem } from '@/types/state/general'
import { useTemplateV2 } from '@/store/templateV2Store'

import ActionDefaultAccount from '@/components/default_account/ActionDefaultAccount.vue'
import Round from '@/components/template-v2/cell/Round.vue'

import TrafficSource from '@/components/template-v2/cell/TrafficSource.vue'
import TemplateV2CellDemandSource from '@/components/template-v2/cell/TemplateV2CellDemandSource.vue'

const templateV2Store = useTemplateV2(helper.truePath())()

templateV2Store.componentMap = (column: ColumnItem) => {
  if (!column.field) return

  switch (column.field) {
    case 'action':
      return ActionDefaultAccount
    case 'global':
      return Round
    case 'traffic_source':
      return TrafficSource
    case 'demand_source':
      return TemplateV2CellDemandSource
  }
  return
}
</script>

<template></template>
