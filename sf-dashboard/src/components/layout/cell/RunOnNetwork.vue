<script setup lang="ts">
import { ICellRendererParams } from 'ag-grid-community'

import Close from '@/assets/icons/Close.vue'

import Checkmark from '@/assets/icons/Checkmark.vue'
import { ctr_layout } from '@/services/ctr_layout'

const props = defineProps({
  params: {
    type: Object as () => ICellRendererParams,
    default: () => {},
    required: false,
  },
})

const statusRef = ref<string>(props.params.value)
const isChanging = ref<boolean>(false)

const handleChangeStatus = async (value: string) => {
  if (
    !confirm(
      `Do you want to ${value == 'on' ? 'enable' : 'disable'} run on network?`
    )
  ) {
    return
  }
  isChanging.value = true
  const payload = {
    id: props.params.data.id,
    run_on_network: value,
  }
  const result = await ctr_layout.ChangeRunOnNetwork(payload)
  if (result?.status) {
    window.message.success('Change run on network successfully')
    statusRef.value = value
  }
  isChanging.value = false
}
</script>
<template>
  <div class="flex h-full items-center">
    <n-switch
      v-model:value="statusRef"
      checked-value="on"
      unchecked-value="off"
      class="mr-2"
      :loading="isChanging"
      :on-update:value="handleChangeStatus"
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
