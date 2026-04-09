<script setup lang="ts">
import { ICellRendererParams } from 'ag-grid-community'

import TrashOutline from '@/assets/icons/TrashOutline.vue'
import { ctr_campaign } from '@/services/ctr_campaign'

import { useLocale } from '@/lang/messages'
const Message = useLocale(
  () => import('@/lang/vi/messages'),
  () => import('@/lang/en/messages')
)

const props = defineProps({
  params: {
    type: Object as () => ICellRendererParams,
    default: () => {},
    required: false,
  },
})

const isSubmitBtnLoading = ref(false)
const onDeleteClick = async () => {
  if (window.confirm(Message.value.remove_crawl_campaign)) {
    isSubmitBtnLoading.value = true
    const result = await ctr_campaign.RemoveCrawlCampaign(props.params.data.id)
    if (result?.status) {
      window.message.success(`Remove success!`)
      let selectedNode = props.params.node
      let selectedData = selectedNode.data
      ;(props.params.api as any).applyTransaction({ remove: [selectedData] })
    } else {
      window.message.error(`Remove failed!`)
    }
    isSubmitBtnLoading.value = false
  }
}
</script>
<template>
  <div class="flex items-center">
    <n-icon
      size="35"
      class="flex items-center m-1 rounded-full p-2 cursor-pointer bg-gray-200 hover:bg-gray-300"
      title="Remove"
      :component="TrashOutline"
      @click="onDeleteClick"
    />
  </div>
</template>
