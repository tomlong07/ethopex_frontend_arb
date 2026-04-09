<script setup lang="ts">
import FloatingWrapper from '../common/FloatingWrapper.vue'

const props = defineProps({
  name: { type: String, default: 'Name' },
})

const value = defineModel<any>('value')
</script>

<template>
  <FloatingWrapper :name="props.name" required>
    <n-input
      v-model:value="value"
      type="text"
      :placeholder="`Enter ${props.name}`"
      maxlength="255"
    />
  </FloatingWrapper>
</template>
