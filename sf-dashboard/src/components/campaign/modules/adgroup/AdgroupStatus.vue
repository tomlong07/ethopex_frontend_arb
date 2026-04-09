<script lang="ts" setup>
import {
  adGroups,
  campaignTypeClass,
  FreezeClass,
} from '@/types/components/campaign-v2'
import CustomSwitch from '@/components/common/CustomSwitch.vue'

const props = defineProps({
  campaign: {
    type: Object as () => campaignTypeClass,
    required: true,
  },

  adgroup: {
    type: Object as () => adGroups,
    required: true,
  },
  FreezeData: {
    type: Object as () => FreezeClass,
    required: true,
  },
})
</script>

<template>
  <div
    class="flex items-center gap-2"
    v-if="
      !props.campaign.IsSmart() &&
      props.FreezeData.isEditPage() &&
      !!props.adgroup.id
    "
  >
    <div class="text-xs font-bold w-29">Status</div>
    <div class="flex-1 min-w-0 w-[calc(100%-10rem)]">
      <CustomSwitch
        v-model="props.adgroup.status"
        type="onoff"
        true-label="On"
        false-label="Off"
        size="small"
      />
    </div>
  </div>
</template>
