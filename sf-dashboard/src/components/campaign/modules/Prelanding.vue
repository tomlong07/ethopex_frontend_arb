<script setup lang="ts">
import { ONOFF } from '@/enum/campaign'
import { campaignTypeClass, FreezeClass } from '@/types/components/campaign-v2'
import CustomSwitch from '@/components/common/CustomSwitch.vue'

const props = defineProps({
  campaign: {
    type: Object as () => campaignTypeClass,
    required: true,
  },
  FreezeData: {
    type: Object as () => FreezeClass,
    required: true,
  },
  class: {
    type: String,
    default: 'w-40',
  },
})

const isShow = computed(() => {
  return props.campaign.IsDemandAdsense() || props.campaign.IsDemandBing1()
})

watch(
  () => isShow.value,
  (newVal) => {
    if (newVal) {
      if (!props.campaign.prelanding) {
        props.campaign.prelanding = ONOFF.OFF
      }
    } else {
      props.campaign.prelanding = null
    }
  }
)

const trigger = async () => {
  await nextTick()

  if (props.campaign.IsPrelandingOn()) {
    props.campaign.landing_page_by_creative = ONOFF.OFF
  } else {
    props.campaign.landing_pages = { id: null }
  }
}

const name = 'Prelanding'
</script>

<template>
  <div class="flex items-center gap-2" v-if="isShow">
    <div class="text-xs font-bold" :class="props.class">{{ name }}</div>
    <div class="flex-1 min-w-0 w-[calc(100%-10rem)]">
      <CustomSwitch
        v-model="props.campaign.prelanding"
        type="onoff"
        true-label="On"
        false-label="Off"
        size="small"
        :disabled="
          props.FreezeData.isEditPage() &&
          (props.campaign.traffic_source_id ? true : false)
        "
        @change="trigger()"
      />
    </div>
  </div>
</template>
