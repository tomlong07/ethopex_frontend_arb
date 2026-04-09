<script setup lang="ts">
import {
  campaignTypeClass,
  FreezeClass,
  StatusCampManager,
} from '@/types/components/campaign-v2'
import CustomSwitch from '@/components/common/CustomSwitch.vue'
import { CREATE_CAMP } from '@/enum/campaign'

const props = defineProps({
  campaign: {
    type: Object as () => campaignTypeClass,
    required: true,
  },
  FreezeData: {
    type: Object as () => FreezeClass,
    required: true,
  },

  statusData: {
    type: Object as () => StatusCampManager,
    required: true,
  },
})

const isComp = window.arb.isCompany()

const isDisabled = computed(() => {
  if (!props.campaign.IsInternalLanding()) {
    if (props.campaign.IsDirectOff()) return true
  }
  if (props.statusData.permission.landing_by_creative) return false
  if (window.arb.isLead() || window.arb.isAdmin()) return false
  return !props.campaign.IsPrelandingOn()
})

const trigger = async () => {
  await nextTick()

  if (props.campaign.IsCreativeLandingByCreative()) {
    props.campaign.landing_pages = { id: null }
  } else {
    //Off landing by creative thì xóa bỏ đi, vì nó ở campaign
    if (
      !props.campaign.IsInternalLanding() &&
      props.FreezeData.isAddorDuplicate()
    ) {
      props.campaign.ResetLandingInAds()
    }
  }
}

const name = 'Create landing by creative'
</script>

<template>
  <div class="flex items-center gap-2" v-if="isComp && props.campaign.IsAPI()">
    <div class="text-xs font-bold w-40">{{ name }}</div>
    <div class="flex-1 min-w-0">
      <CustomSwitch
        v-model="props.campaign.landing_page_by_creative"
        type="onoff"
        true-label="On"
        false-label="Off"
        size="small"
        :disabled="props.FreezeData.isEditPage() || isDisabled"
        @change="trigger()"
      />
    </div>
  </div>
</template>
