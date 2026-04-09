<script setup lang="ts">
import { ICellRendererParams } from 'ag-grid-community'
import Close from '@/assets/icons/Close.vue'

import ctr_campaign_keywords_manager from '@/services/ctr_campaign_keywords_manager'
import Checkmark from '@/assets/icons/Checkmark.vue'

const props = defineProps({
  params: {
    type: Object as () => ICellRendererParams,
    default: () => {},
    required: false,
  },
})

const statusNow = ref<string>(props.params.value)
const isLoading = ref<boolean>(false)
const changeStatusById = async (value: string) => {
  isLoading.value = true

  const result = await ctr_campaign_keywords_manager.ChangeStatus({
    id: props.params.data?.id,
    status: value,
  })

  if (result?.status) {
    window.message.success('Status changed successfully')
    statusNow.value = value
  }

  isLoading.value = false
}
</script>
<template>
  <n-switch
    :value="statusNow"
    checked-value="on"
    unchecked-value="off"
    :on-update:value="changeStatusById"
    :loading="isLoading"
  >
    <template #checked-icon>
      <n-icon :component="Checkmark" color="#121212" />
    </template>
    <template #unchecked-icon> <n-icon :component="Close" /> </template
  ></n-switch>
</template>
