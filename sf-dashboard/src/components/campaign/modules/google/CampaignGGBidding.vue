<script setup lang="ts">
import { NTooltip, SelectOption } from 'naive-ui'

import { campaignTypeClass, FreezeClass } from '@/types/components/campaign-v2'

import {
  BiddingOptionsGGDisplay,
  BiddingOptionsGoogle,
} from '@/options/campaign'
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
})

const biddingOptions = computed<SelectOption[]>(() => {
  if (props.campaign.IsGGDisplay()) return BiddingOptionsGGDisplay

  if (props.campaign.IsPMax()) {
    return BiddingOptionsGoogle.filter(
      (option) => option.value !== 'targetSpend'
    )
  }

  return BiddingOptionsGoogle
})

const showBiddingControls = computed(() => {
  if (props.campaign.IsGGDisplay()) {
    const bidding = props.campaign.bidding ?? ''
    return ![
      'maximizeConversions',
      'maximizeConversionValue',
      'manual_cpc',
    ].includes(bidding)
  }

  return true
})

const onUpdateBidding = (value: string) => {
  props.campaign.bidding_status = false
  props.campaign.cpc = 0

  if (props.campaign.ad_groups) {
    props.campaign.ad_groups.forEach((element) => {
      //Default của google display
      if (props.campaign.IsManualCPC()) {
        element.cpc = 0.01
        element.bidding_status = true

        return
      }
      element.bidding_status = false
      element.cpc = 0
    })
  }
}

const onUpdateValueBidding = (value: boolean) => {
  props.campaign.bidding_status = value
  if (!value) {
    props.campaign.cpc = 0
  }

  if (props.campaign.ad_groups) {
    for (let index = 0; index < props.campaign.ad_groups.length; index++) {
      props.campaign.ad_groups[index].bidding_status = false
      props.campaign.ad_groups[index].cpc = 0
    }
  }
}

const renderOption = ({
  node,
  option,
}: {
  node: VNode
  option: SelectOption
}) => {
  if (option.disabled) {
    return h(NTooltip, null, {
      trigger: () => node,
      default: () => {
        return 'Not available'
      },
    })
  }

  return node
}
watch(
  () => props.campaign.campaign_type,
  async (newValue, oldValue) => {
    //Nếu khi đổi campaign_type, bidding đang chọn ko có thì đổi về option đầu tiên khả dụng
    if (
      !biddingOptions.value.find(
        (element) => element.value === props.campaign.bidding
      )
    ) {
      props.campaign.bidding = biddingOptions.value[0].value as string
    }
  }
)

onMounted(() => {
  if (!props.campaign.bidding) {
    props.campaign.bidding = biddingOptions.value[0].value as string
  }
  if (!props.campaign.cpc) props.campaign.cpc = 0
  if (!props.campaign.bidding_status) props.campaign.bidding_status = false
})

const renderName = computed<string>(() => {
  return (
    (biddingOptions.value.find(
      (option) => option.value === props.campaign.bidding
    )?.label as string) || ''
  )
})

defineExpose({
  renderName,
})
const displayDollar = computed(() => {
  return !['maximizeConversionValue', 'target_roas'].some((x) =>
    props.campaign.bidding?.includes(x)
  )
})
const displayPercent = computed(() => {
  return ['maximizeConversionValue', 'target_roas'].includes(
    props.campaign.bidding ?? ''
  )
})

const name = 'Bidding'
</script>

<template>
  <div class="flex gap-4 items-center">
    <div class="w-96">
      <FloatingWrapper :name="name" rounded class="name-affect-comp w-full">
        <n-select
          v-model:value="props.campaign.bidding"
          :placeholder="name"
          :options="biddingOptions"
          :render-option="renderOption"
          @update:value="onUpdateBidding"
        />
      </FloatingWrapper>
    </div>

    <div class="flex items-center gap-2" v-if="showBiddingControls">
      <n-checkbox
        v-model:checked="props.campaign.bidding_status"
        :disabled="
          props.campaign.IsDemandGen() &&
          props.campaign.bidding === 'targetSpend'
        "
        :on-update:checked="onUpdateValueBidding"
      >
      </n-checkbox>
      <FloatingWrapper name="Set Target" rounded>
        <n-input-number
          class="flex-grow"
          v-model:value="props.campaign.cpc"
          min="0"
          :disabled="!props.campaign.bidding_status"
          max="10000"
        >
          <template #prefix v-if="displayDollar"><span>$</span></template>
          <template #suffix v-if="displayPercent"><span>% </span></template>
        </n-input-number>
      </FloatingWrapper>
    </div>
  </div>
</template>
