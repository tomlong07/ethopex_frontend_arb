<script setup lang="ts">
import {
  campaignTypeClass,
  FreezeClass,
  SelectOptionsManager,
  StatusCampManager,
} from '@/types/components/campaign-v2'

import PolicyReviewAd from '@/components/campaign/modules/PolicyReviewAd.vue'

import URL from './URL.vue'
import InputComponent from './InputComponent.vue'
import StatusComponent from './StatusComponent.vue'
import AdSetup from './AdSetup.vue'
import AdFanpage from './AdFanpage.vue'
import AdStatus from './AdStatus.vue'
import { AD_SETUP, AI_STATUS } from '@/enum/campaign'
import useAdDataStore from '@/store/adDataStore'
import AdID from './AdID.vue'
import Grid4 from '@/assets/icons/Grid4.vue'
import AdPostID from './AdPostID.vue'
import ModalAdvancedPreviewFb from '../../facebook/modal/ModalAdvancedPreviewFb.vue'

const adDataStore = useAdDataStore()
const props = defineProps({
  campaign: {
    type: Object as () => campaignTypeClass,
    required: true,
  },
  optionsManager: {
    type: Object as () => SelectOptionsManager,
    required: true,
  },
  item: {
    type: Object as () => any,
    required: true,
  },

  isEdit: {
    type: Boolean,
    default: false,
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

const isComp = computed(() => {
  return window.arb.isCompany()
})

const openModalAd = () => {
  adDataStore.adInfo = props.item
  adDataStore.campaignId = props.campaign.id
  adDataStore.showModal = true
}
</script>

<template>
  <div class="flex flex-col gap-2">
    <div class="flex items-center gap-2">
      <div class="w-40">Policy Review</div>
      <div class="flex-1 min-w-0 w-[calc(100%-10rem)]">
        <PolicyReviewAd :ad="item" />
      </div>
    </div>

    <AdStatus :campaign="props.campaign" :item="props.item" />
    <StatusComponent
      v-if="isComp"
      v-model:value="props.item.delivery_status"
      name="Delivery Status"
    />

    <StatusComponent
      v-if="isComp && props.item.delivery_status == 'Rejected'"
      v-model:value="props.item.delivery_status_reasons"
      name="Delivery Status Reasons"
    />

    <StatusComponent
      v-if="isComp && props.campaign.IsCreativeLandingByCreative()"
      v-model:value="props.item.status_link"
      name="Keyword Status"
    />

    <div>
      <InputComponent
        v-model:value="props.item.name"
        name="Name"
        v-if="!campaign.IsAPIPublic()"
      />
      <!-- <InputComponent v-model:value="props.item.name" name="Name" v-else /> -->
    </div>

    <template v-if="props.campaign.IsTrafficFacebook()">
      <AdSetup
        v-if="!campaign.IsAPIPublic()"
        v-model:value="props.item.ad_setup"
        disabled
        name="Ad Setup"
      />
      <AdFanpage
        v-if="!campaign.IsAPIPublic()"
        :item="props.item"
        :optionsManager="props.optionsManager"
        :is-edit="props.isEdit"
      />
    </template>

    <AdsCreative
      v-if="!campaign.IsAPIPublic()"
      :campaign="props.campaign"
      :FreezeData="props.FreezeData"
      :item="props.item"
    />

    <AdLandingPage
      :campaign="props.campaign"
      :FreezeData="props.FreezeData"
      :item="props.item"
      v-if="
        props.item.ai_status !== AI_STATUS.REJECTED &&
        props.item.ad_setup !== AD_SETUP.USE_EXISTING_POST
      "
    />

    <URL v-if="props.item?.url && isComp" v-model:value="props.item.url" />

    <AdPostID
      :campaign="props.campaign"
      :item="props.item"
      v-if="props.campaign.IsTrafficFacebook() && !campaign.IsAPIPublic()"
    />

    <!-- <AdID :item="props.item" v-if="!campaign.IsAPIPublic()" /> -->

    <ModalAdvancedPreviewFb
      :adcreative="props.item"
      :campaign="props.campaign"
      :status-data="props.statusData"
      :FreezeData="props.FreezeData"
    />

    <div class="flex gap-2" v-if="props.item.creative_id">
      <n-button class="text-xs w-fit" type="primary" @click="openModalAd">
        <template #icon> <n-icon :component="Grid4" /></template>
        View Ad</n-button
      >
    </div>
  </div>
</template>
