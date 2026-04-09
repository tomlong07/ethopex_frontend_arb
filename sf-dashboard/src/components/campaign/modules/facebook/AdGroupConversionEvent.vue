<script setup lang="ts">
import { SelectOption } from 'naive-ui'

import {
  adGroups,
  campaignTypeClass,
  FreezeClass,
  GroupIs,
} from '@/types/components/campaign-v2'
import { ctr_pixel } from '@/services/ctr_pixel'
import FloatingWrapper from '@/components/common/FloatingWrapper.vue'

const props = defineProps({
  campaign: {
    type: Object as () => campaignTypeClass,
    required: true,
  },
  adgroup: {
    type: Object as () => adGroups,
    required: true,
  },

  FreezeData: {
    type: Object as () => FreezeClass,
    required: true,
  },
})

const conversionEventOptionsNew = ref<SelectOption[]>([])

const conversionEventShow = computed(() => {
  switch (true) {
    case props.campaign.IsSales():
      return conversionEventOptionsNew.value.map((option) => ({
        ...option,
        disabled: !['SEARCH', 'VIEW_CONTENT', 'PURCHASE'].includes(
          option.value as string
        ),
      }))

    case props.campaign.IsLeads():
      //Lead + maximize value of conversions
      //Search + CompleteRegistration + Purchase
      if (GroupIs.PerformanceGoalValue(props.adgroup)) {
        return conversionEventOptionsNew.value.map((option) => ({
          ...option,
          disabled: !['SEARCH', 'COMPLETE_REGISTRATION', 'PURCHASE'].includes(
            option.value as string
          ),
        }))
      }
      return conversionEventOptionsNew.value.map((option) => ({
        ...option,
        disabled: ![
          'SEARCH',
          'VIEW_CONTENT',
          'LEAD',
          'COMPLETE_REGISTRATION',
        ].includes(option.value as string),
      }))
  }

  return conversionEventOptionsNew.value
})

watch(
  () => props.adgroup.pixel,
  async (newValue, oldValue) => {
    if (newValue) {
      fetchConversionEvent()
    }
  }
)

watch(
  () => props.adgroup.performance_goal,
  () => {
    if (props.campaign.IsLeads()) {
      props.adgroup.conversion_event = null
    }
  }
)

const fetchConversionEvent = async () => {
  if (props.adgroup.pixel) {
    let result = await ctr_pixel.ListEventFacebook(props.adgroup.pixel)

    result = {
      status: true,
      data: [
        {
          label: 'Search',
          value: 'SEARCH',
        },
        {
          label: 'ViewContent',
          value: 'CONTENT_VIEW',
        },
        {
          label: 'CompleteRegistration',
          value: 'COMPLETE_REGISTRATION',
        },
        {
          label: 'Purchase',
          value: 'PURCHASE',
        },
        {
          label: 'Lead',
          value: 'LEAD',
        },
      ],
    }

    conversionEventOptionsNew.value = result?.data || []
  }
}

onMounted(() => {
  if (props.adgroup.pixel) {
    fetchConversionEvent()
  }
})

const isDisabled = computed(() => {
  if (!props.adgroup.pixel) return true

  if (props.FreezeData.isEditPage() && !props.campaign.traffic_source_id)
    return false

  if (
    props.FreezeData.isEditPage() &&
    !!props.adgroup.id &&
    !!props.adgroup.ad_group_id
  )
    return true

  return false
})

const name = 'Conversion event'
</script>

<template>
  <FloatingWrapper :name="name" rounded required>
    <n-select
      v-model:value="props.adgroup.conversion_event"
      :placeholder="name"
      :disabled="isDisabled"
      :options="conversionEventShow"
    />
  </FloatingWrapper>
</template>
