<script lang="ts" setup>
import Bling from '@/assets/icons/Bling.vue'
import SlashCircle from '@/assets/icons/SlashCircle.vue'
import CircleNone from '@/assets/icons/CircleNone.vue'
import Tick2 from '@/assets/icons/Tick2.vue'
import { ONOFF, PLACEMENT_TYPE } from '@/enum/campaign'
import {
  campaignTypeClass,
  typeObjectOptionsFB,
  FreezeClass,
  StatusCampManager,
} from '@/types/components/campaign-v2'

import { useLocale } from '@/lang/messages'
import ScoreCampaign from './ScoreCampaign.vue'
const FBMess = useLocale(
  () => import('@/lang/vi/facebook'),
  () => import('@/lang/en/facebook')
)

const props = defineProps({
  campaign: {
    type: Object as () => campaignTypeClass,
    required: true,
  },

  FreezeData: {
    type: Object as () => FreezeClass,
    required: true,
  },

  statusData: {
    type: Object as () => StatusCampManager,
    required: true,
  },
})

const isCampAdvantage = computed(() => {
  return props.campaign.campaign_setup === PLACEMENT_TYPE.ADVANTAGE
})

const findNameObjective = () => {
  const label: any =
    typeObjectOptionsFB?.find((item) => item.value === props.campaign.type)
      ?.label || ''

  return label.toLocaleLowerCase()
}

const campaignAdvantages = computed<any>(() => {
  const adGroups = props.campaign?.ad_groups || []

  const isBudgetAdvantage = !(
    props.campaign?.advantage_campaign_budget === ONOFF.OFF &&
    adGroups.length > 1
  )

  const isPlacementAdvantage = adGroups.every(
    (item) => item.placement_type === PLACEMENT_TYPE.ADVANTAGE
  )

  const isAudienceAdvantage = adGroups.some(
    (item) => item.audience_type === PLACEMENT_TYPE.ADVANTAGE
  )

  return {
    isBudgetAdvantage,
    isPlacementAdvantage,
    isAudienceAdvantage,
  }
})

const advantageItems = computed(() => [
  {
    key: 'isBudgetAdvantage',
    title: 'Budget',
    message: `You're using <strong>Campaign budget</strong> (or have a single ad set).`,
  },
  {
    key: 'isAudienceAdvantage',
    title: 'Audience',
    message: `You're either using the recommended setup or your settings are suggestions, in at least one ad set.`,
  },
  {
    key: 'isPlacementAdvantage',
    title: 'Placements',
    message: `You're including all available placements for all ad sets.`,
  },
])
</script>
<template>
  <div class="sticky top-16 min-w-[250px] flex flex-col gap-4">
    <n-card
      class="rounded-lg !border-gray2"
      v-if="campaign.IsInvalidPerformanceGoalFB()"
    >
      <template #header>
        <div class="text-sm font-semibold text-red-600 flex items-center gap-2">
          <n-icon :component="SlashCircle" size="16" />Error
        </div>
      </template>
      <div class="text-xs text-gray-500">
        {{ FBMess.per_goal }}
      </div>
    </n-card>

    <n-card class="rounded-lg !border-gray2">
      <template #header>
        <div class="flex justify-between items-center gap-2">
          <div class="flex items-center gap-2 text-sm">
            <n-icon :component="Bling" />
            <span> Advantage+ {{ findNameObjective() }} campaign </span>
          </div>
          <n-tag
            class="n-tag-exclude"
            :type="isCampAdvantage ? 'success' : undefined"
            size="small"
            round
          >
            {{ isCampAdvantage ? 'On' : 'Off' }}</n-tag
          >
        </div>
      </template>
      <div class="flex flex-col space-y-4">
        <div
          v-for="item in advantageItems"
          :key="item.key"
          class="advantage-item"
        >
          <div class="title flex items-center gap-2 text-sm">
            <n-icon
              v-if="campaignAdvantages[item.key]"
              :component="Tick2"
              size="15"
              color="#007e59"
            />
            <n-icon v-else :component="CircleNone" size="15" color="#aeadad" />
            {{ item.title }}
          </div>
          <div class="message text-xs pl-6" v-html="item.message"></div>
        </div>
      </div>
    </n-card>
    <ScoreCampaign
      v-if="FreezeData.isEditPage()"
      :campaign="campaign"
      :FreezeData="FreezeData"
      :statusData="statusData"
    />
  </div>
</template>
