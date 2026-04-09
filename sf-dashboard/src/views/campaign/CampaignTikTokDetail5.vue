<script setup lang="ts">
import Skeleton from '@/components/skeleton/CampaignSkeleton.vue'

import BackPage from '@/components/common/BackPage.vue'
import { TS } from '@/enum/campaign'
import NavBarCampaign from '@/components/campaign/layout/NavBarCampaign.vue'
import { useFeSettings } from '@/composables/feSettings'
import AdCreativeGeneralWrapper from '@/components/campaign/modules/adcreative/AdCreativeGeneralWrapper.vue'

import DemandSource from '@/components/campaign/modules/DemandSource.vue'

import ToolKW from '@/components/campaign/modules/ToolKW.vue'

import URLs from '@/components/campaign/modules/URLs.vue'
import TriggerTable from '@/components/campaign/modules/TriggerTable.vue'
import { useCampaignStore } from '@/store/campaignStore'

import AdGroupGeneralWrapperV2 from '@/components/campaign/modules/adgroup/AdGroupGeneralWrapperV2.vue'
import AdCreativeGeneralWrapperV2 from '@/components/campaign/modules/adcreative/AdCreativeGeneralWrapperV2.vue'
import NavBarCampaignV2 from '@/components/campaign/layout/NavBarCampaignV2.vue'
import ObjectiveV2 from '@/components/campaign/modules/tiktok/component_v2/ObjectiveV2.vue'
import BudgetOptimizationV2 from '@/components/campaign/modules/tiktok/component_v2/BudgetOptimizationV2.vue'
import CampaignSetupV2 from '@/components/campaign/modules/tiktok/component_v2/CampaignSetupV2.vue'
import OptimizationGoalV2 from '@/components/campaign/modules/tiktok/component_v2/OptimizationGoalV2.vue'
import BudgetV2 from '@/components/campaign/modules/tiktok/component_v2/BudgetV2.vue'
import PolicyReviewV2 from '@/components/campaign/modules/tiktok/component_v2/PolicyReviewV2.vue'
import HeaderExtraV2 from '@/components/campaign/modules/tiktok/component_v2/HeaderExtraV2.vue'
import NameV2 from '@/components/campaign/modules/tiktok/component_v2/NameV2.vue'
import StatusCompV2 from '@/components/campaign/modules/tiktok/component_v2/StatusCompV2.vue'
import AccountSupplyV2 from '@/components/campaign/modules/tiktok/component_v2/AccountSupplyV2.vue'
import DemandSourceV2 from '@/components/campaign/modules/tiktok/component_v2/DemandSourceV2.vue'
import CreateCampaignV2 from '@/components/campaign/modules/tiktok/component_v2/CreateCampaignV2.vue'
import LabelsV2 from '@/components/campaign/modules/tiktok/component_v2/LabelsV2.vue'
import PricingRuleV2 from '@/components/campaign/modules/tiktok/component_v2/PricingRuleV2.vue'
import TrafficSourceIDV2 from '@/components/campaign/modules/tiktok/component_v2/TrafficSourceIDV2.vue'
import DirectLinkV2 from '@/components/campaign/modules/tiktok/component_v2/DirectLinkV2.vue'
import PrelandingV2 from '@/components/campaign/modules/tiktok/component_v2/PrelandingV2.vue'
import PrelandingDomainV2 from '@/components/campaign/modules/tiktok/component_v2/PrelandingDomainV2.vue'
import CreateLandingPageByCreativeV2 from '@/components/campaign/modules/tiktok/component_v2/CreateLandingPageByCreativeV2.vue'
import TagV2 from '@/components/campaign/modules/tiktok/component_v2/TagV2.vue'
import AdFormatsV2 from '@/components/campaign/modules/tiktok/component_v2/AdFormatsV2.vue'
import CategorySiteBuilderV2 from '@/components/campaign/modules/tiktok/component_v2/CategorySiteBuilderV2.vue'
import LandingPageV2 from '@/components/campaign/modules/tiktok/component_v2/LandingPageV2.vue'
import LandingPagePrelanderV2 from '@/components/campaign/modules/tiktok/component_v2/LandingPagePrelanderV2.vue'
import KeywordMacroV2 from '@/components/campaign/modules/tiktok/component_v2/KeywordMacroV2.vue'
import UserFlowV2 from '@/components/campaign/modules/tiktok/component_v2/UserFlowV2.vue'
import GDV2 from '@/components/campaign/modules/tiktok/component_v2/GDV2.vue'
import MainKeywordV2 from '@/components/campaign/modules/tiktok/component_v2/MainKeywordV2.vue'
import SecondaryKeywordV2 from '@/components/campaign/modules/tiktok/component_v2/SecondaryKeywordV2.vue'
import KeywordSetV2 from '@/components/campaign/modules/tiktok/component_v2/KeywordSetV2.vue'
import URLsV2 from '@/components/campaign/modules/tiktok/component_v2/URLsV2.vue'
import PixelTableV2 from '@/components/campaign/modules/tiktok/component_v2/PixelTableV2.vue'
import TriggerTableV2 from '@/components/campaign/modules/tiktok/component_v2/TriggerTableV2.vue'
import ActionButtonsV3 from '@/components/campaign/modules/tiktok/component_v2/ActionButtonsV3.vue'
import DraftConfirmV2 from '@/components/campaign/modules/tiktok/component_v2/DraftConfirmV2.vue'

const traffic_source = TS.TIKTOK
const isComp = window.arb.isCompany()
const campaignStore = useCampaignStore()

const campaignContext = computed(() => {
  return {
    campaign: campaignStore.campaign,
    statusData: campaignStore.statusData,
    FreezeData: campaignStore.FreezeData,
    FeSettings: campaignStore.feSettings,
    showName: campaignStore.showName,
  }
})

watch(
  () => campaignStore.displayName,
  () => {
    if (
      !campaignStore.FreezeData.isEditPage() ||
      campaignStore.statusData.isLoading ||
      !campaignStore.statusData.userClick
    ) {
      return
    }
    campaignStore.statusData.initName = false
  }
)

onBeforeMount(() => {
  campaignStore.beforeMountHandle()
  campaignStore.fetchPermission(traffic_source)
})

onMounted(async () => {
  campaignStore.initCampaign(traffic_source)
  await campaignStore.onMountedHandle()
})

const submitForm = async () => {
  campaignStore.submitForm()
}
</script>
<template>
  <div class="wrapper flex flex-col bg-base pr-3 flex-1 main_head">
    <DraftConfirmV2 :data="campaignContext" />

    <div class="h-screen flex flex-col bg-base mb-12 mt-5 flex-1 gap-4">
      <Skeleton v-if="campaignContext.statusData.isLoading" />
      <div class="flex gap-4" v-else>
        <div class="flex w-[74px] lg:w-[340px] flex-none relative">
          <NavBarCampaignV2 :data="campaignContext" />
        </div>
        <div class="content w-full">
          <div class="flex justify-between items-center mb-3">
            <BackPage
              v-if="campaignContext.FeSettings.page_list"
              :url="campaignContext.FeSettings.page_list"
              name="Campaign"
            />
          </div>

          <div
            class="campaign flex flex-col gap-4"
            v-show="campaignContext.statusData.IsTabCampaign()"
          >
            <PolicyReviewV2 :data="campaignContext" />
            <n-card title="Campaign" class="card-flex-gap-4">
              <template
                #header-extra
                v-if="campaignContext.FreezeData.isEditPage()"
              >
                <HeaderExtraV2 :data="campaignContext" />
              </template>
              <NameV2 :data="campaignContext" />

              <StatusCompV2 :data="campaignContext" />

              <AccountSupplyV2 :data="campaignContext" />

              <DemandSourceV2 :data="campaignContext" />

              <CreateCampaignV2 :data="campaignContext" />

              <LabelsV2
                :data="campaignContext"
                v-if="campaignContext.statusData.permission.label"
                ref="labelComp"
              />

              <PricingRuleV2 :data="campaignContext" />

              <TrafficSourceIDV2 :data="campaignContext" />

              <DirectLinkV2 :data="campaignContext" />
              <PrelandingV2
                :data="campaignContext"
                v-if="campaignContext.statusData.permission.prelanding"
              />
              <PrelandingDomainV2
                :data="campaignContext"
                v-if="campaignContext.statusData.permission.prelanding"
              />

              <CreateLandingPageByCreativeV2 :data="campaignContext" />
              <TagV2
                :data="campaignContext"
                v-if="campaignContext.statusData"
              />
            </n-card>

            <AdFormatsV2
              :data="campaignContext"
              v-if="campaignContext.statusData.permission.label"
            />
            <n-card
              v-show="campaignContext.campaign.IsAPI()"
              title="Settings"
              class="card-flex-gap-4"
            >
              <ObjectiveV2 :data="campaignContext" />
              <BudgetOptimizationV2 :data="campaignContext" />
              <CampaignSetupV2 :data="campaignContext" />

              <OptimizationGoalV2 :data="campaignContext" />

              <BudgetV2 :data="campaignContext" />
            </n-card>

            <n-card
              v-show="campaignContext.campaign.demand_source"
              title="Detail"
              class="card-flex-gap-4"
            >
              <CategorySiteBuilderV2 :data="campaignContext" />
              <LandingPageV2 :data="campaignContext" />
              <LandingPagePrelanderV2
                :data="campaignContext"
                v-if="campaignContext.statusData.permission.prelanding"
              />

              <KeywordMacroV2
                :data="campaignContext"
                v-if="campaignContext.statusData.permission.prelanding"
              />

              <UserFlowV2 :data="campaignContext" />
              <VerticalV2 :data="campaignContext" />

              <GDV2 :data="campaignContext" />
            </n-card>

            <n-card
              title="Keyword"
              v-show="
                campaignContext.campaign.IsHasMainKeyword() ||
                campaignContext.campaign.IsHasSecondaryKeyword() ||
                campaignContext.campaign.IsHasKeywordSet()
              "
              class="card-flex-gap-4"
            >
              <div class="flex flex-col gap-4">
                <MainKeywordV2 :data="campaignContext" />
                <SecondaryKeywordV2 :data="campaignContext" />

                <KeywordSetV2 :data="campaignContext" />
              </div>
            </n-card>

            <n-card title="Tools" v-if="isComp">
              <ToolKW />
            </n-card>

            <div
              v-if="campaignContext.FreezeData.isEditPage()"
              class="flex flex-col gap-4"
            >
              <URLsV2 :data="campaignContext" />
              <!-- <General.AdCreative :campaign="campaign" :FreezeData="FreezeData" /> -->
              <PixelTableV2 :data="campaignContext" />
              <TriggerTableV2 :data="campaignContext" />
            </div>
          </div>

          <div
            class="ad_groups"
            v-show="campaignContext.statusData.IsTabAdGroup()"
          >
            <!-- <AdGroupGeneralWrapper
              :campaign="campaign"
              :FreezeData="FreezeData"
              :statusData="statusData"
            /> -->

            <AdGroupsTiktokV2
              v-if="campaignContext.campaign?.ad_groups?.length"
              :campaign="campaignContext.campaign"
              :FreezeData="campaignContext.FreezeData"
              :statusData="campaignContext.statusData"
            />
          </div>

          <div
            class="ad_creative"
            v-show="campaignContext.statusData.IsTabCreative()"
          >
            <AdCreativeGeneralWrapperV2 :data="campaignContext" />
          </div>
        </div>
      </div>
    </div>
    <ActionButtonsV3
      v-if="!campaignContext.statusData.isLoading"
      :data="campaignContext"
      @submitForm="submitForm"
    />
  </div>
</template>
<style scoped lang="scss">
@use '@/css/CampaignDetail.scss';
</style>
