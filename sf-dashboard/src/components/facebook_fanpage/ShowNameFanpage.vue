<script setup lang="ts">
import FloatingWrapper from '../common/FloatingWrapper.vue';

const model = defineModel<string>()
const props = defineProps<{ disabled?: boolean }>()
const name = 'Show Name'
</script>

<template>
  <FloatingWrapper
    :name="name"
  >
    <n-input
    v-model:value="model"
    placeholder="Show Name"
    :disabled="props.disabled"
    />
  </FloatingWrapper>
</template>