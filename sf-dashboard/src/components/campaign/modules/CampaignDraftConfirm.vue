<script setup lang="ts">
import DraftConfirm from '@/components/common/DraftConfirm.vue'
import { ONOFF } from '@/enum/campaign'
import storage from '@/plugins/storage'
import { ctr_campaign } from '@/services/ctr_campaign'
import {
  campaignTypeClass,
  StatusCampManager,
} from '@/types/components/campaign-v2'
import { useTrackInput } from '../composables/campaign'
const emit = defineEmits<{
  (e: 'continue'): void
}>()

const props = defineProps({
  campaign: {
    type: Object as () => campaignTypeClass,
    required: true,
  },

  statusData: {
    type: Object as () => StatusCampManager,
    required: true,
  },
})

const draftConfirm = ref<InstanceType<typeof DraftConfirm>>()
onMounted(() => {
  fetchPresetAccounts()
})

const fetchPresetAccounts = async () => {
  if (props.campaign.IsTrafficFacebook()) {
    const result = await ctr_campaign.GetPresetCampaigns(
      props.campaign.traffic_source as string,
      { default_preset: ONOFF.ON }
    )
    if (result.status) {
      const value = result.data.items[0]
      if (!value) {
        props.statusData.isLoading = false
        // window.message.info(
        //   'No default preset for Account and Pixel (can’t auto-apply). Please set a default first.'
        // )

        return
      }
      const ad_account = value?.ad_account
      const pixel = value.pixel

      props.campaign.account_supply_id = Number(ad_account)

      if (props.campaign.ad_groups && props.campaign.ad_groups.length > 0) {
        props.campaign.ad_groups.forEach((group) => {
          group.pixel = pixel
        })
      }
    }
  }
}

const onStartOver = async () => {
  // preset_default = on thì sẽ set mặc định cho Account và Pixel
  storage.remove()
  props.statusData.SetCampaignIsDefault(true)
  props.statusData.isLoading = false
  props.statusData.readyWatch = true
  localStorage.removeItem('id_account_get_snapchat')
}

const onContinue = async () => {
  const newData = helper.clone(storage.getData()?.campaign) || {}
  props.campaign.SetData(newData)

  if (
    props.campaign.IsTrafficFacebook() &&
    !props.statusData.isAcceptAPI() &&
    props.campaign.IsAPI()
  ) {
    props.campaign.SetManual()
  }

  if (props.campaign.IsManual()) {
    props.campaign.landing_page_by_creative = ONOFF.OFF
    props.campaign.ad_groups = undefined
  }

  props.statusData.SetCampaignIsDefault(false)
  props.statusData.isLoading = false
  props.statusData.readyWatch = true
  emit('continue')
}

useTrackInput(() => {
  props.statusData.SetCampaignIsDefault(false)
})
</script>

<template>
  <DraftConfirm
    @onContinue="onContinue"
    @onStartOver="onStartOver"
    :statusData="props.statusData"
    :newVer="true"
    ref="draftConfirm"
  />
</template>
