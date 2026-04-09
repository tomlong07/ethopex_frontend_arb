<script setup lang="ts">
import { campaignTypeClass, FreezeClass } from '@/types/components/campaign-v2'
import { AD_SETUP, DS, ONOFF } from '@/enum/campaign'
import useLandingOption from '@/store/campaign/useLandingOption'
import LandingPageCore from '@/components/options/LandingPageCore.vue'
import { CreativePropsType } from '../AdCreativeGeneralWrapper.vue'

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
  if (
    props.FreezeData.isDuplicatePage() &&
    props.item.creatives?.ad_setup === AD_SETUP.CREATE_AD &&
    !!props?.item.creatives?.landing_page_id
  ) {
    return true
  }
  if (
    !props.campaign.IsInternalLanding() &&
    props.campaign.IsCreativeLandingByCreative()
  ) {
    return true
  }

  if (props.campaign.IsTrafficGoogle()) {
    if (props.campaign.IsOnSearch2Search()) return false
  }

  if (!props.FreezeData.isEditPage()) return false
  return props.campaign.demand_source ? true : false
})

const isDisabled = computed(() => {
  if (props.FreezeData.isEditPage()) return true
  if (props.campaign.IsInternalLanding()) return true

  return false
})

watch(
  () => isShow.value,
  async (newValue, oldValue) => {
    if (newValue) {
      getLanding()
    }
  }
)

const getLanding = async () => {
  if (!props.campaign.demand_source || !isShow.value) return

  landingOptionStore.manager.fetchOptions({
    demand_source: props.campaign.demand_source as DS,
    f: props.item?.landing_page_id || undefined,
    prelander: props.campaign.prelanding === ONOFF.ON ? ONOFF.OFF : undefined,
    id: isDisabled.value,
    //nếu disabled Chỉ get mỗi landing đó cho nhanh query, vì ko đc sửa
  })
}

onMounted(() => {
  getLanding()
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
    :disabled="isDisabled"
  />
</template>
