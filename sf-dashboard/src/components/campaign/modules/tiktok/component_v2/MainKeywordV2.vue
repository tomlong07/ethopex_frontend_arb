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
  () => props.data.campaign.IsHasMainKeyword(),
  async (newValue, oldValue) => {
    if (newValue === false) {
      props.data.campaign.main_keyword = undefined
    }
  }
)

const name = 'Main Keyword'
</script>

<template>
  <FloatingWrapper
    :name="name"
    rounded
    v-if="props.data.campaign.IsHasMainKeyword()"
  >
    <n-input
      v-model:value="props.data.campaign.main_keyword"
      :placeholder="name"
      class="w-full"
    />
  </FloatingWrapper>
</template>
