<script setup lang="ts">
import { SelectOption } from 'naive-ui'

import { campaignTypeClass } from '@/types/components/campaign-v2'
import { BiddingBidControl, BiddingMaxConversion } from '@/options/campaign'
import FloatingWrapper from '@/components/common/FloatingWrapper.vue'

const props = defineProps({
  campaign: {
    type: Object as () => campaignTypeClass,
    required: true,
  },
})

const biddingOptions = computed<SelectOption[]>(() => {
  switch (true) {
    case props.campaign.IsBidControl():
      return BiddingBidControl

    case props.campaign.IsMaxConversion():
      return BiddingMaxConversion

    default:
      return []
  }
})

//Xóa bỏ nếu nó không hiển thị -> tránh gửi thừa vào payload
watch(
  () => props.campaign.IsAPI(),
  async (newValue, oldValue) => {
    if (newValue) {
      props.campaign.bidding = 'OPTIMIZED_CONVERSIONS'
    } else {
      props.campaign.bidding = undefined
    }
  }
)

//Auto xóa bỏ cpc
watch(
  () => props.campaign.bidding,
  async (newValue, oldValue) => {
    props.campaign.cpc = 0
  }
)

const name = 'Bidding'
</script>

<template>
  <FloatingWrapper :name="name" rounded v-if="props.campaign.IsAPI()">
    <div class="flex-1 min-w-0 rounded-md">
      <n-input-group>
        <n-select
          v-model:value="campaign.bidding"
          class="w-2/5"
          :placeholder="name"
          :options="biddingOptions"
        />
        <n-input-number
          v-model:value="campaign.cpc"
          :disabled="campaign.bidding === 'MAX_CONVERSIONS'"
          class="w-3/5"
        >
          <template #prefix><span>$</span></template>
        </n-input-number>
      </n-input-group>
    </div>
  </FloatingWrapper>
</template>
