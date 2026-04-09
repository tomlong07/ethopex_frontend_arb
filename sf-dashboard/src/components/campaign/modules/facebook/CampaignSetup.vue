<script setup lang="ts">
import { SelectOption } from 'naive-ui'

import {
  CampaignSetupFBSale,
  campaignTypeClass,
  FreezeClass,
} from '@/types/components/campaign-v2'
import Settings20Regular from '@/assets/icons/Settings20Regular.vue'
import { ONOFF, PLACEMENT_TYPE } from '@/enum/campaign'
import FloatingWrapper from '@/components/common/FloatingWrapper.vue'

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

const campaignSetupOptions = computed<SelectOption[]>(() => {
  if (props.campaign.IsSales()) return CampaignSetupFBSale

  return []
})

const isShow = computed(() => {
  return props.campaign.IsAPI() && props.campaign.IsSales()
})

//Xóa bỏ nếu nó không hiển thị -> tránh gửi thừa vào payload
watch(
  () => isShow.value,
  async (newValue, oldValue) => {
    if (newValue) {
      props.campaign.SetCampSetUpAdvantage()
    } else {
      props.campaign.campaign_setup = undefined
    }
  }
)

watch(
  () => props.campaign,
  () => {
    const IsBudgetAdvantage = !(
      props.campaign.advantage_campaign_budget === ONOFF.OFF &&
      props.campaign?.ad_groups &&
      props.campaign?.ad_groups?.length > 1
    )

    // tất cả ad_groups phải có placement_type === ADVANTAGE
    const IsPlacementAdvantage = props.campaign.ad_groups?.every(
      (item) => item.placement_type === PLACEMENT_TYPE.ADVANTAGE
    )

    // chỉ cần 1 ad_group có audience_type === ADVANTAGE
    const IsAudienceAdvantage = props.campaign.ad_groups?.some(
      (item) => item.audience_type === PLACEMENT_TYPE.ADVANTAGE
    )

    if (IsBudgetAdvantage && IsPlacementAdvantage && IsAudienceAdvantage) {
      props.campaign.SetCampSetUpAdvantage()
    } else {
      props.campaign.SetCampSetUpManual()
    }
  },
  { deep: true }
)

const name = 'Campaign Setup'
</script>

<template>
  <FloatingWrapper :name="name" rounded v-if="isShow">
    <div
      class="flex-1 min-w-0 grid grid-cols-1 sm:grid-cols-2 gap-4 border rounded-md pt-4 p-2"
    >
      <div
        v-for="(option, index) in campaignSetupOptions"
        :key="index"
        class="flex flex-col gap-2"
      >
        <n-tag
          class="h-12 min-h-12 flex justify-center custom-tag-fb"
          ghost
          :type="
            props.campaign.campaign_setup === option.value
              ? 'success'
              : undefined
          "
          :disabled="props.campaign.campaign_setup !== option.value"
        >
          <div class="flex gap-2 items-center justify-center min-w-0">
            <n-icon
              v-if="option.icon"
              class="flex items-center m-1 rounded-full p-2 cursor-pointer bg-gray-200 hover:bg-gray-300 flex-shrink-0"
              title="Edit"
              :component="Settings20Regular"
              size="32"
            />
            <n-image
              width="32"
              height="32"
              class="pointer-events-none flex-shrink-0"
              :src="option.img as string"
              v-else
            />
            <div
              class="truncate max-w-[50%] lg:max-w-[90%] break-words text-xs"
            >
              {{ option.label }}
            </div>
          </div>
        </n-tag>

        <span class="text-xs text-gray-500 break-words">{{ option.info }}</span>
      </div>
    </div>
  </FloatingWrapper>
</template>
