<script setup lang="ts">
import { useTemplateV2 } from '@/store/templateV2Store'
import { ColumnItem } from '@/types/state/general'

import LinkTooltip from '@/components/template-v2/cell/LinkTooltip.vue'
import Actions from '@/components/template-v2/cell/Actions.vue'
import Round from '@/components/template-v2/cell/Round.vue'
import AdsFor from '@/components/label_mannager_detail/cell/AdsFor.vue'
import TotalCampaigns from '@/components/label_mannager_detail/cell/TotalCampaigns.vue'

const templateV2Store = useTemplateV2(helper.truePath())()

templateV2Store.componentMap = (column: ColumnItem) => {
  if (!column.field) return

  switch (column.field) {
    case 'actions':
      return Actions
    case 'name':
      return LinkTooltip

    case 'total_campaign':
      return TotalCampaigns

    case 'ads_for':
      return AdsFor
    case 'status':
      return Round
  }
  return
}
</script>

<template></template>
