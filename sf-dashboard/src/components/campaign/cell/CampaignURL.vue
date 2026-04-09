<script setup lang="ts">
import { ICellRendererParams } from 'ag-grid-community'
import { ColumnItem } from '@/types/state/general'
import { ctr_campaign } from '@/services/ctr_campaign'

const props = defineProps({
  params: {
    type: Object as () => ICellRendererParams,
    default: () => {},
    required: false,
  },
})

const options = (props.params as any).options as ColumnItem
const urlAction = options?.action || ''

const isError = computed(() => {
  return props.params.data?.keyword_status === 'error'
})

const isLoading = ref(false)

const campaignReviewKeyword = async () => {
  isLoading.value = true
  const result = await ctr_campaign.ReviewKeywordV2(urlAction, {
    campaign_ids: [props.params.data.id as number],
  })

  if (result?.status) {
    window.message.info('Review keyword success!')

    const rowNode = props.params.node
    rowNode.setData({
      ...rowNode.data,
      keyword_status: 'pending',
    })
  }

  isLoading.value = false
}
</script>
<template>
  <div class="flex items-center gap-2 overflow-hidden text-ellipsis">
    <n-button
      ghost
      v-if="isError"
      type="warning"
      :disabled="isLoading"
      @click="campaignReviewKeyword"
      title="Click to review"
    >
      Review
    </n-button>

    <div
      v-if="props.params.data?.url && props.params.data?.url.includes('http')"
      class="overflow-hidden text-ellipsis text-blue-500"
    >
      <a :href="props.params.data?.url" target="_blank">{{
        props.params.data.url
      }}</a>
    </div>

    <div
      class="overflow-hidden text-ellipsis"
      v-else
      :title="props.params.data?.url"
    >
      {{ props.params.data?.url }}
    </div>
  </div>
</template>
