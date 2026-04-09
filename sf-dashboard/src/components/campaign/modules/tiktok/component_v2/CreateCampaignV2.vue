<script setup lang="ts">
import { CampaignContext } from '@/types/components/campaign-v2'
import { SelectOption } from 'naive-ui'
import { CREATE_CAMP } from '@/enum/campaign'
import FloatingWrapper from '@/components/common/FloatingWrapper.vue'

const props = defineProps({
  data: {
    type: Object as () => CampaignContext,
    required: true,
  },
})

const createCampaignOptions = computed<SelectOption[]>(() => {
  return [
    {
      label: 'API',
      value: 'api',
      disabled: !props.data.statusData?.isAcceptAPI(),
    },
    {
      label: 'Manual',
      value: 'manual',
      disabled: !props.data.statusData?.isAcceptManual(),
    },
  ]
})

const isDisabled = computed<boolean>(() => {
  if (props.data.campaign.IsNotChangeCreateCamp()) return true

  if (window.route.path.includes('general')) return true

  return props.data.FreezeData.isEditPage()
})

watch(
  () => props.data.campaign.create_campaign,
  async (newValue, oldValue) => {
    if (newValue === CREATE_CAMP.API) {
      props.data.campaign.AddDefaultAdgroupNewsbreak()
    } else {
      props.data.campaign.ad_groups = undefined
    }
  }
)

const name = 'Create Campaign'
</script>

<template>
  <FloatingWrapper :name="name" rounded required>
    <n-select
      v-model:value="props.data.campaign.create_campaign"
      :disabled="isDisabled"
      :placeholder="name"
      :options="createCampaignOptions"
    />
  </FloatingWrapper>
</template>
