<script setup lang="ts">
import {
  campaignTypeClass,
  newCampaignClass,
  FreezeClass,
  StatusCampManager,
} from '@/types/components/campaign-v2'

import Skeleton from '@/components/skeleton/CampaignSkeleton.vue'

import {
  campComputed,
  campWatch,
  campMethod,
} from '@/components/campaign/composables/campaign'

import BackPage from '@/components/common/BackPage.vue'
import { ctr_campaign } from '@/services/ctr_campaign'
import { TS } from '@/enum/campaign'
import NavBarCampaign from '@/components/campaign/layout/NavBarCampaign.vue'
import { useFeSettings } from '@/composables/feSettings'
import AdGroupGeneralWrapper from '@/components/campaign/modules/adgroup/AdGroupGeneralWrapper.vue'
import AdCreativeGeneralWrapper from '@/components/campaign/modules/adcreative/AdCreativeGeneralWrapper.vue'

import DemandSource from '@/components/campaign/modules/DemandSource.vue'
import PolicyReview from '@/components/campaign/modules/PolicyReview.vue'
import HeaderExtra from '@/components/campaign/modules/HeaderExtra.vue'
import Name from '@/components/campaign/modules/Name.vue'
import StatusComp from '@/components/campaign/modules/StatusComp.vue'
import AccountSupply from '@/components/campaign/modules/AccountSupply.vue'
import TrafficSourceID from '@/components/campaign/modules/TrafficSourceID.vue'
import Prelanding from '@/components/campaign/modules/Prelanding.vue'
import PrelandingDomain from '@/components/campaign/modules/PrelandingDomain.vue'
import CreateLandingPageByCreative from '@/components/campaign/modules/CreateLandingPageByCreative.vue'
import Tag from '@/components/campaign/modules/Tag.vue'
import CategorySiteBuilder from '@/components/campaign/modules/CategorySiteBuilder.vue'
import LandingPage from '@/components/campaign/modules/LandingPage.vue'
import LandingPagePrelander from '@/components/campaign/modules/LandingPagePrelander.vue'
import KeywordMacro from '@/components/campaign/modules/KeywordMacro.vue'
import UserFlow from '@/components/campaign/modules/UserFlow.vue'
import Vertical from '@/components/campaign/modules/Vertical.vue'
import GD from '@/components/campaign/modules/GD.vue'
import AdFormats from '@/components/campaign/modules/AdFormats.vue'
import MainKeyword from '@/components/campaign/modules/MainKeyword.vue'
import SecondaryKeyword from '@/components/campaign/modules/SecondaryKeyword.vue'
import KeywordSet from '@/components/campaign/modules/KeywordSet.vue'
import ToolKW from '@/components/campaign/modules/ToolKW.vue'
import DirectLink from '@/components/campaign/modules/DirectLink.vue'
import PricingRule from '@/components/campaign/modules/PricingRule.vue'
import Labels from '@/components/campaign/modules/Labels.vue'
import CreateCampaign from '@/components/campaign/modules/CreateCampaign.vue'
import Objective from '@/components/campaign/modules/Objective.vue'
import ActionButtonsV2 from '@/components/campaign/modules/ActionButtonsV2.vue'
import BudgetOptimization from '@/components/campaign/modules/tiktok/BudgetOptimization.vue'
import OptimizationGoal from '@/components/campaign/modules/tiktok/OptimizationGoal.vue'

import URLs from '@/components/campaign/modules/URLs.vue'
import PixelTable from '@/components/campaign/modules/PixelTable.vue'
import TriggerTable from '@/components/campaign/modules/TriggerTable.vue'
import PurchaseValue from '@/components/campaign/modules/PurchaseValue.vue'
const demandComp = ref<InstanceType<typeof DemandSource>>()

const traffic_source = TS.TIKTOK
const isComp = window.arb.isCompany()

const FreezeData = helper.deepFreeze(
  new FreezeClass(window.route)
) as FreezeClass

const campaign = ref<campaignTypeClass>(
  FreezeData.isAddPage()
    ? newCampaignClass(traffic_source)
    : new campaignTypeClass({})
)

const statusData = ref(new StatusCampManager())
const feSettings = toRef(statusData.value, 'feSettings')

useFeSettings(feSettings, window.route?.meta?.url as string)

const watchs = campWatch()
const methods = campMethod(campaign, FreezeData, statusData)

const getLocationNames = (adGroups: any[]) => {
  // Trường hợp chọn ALL Countries
  if (adGroups.some((adGroup) => adGroup.location?.value?.includes('ALL'))) {
    return ['All Countries']
  }

  // Lọc các location từ adGroups trùng với optionsLocationTT
  const matchingLocationCodes = adGroups.flatMap(
    (adGroup) =>
      adGroup.location?.value?.flatMap((location: string) =>
        statusData.value.optionsLocationTT
          .filter((item) => item.value === location)
          .map((item) => item.code)
      ) || []
  )

  const hasMore = matchingLocationCodes.length > 5
  let locations = [...new Set(matchingLocationCodes)]
  const name = locations.slice(0, 5).join(', ') + (hasMore ? '...' : '')

  return name ? [name] : []
}

const getLanguageNames = (adGroups: any[]) => {
  if (adGroups.some((adGroup) => adGroup.language?.includes('ALL'))) {
    return ['All Languages']
  }

  const allLanguages = adGroups.flatMap((adGroup) => adGroup.language || [])

  const uniqueLanguages = [...new Set(allLanguages)]

  if (uniqueLanguages.length === 0) {
    return []
  }

  const hasMore = uniqueLanguages.length > 5
  const name = uniqueLanguages.slice(0, 5).join(', ') + (hasMore ? '...' : '')

  return [name]
}
const displayName = computed(() => {
  if (!campaign.value.traffic_source) {
    return ''
  }

  let result =
    (campaign.value?.id ? `${campaign.value?.id}: ` : '') +
    `${helper.capitalizeFirstLetter(campaign.value.traffic_source)} -> `

  let nameArr: string[] = []

  if (campaign.value.ad_groups?.length) {
    nameArr.push(...getLocationNames(campaign.value.ad_groups))
  }

  if (campaign.value.demand_source) {
    nameArr.push(demandComp?.value?.demandSourceName || '')
  }

  if (campaign.value.ad_groups?.length) {
    nameArr.push(...getLanguageNames(campaign.value.ad_groups))
  }

  if (campaign.value?.origin_name) {
    nameArr.push(campaign.value.origin_name)
  }

  if (nameArr.length) {
    result += nameArr.join(' - ')
  }

  return result || ''
})

const computeds = campComputed(campaign, FreezeData, statusData, displayName)
watchs.watchDisplayName(displayName, FreezeData, statusData)

const fetchDuplicate = async () => {
  statusData.value.isLoading = true

  const result = await ctr_campaign.Duplicate(FreezeData.duplicateId)

  if (result?.status) {
    campaign.value = new campaignTypeClass(result?.data || {})

    // campaign.value = new campaignTypeClass(campData.data || {})
    copyHandle()
  }
  campaign.value.HandleDuplicate()

  statusData.value.isLoading = false
}

//Repair data for duplicate from other traffic source
const copyHandle = async () => {
  if (!FreezeData.isCopy) {
    return
  }
}

onBeforeMount(() => {
  methods.beforeMountHandle()
  methods.fetchPermission(traffic_source)
})

onMounted(async () => {
  await methods.onMountedHandle(fetchDuplicate, traffic_source)
})

const submitForm = async () => {
  methods.submitForm(computeds.payload, feSettings)
}
</script>
<template>
  <div class="wrapper flex flex-col bg-base pr-3 flex-1 main_head">
    <CampaignDraftConfirm :campaign="campaign" :statusData="statusData" />

    <div class="h-screen flex flex-col bg-base mb-12 mt-5 flex-1 gap-4">
      <Skeleton v-if="statusData.isLoading" />
      <div class="flex gap-4" v-else>
        <div class="flex w-[74px] lg:w-[340px] flex-none relative">
          <NavBarCampaign
            :campaign="campaign"
            :statusData="statusData"
            :FreezeData="FreezeData"
          />
        </div>
        <div class="content w-full">
          <div class="flex justify-between items-center mb-3">
            <BackPage
              :url="feSettings.page_list"
              name="Campaign"
              v-if="feSettings.page_list"
            />
          </div>

          <div
            class="campaign flex flex-col gap-4"
            v-show="statusData.IsTabCampaign()"
          >
            <PolicyReview
              :campaign="campaign"
              :FreezeData="FreezeData"
              :statusData="statusData"
            />
            <n-card title="Campaign" class="card-flex-gap-4">
              <template #header-extra v-if="FreezeData.isEditPage()">
                <HeaderExtra :campaign="campaign" />
              </template>
              <Name
                :campaign="campaign"
                :FreezeData="FreezeData"
                :showName="computeds.showName.value"
              />

              <StatusComp :campaign="campaign" />

              <AccountSupply
                :campaign="campaign"
                :FreezeData="FreezeData"
                :statusData="statusData"
              />

              <DemandSource
                ref="demandComp"
                :campaign="campaign"
                :statusData="statusData"
                :FreezeData="FreezeData"
              />

              <CreateCampaign
                :campaign="campaign"
                :FreezeData="FreezeData"
                :statusData="statusData"
              />

              <Labels
                :campaign="campaign"
                :statusData="statusData"
                v-if="statusData.permission.label"
                ref="labelComp"
              />

              <PricingRule :campaign="campaign" />

              <TrafficSourceID :campaign="campaign" />

              <DirectLink :campaign="campaign" :FreezeData="FreezeData" />
              <Prelanding
                :campaign="campaign"
                :FreezeData="FreezeData"
                v-if="statusData.permission.prelanding"
              />
              <PrelandingDomain
                :campaign="campaign"
                :statusData="statusData"
                :FreezeData="FreezeData"
                v-if="statusData.permission.prelanding"
              />

              <CreateLandingPageByCreative
                :campaign="campaign"
                :FreezeData="FreezeData"
                :statusData="statusData"
              />
              <Tag
                :campaign="campaign"
                :statusData="statusData"
                v-if="statusData"
              />

              <PurchaseValue
                :campaign="campaign"
                :statusData="statusData"
                :FreezeData="FreezeData"
              />
            </n-card>

            <AdFormats
              :campaign="campaign"
              :statusData="statusData"
              v-if="statusData.permission.label"
            />
            <n-card
              v-show="campaign.IsAPI()"
              title="Settings"
              class="card-flex-gap-4"
            >
              <Objective :campaign="campaign" :FreezeData="FreezeData" />
              <BudgetOptimization
                :campaign="campaign"
                :FreezeData="FreezeData"
              />
              <CampaignTTSetup :campaign="campaign" :FreezeData="FreezeData" />

              <OptimizationGoal :campaign="campaign" :FreezeData="FreezeData" />

              <CampaignTTBudget :campaign="campaign" :FreezeData="FreezeData" />
            </n-card>

            <n-card
              v-if="!campaign.IsAPIPublic()"
              v-show="campaign.demand_source"
              title="Detail"
              class="card-flex-gap-4"
            >
              <CategorySiteBuilder
                :campaign="campaign"
                :statusData="statusData"
                :FreezeData="FreezeData"
              />
              <LandingPage
                :campaign="campaign"
                :FreezeData="FreezeData"
                :statusData="statusData"
              />
              <AMXT
                :campaign="campaign"
                :FreezeData="FreezeData"
                :statusData="statusData"
              />
              <LandingPagePrelander
                :statusData="statusData"
                :campaign="campaign"
                :FreezeData="FreezeData"
                v-if="statusData.permission.prelanding"
              />

              <KeywordMacro
                :campaign="campaign"
                :FreezeData="FreezeData"
                v-if="statusData.permission.prelanding"
              />

              <UserFlow :campaign="campaign" :statusData="statusData" />
              <Vertical :campaign="campaign" :statusData="statusData" />

              <GD :campaign="campaign" :statusData="statusData" />
            </n-card>

            <n-card
              title="Keyword"
              v-show="
                campaign.IsHasMainKeyword() ||
                campaign.IsHasSecondaryKeyword() ||
                campaign.IsHasKeywordSet()
              "
              class="card-flex-gap-4"
            >
              <div class="flex flex-col gap-4">
                <MainKeyword :campaign="campaign" />
                <SecondaryKeyword :campaign="campaign" />

                <KeywordSet
                  :campaign="campaign"
                  :FreezeData="FreezeData"
                  :statusData="statusData"
                />
              </div>
            </n-card>

            <n-card title="Tools" v-if="isComp">
              <ToolKW />
            </n-card>

            <div v-if="FreezeData.isEditPage()" class="flex flex-col gap-4">
              <URLs :campaign="campaign" />
              <!-- <General.AdCreative :campaign="campaign" :FreezeData="FreezeData" /> -->
              <PixelTable :campaign="campaign" />

              <TriggerTable :campaign="campaign" />
            </div>
          </div>

          <div class="ad_groups" v-show="statusData.IsTabAdGroup()">
            <AdGroupGeneralWrapper
              :campaign="campaign"
              :FreezeData="FreezeData"
              :statusData="statusData"
            />
          </div>

          <div class="ad_creative" v-show="statusData.IsTabCreative()">
            <AdCreativeGeneralWrapper
              :campaign="campaign"
              :FreezeData="FreezeData"
              :statusData="statusData"
            />
          </div>
        </div>
      </div>
    </div>
    <ActionButtonsV2
      v-if="!statusData.isLoading"
      :campaign="campaign"
      :FreezeData="FreezeData"
      :statusData="statusData"
      @submitForm="submitForm"
    />
  </div>
</template>
<style scoped lang="scss">
@use '@/css/CampaignDetail.scss';
</style>
