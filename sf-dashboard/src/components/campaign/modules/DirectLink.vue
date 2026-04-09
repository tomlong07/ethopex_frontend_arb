<script setup lang="ts">
import { campaignTypeClass, FreezeClass } from '@/types/components/campaign-v2'

import CustomSwitch from '@/components/common/CustomSwitch.vue'
import { ONOFF } from '@/enum/campaign'

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

//Xóa bỏ nếu nó không hiển thị -> tránh gửi thừa vào payload
watch(
  () => props.campaign.isShowDirectLink(),
  async (newValue, oldValue) => {
    if (newValue) {
      props.campaign.SetDirectOn()
    } else {
      props.campaign.direct_link = undefined
    }
  }
)

const isDisabled = computed<boolean>(() => {
  if (props.FreezeData.isEditPage()) return true
  if (!props.campaign.IsInternalLanding()) return false

  return true // Khanh said the default to not use direct link = OFF (will enable it later if needed)
})

const updateDirectLink = async () => {
  await nextTick()

  if (props.campaign.IsDirectOff()) {
    props.campaign.landing_page_by_creative = ONOFF.OFF

    props.campaign.ResetLandingInAds()
  }
}
</script>

<template>
  <div
    v-if="props.campaign.isShowDirectLink() && !props.campaign.IsAPIPublic()"
    class="flex items-center gap-2"
  >
    <div class="text-xs font-bold" :class="props.class">Direct Link</div>
    <div class="flex-1 min-w-0 w-[calc(100%-10rem)]">
      <CustomSwitch
        v-model="props.campaign.direct_link"
        type="onoff"
        true-label="On"
        false-label="Off"
        size="small"
        :disabled="isDisabled"
        @change="updateDirectLink"
      />
    </div>
  </div>
</template>
