<script setup lang="ts">
import {
  adGroups,
  campaignTypeClass,
  FreezeClass,
} from '@/types/components/campaign-v2'
import { SelectOption } from 'naive-ui'
import { ctr_traffic_source } from '@/services/ctr_traffic_source'

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
const isLoading = ref(false)

const isDisabledROAS = computed<boolean>(() => {
  return (
    props.campaign.budget_optimize_on === 'on' &&
    props.adgroup.optimization_goal === 'VALUE'
  )
})

const createBiddingOptions = computed<SelectOption[]>(() => {
  return [
    {
      label: 'Set minimum ROAS',
      value: 'VO_MIN_ROAS',
      disabled: isDisabledROAS.value,
    },
    { label: 'Highest value', value: 'VO_HIGHEST_VALUE' },
  ]
})

const biddingOptions = ref<SelectOption[]>([])

const isDisabledBidding = computed<boolean>(() => {
  return (
    props.campaign.budget_optimize_on === 'on' &&
    props.campaign.type === 'TRAFFIC' &&
    props.adgroup.optimization_goal === 'TRAFFIC_LANDING_PAGE_VIEW'
  )
})

const biddingOptionsShow = computed<SelectOption[]>(() => {
  if (!isDisabledBidding.value) return biddingOptions.value

  let options: SelectOption[] = []
  for (let index = 0; index < biddingOptions.value.length; index++) {
    const element = biddingOptions.value[index]
    const newElement = helper.clone(element)
    if (element.value !== 'BID_TYPE_NO_BID') {
      options.push({ ...newElement, disabled: true })
    } else {
      options.push(newElement)
    }
  }

  return options
})

const fetchBiddingByTraffic = async () => {
  isLoading.value = true
  const result = await ctr_traffic_source.GetBidding({
    traffic_source: props.campaign.traffic_source,
  })
  biddingOptions.value = result?.data || []

  isLoading.value = false
}

//Xóa bỏ nếu nó không hiển thị -> tránh gửi thừa vào payload
watch(
  () => props.campaign.IsAPI(),
  async (newValue, oldValue) => {
    if (newValue) {
      await fetchBiddingByTraffic()
    } else {
      props.campaign.bidding = undefined
    }
  }
)

onMounted(() => {
  if (props.campaign.IsAPI()) {
    fetchBiddingByTraffic()
  }
})

const name = 'Bidding'
</script>

<template>
  <div class="flex items-center gap-2">
    <div class="w-40 font-bold">{{ name }}</div>
    <div class="flex-1 min-w-0">
      <n-input-group>
        <n-select
          v-if="props.adgroup.optimization_goal === 'VALUE'"
          v-model:value="props.campaign.bidding"
          class="w-2/5"
          :placeholder="name"
          :disabled="props.FreezeData.isEditPage()"
          :options="createBiddingOptions"
        />
        <n-select
          v-else
          v-model:value="props.campaign.bid_strategy"
          value-field="value"
          label-field="label"
          class="w-2/5"
          :placeholder="name"
          :disabled="props.FreezeData.isEditPage() || isDisabledBidding"
          :loading="isLoading"
          :options="biddingOptionsShow"
        />
        <n-input-number
          v-model:value="props.campaign.cpc"
          class="w-3/5"
          :disabled="
            props.campaign.bidding === 'VO_HIGHEST_VALUE' ||
            props.campaign.bidding === 'BID_TYPE_NO_BID'
          "
        >
          <template #prefix><span>$</span></template>
        </n-input-number>
      </n-input-group>
    </div>
  </div>
</template>
