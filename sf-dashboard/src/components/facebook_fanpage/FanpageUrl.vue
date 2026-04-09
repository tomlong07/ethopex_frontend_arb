<script setup lang="ts">
import FloatingWrapper from '../common/FloatingWrapper.vue';

const model = defineModel<string>()
const props = defineProps<{ disabled?: boolean }>()
const name = 'Fanpage URL'
</script>

<template>
  <FloatingWrapper
    :name="name"
  >
    <n-input
    v-model:value="model"
    placeholder="Fanpage URL"
    :disabled="props.disabled"
    />
  </FloatingWrapper>
</template>