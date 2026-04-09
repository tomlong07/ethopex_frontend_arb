<script setup lang="ts">
import { ICellRendererParams } from 'ag-grid-community'

import { ctr_account } from '@/services/ctr_account'
import BaseSwitch from '@/components/common/BaseSwitch.vue'

const props = defineProps({
  params: {
    type: Object as () => ICellRendererParams,
    default: () => {},
    required: false,
  },
})

const statusRef = ref<string>(props.params.value)
const statusOld = ref<string>(props.params.value)
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
  const result = await ctr_account.ChangeStatusAccountAds(
    props.params.data.id,
    payload
  )
  isLoading.value = false
  messLoading.destroy()

  if (result?.status) {
    window.message.success('Change status successfully')
    return
  }
  statusRef.value = statusOld.value
}
</script>
<template>
  <div class="flex h-full items-center cell-status">
    <BaseSwitch
      v-model="statusRef"
      :loading="isLoading"
      class="mr-2 h-full"
      @update:value="handleChange"
    />
  </div>
</template>
<style lang="scss">
.ag-cell-wrapper {
  height: 100%;
}
</style>
