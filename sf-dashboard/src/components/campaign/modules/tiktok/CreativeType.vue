<script setup lang="ts">
import { campaignTypeClass } from '@/types/components/campaign-v2'
import Close from '@/assets/icons/Close.vue'

import Checkmark from '@/assets/icons/Checkmark.vue'

const props = defineProps({
  campaign: {
    type: Object as () => campaignTypeClass,
    required: true,
  },
})
</script>

<template>
  <div class="flex items-center">
    <div class="w-1/6 font-bold">Creative Type</div>
    <div class="w-5/6 flex items-center">
      <n-switch
        v-model:value="props.campaign.creative_type"
        checked-value="DYNAMIC"
        unchecked-value="CUSTOM"
        disabled
      >
        <template #checked-icon>
          <n-icon :component="Checkmark" color="#121212" />
        </template>
        <template #unchecked-icon> <n-icon :component="Close" /> </template
      ></n-switch>
      <div class="pl-2">Automated creative optimization</div>
    </div>
  </div>
</template>
