<script setup lang="ts">
import {
  campaignTypeClass,
  FreezeClass,
  StatusCampManager,
  adGroups,
} from '@/types/components/campaign-v2'
import AdGroupConversionLocation from '@/components/campaign/modules/facebook/AdGroupConversionLocation.vue'
import AdGroupPerformanceGoal from '@/components/campaign/modules/facebook/AdGroupPerformanceGoal.vue'
import AdGroupPixel from '@/components/campaign/modules/facebook/AdGroupPixel.vue'
import AdGroupBiddingAndBudget from '@/components/campaign/modules/facebook/AdGroupBiddingAndBudget.vue'
import AdGroupSchedule from '@/components/campaign/modules/facebook/AdGroupSchedule.vue'
import AdGroupLocations from '@/components/campaign/modules/facebook/AdGroupLocations.vue'
import AdGroupLanguageMultiple from '@/components/campaign/modules/facebook/AdGroupLanguageMultiple.vue'
import AdGroupGender from '@/components/campaign/modules/facebook/AdGroupGender.vue'
import AdGroupAge from '@/components/campaign/modules/facebook/AdGroupAge.vue'
import AdGroupCostPerResultGoal from '@/components/campaign/modules/facebook/AdGroupCostPerResultGoal.vue'
import AdGroupURL from '@/components/campaign/modules/facebook/AdGroupURL.vue'
import AdGroupConversionEvent from '@/components/campaign/modules/facebook/AdGroupConversionEvent.vue'
import AdGroupInterests from '@/components/campaign/modules/facebook/AdGroupInterests.vue'
import AdGroupAttributionSetting from '@/components/campaign/modules/facebook/AdGroupAttributionSetting.vue'
import AdgroupBeneficiary from '@/components/campaign/modules/facebook/AdgroupBeneficiary.vue'
import AdGroupAdScheduling from '@/components/campaign/modules/facebook/AdGroupAdScheduling.vue'

import AdgroupName from '@/components/campaign/modules/adgroup/AdgroupName.vue'
import AdgroupStatus from '@/components/campaign/modules/adgroup/AdgroupStatus.vue'

import AdGroupPlacementV2 from './AdGroupPlacementV2.vue'
import { INEX, ONOFF, PLACEMENT_TYPE } from '@/enum/campaign'
import AdGroupTag from '../adgroup/AdGroupTag.vue'
import AdGroupAudienceType from './AdGroupAudienceType.vue'

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
  return (props.campaign.IsTrafficFacebook() && props.campaign.IsAPI()) || false
})

const isCompany = window.arb.isCompany()
const isDev = window.arb.isDev()

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
      props.campaign.AddDefaultAdgroupFB()
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

    // if (props.campaign.ad_groups) {
    //   if (
    //     props.FreezeData.isDuplicatePageV2() &&
    //     props.campaign.ad_groups.length
    //   ) {
    //     props.campaign.ad_groups.splice(1, props.campaign.ad_groups.length - 1) // Xóa từ index 1 đến hết

    //     return
    //   }
    // }
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

const isShowPlacement = computed<boolean>(() => {
  return props.campaign.IsAPI()
})

const isHasEU = (adgroup: adGroups) => {
  return adgroup?.location?.value?.some((countryCode) =>
    helper.isEUCountry(countryCode)
  )
}

watch(
  () => props.campaign.ad_groups?.length,
  (v: number | undefined) => {
    if (v && v >= 2 && props.campaign.advantage_campaign_budget === ONOFF.OFF) {
      props.campaign.SetCampSetUpManual()
    } else {
      props.campaign.SetCampSetUpAdvantage()
    }
  }
)
</script>

<template>
  <div class="flex flex-col gap-4" v-if="isShow">
    <n-card class="card-flex-gap-4 rounded-[5px] !border-gray2">
      <template #header>
        <n-ellipsis class="w-[420px] lg:w-[800px]">
          {{ adGroup?.name ? adGroup.name : 'Ad Set' }}
        </n-ellipsis>
      </template>
      <template #header-extra v-if="isDev && props.FreezeData.isEditPage()"
        ><div class="text-xs text-gray-500">
          ID: {{ adGroup?.ad_group_id }}
        </div></template
      >
      <AdgroupName :adgroup="adGroup" />
      <AdgroupStatus
        :campaign="campaign"
        :adgroup="adGroup"
        :FreezeData="FreezeData"
      />
      <CampaignFBDeliveryStatus
        :data="adGroup"
        v-if="FreezeData.isEditPage()"
        class1="text-xs font-bold"
      />
    </n-card>

    <n-card
      class="card-flex-gap-4 rounded-[5px] !border-gray2"
      title="Conversion"
    >
      <AdGroupConversionLocation :FreezeData="FreezeData" :adgroup="adGroup" />
      <AdGroupPerformanceGoal
        :FreezeData="FreezeData"
        :campaign="campaign"
        :adgroup="adGroup"
      />

      <AdGroupPixel
        :adgroup="adGroup"
        :campaign="campaign"
        :FreezeData="FreezeData"
        :statusData="statusData"
      />

      <AdGroupConversionEvent
        :campaign="campaign"
        :adgroup="adGroup"
        :FreezeData="FreezeData"
      />

      <AdGroupCostPerResultGoal
        :adgroup="adGroup"
        :campaign="campaign"
        :FreezeData="FreezeData"
      />
      <AdGroupAttributionSetting
        :campaign="campaign"
        :adgroup="adGroup"
        :FreezeData="FreezeData"
      />
    </n-card>

    <n-card
      class="card-flex-gap-4 rounded-[5px] !border-gray2"
      title="Budget & schedule"
    >
      <AdGroupBiddingAndBudget
        :adgroup="adGroup"
        :campaign="campaign"
        :isEditPage="FreezeData.isEditPage()"
      />

      <AdGroupSchedule :adgroup="adGroup" :FreezeData="FreezeData" />
      <AdGroupAdScheduling
        :campaign="campaign"
        :adgroup="adGroup"
        :FreezeData="FreezeData"
      />
    </n-card>

    <n-card class="card-flex-gap-4 rounded-[5px] !border-gray2">
      <template #header>
        <div class="flex items-center justify-between">
          <span>Audience controls</span>
          <AdGroupTag
            :index="index"
            :campaign="props.campaign"
            type="audience"
          />
        </div>
      </template>
      <AdGroupAudienceType
        :campaign="campaign"
        :FreezeData="FreezeData"
        :index="index"
      />
      <AdGroupLocations
        :adgroup="adGroup"
        :campaign="campaign"
        :FreezeData="FreezeData"
        :statusData="statusData"
      />
      <AdGroupLanguageMultiple
        :adgroup="adGroup"
        :campaign="campaign"
        :FreezeData="FreezeData"
        :statusData="statusData"
      />
      <AdGroupAge :adgroup="adGroup" :campaign="campaign" />
      <AdGroupGender
        :campaign="campaign"
        :FreezeData="FreezeData"
        :index="index"
        v-if="adGroup.audience_type === PLACEMENT_TYPE.MANUAL"
      />

      <AdGroupInterests
        :campaign="campaign"
        :FreezeData="FreezeData"
        :index="index"
        v-if="adGroup.audience_type === PLACEMENT_TYPE.MANUAL"
      />
    </n-card>

    <n-card
      title="Beneficiary and payer"
      class="card-flex-gap-4 rounded-[5px] !border-gray2"
      v-if="isHasEU(adGroup) || adGroup?.location?.type === INEX.EXCLUDE"
    >
      <AdgroupBeneficiary :adgroup="adGroup" :FreezeData="FreezeData" />
    </n-card>

    <n-card
      v-if="isCompany"
      title="Tracking"
      class="card-flex-gap-4 rounded-[5px] !border-gray2"
    >
      <AdGroupURL
        :campaign="campaign"
        :FreezeData="FreezeData"
        :index="index"
      />
    </n-card>

    <n-card
      class="card-flex-gap-4 rounded-[5px] !border-gray2"
      v-show="isShowPlacement"
    >
      <template #header>
        <div class="flex items-center justify-between">
          <span>Placements</span>
          <AdGroupTag
            :index="index"
            :campaign="props.campaign"
            type="placements"
          />
        </div>
      </template>
      <AdGroupPlacementV2
        :campaign="campaign"
        :FreezeData="FreezeData"
        :index="index"
      />
    </n-card>
  </div>
</template>
