<script setup lang="ts">
import { railStyle } from '@/utils/styleHelper'

import { ctr_campaign } from '@/services/ctr_campaign'
import { NSwitch } from 'naive-ui'

const props = defineProps({
  status: String,
  campaignId: Number,
  reportStore: Object,
})

// const emit = defineEmits(['update'])

const active = ref(props.status || 'off')
const isLoading = ref(false)

//Chỉ cần handle nội bộ ko cần update ra tabulator
const onClick = async () => {
  const alertCamp = props.reportStore?.reportSettingsNew.alertCamp

  if (!props.campaignId) return

  const newStatus = active.value === 'on' ? 'off' : 'on'
  if (!alertCamp) {
    const message = `Are you sure you want to change status to ${newStatus}?`
    if (!window.confirm(message)) return
  }

  isLoading.value = true
  const loading = window.message.loading('Changing is on process. Please wait!')

  const result = await ctr_campaign.ChangeStatus({
    id: props.campaignId,
    status: newStatus,
  })

  if (result?.status) {
    active.value = newStatus
    window.message.success('Status updated successfully')

    // emit('update', newStatus) // Báo cho Tabulator update lại cell
  }

  loading.destroy()

  isLoading.value = false
}
</script>

<template>
  <n-switch
    :rail-style="railStyle"
    :value="active"
    :on-update:value="onClick"
    checked-value="on"
    unchecked-value="off"
    :loading="isLoading"
  />
</template>
