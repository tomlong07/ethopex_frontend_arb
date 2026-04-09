<script setup lang="ts">
import FloatingWrapper from '@/components/common/FloatingWrapper.vue'

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  class: {
    type: String,
    default: 'w-28',
  },
})

const value = defineModel<string>('value')
</script>

<template>
  <FloatingWrapper :name="props.name" rounded>
    <n-input v-model:value="value" disabled />
  </FloatingWrapper>
</template>
