<script setup lang="ts">
import { ICellRendererParams } from 'ag-grid-community'

const props = defineProps({
  params: {
    type: Object as () => ICellRendererParams,
    default: () => {},
    required: false,
  },
})

const spent = props.params.data?.amount_spent_for_promotion || 0

//Nếu đã có khuyến mãi thì đoạn tiêu để km là $500
const spentShow = props.params.data?.spent_percent
  ? '500'
  : spent === 0
  ? '0'
  : helper.formatNumberV2(spent)
const target = 500
</script>
<template>
  <div>
    <div class="flex justify-between mb-1 text-sm text-gray-600">
      <span>${{ spentShow }}</span>
      <span>${{ target }}</span>
    </div>

    <n-progress
      type="line"
      :percentage="(spent / target) * 100"
      processing
      color="#188038"
      rail-color="#a2c3fc"
      :show-indicator="false"
    />
  </div>
</template>
