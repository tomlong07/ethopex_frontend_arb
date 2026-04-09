<script setup lang="ts">
import { campaignTypeClass } from '@/types/components/campaign-v2'

const props = defineProps({
  campaign: {
    type: Object as () => campaignTypeClass,
    required: true,
  },
})

const openOriginalCampaign = async () => {
  if (!props.campaign?.clone_by_id) {
    return
  }

  window.open(
    window.route.meta.include + '/' + props.campaign?.clone_by_id,
    '_blank'
  )
}

const email = computed(() => {
  return props.campaign?.user?.email || ''
})
</script>

<template>
  <div>
    <span class="font-xs italic text-gray-400">
      {{ email }}
    </span>
    <n-button
      v-if="props.campaign?.clone_by_id"
      color="#f43f5e"
      class="ml-2"
      type="default"
      :title="'ID: ' + props.campaign?.clone_by_id"
      @click="openOriginalCampaign"
    >
      Original Campaign
    </n-button>
  </div>
</template>
