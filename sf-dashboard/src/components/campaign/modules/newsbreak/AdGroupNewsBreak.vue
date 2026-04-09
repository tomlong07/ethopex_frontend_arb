<script setup lang="ts">
import {
  campaignTypeClass,
  FreezeClass,
  StatusCampManager,
} from '@/types/components/campaign-v2'
import { adGroups } from '@/types/components/campaign-v2'
import AdGroupBudget from './AdGroupBudget.vue'
import AdgroupName from '../adgroup/AdgroupName.vue'
import AdgroupStatus from '../adgroup/AdgroupStatus.vue'
import AdGroupLanguage from './AdGroupLanguage.vue'
import AdGroupAgeGroup from './AdGroupAgeGroup.vue'
import AdGroupDeliveryType from './AdGroupDeliveryType.vue'
import AdGroupFrequencyCaps from './AdGroupFrequencyCaps.vue'
import ScheduleNewsBreak from './ScheduleNewsBreak.vue'
import NewsBreakPixel from './NewsBreakPixel.vue'

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
  return (
    (props.campaign.IsTrafficNewsbreak() && props.campaign.IsAPI()) || false
  )
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
    if (!newValue) {
      props.campaign.ad_groups = undefined
    }
  },
  { immediate: true }
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

const isDev = window.arb.isDev()
</script>

<template>
  <n-card v-if="isShow" class="card-flex-gap-4 rounded-[5px] !border-gray2">
    <template #header>
      <div class="flex justify-between gap-4">
        <div>Ad Groups</div>
      </div>
    </template>

    <template #header-extra v-if="isDev"
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
        <AdGroupNBCreative
          :campaign="campaign"
          :adgroup="adGroup"
          :FreezeData="FreezeData"
          :statusData="statusData"
        />
        <NewsBreakPixel
          :adgroup="adGroup"
          :campaign="campaign"
          :FreezeData="FreezeData"
        />
      </n-card>

      <n-card class="card-flex-gap-4" title="Budget & schedule">
        <AdGroupBudget
          :adgroup="adGroup"
          :campaign="campaign"
          :FreezeData="FreezeData"
        />
        <AdGroupNBBidding
          :adgroup="adGroup"
          :campaign="campaign"
          :FreezeData="FreezeData"
        />
        <AdGroupDeliveryType
          :adgroup="adGroup"
          :campaign="campaign"
          :FreezeData="FreezeData"
        />
        <AdGroupFrequencyCaps
          :adgroup="adGroup"
          :campaign="campaign"
          :FreezeData="FreezeData"
        />
        <AdGroupNBSchedule
          :adgroup="adGroup"
          :campaign="campaign"
          :FreezeData="FreezeData"
        />
        <ScheduleNewsBreak :adgroup="adGroup" :campaign="campaign" />
      </n-card>

      <n-card class="card-flex-gap-4" title="Audience controls">
        <AdGroupLanguage
          :campaign="campaign"
          :adgroup="adGroup"
          :FreezeData="FreezeData"
        />
        <AdGroupNBGender
          :campaign="campaign"
          :adgroup="adGroup"
          :FreezeData="FreezeData"
        />
        <AdGroupAgeGroup
          :campaign="campaign"
          :adgroup="adGroup"
          :FreezeData="FreezeData"
        />
      </n-card>
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
