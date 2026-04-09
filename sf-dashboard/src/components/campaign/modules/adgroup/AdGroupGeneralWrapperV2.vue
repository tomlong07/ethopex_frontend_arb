<script lang="ts" setup>
import { adGroups, CampaignContext } from '@/types/components/campaign-v2'
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
  data: {
    type: Object as () => CampaignContext,
    required: true,
  },
})

const index = computed(() => props.data.statusData.adGroupIndex || 0)
const adGroup = computed<adGroups | any>(() => {
  if (!props.data.campaign.ad_groups) return undefined
  return props.data.campaign.ad_groups[index.value]
})
</script>
<template>
  <AdGroupsFaceBookV2
    v-if="adGroup && data.campaign.IsTrafficFacebook()"
    :campaign="data.campaign"
    :FreezeData="data.FreezeData"
    :statusData="data.statusData"
    :index="index"
    :adGroup="adGroup"
  />
  <AdGroupsGoogleV2
    v-if="adGroup && data.campaign.IsTrafficGoogle()"
    :campaign="data.campaign"
    :FreezeData="data.FreezeData"
    :statusData="data.statusData"
    :index="index"
    :adGroup="adGroup"
  />
  <AdGroupsTiktokV2
    v-if="
      data.campaign?.ad_groups &&
      data.campaign?.ad_groups?.length > 0 &&
      data.campaign.IsTrafficTiktok()
    "
    :campaign="data.campaign"
    :FreezeData="data.FreezeData"
    :statusData="data.statusData"
    :index="index"
    :adGroup="adGroup"
  />
  <AdGroupNewsBreak
    v-if="
      data.campaign?.ad_groups &&
      data.campaign?.ad_groups?.length > 0 &&
      data.campaign.IsTrafficNewsbreak()
    "
    :campaign="data.campaign"
    :FreezeData="data.FreezeData"
    :statusData="data.statusData"
    :index="index"
    :adGroup="adGroup"
  />
</template>
