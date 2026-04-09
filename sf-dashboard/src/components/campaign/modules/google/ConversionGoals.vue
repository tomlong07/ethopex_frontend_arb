<script setup lang="ts">
import { campaignTypeClass, FreezeClass } from '@/types/components/campaign-v2'
import { ConversionGoalsOptions } from '@/options/campaign'
import FloatingWrapper from '@/components/common/FloatingWrapper.vue'

const props = defineProps({
  campaign: {
    type: Object as () => campaignTypeClass,
    required: true,
  },

  FreezeData: {
    type: Object as () => FreezeClass,
    required: true,
  },

  isDisabled: {
    type: Boolean,
    default: false,
  },
})

const isShow = computed<boolean>(() => {
  return props.campaign.IsAPI()
})

watch(
  () => isShow.value,
  async (newValue, oldValue) => {
    if (!newValue) {
      props.campaign.conversion_goals = null
    }
  }
)

const name = 'Conversion goals'
</script>

<template>
  <FloatingWrapper :name="name" rounded v-if="isShow">
    <n-select
      filterable
      v-model:value="props.campaign.conversion_goals"
      :placeholder="name"
      :options="ConversionGoalsOptions"
    />
  </FloatingWrapper>
</template>
