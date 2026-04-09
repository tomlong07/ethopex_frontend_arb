<script setup lang="ts">
import {
  adGroups,
  campaignTypeClass,
  FreezeClass,
} from '@/types/components/campaign-v2'
import { SelectOption } from 'naive-ui'
import { ctr_traffic_source } from '@/services/ctr_traffic_source'
import RedDot from '@/components/common/RedDot.vue'
import { BIDSTRATEGY } from '@/enum/campaign'
import CustomSwitch from '@/components/common/CustomSwitch.vue'
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
const isLoading = ref(false)

const shouldShowInput = computed<boolean>(() => {
  return (
    props.adgroup.bid_strategy === BIDSTRATEGY.VO_MIN_ROAS ||
    props.adgroup.bid_strategy === BIDSTRATEGY.BIDCUSTOM
  )
})
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

const isDisabledBidding = computed<boolean>(() => {
  return (
    props.campaign.budget_optimize_on === 'on' &&
    props.campaign.type === 'TRAFFIC' &&
    props.adgroup.optimization_goal === 'TRAFFIC_LANDING_PAGE_VIEW'
  )
})
const biddingOptions = ref<SelectOption[]>([])
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

watch(
  () => isDisabledROAS.value,
  async (newValue, oldValue) => {
    if (newValue) {
      if (props.campaign.bidding === 'VO_MIN_ROAS') {
        props.campaign.bidding = ''
      }
    }
  }
)

// watch(
//   () => isDisabledBidding.value,
//   async (newValue, oldValue) => {
//     if (newValue) {
//       props.campaign.bidding = BIDSTRATEGY.VO_MIN_ROAS
//     }
//   }
// )

const bidStrategy = computed({
  get: () => {
    return (
      props.adgroup.bid_strategy === BIDSTRATEGY.VO_MIN_ROAS ||
      props.adgroup.bid_strategy === BIDSTRATEGY.BIDCUSTOM
    )
  },
  set: (value: boolean) => {
    if (props.campaign.optimization_goal === 'VALUE') {
      props.adgroup.bid_strategy = value
        ? BIDSTRATEGY.VO_MIN_ROAS
        : BIDSTRATEGY.VO_HIGHEST_VALUE
    } else {
      props.adgroup.bid_strategy = value
        ? BIDSTRATEGY.BIDCUSTOM
        : BIDSTRATEGY.BIDNOBID
    }
  },
})

watch(
  () => props.campaign.optimization_goal,
  async (newValue, oldValue) => {
    console.log(newValue)

    if (newValue === 'VALUE') {
      props.adgroup.bid_strategy = createBiddingOptions.value[1]
        .value as BIDSTRATEGY
    } else {
      props.adgroup.bid_strategy = biddingOptionsShow.value[1]
        .value as BIDSTRATEGY
    }
  }
)
watch(
  () => props.campaign.budget_optimize_on,
  async (newValue, oldValue) => {
    if (newValue === 'on' && props.campaign.optimization_goal != 'VALUE') {
      props.adgroup.bid_strategy = BIDSTRATEGY.BIDNOBID
    }
  }
)

onMounted(() => {
  if (props.campaign.IsAPI()) {
    fetchBiddingByTraffic()
  }
})
const handleBidStrategyValue = (value: string) => {
  if (value) {
    props.adgroup.bid_strategy = BIDSTRATEGY.VO_MIN_ROAS
  } else {
    props.adgroup.bid_strategy = BIDSTRATEGY.VO_HIGHEST_VALUE
  }
}
const handleBidStrategyConvert = (value: string) => {
  if (value) {
    props.adgroup.bid_strategy = BIDSTRATEGY.BIDCUSTOM
  } else {
    props.adgroup.bid_strategy = BIDSTRATEGY.BIDNOBID
  }
}

watch(
  () => bidStrategy.value,
  async (newValue, oldValue) => {
    if (!newValue) {
      props.adgroup.cpc = null
    }
  }
)
const displayBiddingText = computed(() => {
  if (
    props.campaign.type === 'TRAFFIC' ||
    props.campaign.optimization_goal === 'CONVERT'
  ) {
    return 'Target CPA'
  }
  if (props.campaign.optimization_goal === 'VALUE') {
    return 'Target ROAS'
  }
  return ''
})
const name = 'Bidding'
</script>

<template>
  <div
    class="grid grid-cols-[auto,1fr] grid-rows-[auto,auto] gap-x-2 gap-y-2 items-start"
    v-if="props.campaign.budget_optimize_on !== 'on'"
  >
    <div
      class="text-xs font-bold whitespace-nowrap flex items-center col-start-1 row-start-1 w-29"
    >
      {{ name }}
      <RedDot />
    </div>

    <div class="flex items-center gap-2 col-start-2 row-start-1">
      <CustomSwitch
        v-if="props.campaign.optimization_goal === 'VALUE'"
        v-model="bidStrategy"
        :disabled="
          props.FreezeData.isEditPage() &&
          (props.campaign.IsSmartCreated() ||
            (!!props.adgroup.id && !!props.adgroup.ad_group_id))
        "
        @update:value="handleBidStrategyValue"
        type="boolean"
        true-label="On"
        false-label="Off"
        size="small"
      />
      <CustomSwitch
        v-else
        v-model="bidStrategy"
        :disabled="
          (props.FreezeData.isEditPage() || isDisabledBidding) &&
          (props.campaign.IsSmartCreated() ||
            (!!props.adgroup.id && !!props.adgroup.ad_group_id))
        "
        @update:value="handleBidStrategyConvert"
        type="boolean"
        true-label="On"
        false-label="Off"
        size="small"
      />
      <span class="whitespace-nowrap">{{ displayBiddingText }}</span>
    </div>

    <div
      class="flex items-center gap-2 col-start-1 col-span-2 row-start-2"
      v-if="shouldShowInput"
    >
      <FloatingWrapper rounded class="w-auto">
        <n-input-number v-model:value="props.adgroup.cpc" style="width: 220px">
          <template #prefix><span>$</span></template>
        </n-input-number>
      </FloatingWrapper>
    </div>
  </div>
</template>
