<script setup lang="ts">
import { ICellRendererParams } from 'ag-grid-community'

import { ctr_account } from '@/services/ctr_account'
import Checkmark from '@/assets/icons/Checkmark.vue'
import Close from '@/assets/icons/Close.vue'

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
  const messLoading = window.message.loading(
    'Changing is on process. Please wait!',
    {
      duration: 0, //0 is infinite
    }
  )
  const payload = {
    status: value,
  }
  isLoading.value = true
  const result = await ctr_account.ChangeUseRootDomainAccountAds(
    props.params.data.id,
    payload
  )
  isLoading.value = false
  messLoading.destroy()

  if (result?.status) {
    window.message.success('Change status successfully')
    statusRef.value = value
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
<style lang="scss">
.ag-cell-wrapper {
  height: 100%;
}
</style>
