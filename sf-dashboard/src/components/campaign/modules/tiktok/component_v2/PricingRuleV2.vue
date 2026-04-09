<script setup lang="ts">
import FloatingWrapper from '@/components/common/FloatingWrapper.vue'
import { CampaignContext } from '@/types/components/campaign-v2'

const props = defineProps({
  data: {
    type: Object as () => CampaignContext,
    required: true,
  },
})

//Xóa bỏ nếu nó không hiển thị -> tránh gửi thừa vào payload
watch(
  () => props.data.campaign.isShowPricingRule(),
  async (newValue, oldValue) => {
    if (newValue === false) {
      props.data.campaign.pricingRule = undefined
    }
  }
)

const name = 'Pricing Rule'
</script>

<template>
  <FloatingWrapper
    :name="name"
    rounded
    required
    v-if="props.data.campaign.isShowPricingRule()"
  >
    <n-input-number
      v-model:value="props.data.campaign.pricingRule"
      :placeholder="name"
    >
    </n-input-number>
  </FloatingWrapper>
</template>
