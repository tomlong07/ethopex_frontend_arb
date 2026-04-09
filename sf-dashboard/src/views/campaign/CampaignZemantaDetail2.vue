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

import { ctr_campaign } from '@/services/ctr_campaign'
import { TS } from '@/enum/campaign'
import { useFeSettings } from '@/composables/feSettings'
import CampaignGeneralWrapper from '@/components/campaign/layout/CampaignGeneralWrapper.vue'
import ModalAdGeneralV2 from '@/components/campaign/modal/ModalAdGeneralV2.vue'

import DemandSource from '@/components/campaign/modules/DemandSource.vue'
import PolicyReview from '@/components/campaign/modules/PolicyReview.vue'
import HeaderExtra from '@/components/campaign/modules/HeaderExtra.vue'
import Name from '@/components/campaign/modules/Name.vue'
import StatusComp from '@/components/campaign/modules/StatusComp.vue'
import AccountSupply from '@/components/campaign/modules/AccountSupply.vue'
import TrafficSourceID from '@/components/campaign/modules/TrafficSourceID.vue'
import Prelanding from '@/components/campaign/modules/Prelanding.vue'
import PrelandingDomain from '@/components/campaign/modules/PrelandingDomain.vue'
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
import CreateCampaign from '@/components/campaign/modules/CreateCampaign.vue'
import CreateLandingPageByCreative from '@/components/campaign/modules/CreateLandingPageByCreative.vue'
import Creative from '@/components/campaign/modules/Creative.vue'
import AdsCamp from '@/components/campaign/modules/AdsCamp.vue'

import URLs from '@/components/campaign/modules/URLs.vue'
import CreativeTable from '@/components/campaign/modules/CreativeTable.vue'
import PixelTable from '@/components/campaign/modules/PixelTable.vue'
import TriggerTable from '@/components/campaign/modules/TriggerTable.vue'
import AdCreative from '@/components/campaign/modules/general/AdCreative.vue'

const demandComp = ref<InstanceType<typeof DemandSource>>()
const traffic_source = TS.ZEMANTA

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
const columnDefs = computed(() => {
  return colDefsByTs(campaign.value?.traffic_source as string)
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

  if (campaign.value.demand_source) {
    nameArr.push(demandComp?.value?.demandSourceName || '')
  }

  if (campaign.value?.location?.value?.length) {
    let location = ''

    if (campaign.value?.location?.type) {
      location = helper.capitalizeFirstLetter(campaign.value?.location?.type)
    }

    if (campaign.value.location.value.length > 5) {
      location += ' (Many countries)'
    } else {
      location += ' ' + campaign.value?.location?.value.join(', ')
    }
    nameArr.push(location)
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
          <PolicyReview
            :campaign="campaign"
            :FreezeData="FreezeData"
            :statusData="statusData"
          />
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
            <Tag
              :campaign="campaign"
              :statusData="statusData"
              v-if="statusData"
            />
          </n-card>

          <n-card
            v-if="!campaign.IsAPIPublic()"
            v-show="campaign.demand_source"
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

            <Creative
              :campaign="campaign"
              :FreezeData="FreezeData"
              :statusData="statusData"
            />

            <UserFlow :campaign="campaign" />
            <Vertical :campaign="campaign" :statusData="statusData" />
            <GD :campaign="campaign" :statusData="statusData" />

            <AdsCamp :campaign="campaign" :FreezeData="FreezeData" />
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
        <div class="flex flex-col gap-4">
          <n-card
            title="Tools"
            class="card-flex-gap-4 rounded-[5px] !border-gray2"
            v-if="isComp"
          >
            <ToolKW />
          </n-card>

          <div v-if="FreezeData.isEditPage()" class="flex flex-col gap-4">
            <URLs :campaign="campaign" />
            <AdCreative :campaign="campaign" :FreezeData="FreezeData" />

            <!-- <CreativeTable :id="FreezeData.id" :columnDefs="columnDefs" /> -->

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
