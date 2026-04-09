<script setup lang="ts">
import QuestionCircleRegular from '@/assets/icons/QuestionCircleRegular.vue'
import useRuleStoreV3 from '@/store/details/ruleV3'
import CollapseSection from '../common/CollapseSection.vue'
import { useLocale } from '@/lang/messages'
const RuleLimit = useLocale(
  () => import('@/lang/vi/rule_limit'),
  () => import('@/lang/en/rule_limit')
)
const ruleStoreV3 = useRuleStoreV3()

watch(
  () => ruleStoreV3.ruleV3.isAddCampaignRule(),
  (newValue) => {
    if (!newValue) {
      ruleStoreV3.ruleV3.add_campaign.delay = undefined
      ruleStoreV3.ruleV3.add_campaign.limit_campaign = undefined
    }
  }
)
const name = `Delay`
const name2 = `Limit Campaign`
</script>
<template>
  <CollapseSection
    name="limit"
    header="Limit"
    v-if="
      ruleStoreV3.ruleV3.isAddCampaignRule() && ruleStoreV3.ruleV3.add_campaign
    "
  >
    <div class="flex items-center gap-2">
      <div class="w-32 font-bold flex items-center gap-2">
        Delay
        <n-popover trigger="hover">
          <template #trigger>
            <n-icon size="12"><QuestionCircleRegular /></n-icon>
          </template>
          <span>{{ RuleLimit.delay }}</span>
        </n-popover>
      </div>
      <div class="flex-1 min-w-0">
        <n-input-number
          v-model:value="ruleStoreV3.ruleV3.add_campaign.delay"
          :placeholder="name"
          min="0"
          max="1000"
        >
          <template #suffix>
            {{ RuleLimit.second }}
          </template></n-input-number
        >
      </div>
    </div>

    <div class="flex items-center gap-2">
      <div class="w-32 font-bold flex items-center gap-2">
        {{ name2 }}
        <n-popover trigger="hover">
          <template #trigger>
            <n-icon size="12"><QuestionCircleRegular /></n-icon>
          </template>
          <span>{{ RuleLimit.total_rule }}</span>
        </n-popover>
      </div>
      <div class="flex-1 min-w-0">
        <n-input-number
          v-model:value="ruleStoreV3.ruleV3.add_campaign.limit_campaign"
          :placeholder="name2"
          min="0"
          max="1000"
        >
          <template #suffix> campaigns </template></n-input-number
        >
      </div>
    </div>
  </CollapseSection>
</template>
