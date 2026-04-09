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
  () => props.campaign.IsHasMainKeyword(),
  async (newValue, oldValue) => {
    if (newValue === false) {
      props.campaign.main_keyword = undefined
    }
  }
)

const name = 'Main Keyword'
</script>

<template>
  <FloatingWrapper
    :name="name"
    rounded
    v-if="props.campaign.IsHasMainKeyword()"
  >
    <n-input
      v-model:value="props.campaign.main_keyword"
      :placeholder="name"
      class="w-full"
    />
  </FloatingWrapper>
</template>
