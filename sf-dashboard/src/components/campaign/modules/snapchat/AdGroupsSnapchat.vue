<script setup lang="ts">
import {
  campaignTypeClass,
  FreezeClass,
  StatusCampManager,
} from '@/types/components/campaign-v2'
import { adGroups } from '@/types/components/campaign-v2'

import AdgroupBidding from '@/components/campaign/modules/snapchat/AdgroupBidding.vue'
import AdgroupCreative from './AdgroupCreative.vue'
import AdgroupName from '../adgroup/AdgroupName.vue'
import AdgroupDevice from './AdgroupDevice.vue'
import AdgroupBudget from './AdgroupBudget.vue'
import AdgroupConversionEvent from './AdgroupConversionEvent.vue'
import AdgroupLocation from './AdgroupLocation.vue'
import AdgroupAge from './AdgroupAge.vue'
import AdgroupLanguage from './AdgroupLanguage.vue'
import AdgroupSchedule from './AdgroupSchedule.vue'

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
  return (props.campaign.IsTrafficSnapchat() && props.campaign.IsAPI()) || false
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
      props.campaign.AddDefaultAdgroupSnapChat()
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
      <n-card
        v-show="campaign.demand_source"
        title="Detail"
        class="card-flex-gap-4 rounded-[5px] !border-gray2"
      >
        <AdgroupName :adgroup="adGroup" />
        <AdgroupCreative
          :campaign="campaign"
          :FreezeData="FreezeData"
          :statusData="statusData"
          :adGroup="adGroup"
        />
      </n-card>
      <n-card
        title="Targeting"
        class="card-flex-gap-4 rounded-[5px] !border-gray2"
        v-show="campaign.IsAPI()"
      >
        <AdgroupDevice
          :campaign="campaign"
          :adGroup="adGroup"
          :FreezeData="FreezeData"
        />

        <AdgroupBidding :campaign="campaign" :adGroup="adGroup" />
        <AdgroupBudget :campaign="campaign" :adGroup="adGroup" />
        <AdgroupConversionEvent
          :campaign="campaign"
          :adGroup="adGroup"
          :isDisabled="FreezeData.isEditPage() && !!adGroup.id"
        />

        <AdgroupLocation
          :campaign="campaign"
          :FreezeData="FreezeData"
          :statusData="statusData"
          :adGroup="adGroup"
          ref="locationComp"
        />

        <AdGroupSCGender :campaign="campaign" :adGroup="adGroup" />
        <AdgroupAge :campaign="campaign" :adGroup="adGroup" />
        <AdgroupLanguage
          :campaign="campaign"
          :FreezeData="FreezeData"
          :adGroup="adGroup"
        />

        <AdgroupSchedule
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
