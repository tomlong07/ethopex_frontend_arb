<script setup lang="ts">
import { ICellRendererParams } from 'ag-grid-community'

const props = defineProps({
  params: {
    type: Object as () => ICellRendererParams,
    default: () => {},
    required: false,
  },
})

const data = props.params.data

const percentNow = computed(() => {
  return helper.formatNumberV2(data.spent_percent)
})

const amountNow = computed(() => {
  return helper.formatNumberV2(data.spent_amount)
})
</script>
<template>
  <div class="flex flex-col w-full h-full">
    <span v-if="data.spent_percent">{{ percentNow }}%</span>
    <span v-if="data.spent_amount">${{ amountNow }}</span>

    <span v-if="!data.spent_percent && !data.spent_amount"
      >Data not yet available</span
    >
  </div>
</template>
