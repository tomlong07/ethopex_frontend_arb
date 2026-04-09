<script setup lang="ts">
import { useTemplateV2 } from '@/store/templateV2Store'
import { ColumnItem } from '@/types/state/general'

import ShowIncludeExclude from '@/components/domain_trigger/cell/ShowIncludeExclude.vue'
import LinkTooltip from '@/components/template-v2/cell/LinkTooltip.vue'
import Actions from '@/components/template-v2/cell/Actions.vue'
import Round from '@/components/template-v2/cell/Round.vue'
import Tooltip from '@/components/template-v2/cell/Tooltip.vue'
import DateTime from '@/components/template-v2/cell/DateTime.vue'
import AdsenseAccountAB from '@/components/domain_config/cell/AdsenseAccountAB.vue'

const templateV2Store = useTemplateV2(helper.truePath())()

templateV2Store.componentMap = (column: ColumnItem) => {
  if (!column.field) return

  switch (column.field) {
    case 'actions':
      return Actions
    case 'name':
      return LinkTooltip
    case 'traffic_sources_name':
    case 'ad_accounts_name':
    case 'labels_name':
      return ShowIncludeExclude
    case 'status':
      return Round
    case 'adsense_accounts_name':
    case 'adsense_accounts_backup_name':
      return Tooltip
    case 'created_at':
      return DateTime
    case 'adsense_ab':
      return AdsenseAccountAB
  }
  return
}
</script>

<template></template>
