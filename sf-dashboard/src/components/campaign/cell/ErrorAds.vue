<script setup lang="ts">
import ReportGmailerrorredFilled from '@/assets/icons/ReportGmailerrorredFilled.vue'
import { ICellRendererParams } from 'ag-grid-community'

const props = defineProps({
  params: {
    type: Object as () => ICellRendererParams,
    default: () => {},
    required: false,
  },
})
</script>
<template>
  <div class="flex w-full h-full items-center">
    <n-tooltip v-if="props.params.data.error" trigger="hover">
      <template #trigger>
        <n-icon size="20" color="red">
          <ReportGmailerrorredFilled />
        </n-icon>
      </template>
      <div>{{ props.params.data.error }}</div>
    </n-tooltip>
  </div>
</template>
