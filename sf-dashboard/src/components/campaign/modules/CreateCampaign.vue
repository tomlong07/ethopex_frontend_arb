<!--  -->
<script setup lang="ts">
import {
  campaignTypeClass,
  FreezeClass,
  StatusCampManager,
} from '@/types/components/campaign-v2'
import { SelectOption } from 'naive-ui'
import { CREATE_CAMP, ONOFF, TS } from '@/enum/campaign'
import FloatingWrapper from '@/components/common/FloatingWrapper.vue'

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

const createCampaignOptions = computed<SelectOption[]>(() => {
  let options = [
    {
      label: 'API',
      value: 'api',
      disabled: !props.statusData?.isAcceptAPI(),
    },
    {
      label: 'Manual',
      value: 'manual',
      disabled: !props.statusData?.isAcceptManual(),
    },
  ]
  if (props.campaign.IsAPIPublic()) {
    options.push({
      label: 'API Public',
      value: 'api public',
      disabled: true,
    })
  }

  return options
})
const isDisabled = computed<boolean>(() => {
  if (props.campaign.IsNotChangeCreateCamp()) return true

  if (window.route.path.includes('general')) return true

  return props.FreezeData.isEditPage()
})

const updateCreateCampaign = (value: CREATE_CAMP) => {
  if (props.campaign.create_campaign === value) return
  props.campaign.create_campaign = value

  if (props.campaign.IsAPI()) {
    props.campaign.landing_page_by_creative = ONOFF.ON
    if (props.campaign.IsTrafficNewsbreak()) {
      props.campaign.AddDefaultAdgroupNewsbreak()
      return
    }
    props.campaign.SetNewCampaign(props.campaign.traffic_source as TS)
  } else {
    props.campaign.landing_page_by_creative = ONOFF.OFF
    props.campaign.ad_groups = undefined
  }
}

const name = 'Create Campaign'
</script>

<template>
  <FloatingWrapper :name="name" rounded required>
    <n-select
      v-model:value="props.campaign.create_campaign"
      :disabled="isDisabled"
      :placeholder="name"
      :options="createCampaignOptions"
      :on-update:value="updateCreateCampaign"
    />
  </FloatingWrapper>
</template>
