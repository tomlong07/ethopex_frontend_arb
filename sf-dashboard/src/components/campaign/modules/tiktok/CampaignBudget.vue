<script setup lang="ts">
import { campaignTypeClass, FreezeClass } from '@/types/components/campaign-v2'
import Close from '@/assets/icons/Close.vue'

import AdGroupTag from '../adgroup/AdGroupTag.vue'
import Checkmark from '@/assets/icons/Checkmark.vue'

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
  () => props.campaign.IsAPI(),
  async (newValue, oldValue) => {
    if (newValue) {
      props.campaign.SetAdvantageCampaignBudgetOn()
    } else {
      props.campaign.advantage_campaign_budget = undefined
    }
  }
)

const isFistTimeInit = ref(false)

onMounted(() => {
  if (props.FreezeData.isAddPage()) {
    isFistTimeInit.value = true
  }
})

const name = 'Campaign budget'
</script>

<template>
  <div class="flex items-center gap-2">
    <div class="w-40 font-bold">{{ name }}</div>
    <div class="flex justify-between flex-1 min-w-0">
      <n-switch
        v-model:value="props.campaign.advantage_campaign_budget"
        checked-value="on"
        unchecked-value="off"
      >
        <template #checked-icon>
          <n-icon :component="Checkmark" color="#121212" />
        </template>
        <template #unchecked-icon> <n-icon :component="Close" /> </template
      ></n-switch>
      <AdGroupTag :campaign="props.campaign" type="budget" />
    </div>
  </div>
</template>
