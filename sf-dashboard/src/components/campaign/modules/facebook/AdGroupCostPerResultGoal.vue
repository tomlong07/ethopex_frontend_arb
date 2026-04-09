<script setup lang="ts">
import {
  adGroups,
  campaignTypeClass,
  FreezeClass,
  GroupIs,
} from '@/types/components/campaign-v2'
import { SelectOption } from 'naive-ui'
import QuestionCircleRegular from '@/assets/icons/QuestionCircleRegular.vue'

import { ATTRIBUTION_SETTING, BIDSTRATEGY } from '@/enum/campaign'
import FloatingWrapper from '@/components/common/FloatingWrapper.vue'

const props = defineProps({
  adgroup: {
    type: Object as () => adGroups,
    required: true,
  },
  campaign: {
    type: Object as () => campaignTypeClass,
    required: true,
  },
  FreezeData: {
    type: Object as () => FreezeClass,
    required: true,
  },
})
const BidStrategyOptions = computed<SelectOption[]>(() => {
  return [
    {
      value: BIDSTRATEGY.COST_PER_RESULT_GOAL,
      label: 'Cost per result goal',
      bonus: 'Best for getting the most volume',
    },
    {
      value: BIDSTRATEGY.BID_CAP,
      label: 'Bid cap',
      bonus: 'Best for controlling bids in the auction',
      disabled: props.campaign.IsSalesAdvantage(),
    },
  ]
})

const changeBidStrategy = (value: any) => {
  props.adgroup.cost_per_result = value

  if (value && props.adgroup.attribution === ATTRIBUTION_SETTING.INCREMENTAL) {
    props.adgroup.attribution = ATTRIBUTION_SETTING.STANDARD
  }

  bidStrageryAutoChange()
}

const tooltip = computed<string>(() => {
  if (props.campaign.IsFBBidCap()) {
    return `• Set a bid control if you want to control your maximum bid in every auction.
    • By setting a bid control, you're telling Meta how to bid on results.
    • If your ad set requires a conversion window, use that to determine your bid control too.
    • If you don't set one, Meta will focus on spending your entire budget and getting the most results.
    • Bid controls are only available with some performance goal selections.`
  }
  if (GroupIs.PerformanceGoalNumber(props.adgroup)) {
    return `• Optimize your campaign for certain performance goals.
    • Don’t set a cost per result goal if you want Meta to focus on spending your entire budget for the most results.
          <a href="https://www.facebook.com/business/help/272336376749096?id=2196356200683573" target="_blank" class="text-blue-500">About cost per result goal</a>`
  }

  if (GroupIs.PerformanceGoalValue(props.adgroup)) {
    return `• If keeping the average return on ad spend around a certain amount is important, enter a ROAS goal.
    • Otherwise, Meta will try to spend your entire budget and get the most purchase value using the highest value bid strategy.
      <a href="https://www.facebook.com/business/help/491846184627504?id=2196356200683573" target="_blank" class="text-blue-500">About ROAS</a>`
  }

  return ''
})

const name = computed<string>(() => {
  if (props.campaign.IsFBBidCap()) {
    return 'Bid control'
  }
  if (GroupIs.PerformanceGoalNumber(props.adgroup)) {
    return `Cost per result goal`
  }

  if (GroupIs.PerformanceGoalValue(props.adgroup)) {
    return `Target ROAS`
  }

  return ''
})

const BidStrategyValueChange = () => {
  if (props.adgroup.cost_per_result) {
    props.adgroup.bid_strategy = BIDSTRATEGY.ROAS_GOAL
  } else {
    props.adgroup.bid_strategy = BIDSTRATEGY.HIGHEST_VOLUME
  }
}

const BidStrategyOffSiteChange = () => {
  if (props.adgroup.cost_per_result) {
    props.adgroup.bid_strategy = BIDSTRATEGY.COST_PER_RESULT_GOAL
  } else {
    props.adgroup.bid_strategy = BIDSTRATEGY.HIGHEST_VOLUME
  }
}

const bidStrageryAutoChange = () => {
  if (GroupIs.PerformanceGoalValue(props.adgroup)) {
    BidStrategyValueChange()
  }

  if (GroupIs.PerformanceGoalNumber(props.adgroup)) {
    BidStrategyOffSiteChange()
  }
}

watch(
  () => props.adgroup.performance_goal,
  async (newValue, oldValue) => {
    bidStrageryAutoChange()
  }
)

const nameBid = `Bid strategy`
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex items-center gap-2">
      <FloatingWrapper :name="name" rounded>
        <n-input-number
          class="w-full"
          v-model:value="props.adgroup.cost_per_result"
          max="1000"
          min="0"
          :precision="GroupIs.PerformanceGoalValue(props.adgroup) ? 3 : 2"
          :placeholder="
            GroupIs.PerformanceGoalValue(props.adgroup) ? 'X.XXX' : 'X.XX'
          "
          :disabled="
            props.campaign.IsFBHighestBid() ||
            props.adgroup.attribution === ATTRIBUTION_SETTING.INCREMENTAL
          "
          :on-update:value="changeBidStrategy"
        >
          <template #prefix v-if="!GroupIs.PerformanceGoalValue(props.adgroup)">
            $
          </template>
        </n-input-number>
        <template #extra>
          <n-popover trigger="hover">
            <template #trigger>
              <n-icon size="14" :component="QuestionCircleRegular"></n-icon>
            </template>
            <span
              v-html="tooltip"
              class="whitespace-pre-line text-xs leading-relaxed"
            ></span>
          </n-popover>
        </template>
      </FloatingWrapper>
    </div>

    <div
      class="flex items-center gap-2"
      v-if="
        props.adgroup.cost_per_result &&
        GroupIs.PerformanceGoalNumber(props.adgroup) &&
        !props.campaign.bid_strategy
      "
    >
      <div class="text-xs font-bold">{{ nameBid }}</div>
      <div class="flex gap-2">
        <div>
          <n-radio-group
            v-model:value="props.adgroup.bid_strategy"
            :disabled="
              props.FreezeData.isEditPage() && !!props.adgroup.ad_group_id
            "
            class="flex gap-8"
          >
            <n-flex vertical v-for="bid in BidStrategyOptions" :key="bid.value">
              <n-radio
                :value="bid.value"
                :label="(bid.label as string)"
                :disabled="bid.disabled"
              />
              <span class="text-xs text-gray-500">{{ bid.bonus }}</span>
            </n-flex>
          </n-radio-group>
        </div>
      </div>
    </div>
  </div>
</template>
