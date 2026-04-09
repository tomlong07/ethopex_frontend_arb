<script setup lang="ts">
import {
  campaignTypeClass,
  newCampaignClass,
  FreezeClass,
  StatusCampManager,
} from '@/types/components/campaign-v2'

import Skeleton from '@/components/skeleton/CampaignSkeletonDetail.vue'

import {
  campComputed,
  campWatch,
  campMethod,
} from '@/components/campaign/composables/campaign'

import ModalCreative from '@/components/campaign/modal/ModalCreative.vue'

import BackPage from '@/components/common/BackPage.vue'
import { ctr_campaign } from '@/services/ctr_campaign'
import { TS } from '@/enum/campaign'
import { useFeSettings } from '@/composables/feSettings'
import NavBarCampaign from '@/components/campaign/layout/NavBarCampaign.vue'
import AdCreativeGeneralWrapper from '@/components/campaign/modules/adcreative/AdCreativeGeneralWrapper.vue'

import DemandSource from '@/components/campaign/modules/DemandSource.vue'
import PolicyReview from '@/components/campaign/modules/PolicyReview.vue'
import HeaderExtra from '@/components/campaign/modules/HeaderExtra.vue'
import Name from '@/components/campaign/modules/Name.vue'
import StatusComp from '@/components/campaign/modules/StatusComp.vue'
import AccountSupply from '@/components/campaign/modules/AccountSupply.vue'
import CreateCampaign from '@/components/campaign/modules/CreateCampaign.vue'
import TrafficSourceID from '@/components/campaign/modules/TrafficSourceID.vue'
import Labels from '@/components/campaign/modules/Labels.vue'
import PricingRule from '@/components/campaign/modules/PricingRule.vue'
import Prelanding from '@/components/campaign/modules/Prelanding.vue'
import PrelandingDomain from '@/components/campaign/modules/PrelandingDomain.vue'
import CreateLandingPageByCreative from '@/components/campaign/modules/CreateLandingPageByCreative.vue'
import CategorySiteBuilder from '@/components/campaign/modules/CategorySiteBuilder.vue'
import LandingPage from '@/components/campaign/modules/LandingPage.vue'
import LandingPagePrelander from '@/components/campaign/modules/LandingPagePrelander.vue'
import KeywordMacro from '@/components/campaign/modules/KeywordMacro.vue'
import UserFlow from '@/components/campaign/modules/UserFlow.vue'
import Vertical from '@/components/campaign/modules/Vertical.vue'
import GD from '@/components/campaign/modules/GD.vue'
import MainKeyword from '@/components/campaign/modules/MainKeyword.vue'
import SecondaryKeyword from '@/components/campaign/modules/SecondaryKeyword.vue'
import KeywordSet from '@/components/campaign/modules/KeywordSet.vue'
import ToolKW from '@/components/campaign/modules/ToolKW.vue'
import ActionButtonsV2 from '@/components/campaign/modules/ActionButtonsV2.vue'
import DirectLink from '@/components/campaign/modules/DirectLink.vue'
import Objective from '@/components/campaign/modules/Objective.vue'
import URLs from '@/components/campaign/modules/URLs.vue'

const traffic_source = TS.NEWSBREAK

const demandComp = ref<InstanceType<typeof DemandSource>>()
const modalCreativeComp = ref<InstanceType<typeof ModalCreative>>()

//Freeze lại tránh thay đổi các data này
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
const isComp = window.arb.isCompany()

const sourceCopy = ref<string>()

const watchs = campWatch()
const methods = campMethod(campaign, FreezeData, statusData)

const displayName = computed(() => {
  if (statusData.value.isLoading) {
    return ''
  }
  if (!campaign.value.traffic_source) {
    return ''
  }

  let result =
    (campaign.value?.id ? `${campaign.value?.id}: ` : '') +
    `${helper.capitalizeFirstLetter(campaign.value.traffic_source)} -> `

  let nameArr: string[] = []

  if (campaign.value?.demand_source) {
    nameArr.push(demandComp?.value?.demandSourceName || '')
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

    copyHandle()
  }

  campaign.value.HandleDuplicate()

  statusData.value.isLoading = false
}

const traffic_source_copy = computed<string>(() =>
  String(window.route.query.traffic_source || '')
)

//Repair data for duplicate from other traffic source
const copyHandle = async () => {
  if (!FreezeData.isCopy) {
    return
  }

  const cloneCreative = helper.clone(campaign.value.creative)
  sourceCopy.value = campaign.value.traffic_source

  campaign.value.account_supply_id = undefined
  campaign.value.bidding = undefined
  campaign.value.user = undefined
  campaign.value.creative = { id: 0 }

  if (campaign.value.location) {
    campaign.value.location.value = [] as string[]
  }

  if (traffic_source_copy.value) {
    campaign.value.traffic_source = traffic_source_copy.value as TS
  }
  campaign.value.SetAPI()

  await helper.sleep(1)

  modalCreativeComp.value?.changeShowModalCreative(true)
  modalCreativeComp.value?.changeSourceCreative(cloneCreative)
}

onBeforeMount(() => {
  methods.beforeMountHandle()
  methods.fetchPermission(TS.NEWSBREAK)
})

onMounted(async () => {
  methods.onMountedHandle(fetchDuplicate, traffic_source)
})

const submitForm = async () => {
  methods.submitForm(computeds.payload, feSettings)
}
</script>
<template>
  <div class="wrapper flex flex-col bg-base px-3 flex-1 main_head">
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
              <!-- <TrafficSource :campaign="campaign" :FreezeData="FreezeData" /> -->

              <AccountSupply
                :campaign="campaign"
                :FreezeData="FreezeData"
                :statusData="statusData"
              />

              <DemandSource
                ref="demandComp"
                :campaign="campaign"
                :FreezeData="FreezeData"
                :statusData="statusData"
              />

              <CreateCampaign
                :campaign="campaign"
                :FreezeData="FreezeData"
                :statusData="statusData"
              />

              <TrafficSourceID :campaign="campaign" />

              <Labels
                :campaign="campaign"
                :statusData="statusData"
                v-if="statusData.permission.label"
              />

              <PricingRule :campaign="campaign" />

              <DirectLink :campaign="campaign" :FreezeData="FreezeData" />
              <Prelanding
                :campaign="campaign"
                :FreezeData="FreezeData"
                v-if="statusData.permission.prelanding"
              />
              <PrelandingDomain
                :campaign="campaign"
                :FreezeData="FreezeData"
                :statusData="statusData"
                v-if="statusData.permission.prelanding"
              />

              <CreateLandingPageByCreative
                :campaign="campaign"
                :FreezeData="FreezeData"
                :statusData="statusData"
              />
            </n-card>

            <n-card
              title="Settings"
              class="relative card-flex-gap-4"
              v-if="campaign.IsAPI()"
            >
              <Objective :campaign="campaign" :FreezeData="FreezeData" />
            </n-card>

            <n-card
              v-if="!campaign.IsAPIPublic()"
              v-show="campaign?.demand_source"
              title="Detail"
              class="relative card-flex-gap-4"
            >
              <CategorySiteBuilder
                :campaign="campaign"
                :FreezeData="FreezeData"
                :statusData="statusData"
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
                :campaign="campaign"
                :FreezeData="FreezeData"
                :statusData="statusData"
                v-if="statusData.permission.prelanding"
              />

              <KeywordMacro
                :campaign="campaign"
                :FreezeData="FreezeData"
                v-if="statusData.permission.prelanding"
              />
              <!-- 
              <Creative
                :campaign="campaign"
                :FreezeData="FreezeData"
                :statusData="statusData"
              /> -->

              <ModalCreative
                ref="modalCreativeComp"
                :campaign="campaign"
                :statusData="statusData"
                :duplicateId="FreezeData.duplicateId"
                :sourceCopy="sourceCopy"
              />

              <UserFlow :campaign="campaign" />
              <Vertical :campaign="campaign" :statusData="statusData" />
              <GD :campaign="campaign" :statusData="statusData" />
            </n-card>

            <!-- <AdFormats
            :campaign="campaign"
            v-if="statusData.permission.label"
          /> -->

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
          </div>

          <div class="ad_groups" v-show="statusData.IsTabAdGroup()">
            <!-- <AdGroupGeneralWrapper
              :campaign="campaign"
              :FreezeData="FreezeData"
              :statusData="statusData"
            /> -->
            <AdGroupNewsBreak
              v-if="campaign?.ad_groups && campaign?.ad_groups?.length > 0"
              :campaign="campaign"
              :FreezeData="FreezeData"
              :statusData="statusData"
            />
            <n-card title="Tools" v-if="isComp">
              <ToolKW />
            </n-card>

            <div v-if="FreezeData.isEditPage()" class="flex flex-col gap-4">
              <URLs :campaign="campaign" />

              <!-- <AsyncComp.CreativeTable
                :id="FreezeData.id"
                :columnDefs="columnDefs"
              /> -->

              <!-- <AsyncComp.PixelTable :campaign="campaign" /> -->

              <!-- <AsyncComp.TriggerTable :campaign="campaign" /> -->
            </div>
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
      :campaign="campaign"
      :FreezeData="FreezeData"
      :statusData="statusData"
      @submitForm="submitForm"
    />
  </div>
</template>
<style lang="scss">
@use '@/css/CampaignDetail.scss';
</style>
