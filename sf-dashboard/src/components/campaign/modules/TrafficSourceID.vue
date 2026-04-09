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
  () => props.campaign.IsAPI(),
  async (newValue, oldValue) => {
    if (newValue === true) {
      props.campaign.traffic_source_id = ''
    }
  }
)

const name = 'Traffic Source ID'
</script>

<template>
  <FloatingWrapper v-if="!campaign.IsAPIPublic()" :name="name" rounded>
    <n-input
      v-model:value="props.campaign.traffic_source_id"
      :placeholder="name"
      :disabled="props.campaign.IsAPI()"
      class="w-full"
    />
  </FloatingWrapper>
</template>
