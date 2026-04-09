<script setup lang="ts">
import DraftConfirm from '@/components/common/DraftConfirm.vue'
import { ONOFF } from '@/enum/campaign'
import storage from '@/plugins/storage'
import { ctr_campaign } from '@/services/ctr_campaign'
import {
  CampaignContext,
  campaignTypeClass,
} from '@/types/components/campaign-v2'
import { useTrackInput } from '../../../composables/campaign'
const emit = defineEmits<{
  (e: 'continue'): void
}>()

const props = defineProps({
  data: {
    type: Object as () => CampaignContext,
    required: true,
  },
})

const draftConfirm = ref<InstanceType<typeof DraftConfirm>>()
onMounted(() => {
  fetchPresetAccounts()
})

const fetchPresetAccounts = async () => {
  if (props.data.campaign.IsTrafficFacebook()) {
    const result = await ctr_campaign.GetPresetCampaigns(
      props.data.campaign.traffic_source as string,
      { default_preset: ONOFF.ON }
    )
    if (result.status) {
      const value = result.data.items[0]
      if (!value) {
        props.data.statusData.isLoading = false
        // window.message.info(
        //   'No default preset for Account and Pixel (can’t auto-apply). Please set a default first.'
        // )

        return
      }
      const ad_account = value?.ad_account
      const pixel = value.pixel

      props.data.campaign.account_supply_id = Number(ad_account)

      if (
        props.data.campaign.ad_groups &&
        props.data.campaign.ad_groups.length > 0
      ) {
        props.data.campaign.ad_groups.forEach((group) => {
          group.pixel = pixel
        })
      }
    }
  }
}

const onStartOver = async () => {
  // preset_default = on thì sẽ set mặc định cho Account và Pixel
  storage.remove()
  props.data.statusData.SetCampaignIsDefault(true)
  props.data.statusData.isLoading = false
  props.data.statusData.readyWatch = true
  localStorage.removeItem('id_account_get_snapchat')
}

const onContinue = async () => {
  const newData = helper.clone(storage.getData()?.campaign) || {}

  for (const key in newData) {
    if (Object.prototype.hasOwnProperty.call(newData, key)) {
      const element = newData[key]

      ;(props.data.campaign[key as keyof campaignTypeClass] as any) = element
    }
  }

  if (
    props.data.campaign.IsTrafficFacebook() &&
    !props.data.statusData.isAcceptAPI() &&
    props.data.campaign.IsAPI()
  ) {
    props.data.campaign.SetManual()
  }
  props.data.statusData.SetCampaignIsDefault(false)
  props.data.statusData.isLoading = false
  props.data.statusData.readyWatch = true
  emit('continue')
}

useTrackInput(() => {
  props.data.statusData.SetCampaignIsDefault(false)
})
</script>

<template>
  <DraftConfirm
    @onContinue="onContinue"
    @onStartOver="onStartOver"
    :statusData="props.data.statusData"
    :newVer="true"
    ref="draftConfirm"
  />
</template>
