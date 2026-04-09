<script setup lang="ts">
import FloatingWrapper from '@/components/common/FloatingWrapper.vue'
import { userFlowOptions } from '@/options/campaign'
import { campaignTypeClass } from '@/types/components/campaign-v2'

const props = defineProps({
  campaign: {
    type: Object as () => campaignTypeClass,
    required: true,
  },
})

const onUpdateUserFlowValue = (value: string) => {
  props.campaign.user_flow = value

  if (value === '3click') {
    props.campaign.gd = 'AP1005627'
    return
  }

  props.campaign.gd = undefined
}

//Xóa bỏ nếu nó không hiển thị -> tránh gửi thừa vào payload
watch(
  () => props.campaign.isShowUserFlow(),
  async (newValue, oldValue) => {
    if (!newValue) {
      props.campaign.user_flow = undefined
    }
  }
)

const name = 'User Flow'
</script>

<template>
  <FloatingWrapper :name="name" rounded v-if="props.campaign.isShowUserFlow()">
    <n-select
      :placeholder="name"
      v-model:value="props.campaign.user_flow"
      :options="userFlowOptions"
      :on-update:value="onUpdateUserFlowValue"
    />
  </FloatingWrapper>
</template>
