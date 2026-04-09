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
    <div class="flex flex-col">
      <div>
        {{ props.params.data.name }}
      </div>
    </div>
    <div class="flex items-center">
      <!-- tooltip error message -->
      <n-tooltip v-if="props.params.data.error" trigger="hover">
        <template #trigger>
          <n-icon size="20" color="red">
            <ReportGmailerrorredFilled />
          </n-icon>
        </template>
        <div>{{ props.params.data.error }}</div>
      </n-tooltip>
    </div>
  </div>
</template>
