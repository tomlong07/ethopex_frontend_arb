<script setup lang="ts">
import QuestionCircleRegular from '@/assets/icons/QuestionCircleRegular.vue'
import FloatingWrapper from '@/components/common/FloatingWrapper.vue'
import { campaignTypeClass } from '@/types/components/campaign-v2'

const props = defineProps({
  campaign: {
    type: Object as () => campaignTypeClass,
    required: true,
  },
})

const isShow = computed(() => {
  return props.campaign.IsDemandPubPower() && props.campaign.IsByEPC()
})

watch(
  () => isShow.value,
  async (newValue, oldValue) => {
    if (!newValue) {
      props.campaign.min_epc = null
    }
  }
)

const name = 'Min EPC'
</script>

<template>
  <FloatingWrapper :name="name" rounded v-if="isShow">
    <n-input-number
      :min="0"
      :max="1000"
      v-model:value="props.campaign.min_epc"
      :placeholder="name"
    >
      <template #prefix> $ </template></n-input-number
    >
    <template #extra>
      <n-popover trigger="hover">
        <template #trigger>
          <n-icon size="14" :component="QuestionCircleRegular"></n-icon>
        </template>
        For Content ARB
      </n-popover></template
    >
  </FloatingWrapper>
</template>
