<script setup lang="ts">
import { CampaignContext } from '@/types/components/campaign-v2'
import CustomSwitch from '@/components/common/CustomSwitch.vue'
import { CREATE_CAMP } from '@/enum/campaign'

const props = defineProps({
  data: {
    type: Object as () => CampaignContext,
    required: true,
  },
})

const isComp = window.arb.isCompany()

const isDisabled = computed(() => {
  if (window.arb.isLead() || window.arb.isAdmin()) return false
  return !props.data.campaign.IsPrelandingOn()
})

const trigger = async () => {
  await nextTick()

  if (props.data.campaign.IsCreativeLandingByCreative()) {
    props.data.campaign.landing_pages = { id: null }
  }
}

const name = 'Create landing by creative'
</script>

<template>
  <div
    class="flex items-center gap-2"
    v-if="isComp && props.data.campaign.create_campaign === CREATE_CAMP.API"
  >
    <div class="text-xs font-bold w-40">{{ name }}</div>
    <div class="flex-1 min-w-0">
      <CustomSwitch
        v-model="props.data.campaign.landing_page_by_creative"
        type="onoff"
        true-label="On"
        false-label="Off"
        size="small"
        :disabled="props.data.FreezeData.isEditPage() || isDisabled"
        @change="trigger()"
      />
    </div>
  </div>
</template>
