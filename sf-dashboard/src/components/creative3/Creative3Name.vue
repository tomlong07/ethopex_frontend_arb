<script setup lang="ts">
import {
  CreativeStateManager,
  creativeTypeClass,
} from '@/types/components/creative-v2'
import FloatingWrapper from '@/components/common/FloatingWrapper.vue'

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
</script>

<template>
  <FloatingWrapper name="Name" small rounded>
    <n-input
      v-model:value="props.cre.name"
      show-count
      placeholder="Name"
      :disabled="props.stateManager.isModalAd"
  /></FloatingWrapper>
</template>
