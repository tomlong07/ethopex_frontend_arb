<script setup lang="ts">
import {
  adGroups,
  campaignTypeClass,
  FreezeClass,
  SelectOptionsManager,
  StatusCampManager,
} from '@/types/components/campaign-v2'

import CreativeAdSetup from '@/components/campaign/modules/facebook/Ads/CreativeAdSetup.vue'
import CreativeCreative from '@/components/campaign/modules/facebook/Ads/CreativeCreative.vue'
import CreativeFanpage from '@/components/campaign/modules/facebook/Ads/CreativeFanpage.vue'
import CreativePostID from '@/components/campaign/modules/facebook/Ads/CreativePostID.vue'
import CreativeName from '@/components/campaign/modules/facebook/Ads/CreativeName.vue'

import { CreativePropsType } from '../adcreative/AdCreativeGeneralWrapper.vue'
import AdsData from '@/components/campaign/modules/adcreative/ads/AdsData.vue'
import ModalAdvancedPreviewFb from './modal/ModalAdvancedPreviewFb.vue'
import { AD_SETUP } from '@/enum/campaign'

const props = defineProps({
  adgroup: {
    type: Object as () => adGroups,
    required: true,
  },

  adcreative: {
    type: Object as () => CreativePropsType,
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
const isShowId = window.arb.isAdmin() || window.arb.isDev()

const copyNow = () => {
  if (!props.adcreative.ad_creative?.id) return
  helper.copyText(String(props.adcreative.ad_creative?.id))
  window.message.success('Copied!')
}
</script>

<template>
  <div class="flex flex-col gap-4 w-full">
    <n-card
      v-if="adcreative.creatives"
      class="card-flex-gap-4 rounded-[5px] !border-gray2"
    >
      <template #header>
        <div class="card_title">
          <n-ellipsis class="w-[420px] lg:w-[650px]">
            {{
              adcreative.creatives?.name
                ? adcreative.creatives.name
                : `Ad ${index >= 0 ? index + 1 : ''}`
            }}
          </n-ellipsis>
        </div>
      </template>
      <n-spin
        v-if="props.adgroup.creatives?.length"
        :show="
          props.optionsManager.loadingCreative ||
          props.optionsManager.loadingFanpage
        "
        content-class="flex flex-col gap-4"
      >
        <div class="relative">
          <div class="flex flex-col gap-4">
            <CreativeName
              :campaign="props.campaign"
              :adcreative="adcreative.creatives"
            />
            <CreativeAdSetup :adcreative="adcreative.creatives" />

            <CreativeFanpage
              :adcreative="adcreative.creatives"
              :optionsManager="props.optionsManager"
            />
            <CreativeCreative
              :adcreative="adcreative.creatives"
              :campaign="props.campaign"
              :optionsManager="props.optionsManager"
              :FreezeData="props.FreezeData"
            />

            <!-- {{ adcreative.creatives }} -->

            <AdLandingPageCampaign
              :campaign="props.campaign"
              :FreezeData="props.FreezeData"
              :item="adcreative.creatives"
              show
            />

            <ModalAdvancedPreviewFb
              :adcreative="adcreative.creatives"
              :campaign="props.campaign"
              :status-data="props.statusData"
              :FreezeData="props.FreezeData"
            />
            <CreativePostID
              :adcreative="adcreative.creatives"
              :optionsManager="props.optionsManager"
            />
          </div>
        </div>
      </n-spin>
    </n-card>

    <n-card class="card-flex-gap-4 rounded-[5px] !border-gray2" v-else>
      <template #header>
        <div>
          <n-ellipsis style="max-width: 370px">
            {{
              adcreative.ad_creative?.name
                ? adcreative.ad_creative.name
                : 'Ad Creative'
            }}
          </n-ellipsis>
        </div>
      </template>

      <template #header-extra v-if="isShowId && props.FreezeData.isEditPage()">
        <div class="text-xs text-gray-500 cursor-copy" @click="copyNow">
          {{ adcreative.ad_creative?.id }}
        </div>
      </template>
      <div
        :key="index"
        class="p-4 flex flex-col gap-4"
        :class="{
          'bg-red-100 text-red-800 relative w-full rounded':
            adcreative.ad_creative?.error,
        }"
      >
        <AdsData
          v-if="adcreative.ad_creative"
          :adcreative="adcreative"
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
