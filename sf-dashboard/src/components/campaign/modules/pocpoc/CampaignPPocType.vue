<script setup lang="ts">
import { SelectOption } from 'naive-ui'

import { campaignTypeClass, FreezeClass } from '@/types/components/campaign-v2'
import FloatingWrapper from '@/components/common/FloatingWrapper.vue'
import { campaignTypePocpoc } from '@/options/campaign'

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

const campaignTypeOptions: SelectOption[] = campaignTypePocpoc

//Xóa bỏ nếu nó không hiển thị -> tránh gửi thừa vào payload
watch(
  () => props.campaign.IsAPI(),
  async (newValue, oldValue) => {
    if (newValue) {
      if (props.campaign) {
        props.campaign.SetTypeNative()
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
