<script setup lang="ts">
import { SelectOption } from 'naive-ui'

import { campaignTypeClass } from '@/types/components/campaign-v2'
import FloatingWrapper from '@/components/common/FloatingWrapper.vue'
import { biddingStrategyOptions } from '@/options/campaign'

const props = defineProps({
  campaign: {
    type: Object as () => campaignTypeClass,
    required: true,
  },
})

const onChangeBiddingStrategy = (value: string) => {
  if (value !== '') {
    props.campaign.bidding = ''
    props.campaign.cpc = 0
  }
}

//Xóa bỏ nếu nó không hiển thị -> tránh gửi thừa vào payload
watch(
  () => props.campaign.IsAPI(),
  async (newValue, oldValue) => {
    if (newValue) {
      props.campaign.bidding_strategy = 'CPC/CPM'
    } else {
      props.campaign.bidding_strategy = undefined
    }
  }
)

const name = 'Bidding Strategy'
</script>

<template>
  <FloatingWrapper :name="name" rounded v-if="props.campaign.IsAPI()">
    <n-select
      v-model:value="props.campaign.bidding_strategy"
      :options="biddingStrategyOptions"
      :placeholder="name"
      @update:value="onChangeBiddingStrategy"
    />
  </FloatingWrapper>
</template>
