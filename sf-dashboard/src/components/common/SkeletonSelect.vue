<script setup lang="ts">
import { TSize } from '@/enum/naiveui'

const props = defineProps({
  class: {
    type: String,
    default: 'w-60',
  },

  size: {
    type: String,
    default: 'medium',
  },
})
</script>

<template>
  <div class="flex flex-col gap-1" :class="props.class">
    <div class="text-xs text-gray-500 font-bold"><n-skeleton text /></div>
    <n-skeleton :sharp="false" :size="(props.size as TSize)" />
  </div>
</template>
