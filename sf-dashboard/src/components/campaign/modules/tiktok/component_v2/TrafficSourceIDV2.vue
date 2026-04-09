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
  () => props.data.campaign.IsAPI(),
  async (newValue, oldValue) => {
    if (newValue === true) {
      props.data.campaign.traffic_source_id = ''
    }
  }
)

const name = 'Traffic Source ID'
</script>

<template>
  <FloatingWrapper :name="name" rounded>
    <n-input
      v-model:value="props.data.campaign.traffic_source_id"
      :placeholder="name"
      :disabled="props.data.campaign.IsAPI()"
      class="w-full"
    />
  </FloatingWrapper>
</template>
