<script setup lang="ts">
import { CampaignContext } from '@/types/components/campaign-v2'

import CustomSwitch from '@/components/common/CustomSwitch.vue'

const props = defineProps({
  data: {
    type: Object as () => CampaignContext,
    required: true,
  },
  class: {
    type: String,
    default: 'w-40',
  },
})

//Xóa bỏ nếu nó không hiển thị -> tránh gửi thừa vào payload
watch(
  () => props.data.campaign.isShowDirectLink(),
  async (newValue, oldValue) => {
    if (newValue) {
      props.data.campaign.SetDirectOn()
    } else {
      props.data.campaign.direct_link = undefined
    }
  }
)

const isDisabled = computed<boolean>(() => {
  return true // Khanh said the default to not use direct link = OFF (will enable it later if needed)
  return (
    props.data.FreezeData.isEditPage() || props.data.campaign.IsTrafficGoogle()
  )
})
</script>

<template>
  <div
    v-if="props.data.campaign.isShowDirectLink()"
    class="flex items-center gap-2"
  >
    <div class="text-xs font-bold" :class="props.class">Direct Link</div>
    <div class="flex-1 min-w-0 w-[calc(100%-10rem)]">
      <CustomSwitch
        v-model="props.data.campaign.direct_link"
        type="onoff"
        true-label="On"
        false-label="Off"
        size="small"
        :disabled="isDisabled"
      />
    </div>
  </div>
</template>
