<script setup lang="ts">
import { useTemplateV2 } from '@/store/templateV2Store'
import { ColumnItem } from '@/types/state/general'

import Tooltip from '@/components/template-v2/cell/Tooltip.vue'
import SatisfyRuleType from '@/components/satisfy/cell/SatisfyRuleType.vue'
import NewCampaign from '@/components/rule/cell/NewCampaign.vue'
import ActionRuleSatisfy from '@/components/satisfy/cell/ActionRuleSatisfy.vue'
import CampaignNameSatisfy from '@/components/satisfy/cell/CampaignNameSatisfy.vue'

const templateV2Store = useTemplateV2(helper.truePath())()

templateV2Store.componentMap = (column: ColumnItem) => {
  if (!column.field) return
  switch (column.field) {
    case 'campaign_name':
      return CampaignNameSatisfy
    case 'action':
      return ActionRuleSatisfy
    case 'rule_name':
    case 'account_name':
      return Tooltip

    case 'new_campaign_name':
      return NewCampaign

    case 'rule_type':
      return SatisfyRuleType
  }
  return
}
</script>

<template></template>
