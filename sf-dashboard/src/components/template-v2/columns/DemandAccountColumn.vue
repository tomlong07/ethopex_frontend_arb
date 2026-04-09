<script setup lang="ts">
import { useTemplateV2 } from '@/store/templateV2Store'
import { ColumnItem } from '@/types/state/general'

import LimitChannelAdsense from '@/components/demand_account/cell/LimitChannelAdsense.vue'
import Round from '@/components/template-v2/cell/Round.vue'
import LinkTooltip from '@/components/template-v2/cell/LinkTooltip.vue'

const templateV2Store = useTemplateV2(helper.truePath())()

templateV2Store.componentMap = (column: ColumnItem) => {
  if (!column.field) return

  switch (column.field) {
    case 'name':
      return LinkTooltip
    case 'status':
      return Round
    case 'channels':
      return LimitChannelAdsense
  }
  return
}
</script>

<template></template>
