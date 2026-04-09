<script setup lang="ts">
import { useTemplateV2 } from '@/store/templateV2Store'
import { ColumnItem } from '@/types/state/general'

import Campaigns from '@/components/crawl_campaign/cell/Campaigns.vue'
import ChangeStatusCampaign from '@/components/crawl_campaign/cell/ChangeStatusCampaign.vue'
import ActionsCrawlCampaign from '@/components/crawl_campaign/cell/ActionsCrawlCampaign.vue'

import Tooltip from '@/components/template-v2/cell/Tooltip.vue'
import TrafficSource from '@/components/template-v2/cell/TrafficSource.vue'
import Round from '@/components/template-v2/cell/Round.vue'
import CrawlError from '@/components/crawl_campaign/cell/CrawlError.vue'
import MultiLinks from '@/components/crawl_campaign/cell/MultiLinks.vue'
import RoundAction from '@/components/crawl_campaign/cell/RoundAction.vue'
const templateV2Store = useTemplateV2(helper.truePath())()

templateV2Store.componentMap = (column: ColumnItem) => {
  if (!column.field) return

  switch (column.field) {
    case 'traffic_source':
      return TrafficSource
    case 'campaign_ids':
      return Campaigns
    case 'status_campaign':
      return ChangeStatusCampaign
    case 'creative_ids':
    case 'landing_page_ids':
      return MultiLinks
    case 'status':
      if (column.action) {
        return RoundAction
      }
    case 'bot_scan':
      return Round
    case 'error':
      return CrawlError
    case 'term_scan':
    case 'keywords':
    case 'angles':
      return Tooltip
    case 'action':
      return ActionsCrawlCampaign
  }
  return
}
</script>

<template></template>
