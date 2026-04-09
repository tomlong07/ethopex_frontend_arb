<script setup lang="ts">
import { ICellRendererParams } from 'ag-grid-community'
import useAccountAd from '@/store/useAccountAd'

import Clone from '@/assets/icons/Clone.vue'

const accountAdStore = useAccountAd()

const props = defineProps({
  params: {
    type: Object as () => ICellRendererParams,
    default: () => {},
    required: false,
  },
})

const GetByAccountAdID = async () => {
  if (!props.params.value) return
  accountAdStore.id = props.params.value as string
  accountAdStore.type = 'id'
  accountAdStore.showModal = true
}

const copyAdID = () => {
  const copyValue = props.params.value.includes('act_')
    ? props.params.value.replaceAll('act_', '')
    : props.params.value
  helper.copyText(copyValue)
  window.message.success('Copied')
}
</script>
<template>
  <div class="cursor-pointer flex items-center gap-2">
    <div @click="GetByAccountAdID" class="text-blue-500 hover:text-red-500">
      {{ props.params.value }}
    </div>
    <n-icon
      :component="Clone"
      title="Copy"
      size="18"
      @click="copyAdID"
      class="text-blue-500 hover:text-red-500"
    ></n-icon>
  </div>
</template>
