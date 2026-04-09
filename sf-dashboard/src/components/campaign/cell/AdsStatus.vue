<script setup lang="ts">
import { ICellRendererParams } from 'ag-grid-community'

import Close from '@/assets/icons/Close.vue'
import { ctr_campaign } from '@/services/ctr_campaign'
import Checkmark from '@/assets/icons/Checkmark.vue'

const props = defineProps({
  params: {
    type: Object as () => ICellRendererParams,
    default: () => {},
    required: false,
  },
})

const statusRef = ref<string>(props.params.value)

const handleChange = async (value: string) => {
  const messageConfirm = `Are you sure you want to change the status of this title: ${props.params.data.title}?`
  const confirm = window.confirm(messageConfirm)
  if (confirm) {
    if (!props.params.data.ad_id) {
      window.message.error('Ad ID not found')
      return
    }
    const payload = {
      ad_id: `${props.params.data.ad_id}`,
      status: value,
    }
    const result = await ctr_campaign.ChangeStatusAdsCreative(payload)
    if (result?.status) {
      window.message.success('Status updated successfully')
      statusRef.value = value
      return
    }
    return
  }
  window.message.info('Status change was canceled')
}
</script>
<template>
  <div class="flex h-full items-center">
    <n-switch
      v-model:value="statusRef"
      checked-value="on"
      unchecked-value="off"
      class="mr-2"
      :on-update:value="handleChange"
    >
      <template #checked-icon>
        <n-icon :component="Checkmark" color="#121212" />
      </template>
      <template #unchecked-icon>
        <n-icon :component="Close" />
      </template>
    </n-switch>
  </div>
</template>
