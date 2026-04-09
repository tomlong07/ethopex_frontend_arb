<script lang="ts" setup>
import {
  adGroups,
  campaignTypeClass,
  FreezeClass,
  StatusCampManager,
} from '@/types/components/campaign-v2'
import AdGroupsSnapchat from '../snapchat/AdGroupsSnapchat.vue'

const AdGroupsFaceBookV2 = defineAsyncComponent(
  () => import('../facebook/AdGroupsFaceBookV2.vue')
)
const AdGroupsGoogleV2 = defineAsyncComponent(
  () => import('../google/AdGroupsGoogleV2.vue')
)
const AdGroupNewsBreak = defineAsyncComponent(
  () => import('../newsbreak/AdGroupNewsBreak.vue')
)

const AdGroupsTiktokV2 = defineAsyncComponent(
  () => import('../tiktok/AdGroupsTiktokV2.vue')
)

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

const index = computed(() => props.statusData.adGroupIndex || 0)
const adGroup = computed<adGroups | any>(() => {
  if (!props.campaign.ad_groups) return undefined
  return props.campaign.ad_groups[index.value]
})
</script>
<template>
  <AdGroupsFaceBookV2
    v-if="adGroup && campaign.IsTrafficFacebook()"
    :campaign="props.campaign"
    :FreezeData="FreezeData"
    :statusData="statusData"
    :index="index"
    :adGroup="adGroup"
  />
  <AdGroupsGoogleV2
    v-if="adGroup && campaign.IsTrafficGoogle()"
    :campaign="campaign"
    :FreezeData="FreezeData"
    :statusData="statusData"
    :index="index"
    :adGroup="adGroup"
  />
  <AdGroupsTiktokV2
    v-if="
      campaign?.ad_groups &&
      campaign?.ad_groups?.length > 0 &&
      campaign.IsTrafficTiktok()
    "
    :campaign="campaign"
    :FreezeData="FreezeData"
    :statusData="statusData"
    :index="index"
    :adGroup="adGroup"
  />
  <AdGroupsSnapchat
    v-if="
      campaign?.ad_groups &&
      campaign?.ad_groups?.length > 0 &&
      campaign.IsTrafficSnapchat()
    "
    :campaign="campaign"
    :FreezeData="FreezeData"
    :statusData="statusData"
    :index="index"
    :adGroup="adGroup"
  />
  <AdGroupNewsBreak
    v-if="
      campaign?.ad_groups &&
      campaign?.ad_groups?.length > 0 &&
      campaign.IsTrafficNewsbreak()
    "
    :campaign="campaign"
    :FreezeData="FreezeData"
    :statusData="statusData"
    :index="index"
    :adGroup="adGroup"
  />
</template>
