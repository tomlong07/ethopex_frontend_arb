<script setup lang="ts">
import {
  campaignTypeClass,
  newCampaignClass,
  FreezeClass,
  StatusCampManager,
  adGroups,
  AddCreativeSingleImage,
  CreativeSingleImageDefault,
} from '@/types/components/campaign-v2'

import { colDefsByTs } from '@/columns/campaign'

import Skeleton from '@/components/skeleton/CampaignSkeleton.vue'

import {
  campComputed,
  campWatch,
  campMethod,
  addDemoData,
} from '@/components/campaign/composables/campaign'

import BackPage from '@/components/common/BackPage.vue'

import useAdDataStore from '@/store/adDataStore'
import helper from '@/utils/helper'
import StatusASC from '@/components/campaign/modules/facebook/StatusASC.vue'
import Bling from '@/assets/icons/Bling.vue'
import { useMenuCampaignStore } from '@/store/campaign/useMenuCampaign'
import { ctr_campaign } from '@/services/ctr_campaign'
import NavBarCampaign from '@/components/campaign/layout/NavBarCampaign.vue'
import { AD_SETUP, TS } from '@/enum/campaign'
import AdCreativeGeneralWrapper from '@/components/campaign/modules/adcreative/AdCreativeGeneralWrapper.vue'
import { useFeSettings } from '@/composables/feSettings'
import DemandSource from '@/components/campaign/modules/DemandSource.vue'
import PolicyReview from '@/components/campaign/modules/PolicyReview.vue'
import HeaderExtra from '@/components/campaign/modules/HeaderExtra.vue'
import DuplicateType from '@/components/campaign/modules/DuplicateType.vue'
import Name from '@/components/campaign/modules/Name.vue'
import StatusComp from '@/components/campaign/modules/StatusComp.vue'
import AccountSupply from '@/components/campaign/modules/AccountSupply.vue'
import CreateCampaign from '@/components/campaign/modules/CreateCampaign.vue'
import TrafficSourceID from '@/components/campaign/modules/TrafficSourceID.vue'
import Labels from '@/components/campaign/modules/Labels.vue'
import PricingRule from '@/components/campaign/modules/PricingRule.vue'
import DirectLink from '@/components/campaign/modules/DirectLink.vue'
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
import ActionButtonsV2 from '@/components/campaign/modules/ActionButtonsV2.vue'
import OpenAdFullInfo from '@/components/campaign/modules/facebook/OpenAdFullInfo.vue'
import BuyingType from '@/components/campaign/modules/facebook/BuyingType.vue'
import CampaignSetup from '@/components/campaign/modules/facebook/CampaignSetup.vue'
import AdvantageCampaignBudget from '@/components/campaign/modules/facebook/AdvantageCampaignBudget.vue'
import BiddingAndBudget from '@/components/campaign/modules/facebook/BiddingAndBudget.vue'
import BidStrategy from '@/components/campaign/modules/facebook/BidStrategy.vue'
import URLs from '@/components/campaign/modules/URLs.vue'
import CreativeTable from '@/components/campaign/modules/CreativeTable.vue'
import PixelTable from '@/components/campaign/modules/PixelTable.vue'
import TriggerTable from '@/components/campaign/modules/TriggerTable.vue'
import ModalAdsFBV2 from '@/components/campaign/modules/facebook/modal/ModalAdsFBV2.vue'
import { MAX_LENGTH_NAME_AD_FB } from '@/constants/limits'

import { useLocale } from '@/lang/messages'
import PurchaseValue from '@/components/campaign/modules/PurchaseValue.vue'

const AddDevInfo = defineAsyncComponent(
  () => import('@/components/campaign/AddDevInfo.vue')
)

const FBMess = useLocale(
  () => import('@/lang/vi/facebook'),
  () => import('@/lang/en/facebook')
)

const aDataStore = useAdDataStore()
const menuCampaignStore = useMenuCampaignStore()

const demandComp = ref<InstanceType<typeof DemandSource>>()

const isDev = window.arb.isDev()
const isComp = window.arb.isCompany()

const traffic_source = TS.FACEBOOK

//Freeze lại tránh thay đổi các data này
const FreezeData = helper.deepFreeze(
  new FreezeClass(window.route)
) as FreezeClass

const title = 'Campaign'

const campaign = ref<campaignTypeClass>(
  FreezeData.isAddPage()
    ? newCampaignClass(traffic_source)
    : new campaignTypeClass({})
)
//
const statusData = ref(new StatusCampManager())
const feSettings = toRef(statusData.value, 'feSettings')
useFeSettings(feSettings, window.route?.meta?.url as string)

const isShowStatusASC = ref(true)

const columnDefs = computed(() => {
  return colDefsByTs(campaign.value?.traffic_source as string)
})

const watchs = campWatch()
const methods = campMethod(campaign, FreezeData, statusData)

const getLocationNames = (adGroups: any[]) => {
  // Trường hợp chọn ALL Countries
  if (adGroups.some((adGroup) => adGroup.location?.value?.includes('ALL'))) {
    return ['All Countries']
  }

  const allLocationCodes = [
    ...new Set(adGroups.flatMap((adGroup) => adGroup.location?.value || [])),
  ]

  if (!allLocationCodes.length) return []

  const hasMore = allLocationCodes.length > 5
  const name = allLocationCodes.slice(0, 5).join(', ') + (hasMore ? '...' : '')

  return name ? [name] : []
}

const displayName = computed(() => {
  if (statusData.value.isLoading) {
    return ''
  }
  if (!campaign.value?.traffic_source) {
    return ''
  }

  let result =
    (campaign.value?.id ? `${campaign.value?.id}: ` : '') +
    `${helper.capitalizeFirstLetter(campaign.value?.traffic_source)} -> `

  let nameArr: string[] = []

  if (campaign.value.ad_groups?.length) {
    nameArr.push(...getLocationNames(campaign.value.ad_groups))
  }

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

const fetchDuplicate = async (mode: string = '') => {
  statusData.value.isLoading = true
  let result

  result = await ctr_campaign.Duplicate(FreezeData.duplicateId)
  if (result?.status) {
    campaign.value = new campaignTypeClass(result?.data || {})

    if (
      campaign.value.IsTrafficFacebook() &&
      campaign.value.IsAPI() &&
      campaign.value.ad_groups
    ) {
      // creative_features_spec = null
      //- ad_setup === AD_SETUP.CREATE_AD set creative_features_spec: OPT_IN
      //- ad_setup === AD_SETUP.USE_EXISTING_POST set creative_features_spec: OPT_OUT
      campaign.value.ad_groups.forEach((ad: adGroups) => {
        ad.ad_creative?.forEach((item) => {
          item.creative_features_spec = !item.creative_features_spec
            ? item.ad_setup === AD_SETUP.CREATE_AD
              ? AddCreativeSingleImage(
                  item.creative_features_spec,
                  FreezeData.isDuplicatePage()
                )
              : CreativeSingleImageDefault()
            : item.creative_features_spec
        })
      })
    }

    clone2Handle(mode)

    copyHandle()
  }

  statusData.value.disabledSubmit = campaign.value.HandleDuplicate()
  statusData.value.isLoading = false
}

const refetchData = (mode: string = '') => {
  fetchDuplicate(mode)
}

const clone2Handle = (mode: string = '') => {
  if (!FreezeData.isDuplicatePageV2()) {
    return
  }

  if (mode) {
    campaign.value.SetCloneMode(mode)

    window.router.replace({
      query: {
        ...window.router.currentRoute.value.query,
        mode: mode,
      },
    })
  } else {
    campaign.value.SetCloneMode(FreezeData.duplicate_type)
  }
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

const validateAdGroup = () => {
  if (campaign.value.IsTrafficGoogle() && campaign.value.IsAPI()) {
    if (campaign.value.ad_groups) {
      let missingCre = []

      for (let index = 0; index < campaign.value.ad_groups.length; index++) {
        if (campaign.value.ad_groups[index].id) {
          //Trường hợp edit adgroup cũ đã có ad tạo rồi ko cần validate
          continue
        }
        if (
          !campaign.value.ad_groups[index].creatives?.length ||
          !campaign.value.ad_groups[index].name
        ) {
          missingCre.push(
            campaign.value.ad_groups[index].name
              ? campaign.value.ad_groups[index].name
              : 'Ad Group'
          )
        }
      }

      if (missingCre.length) {
        statusData.value.changeAdGroup = Date.now()

        window.message.error(
          'Ad group missing name / creative: ' + missingCre.join(', ')
        )
        return true
      }
    }
  }

  return false
}

const isAntFull = window.arb.isAntFull()

const submitForm = async () => {
  let stop = validateAdGroup()
  if (stop) return

  stop = validateName()
  if (stop) return

  if (campaign.value.IsInvalidPerformanceGoalFB()) {
    window.message.error(FBMess.value.per_goal)
    return
  }

  if (campaign.value.HasPostProgress()) {
    const ok = confirm(
      "Because the original campaign has not been created yet, the new campaign you created will be set to **Ad Setup: 'Create ad'**"
    )
    if (!ok) return
  }

  // if (FreezeData.isAddorDuplicate() && !isAntFull) {
  //   window.message.info(
  //     'This feature is under maintenance. Please try again later.'
  //   )
  //   return
  // }
  methods.submitForm(computeds.payload, feSettings, true)
}

const validateName = () => {
  if (campaign.value.ad_groups) {
    for (let index = 0; index < campaign.value.ad_groups.length; index++) {
      const adgroup = campaign.value.ad_groups[index]

      if (adgroup.creatives) {
        for (let i = 0; i < adgroup.creatives.length; i++) {
          const adcreative = adgroup.creatives[i]
          if (
            adcreative.name &&
            adcreative.name.length > MAX_LENGTH_NAME_AD_FB
          ) {
            window.message.error('Name is too long')
            window.message.warning(adcreative.name)
            return true
          }
        }
      }
    }
  }

  return false
}
const addDevData = async (campaignDev: campaignTypeClass) => {
  await addDemoData(campaign, statusData, campaignDev)
  menuCampaignStore.handleShowActionButton()
}

watch(
  () => aDataStore.reGetCampaign,
  async (newValue, oldValue) => {
    if (newValue) {
      methods.fetchCampaignGetById(traffic_source)
    }
  }
)

// const reciveCampaign = (value:campaignTypeClass) =>{
//   campaign.value = new campaignTypeClass(value)
// }
</script>
<template>
  <div>
    <div class="wrapper flex flex-col bg-base pr-3 flex-1 main_head">
      <CampaignDraftConfirm :campaign="campaign" :statusData="statusData" />

      <div class="h-scree flex flex-col bg-base mt-4 flex-1 gap-4">
        <Skeleton v-if="statusData.isLoading" />
        <div class="flex gap-4" v-else>
          <div class="flex w-[64px] xl:w-[340px] flex-none relative">
            <NavBarCampaign
              :campaign="campaign"
              :statusData="statusData"
              :FreezeData="FreezeData"
            />
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex justify-between items-center mb-3">
              <BackPage
                :url="feSettings.page_list"
                name="Campaign"
                v-if="feSettings.page_list"
              />

              <div class="flex gap-3 items-center">
                <OpenAdFullInfo
                  :campaign="campaign"
                  :FreezeData="FreezeData"
                  v-if="FreezeData.isEditPage()"
                />

                <AddDevInfo
                  v-if="isDev && FreezeData.isAddPage()"
                  :traffic_source="traffic_source"
                  :statusData="statusData"
                  @addDevData="addDevData"
                />
              </div>
            </div>

            <div class="flex gap-4">
              <div class="w-full xl:flex-1 p-0">
                <!-- <n-alert
                  type="warning"
                  title="Meta Campaign Maintenance"
                  bordered
                  class="mx-auto my-4"
                  v-if="FreezeData.isAddorDuplicate() && !isAntFull"
                >
                  Campaign publishing for the Meta traffic source is currently
                  under maintenance. Please try again later.
                </n-alert> -->
                <div class="flex flex-col flex-1 mb-4">
                  <div
                    class="campaign space-y-4"
                    v-show="statusData.IsTabCampaign()"
                  >
                    <PolicyReview
                      :campaign="campaign"
                      :FreezeData="FreezeData"
                      :statusData="statusData"
                    />
                    <n-card class="card-flex-gap-4 rounded-[5px] !border-gray2">
                      <template #header>
                        <span class="overflow-hidden text-ellipsis max-w-24">{{
                          title
                        }}</span>
                      </template>
                      <template #header-extra v-if="FreezeData.isEditPage()">
                        <HeaderExtra :campaign="campaign" />
                      </template>

                      <DuplicateType
                        :campaign="campaign"
                        :FreezeData="FreezeData"
                        @refetchData="refetchData"
                      />
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
                        :statusData="statusData"
                        :campaign="campaign"
                        :FreezeData="FreezeData"
                      />
                      <CreateCampaign
                        :campaign="campaign"
                        :FreezeData="FreezeData"
                        :statusData="statusData"
                      />

                      <TrafficSourceID :campaign="campaign" />

                      <Labels
                        :statusData="statusData"
                        :campaign="campaign"
                        v-if="statusData.permission.label"
                      />

                      <PricingRule :campaign="campaign" />

                      <DirectLink
                        :campaign="campaign"
                        :FreezeData="FreezeData"
                      />
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
                      <Tag
                        :campaign="campaign"
                        :statusData="statusData"
                        v-if="statusData"
                      />
                      <PurchaseValue
                        :campaign="campaign"
                        :FreezeData="FreezeData"
                        :statusData="statusData"
                      />
                    </n-card>

                    <n-card
                      v-show="campaign.IsAPI()"
                      title="Campaign Settings"
                      class="relative card-flex-gap-4 rounded-[5px] !border-gray2"
                    >
                      <BuyingType
                        :campaign="campaign"
                        :FreezeData="FreezeData"
                      />
                      <CampaignFBObjective
                        :campaign="campaign"
                        :FreezeData="FreezeData"
                      />
                      <CampaignSetup
                        :campaign="campaign"
                        :FreezeData="FreezeData"
                      />
                      <CampaignFBCategories
                        :campaign="campaign"
                        :FreezeData="FreezeData"
                      />
                      <AdvantageCampaignBudget
                        :campaign="campaign"
                        :FreezeData="FreezeData"
                      />

                      <BiddingAndBudget
                        :campaign="campaign"
                        :FreezeData="FreezeData"
                      />
                      <BidStrategy
                        :campaign="campaign"
                        :FreezeData="FreezeData"
                      />
                    </n-card>

                    <n-card
                      v-if="!campaign.IsAPIPublic()"
                      v-show="campaign?.demand_source"
                      title="Detail"
                      class="relative card-flex-gap-4 rounded-[5px] !border-gray2"
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

                      <UserFlow :campaign="campaign" />
                      <Vertical :campaign="campaign" :statusData="statusData" />

                      <GD :campaign="campaign" :statusData="statusData" />
                    </n-card>

                    <AdFormats
                      :campaign="campaign"
                      :statusData="statusData"
                      v-if="statusData.permission.label"
                    />

                    <n-card
                      title="Keyword"
                      v-show="
                        campaign.IsHasMainKeyword() ||
                        campaign.IsHasSecondaryKeyword() ||
                        campaign.IsHasKeywordSet()
                      "
                      class="card-flex-gap-4 rounded-[5px] !border-gray2"
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

                    <n-card
                      title="Tools"
                      class="rounded-[5px] !border-gray2"
                      v-if="isComp"
                    >
                      <ToolKW />
                    </n-card>
                    <div
                      v-if="FreezeData.isEditPage()"
                      class="flex flex-col gap-4 rounded-[5px] !border-gray2"
                    >
                      <URLs :campaign="campaign" />

                      <!-- <CreativeTable
                        :statusData="statusData"
                        :id="FreezeData.id"
                        :columnDefs="columnDefs"
                      /> -->

                      <PixelTable :campaign="campaign" />

                      <TriggerTable :campaign="campaign" />
                    </div>
                  </div>

                  <div class="adGroup" v-show="statusData.IsTabAdGroup()">
                    <!-- <AdGroupGeneralWrapper
                      :campaign="campaign"
                      :FreezeData="FreezeData"
                      :statusData="statusData"
                    /> -->

                    <AdGroupsFaceBookV2
                      :campaign="campaign"
                      :FreezeData="FreezeData"
                      :statusData="statusData"
                    />
                  </div>

                  <div
                    class="creative w-full"
                    v-show="statusData.IsTabCreative()"
                  >
                    <AdCreativeGeneralWrapper
                      :campaign="campaign"
                      :FreezeData="FreezeData"
                      :statusData="statusData"
                    />
                  </div>

                  <div class="flex flex-col gap-4">
                    <ModalAdsFBV2
                      :campaign="campaign"
                      v-if="!FreezeData.isAddPage()"
                    />

                    <URLs
                      :campaign="campaign"
                      v-if="campaign.IsCloneCampaign()"
                    />
                  </div>
                </div>
              </div>
              <div class="xl:w-[320px] xl:relative flex-none">
                <div class="xl:sticky xl:top-[100px] fixed right-10 top-32 z-1">
                  <div class="xl:hidden">
                    <n-button
                      @click="isShowStatusASC = !isShowStatusASC"
                      circle
                      :type="isShowStatusASC ? 'primary' : 'default'"
                      class="mb-2 shadow-sm"
                    >
                      <template #icon>
                        <Bling />
                      </template>
                    </n-button>
                  </div>
                  <div
                    class="xl:static xl:w-full xl:p-0 xl:shadow-none absolute right-0 top-12 z-1"
                    :class="isShowStatusASC ? 'block' : 'hidden xl:block'"
                  >
                    <StatusASC
                      :campaign="campaign"
                      :FreezeData="FreezeData"
                      :statusData="statusData"
                    />
                  </div>
                </div>
              </div>
            </div>
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
<style lang="scss">
@use '@/css/CampaignDetail.scss';
</style>
