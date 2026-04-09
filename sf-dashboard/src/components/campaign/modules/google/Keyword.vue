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
  () => props.campaign.IsOnSearch2Search(),
  async (newValue, oldValue) => {
    if (newValue) {
    } else {
      props.campaign.keywords = undefined
    }
  }
)

const name = 'Keyword'
</script>

<template>
  <FloatingWrapper
    :name="name"
    rounded
    v-if="props.campaign.IsOnSearch2Search()"
  >
    <n-input
      v-model:value="props.campaign.keywords"
      :placeholder="name"
      :disabled="props.campaign.IsCloneCampaign()"
    />
  </FloatingWrapper>
</template>
