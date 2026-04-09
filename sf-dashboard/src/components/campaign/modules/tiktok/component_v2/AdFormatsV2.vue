<script setup lang="ts">
import {
  AdFormatsRewarded,
  CampaignContext,
} from '@/types/components/campaign-v2'
import { AdFormats, UnlockContentConfig } from '@/types/components/dialog'

import { ReportFilterStateManager } from '@/types/state/report'

import ConversionLogic from '../../adformats/ConversionLogic.vue'
import MinEPC from '../../adformats/MinEPC.vue'
import Display from '../../adformats/Display.vue'
import Anchor from '../../adformats/Anchor.vue'
import Interstitial from '../../adformats/Interstitial.vue'
import Rewarded from '../../adformats/Rewarded.vue'
import UnlockContent from '../../adformats/UnlockContent.vue'

const id = computed<number>(() => Number(window.route.params.id || 0))

const isAddPage = computed<boolean>(() => id.value === 0)
const props = defineProps({
  data: {
    type: Object as () => CampaignContext,
    required: true,
  },
  inModal: {
    type: Boolean,
    default: false,
  },
  stateLabel: {
    type: Object as () => ReportFilterStateManager,
    default: null,
  },
})

// hasDialog, hasType = false thì không gửi payload
onMounted(() => {
  if (
    isAddPage.value &&
    props.data.statusData.permission.label &&
    !props.inModal
  ) {
    props.data.campaign.ad_formats = {
      display: new AdFormats({ hasDialog: false, hasType: true, status: 'on' }),
      anchor: new AdFormats({ hasDialog: false, hasType: false }),
      interstitial: new AdFormats({ hasDialog: false, hasType: false }),
      rewarded: new AdFormatsRewarded(),
      unlock_content: new UnlockContentConfig(),
    }
  }
})

const LABEL_BANNER = 24
const LABEL_TEST_BUDGET = 28

const isShowConfigAds = computed(() => {
  return (
    props.data.campaign.label == LABEL_BANNER ||
    props.data.campaign.label == LABEL_TEST_BUDGET ||
    props.data.campaign.IsDemandPubPower()
  )
})

const isShowConfigAdsInModal = computed(() => {
  const allLabels = props.stateLabel.State.label?.options || []

  let getLabel
  if (allLabels && allLabels?.length > 0) {
    getLabel = allLabels?.find(
      (item) => item.label === props.data.campaign.label
    )
  }

  return (
    getLabel?.value == LABEL_BANNER ||
    getLabel?.value == LABEL_TEST_BUDGET ||
    props.data.campaign.IsDemandPubPower()
  )
})
</script>
<template>
  <n-card
    v-if="
      (props.inModal && isShowConfigAdsInModal) ||
      (!props.inModal && isShowConfigAds)
    "
    class="card-flex-items-end"
  >
    <template #header> Config Ads </template>
    <div class="flex flex-col gap-2">
      <div v-if="props.data.statusData.permission.label">
        <div class="min-w-[750px]">
          <div class="flex items-center gap-2">
            <div class="flex flex-row place-items-center gap-4 flex-1 min-w-0">
              <div class="w-20 font-bold flex-shrink-0 pl-4">Status</div>
              <div class="w-[7rem] font-bold flex-shrink-0">Type</div>
              <div class="flex-1 font-bold min-w-0">Floor Price</div>
            </div>
          </div>
        </div>
        <div class="flex flex-col gap-2">
          <Display :campaign="props.data.campaign" />
          <Anchor :campaign="props.data.campaign" />
          <Interstitial :campaign="props.data.campaign" />
          <Rewarded :campaign="props.data.campaign" />
          <UnlockContent :campaign="props.data.campaign" />
        </div>
      </div>

      <ConversionLogic :campaign="props.data.campaign" />
      <MinEPC :campaign="props.data.campaign" />
    </div>
  </n-card>
</template>
