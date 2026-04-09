<script setup lang="ts">
import { campaignTypeClass, FreezeClass } from '@/types/components/campaign-v2'
import { ONOFF } from '@/enum/campaign'
import useLandingOption from '@/store/campaign/useLandingOption'
import LandingPageCore from '@/components/options/LandingPageCore.vue'

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

  show: {
    type: Boolean,
    default: false,
  },
})

const landingOptionStore = useLandingOption()

const isShow = computed<boolean>(() => {
  if (props.show) return true
  if (props.campaign.IsDemandBing1()) return false

  if (props.campaign.IsTrafficGoogle()) {
    if (props.campaign.IsOnSearch2Search()) return false
  }

  if (!props.FreezeData.isEditPage()) return false
  return props.campaign.demand_source ? true : false
})

onMounted(() => {
  if (!props.campaign.demand_source || !isShow.value) return

  landingOptionStore.manager.fetchOptions({
    demand_source: props.campaign.demand_source,
    f: props.item?.landing_page_id || undefined,
    prelander: props.campaign.prelanding === ONOFF.ON ? ONOFF.OFF : undefined,
    id: true,
    //Chỉ get mỗi landing đó cho nhanh query, vì ko đc sửa
  })
})
</script>

<template>
  <LandingPageCore
    v-if="
      isShow &&
      (props.item?.landing_page_id ||
        props.campaign.IsCreativeLandingByCreative())
    "
    v-model:value="props.item.landing_page_id"
    :manager="landingOptionStore.manager"
    disabled
  />
</template>
