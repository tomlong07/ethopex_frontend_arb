<script setup lang="ts">
import { campaignTypeClass, FreezeClass } from '@/types/components/campaign-v2'
import useCreativeOption from '@/store/campaign/useCreativeOption'
import CreativeCore from '@/components/options/CreativeCore.vue'

const props = defineProps({
  campaign: {
    type: Object as () => campaignTypeClass,
    required: true,
  },

  FreezeData: {
    type: Object as () => FreezeClass,
    required: true,
  },

  item: {
    type: Object as () => any,
    required: true,
  },
})

const creativeOptionStore = useCreativeOption()

onMounted(() => {
  if (!props.campaign.traffic_source) return

  creativeOptionStore.manager.fetchOptions({
    traffic_source: props.campaign.traffic_source,
    id: props.item?.creative_id || undefined,
  })
})
</script>

<template>
  <CreativeCore
    v-if="
      props.item?.creative_id || props.campaign.IsCreativeLandingByCreative()
    "
    v-model:value="props.item.creative_id"
    :manager="creativeOptionStore.manager"
    :item="item"
    :campaign="campaign"
    disabled
  />
</template>
