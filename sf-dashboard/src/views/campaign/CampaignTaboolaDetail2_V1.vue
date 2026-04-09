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
} from '@/components/campaign/composables/campaign'

import ActionButtonsV2 from '@/components/campaign/modules/ActionButtonsV2.vue'
import AdFormats from '@/components/campaign/modules/AdFormats.vue'
import DemandSource from '@/components/campaign/modules/DemandSource.vue'
import HeaderExtra from '@/components/campaign/modules/HeaderExtra.vue'
import PolicyReview from '@/components/campaign/modules/PolicyReview.vue'
import ToolKW from '@/components/campaign/modules/ToolKW.vue'
import TaboolaScheduleCalendar from '@/components/campaign/modules/taboola/ScheduleCalendar.vue'
import GeneralAdCreative from '@/components/campaign/modules/general/AdCreative.vue'
import * as AsyncComp from '@/components/campaign/async'

import BackPage from '@/components/common/BackPage.vue'
import ModalAdGeneral from '@/components/campaign/modal/ModalAdGeneral.vue'
import { ctr_campaign } from '@/services/ctr_campaign'
import { TS } from '@/enum/campaign'
import { useFeSettings } from '@/composables/feSettings'

const CopyCampaignModal = defineAsyncComponent(
  () => import('@/components/campaign/modal/CopyCampaignModal.vue')
)
const isMobile = helper.mobileDetect()
const traffic_source = TS.TABOOLA
const isComp = window.arb.isCompany()

const demandComp = ref<InstanceType<typeof DemandSource>>()

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

  if (campaign.value.demand_source) {
    nameArr.push(demandComp?.value?.demandSourceName || '')
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
  <div class="wrapper flex flex-col bg-base px-3 flex-1">
    <CampaignDraftConfirm :campaign="campaign" :statusData="statusData" />

    <div class="h-screen flex flex-col bg-base my-12 flex-1 gap-4">
      <BackPage
        :url="feSettings.page_list"
        :name="title"
        v-if="feSettings.page_list"
      />
      <Skeleton v-if="statusData.isLoading" />
      <n-grid x-gap="14" y-gap="14" :cols="isMobile ? 1 : 2" v-else>
        <n-gi class="flex flex-col gap-4">
          <PolicyReview
            :campaign="campaign"
            :FreezeData="FreezeData"
            :statusData="statusData"
          />
          <n-card :title="title" class="card-flex-gap-4">
            <template #header-extra v-if="FreezeData.isEditPage()">
              <HeaderExtra :campaign="campaign" />
            </template>
            <!-- Đã lấy nội dung -->
          </n-card>

          <n-card
            v-show="campaign.demand_source"
            title="Detail"
            class="card-flex-gap-4"
          >
            <!-- Đã lấy nội dung -->
          </n-card>

          <AdFormats :campaign="campaign" :statusData="statusData" />

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
              <!-- Đã lấy nội dung -->
            </div>
          </n-card>

          <n-card
            title="Targeting"
            class="card-flex-gap-4"
            v-show="campaign.IsAPI()"
          >
            <!-- Đã lấy nội dung -->
          </n-card>
        </n-gi>
        <n-gi class="flex flex-col gap-4">
          <n-card title="Tools" v-if="isComp">
            <ToolKW />
          </n-card>

          <TaboolaScheduleCalendar :campaign="campaign" />

          <div v-if="FreezeData.isEditPage()" class="flex flex-col gap-4">
            <AsyncComp.URLs :campaign="campaign" />
            <GeneralAdCreative :campaign="campaign" :FreezeData="FreezeData" />
            <!-- <AsyncComp.CreativeTable
              :id="FreezeData.id"
              :columnDefs="columnDefs"
            /> -->

            <AsyncComp.PixelTable :campaign="campaign" />

            <AsyncComp.TriggerTable :campaign="campaign" />
          </div>
        </n-gi>
      </n-grid>
    </div>
    <CopyCampaignModal v-if="FreezeData.isEditPage()" />

    <ActionButtonsV2
      :campaign="campaign"
      :FreezeData="FreezeData"
      :statusData="statusData"
      @submitForm="submitForm"
    />
    <ModalAdGeneral :ts="traffic_source" :campaign="campaign" />
  </div>
</template>
<style lang="scss">
@use '@/css/CampaignDetail.scss';
</style>
