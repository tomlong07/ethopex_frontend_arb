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
const isLoading = ref<boolean>(false)
const handleChange = async (value: string) => {
  if (!props.params?.data?.campaign_ids) {
    return
  }
  let messLoading = window.message.loading(
    'Change is in progress. Please wait',
    {
      duration: 0,
    }
  )

  let isSuccess = 0

  for (
    let index = 0;
    index < props.params?.data?.campaign_ids.length;
    index++
  ) {
    const campaignID = props.params?.data?.campaign_ids[index]

    const result = await ctr_campaign.ChangeStatus({
      id: campaignID,
      status: value,
    })

    if (result?.status) {
      isSuccess++
      window.message.success(`${campaignID} status changed successfully`)
    } else {
      window.message.error(`${campaignID} status change failed`)
    }
  }

  messLoading.destroy()
  if (isSuccess === props.params?.data?.campaign_ids.length) {
    statusRef.value = value
    window.message.success('Status changed successfully')
  }
}
</script>

<template>
  <div class="flex h-full items-center cell-status">
    <n-switch
      :value="statusRef"
      checked-value="on"
      unchecked-value="off"
      class="mr-2 h-full"
      :loading="isLoading"
      @update:value="handleChange"
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
