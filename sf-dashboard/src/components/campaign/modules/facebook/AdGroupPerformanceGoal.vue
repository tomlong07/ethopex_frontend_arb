<script setup lang="ts">
import {
  adGroups,
  campaignTypeClass,
  FreezeClass,
} from '@/types/components/campaign-v2'
import QuestionCircleRegular from '@/assets/icons/QuestionCircleRegular.vue'
import { PerformanceGoalOptions } from '@/options/campaign'
import FloatingWrapper from '@/components/common/FloatingWrapper.vue'
import { BIDSTRATEGY } from '@/enum/campaign'

const props = defineProps({
  campaign: {
    type: Object as () => campaignTypeClass,
    required: true,
  },
  adgroup: {
    type: Object as () => adGroups,
    required: true,
  },

  FreezeData: {
    type: Object as () => FreezeClass,
    required: true,
  },
})

const isDisabled = computed(() => {
  if (props.FreezeData.isEditPage() && !props.campaign.traffic_source_id)
    return false

  if (
    props.FreezeData.isEditPage() &&
    !!props.adgroup.id &&
    !!props.adgroup.ad_group_id
  )
    return true
  if (
    props.campaign.bid_strategy &&
    [
      BIDSTRATEGY.ROAS_GOAL,
      BIDSTRATEGY.COST_PER_RESULT_GOAL,
      BIDSTRATEGY.BID_CAP,
    ].includes(props.campaign.bid_strategy)
  ) {
    return true
  }
  return false
})

const name = 'Performance goal'

watch(
  () => props.campaign.bid_strategy,
  (v) => {
    switch (v) {
      case BIDSTRATEGY.ROAS_GOAL:
        props.adgroup.performance_goal = 'VALUE'
        break
      case BIDSTRATEGY.COST_PER_RESULT_GOAL:
      case BIDSTRATEGY.BID_CAP:
        props.adgroup.performance_goal = 'OFFSITE_CONVERSIONS'
        break

      default:
        break
    }
  }
)
</script>

<template>
  <div class="flex items-center gap-2">
    <FloatingWrapper :name="name" rounded required>
      <n-popover trigger="hover" :disabled="!isDisabled">
        <template #trigger>
          <n-select
            v-model:value="props.adgroup.performance_goal"
            :placeholder="name"
            :disabled="isDisabled"
            :options="PerformanceGoalOptions"
          />
        </template>
        <span class="text-xs"
          >The performance goal cannot be changed after the campaign has been
          published. To advertise with a different performance goal, create a
          new ad set.
        </span>
      </n-popover>
      <template #extra>
        <n-popover trigger="hover" placement="top" :width="320">
          <template #trigger>
            <n-icon size="14" :component="QuestionCircleRegular" />
          </template>

          <div class="whitespace-pre-line text-xs leading-relaxed">
            Example: You can tell Meta to maximize purchase volume while keeping
            your average cost per action (CPA) at about $5. <br />
            {{
              props.campaign.IsFBHighestBid()
                ? 'Because of your bid strategy (Highest volume), all ad sets in this campaign must use the same optimization for ad delivery.'
                : ''
            }}
          </div>
        </n-popover>
      </template>
    </FloatingWrapper>
  </div>
</template>
