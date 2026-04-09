<script setup lang="ts">
import { creativeTypeClass } from '@/types/components/creative-v2'

const props = defineProps({
  cre: {
    type: Object as () => creativeTypeClass,
    required: true,
  },
})
</script>

<template>
  <span class="font-xs italic text-gray-400">
    {{ props.cre.email || '' }}
  </span>
</template>
