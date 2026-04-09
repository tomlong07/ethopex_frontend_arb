<script setup lang="ts">
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
})

//Xóa bỏ nếu nó không hiển thị -> tránh gửi thừa vào payload
watch(
  () => props.campaign.IsDemandAdsense(),
  async (newValue, oldValue) => {
    if (newValue) {
      props.campaign.SetS2SOff()
    } else {
      props.campaign.search_to_search = undefined
    }
  }
)

const isDisabled = computed(() => {
  if (props.FreezeData.isEditPage()) return true
  if (props.campaign.IsCloneCampaign()) return true
  return false
})
</script>

<template>
  <div v-if="props.campaign.IsDemandAdsense()" class="flex items-center gap-2">
    <div class="font-bold text-xs w-40">Search To Search</div>
    <div class="flex-1 min-w-0 w-[calc(100%-10rem)]">
      <CustomSwitch
        v-model="props.campaign.search_to_search"
        type="onoff"
        true-label="On"
        false-label="Off"
        size="small"
        :disabled="isDisabled"
      />
    </div>
  </div>
</template>
