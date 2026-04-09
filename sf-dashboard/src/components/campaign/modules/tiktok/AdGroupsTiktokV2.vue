<script setup lang="ts">
import {
  campaignTypeClass,
  FreezeClass,
  StatusCampManager,
} from '@/types/components/campaign-v2'
import { adGroups } from '@/types/components/campaign-v2'

import AdGroupLocationTT from './AdGroupLocationTT.vue'
import AdGroupScheduleTT from './AdGroupScheduleTT.vue'

import AdgroupName from '@/components/campaign/modules/adgroup/AdgroupName.vue'
import AdgroupStatus from '@/components/campaign/modules/adgroup/AdgroupStatus.vue'
import AdGroupCreativeTT from './AdGroupCreativeTT.vue'

import TiktokPixel from './TiktokPixel.vue'
import OptimizationEvent from './OptimizationEvent.vue'
import Gender from './Gender.vue'
import AgeGroup from './AgeGroup.vue'
import InterestBehavior from './InterestBehavior.vue'
import Placement from './Placement.vue'

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

const isShow = computed<boolean>(() => {
  return (props.campaign.IsTrafficTiktok() && props.campaign.IsAPI()) || false
})

const index = computed(() => props.statusData.adGroupIndex || 0)
const adGroup = computed<adGroups | any>(() => {
  if (!props.campaign.ad_groups) return undefined
  return props.campaign.ad_groups[index.value]
})

watch(
  () => isShow.value,
  async (newValue, oldValue) => {
    if (props.FreezeData.isEditPage()) {
      return
    }

    if (newValue) {
      props.campaign.AddDefaultAdgroupTT()
    } else {
      props.campaign.ad_groups = undefined
    }
  }
)

watch(
  () => props.campaign.campaign_type,
  async (newValue, oldValue) => {
    if (props.FreezeData.isEditPage() || !isShow.value) {
      return
    }

    if (props.campaign.ad_groups) {
      for (let index = 0; index < props.campaign.ad_groups.length; index++) {
        props.campaign.ad_groups[index].creatives = []
        props.campaign.ad_groups[index].audience = null
      }
    }
  }
)

watch(
  () => props.campaign.account_supply_id,
  async (newValue, oldValue) => {
    if (props.campaign.IsManual()) {
      return
    }

    if (props.campaign.ad_groups) {
      for (let index = 0; index < props.campaign.ad_groups.length; index++) {
        props.campaign.ad_groups[index].pixel = null
        props.campaign.ad_groups[index].conversion_event = null
      }
    }
  }
)

watch(
  () => props.campaign.type,
  async (newValue, oldValue) => {
    await nextTick()

    if (props.campaign.ad_groups) {
      for (let index = 0; index < props.campaign.ad_groups.length; index++) {
        props.campaign.ad_groups[index].pixel = null
        props.campaign.ad_groups[index].conversion_event = null
        props.campaign.ad_groups[index].optimization_event = null
      }
    }
  }
)

watch(
  () => props.campaign.campaign_setup,
  async (newValue, oldValue) => {
    if (props.campaign.IsManual()) {
      return
    }

    if (props.campaign.ad_groups && props.campaign.IsTrafficTiktok()) {
      if (props.campaign.ad_groups.length > 1) {
        props.campaign.ad_groups.splice(1, props.campaign.ad_groups.length - 1) // Xóa từ index 1 đến hết
        window.message.warning('Only one adgroup when in smart mode')
        return
      }
    }
  }
)

watch(
  () => props.campaign.IsFBHighestBid(),
  async (newValue, oldValue) => {
    if (props.campaign.IsManual()) {
      return
    }

    if (newValue) {
      props.campaign.ad_groups?.forEach((adgroup) => {
        adgroup.cost_per_result = null
      })
    }
  }
)

const hideConversions = computed(() => {
  return props.campaign.type !== 'WEB_CONVERSIONS'
})
const isDev = window.arb.isDev()
</script>

<template>
  <n-card v-if="isShow" class="card-flex-gap-4 rounded-[5px] !border-gray2">
    <template #header>
      <div class="flex justify-between gap-4">
        <div>Ad Groups</div>
      </div>
    </template>

    <template #header-extra v-if="isDev && props.FreezeData.isEditPage()"
      ><div class="text-xs text-gray-500">
        ID: {{ adGroup?.ad_group_id }}
      </div></template
    >

    <div class="flex flex-col gap-4">
      <n-card class="card-flex-gap-4" title="Detail">
        <AdgroupName :adgroup="adGroup" />

        <AdgroupStatus
          :campaign="campaign"
          :adgroup="adGroup"
          :FreezeData="FreezeData"
        />

        <AdGroupDeliveryStatus
          :data="adGroup"
          v-if="FreezeData.isEditPage()"
          class1="text-xs font-bold"
        />

        <AdGroupCreativeTT
          :campaign="campaign"
          :adgroup="adGroup"
          :FreezeData="FreezeData"
          :statusData="statusData"
        />
      </n-card>
      <n-card
        class="card-flex-gap-4"
        title="Conversion"
        v-show="!hideConversions"
      >
        <TiktokPixel
          :adgroup="adGroup"
          :campaign="campaign"
          :FreezeData="FreezeData"
          :statusData="statusData"
        />
        <OptimizationEvent
          :campaign="campaign"
          :adgroup="adGroup"
          :FreezeData="FreezeData"
          :statusData="statusData"
        />
      </n-card>

      <n-card class="card-flex-gap-4" title="Budget & schedule">
        <AdGroupTikTokBudget
          :adgroup="adGroup"
          :campaign="campaign"
          :FreezeData="FreezeData"
        />
        <CampaignTTBidding
          :adgroup="adGroup"
          :campaign="campaign"
          :FreezeData="FreezeData"
        />

        <AdGroupScheduleTT
          :campaign="campaign"
          :adgroup="adGroup"
          :FreezeData="FreezeData"
        />

        <CampaignTTSchedule :adgroup="adGroup" :campaign="campaign" />
      </n-card>

      <n-card class="card-flex-gap-4" title="Audience controls">
        <AdGroupLocationTT
          :campaign="campaign"
          :adgroup="adGroup"
          :FreezeData="FreezeData"
          :statusData="statusData"
        />
        <AdGroupTikTokLanguageMultiple
          :campaign="campaign"
          :adgroup="adGroup"
          :FreezeData="FreezeData"
        />
        <Gender :adgroup="adGroup" :campaign="campaign" />

        <AgeGroup :adgroup="adGroup" :campaign="campaign" />

        <InterestBehavior
          :adgroup="adGroup"
          :campaign="campaign"
          :FreezeData="FreezeData"
        />
      </n-card>
      <Placement
        :adgroup="adGroup"
        :campaign="campaign"
        :FreezeData="FreezeData"
      />
    </div>
  </n-card>
</template>

<style lang="scss">
.n-tabs .n-tabs-tab.tab-wrapper-adgroup {
  .n-tabs-tab__label {
    display: block;
    max-width: 120px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
}
</style>
