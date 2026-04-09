<script setup lang="ts">
import { SelectOption } from 'naive-ui'

import { campaignTypeClass } from '@/types/components/campaign-v2'
import FloatingWrapper from '@/components/common/FloatingWrapper.vue'
import { placeTargetOptions } from '@/options/campaign'

const props = defineProps({
  campaign: {
    type: Object as () => campaignTypeClass,
    required: true,
  },
})

const name = 'Advanced placements & targeting'
</script>

<template>
  <FloatingWrapper :name="name" rounded>
    <n-select
      :placeholder="name"
      v-model:value="props.campaign.placement"
      filterable
      :options="placeTargetOptions"
    />
  </FloatingWrapper>
</template>
