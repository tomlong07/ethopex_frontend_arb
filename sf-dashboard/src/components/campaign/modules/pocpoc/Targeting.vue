<script setup lang="ts">
import { SelectOption } from 'naive-ui'

import { campaignTypeClass } from '@/types/components/campaign-v2'
import { ctr_traffic_source } from '@/services/ctr_traffic_source'
import FloatingWrapper from '@/components/common/FloatingWrapper.vue'

const props = defineProps({
  campaign: {
    type: Object as () => campaignTypeClass,
    required: true,
  },
})
const isLoading = ref(false)
const targetOptions = ref<SelectOption[]>([])

const onChangeTargeting = (value: string | string[]) => {
  if (props.campaign.IsPlacementAdformat()) {
    props.campaign.targeting_adformat = value as string[]
  } else {
    props.campaign.targeting_active_view = value as string
  }
}

const fetchTargetingByTargetType = async () => {
  if (props.campaign.placement !== 'placement') {
    const result = await ctr_traffic_source.TargetingPocPoc({
      params: { type: props.campaign.placement },
    })
    if (result?.status) {
      targetOptions.value = result.data?.targets
    }
  }
}

onMounted(() => {
  if (props.campaign.IsShowTargeting()) {
    fetchTargetingByTargetType()
  }
})

watch(
  () => props.campaign.placement,
  (newValue, oldValue) => {
    props.campaign.targeting = undefined

    if (props.campaign.IsShowTargeting()) {
      fetchTargetingByTargetType()
    }
  }
)

const name = 'Targeting'
</script>

<template>
  <FloatingWrapper :name="name" rounded v-if="props.campaign.IsShowTargeting()">
    <n-select
      v-model:value="props.campaign.targeting"
      filterable
      value-field="value"
      label-field="name"
      :placeholder="name"
      :loading="isLoading"
      :multiple="props.campaign.IsPlacementAdformat()"
      :options="targetOptions"
      @update:value="onChangeTargeting"
    />
  </FloatingWrapper>
</template>
