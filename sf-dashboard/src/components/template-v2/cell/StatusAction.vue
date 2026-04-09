<script setup lang="ts">
import { ICellRendererParams } from 'ag-grid-community'

import Close from '@/assets/icons/Close.vue'

import api_v2 from '@/core/api_v2'
import { ColumnItem } from '@/types/state/general'
import Checkmark from '@/assets/icons/Checkmark.vue'

const props = defineProps({
  params: {
    type: Object as () => ICellRendererParams,
    default: () => {},
    required: false,
  },
})
const options = (props.params as any).options as ColumnItem

const urlAction = options?.action

const status = ref<string>(props.params.value)
const isLoading = ref<boolean>(false)

const handleChange = async (newValue: string) => {
  if (!urlAction) {
    return
  }

  let messLoading = window.message.loading(
    'Changing is on process. Please wait!',
    {
      duration: 0,
    }
  )
  const payload = {
    id: props.params.data.id,
    status: newValue,
  }
  isLoading.value = true

  const result = await api_v2.request({
    url: urlAction,
    data: payload,
    timeout: 120000,
  })

  messLoading.destroy()

  if (result?.status) {
    status.value = newValue

    window.message.success('Change status successfully')
  }

  isLoading.value = false
}
</script>
<template>
  <div class="flex h-full items-center cell-status">
    <n-switch
      v-model:value="status"
      checked-value="on"
      unchecked-value="off"
      class="mr-2 h-full"
      :loading="isLoading"
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
<style lang="scss">
.ag-cell-wrapper {
  height: 100%;
}
</style>
