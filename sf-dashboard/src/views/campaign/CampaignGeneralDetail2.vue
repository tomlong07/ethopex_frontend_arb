<script setup lang="ts">
import {
  campaignTypeClass,
  newCampaignClass,
  FreezeClass,
  StatusCampManager,
} from '@/types/components/campaign-v2'

import { colDefsByTs } from '@/columns/campaign'

import {
  campComputed,
  campWatch,
  campMethod,
} from '@/components/campaign/composables/campaign'

import ModalCreative from '@/components/campaign/modal/ModalCreative.vue'

import { ctr_campaign } from '@/services/ctr_campaign'
import { TS } from '@/enum/campaign'
import { useFeSettings } from '@/composables/feSettings'
import ModalAdGeneralV2 from '@/components/campaign/modal/ModalAdGeneralV2.vue'
import CampaignGeneralWrapper from '@/components/campaign/layout/CampaignGeneralWrapper.vue'

import DemandSource from '@/components/campaign/modules/DemandSource.vue'
import HeaderExtra from '@/components/campaign/modules/HeaderExtra.vue'
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

import Creative from '@/components/campaign/modules/Creative.vue'

import URLs from '@/components/campaign/modules/URLs.vue'
import CreativeTable from '@/components/campaign/modules/CreativeTable.vue'
import PixelTable from '@/components/campaign/modules/PixelTable.vue'
import TriggerTable from '@/components/campaign/modules/TriggerTable.vue'
import AdCreative from '@/components/campaign/modules/general/AdCreative.vue'
import TargetCountry from '@/components/campaign/modules/TargetCountry.vue'
import TargetKeyword from '@/components/campaign/modules/TargetKeyword.vue'
import TargetDevice from '@/components/campaign/modules/TargetDevice.vue'
import TargetTrafficSource from '@/components/campaign/modules/TargetTrafficSource.vue'

const traffic_source = TS.NONE

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

const isComp = window.arb.isCompany()

const statusData = ref(new StatusCampManager())
const feSettings = toRef(statusData.value, 'feSettings')

useFeSettings(feSettings, window.route?.meta?.url as string)

const sourceCopy = ref<string>()
const columnDefs = computed(() => {
  return colDefsByTs('general')
})

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

const isArbTraffic = computed(() => {
  return String(campaign.value?.traffic_source) === 'arbtraffic'
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
  methods.fetchPermission('general')
})

onMounted(async () => {
  methods.onMountedHandle(fetchDuplicate, traffic_source)
})

const submitForm = async () => {
  methods.submitForm(computeds.payload, feSettings)
}
</script>
<template>
  <CampaignGeneralWrapper
    :campaign="campaign"
    :FreezeData="FreezeData"
    :statusData="statusData"
    @submit="submitForm"
  >
    <div class="flex flex-col flex-1">
      <div class="campaign space-y-4" v-show="statusData.IsTabCampaign()">
        <div class="flex flex-col gap-4">
          <n-card
            title="Campaign"
            class="card-flex-gap-4 rounded-[5px] !border-gray2"
          >
            <template #header-extra v-if="FreezeData.isEditPage()">
              <HeaderExtra :campaign="campaign" />
            </template>

            <Name
              :campaign="campaign"
              :FreezeData="FreezeData"
              :showName="computeds.showName.value"
            />

            <StatusComp :campaign="campaign" />
            <CampaignModuleTrafficSource
              :campaign="campaign"
              :FreezeData="FreezeData"
            />

            <AccountSupply
              :campaign="campaign"
              :FreezeData="FreezeData"
              :statusData="statusData"
            />

            <DemandSource
              :statusData="statusData"
              ref="demandComp"
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
              :campaign="campaign"
              :statusData="statusData"
              v-if="statusData.permission.label"
            />

            <PricingRule :campaign="campaign" />

            <DirectLink
              :campaign="campaign"
              :FreezeData="FreezeData"
              class="w-20"
            />
            <Prelanding
              :campaign="campaign"
              :FreezeData="FreezeData"
              v-if="statusData.permission.prelanding"
              class="w-20"
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
        </div>
        <div class="flex flex-col gap-4" v-if="isArbTraffic">
          <n-card
            title="Target Keyword"
            class="card-flex-gap-4 rounded-[5px] !border-gray2"
          >
            <TargetKeyword
              :campaign="campaign"
              :statusData="statusData"
              v-if="statusData"
            />
            <TargetCountry :campaign="campaign" />
            <TargetDevice :campaign="campaign" :clearable="true" />
            <TargetTrafficSource :campaign="campaign" />
          </n-card>
        </div>
        <div class="flex flex-col gap-4">
          <n-card
            title="Tools"
            class="card-flex-gap-4 rounded-[5px] !border-gray2"
            v-if="
              isComp &&
              !(campaign.IsTrafficARBTraffic() && campaign.IsDemandArbCore())
            "
          >
            <ToolKW />
          </n-card>

          <div v-if="FreezeData.isEditPage()" class="flex flex-col gap-4">
            <URLs :campaign="campaign" />
            <AdCreative :campaign="campaign" :FreezeData="FreezeData" />
            <CreativeTable
              :id="FreezeData.id"
              :columnDefs="columnDefs"
              v-if="
                !(campaign.IsTrafficARBTraffic() && campaign.IsDemandArbCore())
              "
            />

            <PixelTable :campaign="campaign" />

            <TriggerTable :campaign="campaign" />
          </div>
        </div>
      </div>
    </div>
    <ModalAdGeneralV2 :campaign="campaign" />
  </CampaignGeneralWrapper>
</template>
<style lang="scss">
@use '@/css/CampaignDetail.scss';
</style>
