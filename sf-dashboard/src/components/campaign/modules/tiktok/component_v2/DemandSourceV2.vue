<script setup lang="ts">
import { SelectOption } from 'naive-ui'
import { CampaignContext } from '@/types/components/campaign-v2'
import { DS, ONOFF } from '@/enum/campaign'
import ctr_demand_source from '@/services/ctr_demand_source'
import FloatingWrapper from '@/components/common/FloatingWrapper.vue'

const props = defineProps({
  data: {
    type: Object as () => CampaignContext,
    required: true,
  },
})

const demandSourceName = computed<string>(() => {
  const found = demandOptions.value.find(
    (item: SelectOption) =>
      item.value === (props.data.campaign.demand_source as string)
  )
  return (found?.name as string) || ''
})

const fetchDemandSource = async () => {
  if (!props.data.campaign.traffic_source) return
  isLoading.value = true

  const result = await ctr_demand_source.GetByTrafficSource(
    props.data.campaign.traffic_source
  )
  demandOptions.value = result?.data || []

  isLoading.value = false
}

const isLoading = ref<boolean>(false)

const demandOptions = ref<SelectOption[]>([])

const demandProcess = async () => {
  await fetchDemandSource()

  if (!props.data.campaign.demand_source) {
    return
  }

  if (
    !demandOptions.value.length ||
    !demandOptions.value.find(
      (item) => item.value === props.data.campaign.demand_source
    )
  ) {
    props.data.campaign.demand_source = undefined
    return
  }
}

const isShow = computed<boolean>(() => {
  let val = props.data.campaign.traffic_source ? true : false

  // TS cũ
  return val
})

onMounted(async () => {
  if (isShow.value) demandProcess()
})

watch(
  () => isShow.value,
  (visible) => {
    if (!visible) return
    if (props.data.FreezeData.isEditPage()) return
    demandProcess()
  }
)

watch(
  () => demandSourceName.value,
  (newVal) => {
    props.data.statusData.demandSourceName = newVal
  }
)

const handleChange = (value: DS) => {
  props.data.campaign.demand_source = value

  if (props.data.campaign.IsDemandPubPower()) {
    props.data.campaign.landing_page_by_creative = ONOFF.OFF
  } else {
    props.data.campaign.landing_page_by_creative = ONOFF.ON
  }

  if (props.data.campaign.IsDemandBing2()) {
    props.data.campaign.SetDirectOff()
    props.data.campaign.landing_page_by_creative = ONOFF.OFF
  }

  if (props.data.campaign.IsDemandAdsense()) return
  if (props.data.campaign.IsTrafficNewsbreak()) return

  // props.campaign.create_campaign = CREATE_CAMP.API
}

const name = 'Demand Source'
</script>

<template>
  <FloatingWrapper :name="name" rounded required class="name-affect-comp">
    <n-select
      v-model:value="props.data.campaign.demand_source"
      label-field="name"
      value-field="value"
      clearable
      :disabled="
        props.data.FreezeData.isEditPage() ||
        !props.data.campaign.traffic_source
      "
      :loading="isLoading"
      :placeholder="name"
      :options="demandOptions"
      @update:value="handleChange"
    />
  </FloatingWrapper>
</template>
