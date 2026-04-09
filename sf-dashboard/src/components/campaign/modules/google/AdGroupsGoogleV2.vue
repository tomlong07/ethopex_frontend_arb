<script setup lang="ts">
import {
  campaignTypeClass,
  FreezeClass,
  StatusCampManager,
  newAdGroup,
  adGroups,
} from '@/types/components/campaign-v2'
import AdGroupCreative from '@/components/campaign/modules/google/AdGroupCreative.vue'
import AdGroupAudience from '@/components/campaign/modules/google/AdGroupAudience.vue'
import AdGroupKeywordPlan from '@/components/campaign/modules/google/AdGroupKeywordPlan.vue'
import AdGroupKeywordGoogleSearch from '@/components/campaign/modules/google/AdGroupKeywordGoogleSearch.vue'
import AdGroupSearchThemes from '@/components/campaign/modules/google/AdGroupSearchThemes.vue'
import AdGroupLocation from '@/components/campaign/modules/google/AdGroupLocation.vue'
import AdGroupBidding from '@/components/campaign/modules/google/AdGroupBidding.vue'
import AdgroupName from '@/components/campaign/modules/adgroup/AdgroupName.vue'
import AdgroupStatus from '@/components/campaign/modules/adgroup/AdgroupStatus.vue'

import helper from '@/utils/helper'
import AdGroupPlacements from '@/components/google_exclude_list/GGExcludePlacements.vue'

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
  return (props.campaign.IsTrafficGoogle() && props.campaign.IsAPI()) || false
})
const isDev = window.arb.isDev()

const index = computed(() => props.statusData.adGroupIndex || 0)
const adGroup = computed<adGroups | any>(() => {
  if (!props.campaign.ad_groups) return undefined
  return props.campaign.ad_groups[index.value]
})

onMounted(() => {
  if (isShow.value) {
    if (!props.campaign.ad_groups) {
      if (props.FreezeData.isAddPage()) {
        props.campaign.AddDefaultAdgroup()
      }

      if (props.FreezeData.isEditPage()) {
        props.campaign.ad_groups = []
      }
    }
  }
})

watch(
  () => isShow.value,
  async (newValue, oldValue) => {
    if (props.FreezeData.isEditPage()) {
      return
    }

    if (newValue) {
      props.campaign.AddDefaultAdgroup()
    } else {
      props.campaign.ad_groups = undefined
    }
  }
)

// Changing campaign_type resets all ad groups, keeping only the name
watch(
  () => props.campaign.campaign_type,
  async (newValue, oldValue) => {
    if (props.FreezeData.isEditPage() || !isShow.value) {
      return
    }

    if (props.campaign.IsGGDisplay()) {
      //Camp display ko có cpc ở cấp camp
      props.campaign.cpc = undefined
    }

    if (props.campaign.ad_groups) {
      //Pmax chỉ có 1 ad group
      if (props.campaign.IsPMax() && props.campaign.ad_groups.length > 1) {
        props.campaign.ad_groups = [props.campaign.ad_groups[0]]
      }

      const cloneAdGroups = helper.clone(props.campaign.ad_groups)

      for (let index = 0; index < props.campaign.ad_groups.length; index++) {
        props.campaign.ad_groups[index] = newAdGroup(cloneAdGroups[index].name)
      }
    }
  }
)

watch(
  () => props.campaign.account_supply_id,
  async (newValue, oldValue) => {
    if (props.FreezeData.isEditPage() || props.campaign.IsManual()) {
      return
    }

    if (props.campaign.ad_groups) {
      props.campaign.ad_groups.forEach((adgroup) => {
        adgroup.audience = null
      })
    }
  }
)
</script>

<template>
  <n-card v-if="isShow" class="card-flex-gap-4 rounded-[5px] !border-gray2">
    <template #header>
      <div class="flex justify-between gap-4">
        <div>
          {{ props.campaign.IsPMax() ? 'Asset Groups' : 'Ad Groups' }}
        </div>
      </div>
    </template>

    <template #header-extra v-if="isDev && props.FreezeData.isEditPage()"
      ><div class="text-xs text-gray-500">
        ID: {{ adGroup?.ad_group_id }}
      </div></template
    >

    <div class="flex flex-col gap-4">
      <AdgroupName :adgroup="adGroup" />

      <AdgroupStatus
        :campaign="campaign"
        :adgroup="adGroup"
        :FreezeData="FreezeData"
        v-if="!props.campaign.IsPMax()"
      />
      <CampaignGGDeliveryStatus
        v-if="FreezeData.isEditPage() && !props.campaign.IsPMax()"
        :data="adGroup"
      />
      <AdGroupCreative
        :adgroup="adGroup"
        :campaign="campaign"
        :FreezeData="FreezeData"
        :statusData="statusData"
        :index="index"
      />
      <AdGroupPlacements
        :adgroup="adGroup"
        :statusData="statusData"
        :isAdGroup="true"
        v-if="props.campaign.IsGGDisplay()"
        :FreezeData="FreezeData"
      />
      <AdGroupSearchThemes
        :adgroup="adGroup"
        :campaign="campaign"
        :FreezeData="FreezeData"
      />

      <AdGroupAudience
        :campaign="campaign"
        :statusData="statusData"
        :FreezeData="FreezeData"
        :index="index"
      />

      <AdGroupKeywordPlan
        :adgroup="adGroup"
        :campaign="campaign"
        :FreezeData="FreezeData"
      />
      <AdGroupKeywordGoogleSearch
        :adgroup="adGroup"
        :campaign="campaign"
        :FreezeData="FreezeData"
      />
      <AdGroupLocation
        :adgroup="adGroup"
        :statusData="statusData"
        :campaign="campaign"
        :FreezeData="FreezeData"
      />
      <AdGroupGGLanguageMultiple
        :campaign="campaign"
        :statusData="statusData"
        :FreezeData="FreezeData"
        :index="index"
      />
      <AdGroupBidding
        :campaign="campaign"
        :FreezeData="FreezeData"
        :index="index"
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
