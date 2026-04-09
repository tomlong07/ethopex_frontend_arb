<script setup lang="ts">
import FloatingWrapper from '@/components/common/FloatingWrapper.vue'
import { campaignTypeClass } from '@/types/components/campaign-v2'

const props = defineProps({
  campaign: {
    type: Object as () => campaignTypeClass,
    required: true,
  },
})

//Xóa bỏ nếu nó không hiển thị -> tránh gửi thừa vào payload
watch(
  () => props.campaign.isShowPricingRule(),
  async (newValue, oldValue) => {
    if (newValue === false) {
      props.campaign.pricingRule = undefined
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
    v-if="props.campaign.isShowPricingRule()"
  >
    <n-input-number
      v-model:value="props.campaign.pricingRule"
      :placeholder="name"
    >
    </n-input-number>
  </FloatingWrapper>
</template>
