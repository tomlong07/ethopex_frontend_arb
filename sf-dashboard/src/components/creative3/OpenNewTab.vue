<script setup lang="ts">
import { CreativeStateManager } from '@/types/components/creative-v2'

const props = defineProps({
  stateManager: {
    type: Object as () => CreativeStateManager,
    required: true,
  },
})

const openThisCreative = () => {
  window.open(`/creative/${props.stateManager.dataModal?.id}`, '_blank')
}
</script>

<template>
  <div class="ml-auto">
    <n-button class="w-32" @click="openThisCreative">
      Open in new tab
    </n-button>
  </div>
</template>
