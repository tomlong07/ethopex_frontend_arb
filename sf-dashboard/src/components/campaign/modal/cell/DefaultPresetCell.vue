<template>
  <n-switch
    v-model:value="data.default_preset"
    @update:value="onToggle"
    :disabled="isLoading"
    checked-value="on"
    unchecked-value="off"
  >
    <template #checked-icon>
      <n-icon :component="Checkmark" color="#121212" />
    </template>
    <template #unchecked-icon> <n-icon :component="Close" /> </template>
  </n-switch>
</template>

<script setup lang="ts">
import Checkmark from '@/assets/icons/Checkmark.vue'
import Close from '@/assets/icons/Close.vue'
import { ctr_campaign } from '@/services/ctr_campaign'
import { useDialog } from 'naive-ui'
import { usePresetCampaign } from '@/store/campaign/usePresetCampaign'
import { ONOFF } from '@/enum/campaign'

const store = usePresetCampaign()

const dialog = useDialog()
const props = withDefaults(defineProps<{ params: any }>(), {
  params: undefined,
})

const data = props.params?.data || {}

const fetchPresetCampaign = props.params?.fetchPresetCampaign
const resetDefaults = props.params?.resetDefaults
const rowData: any[] = props.params?.allRowData || []

const isLoading = ref(false)

const needConfirm = (newVal: ONOFF): boolean => {
  if (newVal !== ONOFF.ON) return false
  if (!Array.isArray(rowData)) return false
  const hasAnyOtherOn = rowData.some(
    (item) => item?.id !== data?.id && item?.default_preset === ONOFF.ON
  )
  return hasAnyOtherOn
}

const onToggle = async (newVal: ONOFF) => {
  if (!data || data.id === undefined) return

  const prev: ONOFF = data.default_preset

  if (needConfirm(newVal)) {
    const confirmed = await store.confirmDefaultPreset(dialog)
    if (!confirmed) {
      data.default_preset = prev
      return
    }
  }

  const payload = {
    name: data.name,
    default_preset: newVal,
    provider: data.provider,
    ad_account: data.ad_account,
    pixel: data.pixel,
    ad_account_name: data.ad_account_name,
  }

  try {
    isLoading.value = true
    const result = await ctr_campaign.UpdatePresetCampaign(data.id, payload)
    if (result && result.status) {
      window.message?.success('Preset campaign updated successfully.')
      fetchPresetCampaign()
      resetDefaults()
    }
  } finally {
    isLoading.value = false
  }
}
</script>
