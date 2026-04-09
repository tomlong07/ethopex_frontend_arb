<script setup lang="ts">
import {
  campaignTypeClass,
  StatusCampManager,
  FreezeClass,
  scheduleItem,
  adGroups,
} from '@/types/components/campaign-v2'

import LanguageMultiple from '@/components/campaign/modules/LanguageMultiple.vue'
import Device from '@/components/campaign/modules/Device.vue'
import Location from '@/components/campaign/modules/Location.vue'

import { TIME_ZONE_TYPE } from '@/enum/campaign'
import { ctr_campaign } from '@/services/ctr_campaign'
import Ids from './Ids.vue'
import CreativeType from './CreativeType.vue'
import Gender from './Gender.vue'
import AgeGroup from './AgeGroup.vue'
import OptimizationGoal from './OptimizationGoal.vue'
import DeliveryType from './DeliveryType.vue'
import Placement from './Placement.vue'

const props = defineProps({
  ids: {
    type: Object as () => number[],
    default: () => {},
    required: true,
  },
  campaign: {
    type: Object as () => campaignTypeClass,
    required: true,
  },

  adGroupData: {
    type: Object as () => adGroups,
    required: true,
  },
  statusData: {
    type: Object as () => StatusCampManager,
    required: true,
  },
})

const adGroupFreezeData = helper.deepFreeze(
  new FreezeClass({ params: {}, query: {} } as any)
) as FreezeClass
type Dayparting = Record<string, number[]>

interface PayloadAdGroupEdit {
  ids: number[]
  status?: string
  device?: string[]
  budget?: number | null
  cpc?: number | null
  language?: string[]
  location?: { value?: string[]; type?: string }
  delivery_type?: string
  gender?: string
  age_groups?: string[]
  share_disabled?: boolean
  comment_disabled?: boolean
  schedule?: {
    dayparting?: string | string[] | null | Dayparting
    show_dayparting?: boolean
    time_zone_type?: TIME_ZONE_TYPE
    type?: string
    value?: scheduleItem[]
  }
  budget_optimize_on?: string
}

const submitForm = async () => {
  isSubmitBtnLoading.value = true

  const adGroupInfoSubmit: PayloadAdGroupEdit = {
    ids: props.ids,
    status: props.adGroupData.status,
    device: props.adGroupData.device,
    budget: props.adGroupData.budget,
    cpc: props.adGroupData.cpc,
    language: props.adGroupData.language,
    location: props.adGroupData.location,
    delivery_type: props.adGroupData.delivery_type,
    gender: props.adGroupData.gender,
    age_groups: props.adGroupData.age_groups,
    share_disabled: props.adGroupData.share_disabled,
    comment_disabled: props.adGroupData.comment_disabled,
    schedule: props.adGroupData.schedule,
    budget_optimize_on: props.adGroupData.budget_optimize_on,
  }

  const result = await ctr_campaign.EditAdGroup(adGroupInfoSubmit)
  if (result.status) {
    window.message.success(`Submit success!`)
  }

  isSubmitBtnLoading.value = false

  if (result.status) {
    if (props.ids.length > 1) {
      window.location.reload()
      return
    }
    closeModal()
  }
}

const isSubmitBtnLoading = ref(false)

const closeModal = () => {
  if (isSubmitBtnLoading.value) {
    window.message.info('Submitting ad group...')
    return
  }
  props.statusData.showModalAdGroup = false
}
</script>

<template>
  <n-modal
    v-model:show="props.statusData.showModalAdGroup"
    style="height: 95vh; width: 95vw"
    :close-on-esc="false"
    :mask-closable="false"
    @mask-click="closeModal"
    @esc="closeModal"
    class="p-2"
  >
    <n-card
      class="card-flex-gap-4 overflow-y-scroll"
      :title="'Ad Group Edit: ' + props.ids.join()"
    >
      <n-card title="Targeting" class="card-flex-gap-4">
        <Ids :ids="props.ids" />
        <Location
          :adgroup="adGroupData"
          :campaign="campaign"
          :FreezeData="adGroupFreezeData"
        />

        <CreativeType :adgroup="adGroupData" :campaign="campaign" />

        <Gender :adgroup="adGroupData" />
        <AgeGroup :adgroup="adGroupData" :campaign="campaign" />
        <LanguageMultiple
          :campaign="campaign"
          :adgroup="adGroupData"
          :FreezeData="adGroupFreezeData"
        />

        <Device
          :campaign="campaign"
          :adgroup="adGroupData"
          :FreezeData="adGroupFreezeData"
        />
      </n-card>
      <n-card title="Bidding & Optimization" class="card-flex-gap-4">
        <OptimizationGoal
          :campaign="campaign"
          :adgroup="adGroupData"
          :FreezeData="adGroupFreezeData"
        />

        <DeliveryType
          :campaign="campaign"
          :adgroup="adGroupData"
          :FreezeData="adGroupFreezeData"
        />
        <CampaignModuleBudget :campaign="campaign" :adgroup="adGroupData" />
      </n-card>

      <n-card title="Budget & Schedule" class="card-flex-gap-4">
        <CampaignTTBidding
          :campaign="campaign"
          :adgroup="adGroupData"
          :FreezeData="adGroupFreezeData"
        />

        <CampaignTTSchedule :campaign="campaign" :adgroup="adGroupData" />
      </n-card>

      <Placement
        :campaign="campaign"
        :adgroup="adGroupData"
        :FreezeData="adGroupFreezeData"
      />

      <div class="flex flex-row-reverse sticky bottom-0">
        <n-button
          color="#f43f5e"
          size="medium"
          type="success"
          :loading="isSubmitBtnLoading"
          @click="submitForm"
        >
          Submit
        </n-button>
      </div>
    </n-card>
  </n-modal>
</template>
