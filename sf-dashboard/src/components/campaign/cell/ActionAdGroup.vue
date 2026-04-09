<script setup lang="ts">
import { ICellRendererParams } from 'ag-grid-community'
import { useDialog, NInputNumber } from 'naive-ui'

import Clone from '@/assets/icons/Clone.vue'
import { ctr_campaign } from '@/services/ctr_campaign'

const dialog = useDialog()
const props = defineProps({
  params: {
    type: Object as () => ICellRendererParams,
    default: () => {},
    required: false,
  },
})

const onClone = async () => {
  const message = `Enter the amount you want to clone Ad Group ${props.params.data.name}?`
  let totalClone = 1
  const confirm = dialog.info({
    title: message,
    content: () =>
      h(NInputNumber, {
        onUpdateValue: (value: any) => (totalClone = value),
        max: 100,
        defaultValue: 1,
      }),
    positiveText: 'Submit',
    onPositiveClick: async () => {
      if (confirm) {
        const payload = {
          id: props.params.data.id,
          number: totalClone,
        }
        const result = await ctr_campaign.CloneAdGroup(payload)
        if (result?.status) {
          window.message.success('Ad Group cloned successfully')
        }
        return
      }
      window.message.success('Cloning the Ad Group was canceled.')
    },
  })
}
</script>
<template>
  <div class="flex w-full h-full items-center">
    <!-- clone -->
    <n-icon
      size="35"
      class="flex items-center m-1 rounded-full p-2 cursor-pointer bg-gray-200 hover:bg-gray-300"
      title="Clone"
      :component="Clone"
      @click="onClone"
    />
  </div>
</template>
