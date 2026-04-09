<template>
  <div class="ag-action-cell gap-1 flex pt-[3px]">
    <n-tooltip trigger="hover" placement="top-end">
      <template #trigger>
        <n-button type="primary" ghost @click.stop="onClickEdit">
          <n-icon size="15">
            <Edit20Regular />
          </n-icon>
        </n-button>
      </template>
      <span>Edit Preset</span>
    </n-tooltip>
    <n-tooltip trigger="hover" placement="top-end">
      <template #trigger>
        <n-button
          :disabled="isEditPage"
          type="primary"
          ghost
          @click.stop="PresetCampaign"
        >
          <n-icon size="15"> <MdArrowRoundForward /> </n-icon>
        </n-button>
      </template>
      <span>Apply Preset Campaign</span>
    </n-tooltip>
  </div>
</template>

<script setup lang="ts">
import MdArrowRoundForward from '@/assets/icons/MdArrowRoundForward.vue'
import Edit20Regular from '@/assets/icons/Edit20Regular.vue'
import { usePresetCampaign } from '@/store/campaign/usePresetCampaign'
import { campaignTypeClass } from '@/types/components/campaign-v2'
import { adGroups } from '@/types/components/campaign-v2'

const store = usePresetCampaign()

interface ICellRendererParams {
  data: any
  [key: string]: any
}

const props = withDefaults(
  defineProps<{
    params: ICellRendererParams
    parentCampaign?: campaignTypeClass
    parentTrafficSource?: string
    parentAdGroups?: adGroups
  }>(),
  {
    parentCampaign: undefined,
    parentTrafficSource: undefined,
    parentAdGroups: undefined,
  }
)
const isEditPage = computed(() => !!Number(window.route.params.id))

const PresetCampaign = () => {
  const data = props.params?.data

  const campaign =
    props.parentCampaign ??
    props.params?.parentCampaign ??
    props.params?.cellRendererParams?.parentCampaign

  const trafficSource =
    props.parentTrafficSource ??
    props.params?.parentTrafficSource ??
    props.params?.cellRendererParams?.parentTrafficSource

  if (!campaign) {
    window.message.error('Campaign is required')
    return
  }

  if (!trafficSource) {
    window.message.error('Traffic source is required')
    return
  }

  const updatedData = {
    ...data,
    ad_account: data.ad_account,
    pixel: data.pixel,
  }
  // Always pass adGroup directly to savePresetCampaign, don't rely on store state
  store.savePresetCampaign(updatedData, campaign)
}

const onClickEdit = () => {
  store.status = true
  const data = props.params?.data

  const preset = data || props.params?.cellRendererParams || null

  const trafficSource =
    props.params?.parentTrafficSource ?? props.parentTrafficSource

  if (!preset) {
    window.message.error('No preset data to edit')
    return
  }

  const editObj = {
    id: preset.id,
    name: preset.name,
    traffic_source: preset.traffic_source || trafficSource,
    ad_account:
      preset.ad_account ?? preset.adAccount ?? preset.adAccountId ?? null,
    pixel: preset.pixel ?? preset.pixel_id ?? null,
    default_preset: preset.default_preset ?? preset.defaultPreset ?? null,
    ad_account_name: preset.ad_account_name || null,
  }
  store.setEditPreset(editObj)
}
</script>
