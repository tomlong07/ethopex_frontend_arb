<script setup lang="ts">
import helper from '@/utils/helper'
import { ICellRendererParams } from 'ag-grid-community'

// Định nghĩa props
const props = defineProps({
  params: {
    type: Object as () => ICellRendererParams,
    default: () => ({}),
    required: false,
  },
})

// Xác định loại trạng thái
const tagType = computed(() => {
  const valueNow = props.params.value?.status.toLowerCase()
  switch (valueNow) {
    case 'pending':
      return 'warning'
    case 'bot_done':
      return 'success'
    case 'error':
      return 'error'
  }

  return 'default'
})
</script>

<template>
  <div class="flex h-full items-center cell-status">
    <!-- Hiển thị props.params.value trực tiếp -->
    <n-tag
      :type="tagType"
      class="n-tag-exclude"
      ghost
      v-if="props.params.value?.status"
    >
      {{ helper.capitalizeFirstLetter(props.params.value?.status) }}
    </n-tag>
  </div>
</template>
