<script setup lang="ts">
import { useTemplateV2 } from '@/store/templateV2Store'
import { ColumnItem } from '@/types/state/general'
import Round from '@/components/template-v2/cell/Round.vue'
import ActionCampaignPreset from '@/components/crawl_campaign/cell/ActionCampaignPreset.vue'
import TrafficSource from '@/components/template-v2/cell/TrafficSource.vue'

const templateV2Store = useTemplateV2(helper.truePath())()

templateV2Store.componentMap = (column: ColumnItem) => {
  if (!column.field) return

  switch (column.field) {
    case 'traffic_source':
      return TrafficSource
    case 'action':
      return ActionCampaignPreset
    case 'status':
    case 'extension':
      return Round
  }
  return
}
</script>

<template></template>
