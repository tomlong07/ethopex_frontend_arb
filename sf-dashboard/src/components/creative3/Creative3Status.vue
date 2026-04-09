<script setup lang="ts">
import {
  CreativeStateManager,
  creativeTypeClass,
} from '@/types/components/creative-v2'
import FloatingWrapper from '@/components/common/FloatingWrapper.vue'
import { statusOptions } from '@/options/creative'

const props = defineProps({
  cre: {
    type: Object as () => creativeTypeClass,
    required: true,
  },

  stateManager: {
    type: Object as () => CreativeStateManager,
    required: true,
  },
})

const classNow = computed(() => {
  switch (props.cre.status) {
    case 'approved':
      return 'select-option-green'
    case 'rejected':
      return 'select-option-red'
    case 'warning':
      return 'select-option-warning'
  }

  return ''
})
</script>

<template>
  <FloatingWrapper name="Status" small rounded>
    <div class="flex select-option-wrapper" :class="classNow">
      <n-select
        v-model:value="props.cre.status"
        :options="statusOptions"
        :disabled="props.stateManager.isModalAd"
      /></div
  ></FloatingWrapper>
</template>
