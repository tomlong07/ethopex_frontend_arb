<script lang="ts" setup>
import Bling from '@/assets/icons/Bling.vue'
import { ONOFF, PLACEMENT_TYPE } from '@/enum/campaign'
import { campaignTypeClass } from '@/types/components/campaign-v2'

const props = defineProps({
  campaign: {
    type: Object as () => campaignTypeClass,
    required: true,
  },
  type: {
    type: String as PropType<'placements' | 'audience' | 'budget'>,
    // required: true,
  },
  index: {
    type: Number,
  },
})

const isAdvantage = computed(() => {
  switch (props.type) {
    case 'placements':
      if (props.index === null || typeof props.index !== 'number') return false
      return (
        props.campaign.ad_groups &&
        props.campaign.ad_groups[props.index]?.placement_type ===
          PLACEMENT_TYPE.ADVANTAGE
      )
    case 'audience':
      if (props.index === null || typeof props.index !== 'number') return false
      return (
        props.campaign.ad_groups &&
        props.campaign.ad_groups[props.index]?.audience_type ===
          PLACEMENT_TYPE.ADVANTAGE
      )
    case 'budget':
      return !(
        props.campaign.advantage_campaign_budget === ONOFF.OFF &&
        props.campaign?.ad_groups &&
        props.campaign?.ad_groups?.length > 1
      )
    default:
      return false
  }
})

const messageToolTip = computed(() => {
  switch (props.type) {
    case 'placements':
      return "You're including all available placements for all ad sets."
    case 'audience':
      return "You're either using the recommended setup or your settings are suggestions, in at least one ad set."
    case 'budget':
      return "You're using Campaign budget (or have a single ad set)."
    default:
      return false
  }
})
</script>
<template>
  <n-tooltip trigger="hover" placement="top" :show-arrow="false">
    <template #trigger>
      <n-tag
        class="n-tag-exclude"
        round
        size="small"
        :type="isAdvantage ? 'success' : undefined"
        :text-color="isAdvantage ? '#e2e8f0' : '#333'"
      >
        <div class="flex items-center gap-1">
          <n-icon
            :component="Bling"
            :color="isAdvantage ? '#18a058' : '#64748b'"
          />
          <span
            class="font-semibold"
            :class="isAdvantage ? '' : 'text-dark-mode'"
          >
            Advantage+ {{ isAdvantage ? 'On' : 'Off' }}
          </span>
        </div>
      </n-tag>
    </template>
    {{ messageToolTip }}
  </n-tooltip>
</template>
