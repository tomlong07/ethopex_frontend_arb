<script setup lang="ts">
import FloatingWrapper from '@/components/common/FloatingWrapper.vue'
import {
  campaignTypeClass,
  FreezeClass,
  campaignType,
} from '@/types/components/campaign-v2'

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

const campaignTypeOptions = computed(() => {
  return campaignType
})

//Xóa bỏ nếu nó không hiển thị -> tránh gửi thừa vào payload
watch(
  () => props.campaign.IsAPI(),
  async (newValue, oldValue) => {
    if (newValue) {
      if (props.campaign) {
        props.campaign.SetTypeGGSearch()
      }
    } else {
      props.campaign.campaign_type = undefined
    }
  }
)

const name = 'Campaign Type'
</script>

<template>
  <FloatingWrapper :name="name" rounded v-if="props.campaign.IsAPI()">
    <n-select
      :disabled="props.FreezeData.isEditPage()"
      :placeholder="name"
      v-model:value="props.campaign.campaign_type"
      :options="campaignTypeOptions"
    />
  </FloatingWrapper>
</template>
