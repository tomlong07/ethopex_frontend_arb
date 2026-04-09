<script setup lang="ts">
import { useTemplateV2 } from '@/store/templateV2Store'
import { ColumnItem } from '@/types/state/general'

import TrafficSource from '@/components/template-v2/cell/TrafficSource.vue'
import StatusAction from '@/components/template-v2/cell/StatusAction.vue'
import DateTime from '@/components/template-v2/cell/DateTime.vue'

import CampaignNameV2 from './cell/CampaignNameV2.vue'
import CampaignActionV2 from './cell/CampaignActionV2.vue'
import LandingAIStatus from './cell/LandingAIStatus.vue'
import TemplateV2CellDemandSource from '../template-v2/cell/TemplateV2CellDemandSource.vue'
import ABTestDomain from './cell/ABTestDomain.vue'
import CampaignURL from './cell/CampaignURL.vue'
import DeliveryStatusCell from './cell/DeliveryStatusCell.vue'
import KeywordStatusNew from './cell/KeywordStatusNew.vue'
import PolicyReview2 from './cell/PolicyReview2.vue'
import Recommendation from './cell/Recommendation.vue'
import TemplateV2CellKeywordStatus2 from './cell/TemplateV2CellKeywordStatus2.vue'

const templateV2Store = useTemplateV2(helper.truePath())()

templateV2Store.componentMap = (column: ColumnItem) => {
  if (!column.field) return

  switch (column.field) {
    case 'name':
      return CampaignNameV2
    case 'actions':
      return CampaignActionV2
    case 'url':
      return CampaignURL
    case 'delivery_status':
      return DeliveryStatusCell
    case 'ai_status':
      return PolicyReview2
    case 'keyword_status':
      return KeywordStatusNew
    case 'keyword_status_2':
      return TemplateV2CellKeywordStatus2
    case 'traffic_source':
      return TrafficSource

    case 'demand_source':
      return TemplateV2CellDemandSource
    case 'ab_test_domain':
      return ABTestDomain
    case 'status':
      return StatusAction
    case 'recommendation':
      return Recommendation
    case 'time':
      return DateTime

    case 'landing_status':
      return LandingAIStatus
  }
  return
}
</script>

<template></template>
