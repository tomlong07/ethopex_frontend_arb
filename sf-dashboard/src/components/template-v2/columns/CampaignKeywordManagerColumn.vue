<script setup lang="ts">
import { useTemplateV2 } from '@/store/templateV2Store'
import { ColumnItem } from '@/types/state/general'

import GroupKeywordsCamp from '@/components/campaign_keywords/cell/GroupKeywordsCamp.vue'
import StatusKWManager from '@/components/campaign_keywords/cell/StatusKWManager.vue'
import Domain from '@/components/campaign_keywords/cell/Domain.vue'
import CellKeywordsCampaign from '@/components/campaign_keywords/cell/CellKeywordsCampaign.vue'

const templateV2Store = useTemplateV2(helper.truePath())()

templateV2Store.componentMap = (column: ColumnItem) => {
  if (!column.field) return

  switch (column.field) {
    case 'actions':
      return GroupKeywordsCamp
    case 'status':
      return StatusKWManager
    case 'keyword_campaigns':
      return CellKeywordsCampaign

    case 'domain':
      return Domain
  }
  return
}
</script>

<template></template>
