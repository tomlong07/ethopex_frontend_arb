<script setup lang="ts">
import { SelectOption } from 'naive-ui'
import {
  campaignTypeClass,
  FreezeClass,
  StatusCampManager,
} from '@/types/components/campaign-v2'
import { DS, ONOFF } from '@/enum/campaign'
import ctr_demand_source from '@/services/ctr_demand_source'
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

const demandSourceName = computed<string>(() => {
  const found = demandOptions.value.find(
    (item: SelectOption) =>
      item.value === (props.campaign.demand_source as string)
  )
  return (found?.name as string) || ''
})

const fetchDemandSource = async () => {
  if (!props.campaign.traffic_source) return
  isLoading.value = true

  const result = await ctr_demand_source.GetByTrafficSource(
    props.campaign.traffic_source
  )
  demandOptions.value = result?.data || []

  isLoading.value = false
}

const isLoading = ref<boolean>(false)

const demandOptions = ref<SelectOption[]>([])

const demandProcess = async () => {
  await fetchDemandSource()

  if (!props.campaign.demand_source) return

  if (
    !demandOptions.value.length ||
    !demandOptions.value.find(
      (item) => item.value === props.campaign.demand_source
    )
  ) {
    props.campaign.demand_source = null
    return
  }
}

onMounted(async () => {
  if (props.campaign.traffic_source) demandProcess()
})

watch(
  () => props.campaign.traffic_source,
  (newVal, _) => {
    if (props.FreezeData.isEditPage()) return

    if (newVal) demandProcess()
  }
)

defineExpose({
  demandSourceName,
})

const handleChange = (value: DS) => {
  props.campaign.demand_source = value

  if (props.campaign.IsDemandPubPower()) {
    props.campaign.landing_page_by_creative = ONOFF.OFF
  } else {
    if (props.campaign.IsAPI()) {
      props.campaign.landing_page_by_creative = ONOFF.ON
    }
  }

  if (props.campaign.IsDemandBing2()) {
    props.campaign.SetDirectOff()
    props.campaign.landing_page_by_creative = ONOFF.OFF
  }

  if (props.campaign.IsDemandAdsense()) return
  if (props.campaign.IsTrafficNewsbreak()) return

  // props.campaign.create_campaign = CREATE_CAMP.API
}

const name = 'Demand Source'
</script>

<template>
  <FloatingWrapper :name="name" rounded required class="name-affect-comp">
    <n-select
      v-model:value="props.campaign.demand_source"
      label-field="name"
      value-field="value"
      clearable
      :disabled="
        props.FreezeData.isEditPage() || !props.campaign.traffic_source
      "
      :loading="isLoading"
      :placeholder="name"
      :options="demandOptions"
      @update:value="handleChange"
    />
  </FloatingWrapper>
</template>
