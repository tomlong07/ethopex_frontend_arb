<script setup lang="ts">
import {
  campaignTypeClass,
} from '@/types/components/campaign-v2'
import CustomSwitch from '@/components/common/CustomSwitch.vue'

const props = defineProps({
  campaign: {
    type: Object as () => campaignTypeClass,
    required: true,
  },
})

const isComp = window.arb.isCompany()

const name = 'Related search ad'
</script>

<template>
  <div class="flex items-center gap-2" v-if="isComp">
    <div class="text-xs font-bold w-40">{{ name }}</div>
    <div class="flex-1 min-w-0">
      <CustomSwitch
        v-model="props.campaign.related_search_ad"
        type="onoff"
        true-label="On"
        false-label="Off"
        size="small"
      />
    </div>
  </div>
</template>
