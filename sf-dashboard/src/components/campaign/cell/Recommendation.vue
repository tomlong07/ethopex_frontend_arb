<script setup lang="ts">
import { ICellRendererParams } from 'ag-grid-community'
import { useRecommendation } from '@/store/campaignRecommendation'
import { NTag } from 'naive-ui'

const rcmStore = useRecommendation()

const props = defineProps({
  params: {
    type: Object as () => ICellRendererParams,
    default: () => {},
    required: false,
  },

  wrap: {
    type: Boolean,
    default: true,
  },
})

const data = props.params.data

const openModal = (type: string) => {
  rcmStore.showModal = true
  rcmStore.typeModal = type
  rcmStore.campaignId = data.id
  rcmStore.changeDataRef({
    recommend_budget: data.recommend_budget,
    recommend_cpa: data.recommend_cpa,
    recommend_roas: data.recommend_roas,
  })
}
</script>
<template>
  <div class="flex py-2 gap-2" :class="props.wrap ? 'flex-wrap' : ''">
    <n-tag
      v-if="data?.recommend_budget"
      type="warning"
      class="cursor-pointer bg-white text-xs px-[5px] py-0 rounded-[3px]"
      @click="openModal('budget')"
      >Limited by budget</n-tag
    >
    <n-tag
      v-if="data?.recommend_cpa"
      type="warning"
      class="cursor-pointer bg-white text-xs px-[5px] py-0 rounded-[3px]"
      @click="openModal('cpa')"
      >Limited by target</n-tag
    >
    <n-tag
      v-if="data?.recommend_roas"
      type="warning"
      class="cursor-pointer bg-white text-xs px-[5px] py-0 rounded-[3px]"
      @click="openModal('roas')"
      >Limited by bid strategy</n-tag
    >
  </div>
</template>
