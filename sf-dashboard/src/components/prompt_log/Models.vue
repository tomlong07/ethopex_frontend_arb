<script setup lang="ts">
import { ICellRendererParams } from 'ag-grid-community'

import PersonCircle from '@/assets/icons/PersonCircle.vue'
import NetworkIntelligence from '@/assets/icons/NetworkIntelligence.vue'

const props = defineProps({
  params: {
    type: Object as () => ICellRendererParams,
    default: () => ({}),
  },
})
</script>

<template>
  <div class="flex flex-col gap-2" v-if="props.params.data">
    <n-popover trigger="hover">
      <template #trigger>
        <div class="flex items-center gap-2">
          <n-icon :component="PersonCircle" size="20" color="gray" />{{
            props.params.data.model_select || 'N/A'
          }}
        </div>
      </template>
      User Select Model
    </n-popover>

    <n-popover trigger="hover">
      <template #trigger>
        <div class="flex items-center gap-2">
          <n-icon :component="NetworkIntelligence" size="20" color="gray" />{{
            props.params.data.model_display || 'N/A'
          }}
        </div>
      </template>
      Display Model
    </n-popover>
  </div>
</template>
