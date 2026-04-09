<script lang="ts" setup>
import {
  adGroups,
  SelectOptionsManager,
  creativeStruct,
  CampaignContext,
} from '@/types/components/campaign-v2'

import AdgroupAdCreativeFacebook from '../facebook/AdgroupAdCreativeV2.vue'
import AdgroupAdCreativeGoogle from '../google/AdgroupAdCreativeGoogle.vue'
import AdgroupAdCreativeNewsbreak from '../newsbreak/AdgroupAdCreativeNewsbreak.vue'
import AdgroupAdCreativeTaboola from '../taboola/AdgroupAdCreativeTaboola.vue'
import useAdDataStore from '@/store/adDataStore'
import {
  ModalCreateAd,
  ModalFacebookPost,
  ModalMenuCreative,
} from '../../async'

import ModalAdGeneralV2 from '../../modal/ModalAdGeneralV2.vue'
import AdGroupAdTikTokV2 from '../tiktok/AdGroupAdTikTokV2.vue'
import AdgroupAdCreativeSnapchat from '../snapchat/AdgroupAdCreativeSnapchat.vue'
export interface CreativePropsType {
  creatives: creativeStruct | undefined
  ad_creative: any | undefined
}

const props = defineProps({
  data: {
    type: Object as () => CampaignContext,
    required: true,
  },
})

const adDataStore = useAdDataStore()

const optionsManager = ref(new SelectOptionsManager())

const adGroup = computed<adGroups | any>(() => {
  const { adGroupIndex } = props.data.statusData
  const groups = props.data.campaign.ad_groups

  return groups && adGroupIndex !== undefined && adGroupIndex >= 0
    ? groups[adGroupIndex]
    : {}
})

const adcreative = computed<CreativePropsType>(() => {
  const { creativeIndex, source } = props.data.statusData
  const group = adGroup.value

  if (!group) {
    return { creatives: undefined, ad_creative: undefined }
  }

  const index =
    creativeIndex !== undefined && creativeIndex >= 0 ? creativeIndex : 0

  if (source === 'ad_creative') {
    return {
      creatives: undefined,
      ad_creative: group.ad_creative?.[index],
    }
  }

  if (source === 'creatives') {
    return {
      creatives: group.creatives?.[index],
      ad_creative: undefined,
    }
  }

  // fallback nếu source không xác định
  return {
    creatives: group.creatives?.[index],
    ad_creative: group.ad_creative?.[index],
  }
})

const create_ids = computed(() => {
  if (adcreative.value.creatives && adcreative.value.creatives.creative_id) {
    return adcreative.value.creatives.creative_id.toString() || null
  }

  if (
    adcreative.value.ad_creative &&
    adcreative.value.ad_creative.creative_id
  ) {
    return adcreative.value.ad_creative.creative_id.toString() || null
  }

  return ''
})

const fanpage_ids = computed(() => {
  if (adcreative.value.creatives && adcreative.value.creatives.fanpage) {
    return adcreative.value.creatives.fanpage?.toString() || null
  }

  if (adcreative.value.ad_creative && adcreative.value.ad_creative.fanpage) {
    return adcreative.value.ad_creative.fanpage?.toString() || null
  }

  return ''
})

const fetchCreatives = async () => {
  optionsManager.value.fetchCreativeOptions({
    ts: props.data.campaign.traffic_source,
    type: props.data.campaign.traffic_source,
    q: '',
    ids: create_ids.value,
  })
}

const fetchFanpages = async () => {
  optionsManager.value.fetchFanpageOptions({ id: fanpage_ids.value })
}

watch(
  [
    () => props.data.statusData.IsTabCreative(),
    () => props.data.statusData.creativeIndex,
  ],
  ([isTabCre, indexCre]) => {
    if (isTabCre && indexCre !== undefined) {
      fetchCreatives()
      if (props.data.campaign.IsTrafficFacebook()) {
        fetchFanpages()
      }
    }
  }
)

watch(
  () => adDataStore.reloadFanpage,
  (newVal, oldVal) => {
    if (newVal) {
      if (props.data.campaign.IsTrafficFacebook()) {
        fetchFanpages()
      }
    }
  }
)
</script>
<template>
  <AdgroupAdCreativeFacebook
    v-if="
      data.campaign.IsTrafficFacebook() &&
      data.campaign?.ad_groups &&
      data.campaign?.ad_groups?.length > 0
    "
    :adgroup="adGroup"
    :adcreative="adcreative"
    :campaign="data.campaign"
    :FreezeData="data.FreezeData"
    :statusData="data.statusData"
    :optionsManager="optionsManager"
  />
  <AdgroupAdCreativeGoogle
    v-if="
      data.campaign?.ad_groups &&
      data.campaign?.ad_groups?.length > 0 &&
      data.campaign.IsTrafficGoogle()
    "
    :adgroup="adGroup"
    :adcreative="adcreative"
    :campaign="data.campaign"
    :FreezeData="data.FreezeData"
    :statusData="data.statusData"
    :optionsManager="optionsManager"
  />
  <AdgroupAdCreativeNewsbreak
    v-if="
      data.campaign?.ad_groups &&
      data.campaign?.ad_groups?.length > 0 &&
      data.campaign.IsTrafficNewsbreak()
    "
    :adgroup="adGroup"
    :adcreative="adcreative"
    :campaign="data.campaign"
    :FreezeData="data.FreezeData"
    :statusData="data.statusData"
    :optionsManager="optionsManager"
  />
  <AdGroupAdTikTokV2
    v-if="
      data.campaign?.ad_groups &&
      data.campaign?.ad_groups?.length > 0 &&
      data.campaign.IsTrafficTiktok()
    "
    :adgroup="adGroup"
    :adcreative="adcreative"
    :campaign="data.campaign"
    :FreezeData="data.FreezeData"
    :statusData="data.statusData"
    :optionsManager="optionsManager"
  />
  <AdgroupAdCreativeTaboola
    v-if="
      data.campaign?.ad_groups &&
      data.campaign?.ad_groups?.length > 0 &&
      data.campaign.IsTrafficTaboola() &&
      data.FreezeData.isEditPage()
    "
    :adgroup="adGroup"
    :adcreative="adcreative"
    :campaign="data.campaign"
    :FreezeData="data.FreezeData"
    :statusData="data.statusData"
    :optionsManager="optionsManager"
  />
  <AdgroupAdCreativeSnapchat
    v-if="
      data.campaign?.ad_groups &&
      data.campaign?.ad_groups?.length > 0 &&
      data.campaign.IsTrafficSnapchat() &&
      data.FreezeData.isEditPage()
    "
    :adgroup="adGroup"
    :adcreative="adcreative"
    :campaign="data.campaign"
    :FreezeData="data.FreezeData"
    :statusData="data.statusData"
    :optionsManager="optionsManager"
  />

  <!-- modal -->
  <ModalFacebookPost v-if="data.campaign.IsTrafficFacebook()" />
  <ModalCreateAd />
  <ModalMenuCreative />
  <ModalAdGeneralV2 :campaign="data.campaign" />
</template>
