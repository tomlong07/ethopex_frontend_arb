<script setup lang="ts">
import { ICellRendererParams } from 'ag-grid-community'

import Close from '@/assets/icons/Close.vue'

import { ctr_rule } from '@/services/ctr_rule'
import Checkmark from '@/assets/icons/Checkmark.vue'

const props = defineProps({
  params: {
    type: Object as () => ICellRendererParams,
    default: () => {},
    required: false,
  },
})

const statusRef = ref<string>(props.params.value)

const handleChangeStatus = async (value: string) => {
  if (
    confirm(`Do you want to ${value == 'on' ? 'enable' : 'disable'} this rule?`)
  ) {
    const payload = {
      id: props.params.data.id,
      status: value,
    }
    const result = await ctr_rule.ChangeStatus(payload)
    if (result && result.status) {
      window.message.success('Status updated successfully')
    }
  } else {
    let backVL = value == 'on' ? 'off' : 'on'
    statusRef.value = backVL
  }
}
</script>
<template>
  <div class="flex h-full items-center">
    <n-switch
      v-model:value="statusRef"
      :disabled="!props.params.data.is_action"
      checked-value="on"
      unchecked-value="off"
      class="mr-2"
      @update:value="handleChangeStatus"
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
