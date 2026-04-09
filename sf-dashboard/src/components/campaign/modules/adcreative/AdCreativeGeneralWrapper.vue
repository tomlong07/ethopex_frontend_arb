<script lang="ts" setup>
import {
  campaignTypeClass,
  FreezeClass,
  StatusCampManager,
  adGroups,
  SelectOptionsManager,
  creativeStruct,
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

const adDataStore = useAdDataStore()

const optionsManager = ref(new SelectOptionsManager())

const adGroup = computed<adGroups | any>(() => {
  const { adGroupIndex } = props.statusData
  const groups = props.campaign.ad_groups

  return groups && adGroupIndex !== undefined && adGroupIndex >= 0
    ? groups[adGroupIndex]
    : {}
})

const adcreative = computed<CreativePropsType>(() => {
  const { creativeIndex, source } = props.statusData
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
    ts: props.campaign.traffic_source,
    type: props.campaign.traffic_source,
    q: '',
    ids: create_ids.value,
  })
}

const fetchFanpages = async () => {
  optionsManager.value.fetchFanpageOptions({ id: fanpage_ids.value })
}

watch(
  [
    () => props.statusData.IsTabCreative(),
    () => props.statusData.creativeIndex,
  ],
  ([isTabCre, indexCre]) => {
    if (isTabCre && indexCre !== undefined) {
      fetchCreatives()
      if (props.campaign.IsTrafficFacebook()) {
        fetchFanpages()
      }
    }
  }
)

watch(
  () => adDataStore.reloadFanpage,
  (newVal, oldVal) => {
    if (newVal) {
      if (props.campaign.IsTrafficFacebook()) {
        fetchFanpages()
      }
    }
  }
)
</script>
<template>
  <AdgroupAdCreativeFacebook
    v-if="
      campaign.IsTrafficFacebook() &&
      campaign?.ad_groups &&
      campaign?.ad_groups?.length > 0
    "
    :adgroup="adGroup"
    :adcreative="adcreative"
    :campaign="campaign"
    :FreezeData="FreezeData"
    :statusData="statusData"
    :optionsManager="optionsManager"
  />
  <AdgroupAdCreativeGoogle
    v-if="
      campaign?.ad_groups &&
      campaign?.ad_groups?.length > 0 &&
      campaign.IsTrafficGoogle()
    "
    :adgroup="adGroup"
    :adcreative="adcreative"
    :campaign="campaign"
    :FreezeData="FreezeData"
    :statusData="statusData"
    :optionsManager="optionsManager"
  />
  <AdgroupAdCreativeNewsbreak
    v-if="
      campaign?.ad_groups &&
      campaign?.ad_groups?.length > 0 &&
      campaign.IsTrafficNewsbreak()
    "
    :adgroup="adGroup"
    :adcreative="adcreative"
    :campaign="campaign"
    :FreezeData="FreezeData"
    :statusData="statusData"
    :optionsManager="optionsManager"
  />
  <AdGroupAdTikTokV2
    v-if="
      campaign?.ad_groups &&
      campaign?.ad_groups?.length > 0 &&
      campaign.IsTrafficTiktok()
    "
    :adgroup="adGroup"
    :adcreative="adcreative"
    :campaign="campaign"
    :FreezeData="FreezeData"
    :statusData="statusData"
    :optionsManager="optionsManager"
  />
  <AdgroupAdCreativeTaboola
    v-if="
      campaign?.ad_groups &&
      campaign?.ad_groups?.length > 0 &&
      campaign.IsTrafficTaboola() &&
      props.FreezeData.isEditPage()
    "
    :adgroup="adGroup"
    :adcreative="adcreative"
    :campaign="campaign"
    :FreezeData="FreezeData"
    :statusData="statusData"
    :optionsManager="optionsManager"
  />
  <AdgroupAdCreativeSnapchat
    v-if="
      campaign?.ad_groups &&
      campaign?.ad_groups?.length > 0 &&
      campaign.IsTrafficSnapchat() &&
      props.FreezeData.isEditPage()
    "
    :adgroup="adGroup"
    :adcreative="adcreative"
    :campaign="campaign"
    :FreezeData="FreezeData"
    :statusData="statusData"
    :optionsManager="optionsManager"
  />

  <!-- modal -->
  <ModalFacebookPost v-if="campaign.IsTrafficFacebook()" />
  <ModalCreateAd />
  <ModalMenuCreative />
  <ModalAdGeneralV2 :campaign="campaign" />
</template>
