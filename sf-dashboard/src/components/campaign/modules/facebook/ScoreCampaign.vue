<script lang="ts" setup>
import {
  campaignTypeClass,
  FreezeClass,
  StatusCampManager,
} from '@/types/components/campaign-v2'

import Note from '@/assets/icons/Note.vue'
import Point from '@/assets/icons/Point.vue'

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
const expandedNamesRef = ref<string[]>([])

const currentAdGroup = computed(() => {
  const index = props.statusData.adGroupIndex ?? 0
  return props.campaign.ad_groups?.[index] as any
})

const campaignRcm = computed(() => (props.campaign as any).recommendations)
const creativeRcm = computed(() => {
  const crIndex = props.statusData.creativeIndex ?? 0
  if (currentAdGroup.value?.ad_creative?.[crIndex]) {
    return currentAdGroup.value.ad_creative[crIndex].recommendations
  }
  return null
})

const isShow = computed(() => {
  if (props.statusData.IsTabCampaign()) return !!campaignRcm.value
  if (props.statusData.IsTabAdGroup())
    return props.campaign.ad_groups?.some((ad: any) => ad.recommendations)
  if (props.statusData.IsTabCreative())
    return props.campaign.ad_groups?.some((ad: any) =>
      ad.ad_creative?.some((c: any) => c.recommendations)
    )
  return false
})

const expandedNames = computed(() => {
  const names: string[] = []
  if (props.statusData.IsTabCampaign() && campaignRcm.value)
    names.push('campaign')
  if (props.statusData.IsTabAdGroup()) {
    const adGroupIndex = props.statusData.adGroupIndex ?? 0
    const adGroup = props.campaign.ad_groups?.[adGroupIndex]
    if (adGroup && (adGroup as any).recommendations) {
      names.push(`adGroup-${adGroupIndex}`)
    }
  }
  if (props.statusData.IsTabCreative() && creativeRcm.value)
    names.push('creative')
  return names
})

watch(
  expandedNames,
  (newNames) => {
    expandedNamesRef.value = newNames
  },
  { immediate: true }
)
</script>
<template>
  <n-card
    class="rounded-lg !border-gray2 main-darkmode-cl-camp"
    v-if="FreezeData.isEditPage() && isShow"
  >
    <template #header>
      <div class="text-sm font-semibold flex items-center gap-2">
        <n-icon :component="Note" size="16" />
        Recommendations
      </div>
    </template>
    <n-collapse
      class="border-none bg-transparent"
      v-model:expanded-names="expandedNamesRef"
    >
      <n-collapse-item
        v-if="props.statusData.IsTabCampaign() && campaignRcm"
        title="Campaign"
        name="campaign"
      >
        <template #header-extra>
          <div
            class="text-xs flex justify-start items-center gap-1 px-3 p-1 bg-[#608aca2d] rounded-xl"
            v-if="campaignRcm?.recommendation_content?.opportunity_score_lift"
          >
            <n-icon :component="Point" size="16" color="#608aca" />
            <span class="text-[#608aca]">
              +{{ campaignRcm?.recommendation_content?.opportunity_score_lift }}
              points
            </span>
          </div>
        </template>
        <div class="flex flex-col space-y-1">
          <div class="text-sm items-center flex gap-2 font-semibold">
            {{ campaignRcm?.recommendation_content?.lift_estimate }}
          </div>
          <div
            class="text-xs text-gray-600"
            v-html="campaignRcm?.recommendation_content?.body"
          ></div>
        </div>
      </n-collapse-item>

      <n-collapse-item
        v-if="
          props.statusData.IsTabAdGroup() && currentAdGroup?.recommendations
        "
        :title="`Ad Group: ${currentAdGroup?.name}`"
        :name="`adGroup-${props.statusData.adGroupIndex ?? 0}`"
      >
        <template #header-extra>
          <div
            class="text-xs flex justify-start items-center gap-1 px-3 p-1 bg-[#608aca2d] rounded-xl"
            v-if="
              currentAdGroup?.recommendations?.recommendation_content
                ?.opportunity_score_lift
            "
          >
            <n-icon :component="Point" size="16" color="#608aca" />
            <span class="text-[#608aca]">
              +{{
                currentAdGroup?.recommendations?.recommendation_content
                  ?.opportunity_score_lift
              }}
              points
            </span>
          </div>
        </template>
        <div class="flex flex-col space-y-1">
          <div class="text-sm items-center flex gap-2 font-semibold">
            {{
              currentAdGroup?.recommendations?.recommendation_content
                ?.lift_estimate
            }}
          </div>
          <div
            class="text-xs text-gray-600"
            v-html="
              currentAdGroup?.recommendations?.recommendation_content?.body
            "
          ></div>
        </div>
      </n-collapse-item>

      <n-collapse-item
        v-if="props.statusData.IsTabCreative() && creativeRcm"
        title="Creative"
        name="creative"
      >
        <template #header-extra>
          <div
            class="text-xs flex justify-start items-center gap-1 px-3 p-1 bg-[#608aca2d] rounded-xl"
            v-if="creativeRcm?.recommendation_content?.opportunity_score_lift"
          >
            <n-icon :component="Point" size="16" color="#608aca" />
            <span class="text-[#608aca]">
              +{{ creativeRcm?.recommendation_content?.opportunity_score_lift }}
              points
            </span>
          </div>
        </template>
        <div class="flex flex-col space-y-1">
          <div class="text-sm items-center flex gap-2 font-semibold">
            {{ creativeRcm?.recommendation_content?.lift_estimate }}
          </div>
          <div
            class="text-xs text-gray-600"
            v-html="creativeRcm?.recommendation_content?.body"
          ></div>
        </div>
      </n-collapse-item>
    </n-collapse>
  </n-card>
</template>
<style>
.main-darkmode-cl-camp .n-collapse-item__content-inner {
  padding-top: 6px !important;
}

.main-darkmode-cl-camp .n-collapse .n-collapse-item .n-collapse-item__header {
  padding-top: 6px !important;
}

.main-darkmode-cl-camp .n-collapse .n-collapse-item {
  margin-top: 10px !important;
}

.main-darkmode-cl-camp .n-card-header {
  padding-bottom: 1px !important;
}
</style>
