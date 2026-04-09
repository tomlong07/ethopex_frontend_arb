<script setup lang="ts">
import {
  campaignTypeClass,
  newCampaignClass,
  FreezeClass,
  StatusCampManager,
} from '@/types/components/campaign-v2'

import { colDefsByTs } from '@/columns/campaign'

import Skeleton from '@/components/skeleton/CampaignSkeleton.vue'

import {
  campComputed,
  campWatch,
  campMethod,
  addDemoData,
} from '@/components/campaign/composables/campaign'

import ModalCreative from '@/components/campaign/modal/ModalCreative.vue'

import BackPage from '@/components/common/BackPage.vue'
import helper from '@/utils/helper'
import DeliveryStatusComp from '@/components/campaign/modules/DeliveryStatusComp.vue'

import useCampaign2Store from '@/store/useCampaign2Store'
import { ctr_campaign } from '@/services/ctr_campaign'

import { TS } from '@/enum/campaign'
import AdCreativeGeneralWrapper from '@/components/campaign/modules/adcreative/AdCreativeGeneralWrapper.vue'
import { useFeSettings } from '@/composables/feSettings'
import Schedule from '@/components/campaign/modules/google/Schedule.vue'

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
import Location from '@/components/campaign/modules/Location.vue'
import Creative from '@/components/campaign/modules/Creative.vue'
import LanguageMultiple from '@/components/campaign/modules/LanguageMultiple.vue'
import Device from '@/components/campaign/modules/Device.vue'

import URLs from '@/components/campaign/modules/URLs.vue'
import CreativeTable from '@/components/campaign/modules/CreativeTable.vue'
import PixelTable from '@/components/campaign/modules/PixelTable.vue'
import TriggerTable from '@/components/campaign/modules/TriggerTable.vue'
import CampaignType from '@/components/campaign/modules/google/CampaignType.vue'
import SearchToSearch from '@/components/campaign/modules/google/SearchToSearch.vue'
import Keyword from '@/components/campaign/modules/google/Keyword.vue'
import OperatingSystem from '@/components/campaign/modules/google/OperatingSystem.vue'
import ConversionGoals from '@/components/campaign/modules/google/ConversionGoals.vue'
import Audience from '@/components/campaign/modules/google/Audience.vue'
import KeywordPlan from '@/components/campaign/modules/google/KeywordPlan.vue'
import KeywordGoogleSearch from '@/components/campaign/modules/google/KeywordGoogleSearch.vue'
import Network from '@/components/campaign/modules/google/Network.vue'
import BroadMatchKeyword from '@/components/campaign/modules/google/BroadMatchKeyword.vue'
import ScheduleCamp from '@/components/campaign/modules/google/ScheduleCamp.vue'
import { useLocale } from '@/lang/messages'
import PurchaseValue from '@/components/campaign/modules/PurchaseValue.vue'
import CampaignGGBidding from '@/components/campaign/modules/google/CampaignGGBidding.vue'

const Message = useLocale(
  () => import('@/lang/vi/messages'),
  () => import('@/lang/en/messages')
)

const AddDevInfo = defineAsyncComponent(
  () => import('@/components/campaign/AddDevInfo.vue')
)
const campaign2Store = useCampaign2Store()

const traffic_source = TS.GOOGLE
const isComp = window.arb.isCompany()

const demandComp = ref<InstanceType<typeof DemandSource>>()
const labelComp = ref<InstanceType<typeof Labels>>()
const locationComp = ref<InstanceType<typeof Location>>()
const biddingComp = ref<InstanceType<typeof CampaignGGBidding>>()
const modalCreativeComp = ref<InstanceType<typeof ModalCreative>>()

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

const statusData = ref(new StatusCampManager())

const feSettings = toRef(statusData.value, 'feSettings')
useFeSettings(feSettings, window.route?.meta?.url as string)

const sourceCopy = ref<string>()
const columnDefs = computed(() => {
  return colDefsByTs(campaign.value?.traffic_source as string)
})

const watchs = campWatch()
const methods = campMethod(campaign, FreezeData, statusData)

const locationDisplayName = computed(() => {
  if (!campaign.value?.location?.value?.length) return ''
  if (campaign.value.location.value.length > 5) return '(Many countries)'
  return (
    locationComp.value?.renderName || campaign.value.location.value.join(', ')
  )
})

const googleApiName = computed<string>(() => {
  let result =
    (campaign.value?.id ? `${campaign.value?.id}: ` : '') +
    `${helper.capitalizeFirstLetter(campaign.value.traffic_source)} -> `

  let nameArr: string[] = []

  if (campaign.value?.location?.value) {
    nameArr.push(locationDisplayName.value)
  }

  if (campaign.value?.label || campaign.value?.label == 0) {
    nameArr.push(labelComp.value?.labelNow || '')
  }

  if (campaign.value?.bidding) {
    nameArr.push(biddingComp.value?.renderName || '')
  }

  if (campaign.value?.origin_name) {
    nameArr.push(campaign.value.origin_name)
  }

  if (nameArr.length) {
    result += nameArr.join(' - ')
  }

  return result
})

const displayName = computed(() => {
  if (statusData.value.isLoading) {
    return ''
  }

  if (!campaign.value.traffic_source) {
    return ''
  }

  if (campaign.value.IsDemandAdsense() && campaign.value.IsAPI()) {
    return googleApiName.value
  }

  let result =
    (campaign.value?.id ? `${campaign.value?.id}: ` : '') +
    `${helper.capitalizeFirstLetter(campaign.value.traffic_source)} -> `

  let nameArr: string[] = []

  if (campaign.value.demand_source) {
    nameArr.push(demandComp?.value?.demandSourceName || '')
  }

  if (campaign.value?.location?.value?.length) {
    const locationType = campaign.value?.location?.type
      ? helper.capitalizeFirstLetter(campaign.value?.location?.type)
      : ''
    nameArr.push(`${locationType} ${locationDisplayName.value}`.trim())
  }

  if (campaign.value?.language?.length) {
    nameArr.push(campaign.value?.language?.join(', '))
  }

  if (campaign.value?.device?.length) {
    nameArr.push(campaign.value?.device.join(', '))
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
  const result = await ctr_campaign.Duplicate(FreezeData.duplicateId)

  if (result?.status) {
    campaign.value = new campaignTypeClass(result?.data || {})

    clone2Handle(mode)

    copyHandle()
  }

  campaign.value.HandleDuplicate()

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

  const cloneCreative = helper.clone(campaign.value.creative)

  sourceCopy.value = campaign.value.traffic_source

  campaign.value.account_supply_id = undefined
  campaign.value.bidding = undefined
  campaign.value.user = undefined
  campaign.value.creative = { id: 0 }

  if (campaign.value.location) {
    campaign.value.location.value = [] as string[]
  }

  campaign.value.traffic_source = TS.GOOGLE

  campaign.value.ad_groups = []

  campaign.value.SetAPI()
  campaign.value.SetTypeDemandGen()

  await helper.sleep(1)

  modalCreativeComp.value?.changeShowModalCreative(true)
  modalCreativeComp.value?.changeSourceCreative(cloneCreative)
}

onBeforeMount(() => {
  methods.beforeMountHandle()
  methods.fetchPermission(traffic_source)
})

onMounted(async () => {
  methods.onMountedHandle(fetchDuplicate, traffic_source)
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

      const errors = document.querySelectorAll('.error-search-themes')

      if (errors.length > 0) {
        window.message.warning('Search themes too long')
        return true
      }
    }
  }

  return false
}

const submitForm = async () => {
  if (campaign.value.IsGGSearch()) {
    if (!campaign.value.broad_match_keyword) {
      window.message.error('Please select Broad Match Keyword option')
      const el = document.getElementById('broad-match-keyword')
      helper.scrollToAndHighlight(el)
      return
    }
  }

  let stop = validateKeywordGGSearch()

  if (stop) {
    return
  }

  stop = validateAdGroup()
  if (stop) {
    return
  }

  methods.submitForm(computeds.payload, feSettings, true)
}

const validateKeywordGGSearch = () => {
  if (campaign.value.keywords_gg_search) {
    let invalid = []
    let keywords = campaign.value.keywords_gg_search.split(/[\n,]+/)
    for (let index = 0; index < keywords.length; index++) {
      const element = keywords[index]

      if (helper.countCharactersV2(element) > 80) {
        invalid.push(element)
      }
    }

    if (invalid.length > 0) {
      arb?.warningf(Message.value.campkeyword, {}, invalid.length)
      for (let index = 0; index < invalid.length; index++) {
        let pos = keywords.indexOf(invalid[index])
        keywords.splice(pos, 1)
      }

      campaign.value.keywords_gg_search = keywords.join('\n')
      return false
    }

    return false
  }
  return false
}

const addDevData = (campaignDev: campaignTypeClass) => {
  addDemoData(campaign, statusData, campaignDev)
}

watch(
  () => campaign2Store.reGetCampaign,
  async (newValue, oldValue) => {
    if (newValue) {
      methods.fetchCampaignGetById(traffic_source)
    }
  }
)
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
            <div class="flex gap-3 items-center">
              <AddDevInfo
                v-if="FreezeData.isAddPage()"
                :traffic_source="traffic_source"
                :statusData="statusData"
                @addDevData="addDevData"
              />
            </div>
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
            <n-card class="card-flex-gap-4 rounded-[5px] !border-gray2">
              <template #header>
                <span class="overflow-hidden text-ellipsis max-w-24">{{
                  title
                }}</span>
              </template>
              <template #header-extra>
                <HeaderExtra
                  :campaign="campaign"
                  v-if="FreezeData.isEditPage()"
                />
              </template>

              <DuplicateType
                :campaign="campaign"
                :FreezeData="FreezeData"
                @refetchData="refetchData"
                :class="{
                  'pointer-events-auto':
                    campaign.IsByBot() && FreezeData.isDuplicatePageV2(),
                }"
              />
              <Name
                :campaign="campaign"
                :FreezeData="FreezeData"
                :showName="computeds.showName.value"
              />
              <StatusComp :campaign="campaign" />
              <DeliveryStatusComp
                :campaign="campaign"
                v-if="FreezeData.isEditPage()"
              />
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

              <CampaignType :campaign="campaign" :FreezeData="FreezeData" />

              <TrafficSourceID :campaign="campaign" />

              <Labels
                :campaign="campaign"
                v-if="statusData.permission.label"
                ref="labelComp"
                :statusData="statusData"
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

              <SearchToSearch
                :campaign="campaign"
                :FreezeData="FreezeData"
                v-if="isComp"
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

            <n-card
              v-if="!campaign.IsAPIPublic()"
              v-show="
                campaign.demand_source &&
                (campaign.landing_pages ||
                  campaign.isShowUserFlow() ||
                  campaign.isShowVertical() ||
                  campaign.isShowGD())
              "
              title="Detail"
              class="relative card-flex-gap-4 rounded-[5px] !border-gray2"
            >
              <CategorySiteBuilder
                :statusData="statusData"
                :campaign="campaign"
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
                :statusData="statusData"
                :FreezeData="FreezeData"
                v-if="statusData.permission.prelanding"
              />

              <KeywordMacro
                :campaign="campaign"
                :FreezeData="FreezeData"
                v-if="statusData.permission.prelanding"
              />

              <Creative
                :campaign="campaign"
                :FreezeData="FreezeData"
                :statusData="statusData"
              />

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
                campaign.IsHasKeywordSet() ||
                campaign.IsOnSearch2Search()
              "
              class="card-flex-gap-4 rounded-[5px] !border-gray2"
            >
              <div class="flex flex-col gap-4">
                <MainKeyword :campaign="campaign" />

                <SecondaryKeyword :campaign="campaign" />

                <KeywordSet
                  ref="keywordSetComp"
                  :campaign="campaign"
                  :FreezeData="FreezeData"
                  :statusData="statusData"
                />

                <Keyword :campaign="campaign" />
              </div>
            </n-card>

            <n-card
              title="Targeting"
              class="card-flex-gap-4 rounded-[5px] !border-gray2"
            >
              <CampaignGGBidding
                :campaign="campaign"
                :FreezeData="FreezeData"
                ref="biddingComp"
              />
              <CampaignGGBudget :campaign="campaign" :FreezeData="FreezeData" />
              <Location
                :campaign="campaign"
                :FreezeData="FreezeData"
                ref="locationComp"
              />

              <LanguageMultiple :campaign="campaign" :FreezeData="FreezeData" />

              <Device
                :campaign="campaign"
                :FreezeData="FreezeData"
                :clearable="true"
              />
              <OperatingSystem :campaign="campaign" :FreezeData="FreezeData" />

              <ConversionGoals :campaign="campaign" :FreezeData="FreezeData" />

              <Audience :campaign="campaign" :FreezeData="FreezeData" />
              <KeywordPlan :campaign="campaign" :FreezeData="FreezeData" />
              <KeywordGoogleSearch
                :campaign="campaign"
                :FreezeData="FreezeData"
              />
            </n-card>
            <n-card
              title="Schedule / Date"
              class="card-flex-gap-4 rounded-[5px] !border-gray2"
            >
              <div class="flex flex-col gap-4">
                <ScheduleCamp :campaign="campaign" :FreezeData="FreezeData" />
                <div class="border-t border-gray-200"></div>
                <Schedule :campaign="campaign" />
              </div>
            </n-card>
            <OptimizeCampaign :FreezeData="FreezeData" :campaign="campaign" />
            <Network :campaign="campaign" />
            <BroadMatchKeyword :campaign="campaign" />

            <n-card
              title="Tools"
              class="rounded-[5px] !border-gray2"
              v-if="isComp"
            >
              <ToolKW />
            </n-card>

            <URLs :campaign="campaign" v-if="campaign.IsCloneCampaign()" />

            <div v-if="FreezeData.isEditPage()" class="flex flex-col gap-4">
              <URLs :campaign="campaign" />

              <!-- <CreativeTable
                :id="FreezeData.id"
                :columnDefs="columnDefs"
                :statusData="statusData"
              /> -->

              <PixelTable :campaign="campaign" />

              <TriggerTable :campaign="campaign" />
            </div>
          </div>

          <div class="ad_groups" v-show="statusData.IsTabAdGroup()">
            <!-- <AdGroupGeneralWrapper
              :campaign="campaign"
              :FreezeData="FreezeData"
              :statusData="statusData"
            /> -->
            <AdGroupsGoogleV2
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
<style lang="scss">
@use '@/css/CampaignDetail.scss';
</style>
