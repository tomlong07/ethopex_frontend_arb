<script setup lang="ts">
import { SelectOption } from 'naive-ui'

import { campaignTypeClass, FreezeClass } from '@/types/components/campaign-v2'
import FloatingWrapper from '@/components/common/FloatingWrapper.vue'
import { buyingTypeOptions } from '@/options/campaign'

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

//Xóa bỏ nếu nó không hiển thị -> tránh gửi thừa vào payload
watch(
  () => props.campaign.IsAPI(),
  async (newValue, oldValue) => {
    if (newValue) {
      props.campaign.buying_type = 'AUCTION'
    } else {
      props.campaign.buying_type = undefined
    }
  }
)

const name = 'Buying Type'
</script>

<template>
  <FloatingWrapper :name="name" rounded v-if="props.campaign.IsAPI()">
    <n-select
      v-model:value="campaign.buying_type"
      :placeholder="name"
      :disabled="true"
      :options="buyingTypeOptions"
    />
  </FloatingWrapper>
</template>
