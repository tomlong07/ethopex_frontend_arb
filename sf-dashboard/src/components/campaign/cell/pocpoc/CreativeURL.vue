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
  <div class="flex justify-between items-center h-full">
    <a
      class="text-xs cursor-pointer text-blue-500 font-medium"
      target="_blank"
      :href="props.params.data.url"
    >
      {{ props.params.data.url }}
    </a>
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
