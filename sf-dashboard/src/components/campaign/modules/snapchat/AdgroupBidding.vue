<script setup lang="ts">
import { SelectOption } from 'naive-ui'

import { campaignTypeClass, adGroups } from '@/types/components/campaign-v2'
import FloatingWrapper from '@/components/common/FloatingWrapper.vue'
import { linkField } from './helpers'
import { biddingOptions } from '@/options/campaign'

const props = defineProps({
  campaign: {
    type: Object as () => campaignTypeClass,
    required: true,
  },
  adGroup: {
    type: Object as () => adGroups,
    required: true,
  },
})

const biddingModel = linkField<string | null>('bidding', [() => props.adGroup])

const cpcModel = linkField<number | null>('cpc', [() => props.adGroup])

const handleBiddingChange = () => {
  cpcModel.value = 0
}

//Xóa bỏ nếu nó không hiển thị -> tránh gửi thừa vào payload
watch(
  () => props.campaign.IsAPI(),
  (isApi) => {
    if (isApi) {
      biddingModel.value = 'AUTO_BID'
    } else {
      biddingModel.value = null
      cpcModel.value = null
    }
  }
)

const name = 'Bidding'
</script>

<template>
  <FloatingWrapper :name="name" rounded v-if="props.campaign.IsAPI()">
    <n-input-group>
      <n-select
        v-model:value="biddingModel"
        class="w-2/5"
        :placeholder="name"
        :options="biddingOptions"
        @update:value="handleBiddingChange"
      />
      <n-input-number
        v-model:value="cpcModel"
        :disabled="biddingModel === 'AUTO_BID'"
        class="w-3/5"
      >
        <template #prefix><span>$</span></template>
      </n-input-number>
    </n-input-group>
  </FloatingWrapper>
</template>
