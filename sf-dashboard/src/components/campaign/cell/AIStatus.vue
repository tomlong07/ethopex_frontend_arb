<script setup lang="ts">
import { ICellRendererParams } from 'ag-grid-community'
import Round from '@/components/template-v2/cell/Round.vue'
import InformationCircleOutline from '@/assets/icons/InformationCircleOutline.vue'

const props = defineProps({
  params: {
    type: Object as () => ICellRendererParams,
    default: () => {},
    required: false,
  },
})
</script>
<template>
  <div class="flex items-center gap-2">
    <Round :params="props.params" />
    <n-popover trigger="hover" v-if="props.params.data?.creative_ai_reject">
      <template #trigger>
        <n-icon size="18" class="text-red-600">
          <InformationCircleOutline />
        </n-icon>
      </template>
      <span
        >Creative AI Reject: {{ props.params.data?.creative_ai_reject }}</span
      >
    </n-popover>
  </div>
</template>
