<script setup lang="ts">
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

watch(
  () => props.campaign.IsSmart(),
  (newValue) => {
    if (newValue) {
      props.adgroup.placement_type = 'PLACEMENT_TYPE_AUTOMATIC'
      props.adgroup.placements = undefined
    } else {
      props.adgroup.placement_type = 'PLACEMENT_TYPE_NORMAL'
      props.adgroup.placements = ['PLACEMENT_TIKTOK']
    }
  },
  { immediate: true }
)
</script>

<template>
  <n-card
    v-if="props.campaign.IsAPI()"
    title="Placement"
    class="card-flex-gap-4"
  >
    <div class="flex items-center">
      <div class="w-1/6 font-bold">&nbsp;</div>
      <div class="w-5/6 flex flex-col items-center gap-4">
        <!-- placement type -->
        <div class="w-full">
          <n-radio-group
            v-model:value="props.adgroup.placement_type"
            :disabled="
              props.FreezeData.isEditPage() && !!props.adgroup.ad_group_id
            "
          >
            <div class="flex flex-col">
              <n-radio
                value="PLACEMENT_TYPE_AUTOMATIC"
                :disabled="!props.campaign.IsSmart()"
                class="flex mb-2"
              >
                <div class="text-lg text-gray-600">Automatic placement</div>
                <div class="font-xs text-gray-400">
                  Automatically show your ads across supported placement.
                </div>
              </n-radio>
              <n-radio
                value="PLACEMENT_TYPE_NORMAL"
                :disabled="props.campaign.IsSmart()"
                class="flex"
              >
                <div class="text-lg text-gray-600">Select placement</div>
                <div class="font-xs text-gray-400">
                  Manually choose your targeting placement.
                </div>
              </n-radio>
            </div>
          </n-radio-group>
        </div>
        <!-- placements -->
        <div
          v-show="props.adgroup.placement_type === 'PLACEMENT_TYPE_NORMAL'"
          class="w-full"
        >
          <n-checkbox-group
            v-model:value="props.adgroup.placements"
            :disabled="
              props.campaign.IsSmart() ||
              (props.FreezeData.isEditPage() && !!props.adgroup.ad_group_id)
            "
          >
            <div class="flex flex-col ml-6">
              <n-checkbox value="PLACEMENT_TIKTOK"> TikTok </n-checkbox>
              <n-checkbox
                value="PLACEMENT_PANGLE"
                :disabled="!props.campaign.IsSmart()"
              >
                Pangle
              </n-checkbox>
            </div>
          </n-checkbox-group>
        </div>
        <!-- user comment -->
        <div class="flex flex-col w-full">
          <div class="flex">
            <CustomSwitch
              v-model="props.adgroup.comment_disabled"
              type="boolean"
              true-label="On"
              false-label="Off"
              size="small"
            />
            <div class="pl-2 font-semibold">User comment</div>
          </div>
          <div class="font-xs text-gray-400">
            We recommend keeping user comments on to help your ads achieve more
            impressions and conversions. You can hide, pin, and reply to
            comments using our management tools.
          </div>
        </div>
        <!-- video download -->
        <div class="flex w-full">
          <CustomSwitch
            v-model="adgroup.video_download_disabled"
            type="boolean"
            true-label="On"
            false-label="Off"
            size="small"
          />

          <div class="pl-2 font-semibold">Video download</div>
        </div>
        <!-- video sharing -->
        <div class="flex w-full">
          <CustomSwitch
            v-model="props.adgroup.share_disabled"
            type="boolean"
            true-label="On"
            false-label="Off"
            size="small"
          />

          <div class="pl-2 font-semibold">Video sharing</div>
        </div>
      </div>
    </div>
  </n-card>
</template>
