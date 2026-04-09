<script setup lang="ts">
import {
  adGroups,
  campaignTypeClass,
  FreezeClass,
  SelectOptionsManager,
  StatusCampManager,
} from '@/types/components/campaign-v2'
import AdsData from '../adcreative/ads/AdsData.vue'

const props = defineProps({
  adgroup: {
    type: Object as () => adGroups,
    required: true,
  },

  campaign: {
    type: Object as () => campaignTypeClass,
    required: true,
  },

  statusData: {
    type: Object as () => StatusCampManager,
    required: true,
  },

  FreezeData: {
    type: Object as () => FreezeClass,
    required: true,
  },

  optionsManager: {
    type: Object as () => SelectOptionsManager,
    required: true,
  },
})

const index = computed<number>(() => {
  const { adGroupIndex, creativeIndex } = props.statusData

  if (
    adGroupIndex !== undefined &&
    adGroupIndex >= 0 &&
    creativeIndex !== undefined &&
    creativeIndex >= 0
  ) {
    return creativeIndex
  }
  return 0
})

const adcreative = computed(() => {
  let creatives, ad_creative

  if (props.statusData.source === 'creatives') {
    creatives =
      index.value != null ? props.adgroup.creatives?.[index.value] : undefined
  }

  if (props.statusData.source === 'ad_creative') {
    ad_creative =
      index.value != null ? props.adgroup.ad_creative?.[index.value] : undefined
  }

  return {
    creatives,
    ad_creative,
  }
})
const cardTitle = computed(() => {
  const creative = adcreative.value.ad_creative
  if (!creative) return 'Ad Creative'

  if (creative.ad_id && creative.name) {
    return `${creative.name}`
  }

  if (creative.name) {
    return creative.name
  }

  if (creative.ad_id) {
    return creative.ad_id
  }

  return 'Ad Creative'
})
</script>

<template>
  <div class="ad_creative">
    <n-card class="card-flex-gap-4 rounded-[5px] !border-gray2">
      <template #header>
        <div class="flex justify-between gap-2">
          <n-ellipsis style="max-width: 370px">
            {{ cardTitle }}
          </n-ellipsis>
          <span
            v-if="adcreative.ad_creative?.ad_id"
            class="text-sm text-gray-500 whitespace-nowrap"
          >
            ID: {{ adcreative.ad_creative.ad_id }}
          </span>
        </div>
      </template>

      <div
        :key="index"
        class="p-4"
        :class="{
          'bg-red-100 text-red-800 relative w-full rounded':
            adcreative.ad_creative?.error,
        }"
      >
        <AdsData
          v-if="adcreative.ad_creative"
          :campaign="props.campaign"
          :optionsManager="props.optionsManager"
          :FreezeData="props.FreezeData"
          :item="adcreative.ad_creative"
          :status-data="statusData"
        />
      </div>
    </n-card>
  </div>
</template>
