<template>
  <div class="ag-action-cell gap-1 flex pt-[3px]">
    <n-tooltip trigger="hover" placement="top-end">
      <template #trigger>
        <n-button type="primary" ghost @click.stop="PresetLocation">
          <n-icon size="15">
            <PresetLocations />
          </n-icon>
        </n-button>
      </template>
      <span>Apply Preset Location</span>
    </n-tooltip>

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
  </div>
</template>

<script setup lang="ts">
import PresetLocations from '@/assets/icons/PresetLocations.vue'
import Edit20Regular from '@/assets/icons/Edit20Regular.vue'
import { usePresetLocations } from '@/store/campaign/usePresetLocations'
import { campaignTypeClass } from '@/types/components/campaign-v2'
import { adGroups } from '@/types/components/campaign-v2'

const store = usePresetLocations()

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
// parentCampaign
// parentTrafficSource
// parentAdGroups
const PresetLocation = () => {
  const data = props.params?.data
  const campaign =
    props.parentCampaign ??
    props.params?.parentCampaign ??
    props.params?.cellRendererParams?.parentCampaign

  const trafficSource =
    props.parentTrafficSource ??
    props.params?.parentTrafficSource ??
    props.params?.cellRendererParams?.parentTrafficSource

  const adGroup =
    props.parentAdGroups ??
    props.params?.parentAdGroups ??
    props.params?.cellRendererParams?.parentAdGroups

  // Parse locations from data
  let locationsToUse = []
  if (data?.locations && Array.isArray(data.locations)) {
    locationsToUse = data.locations
  } else if (typeof data?.locations === 'string') {
    try {
      locationsToUse = JSON.parse(data.locations)
    } catch {
      window.message.error('Invalid location data format')
      return
    }
  }

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
    locations: locationsToUse,
    traffic_source: trafficSource,
  }
  if (adGroup) {
    store.setAdgroup(adGroup)
    try {
      const currentType = adGroup.location?.type || 'include'
      adGroup.location = {
        value: [...locationsToUse],
        type: currentType,
      }
    } catch {}
  }

  store.savePresetLocation(updatedData, campaign)
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
    locations: Array.isArray(preset.locations)
      ? preset.locations
      : typeof preset.locations === 'string'
      ? (() => {
          try {
            return JSON.parse(preset.locations)
          } catch {
            return []
          }
        })()
      : [],
    traffic_source: preset.traffic_source || trafficSource,
  }

  store.setEditPreset(editObj)
}
</script>
