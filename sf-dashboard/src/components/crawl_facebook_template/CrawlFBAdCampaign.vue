<script setup lang="ts">
import FloatingWrapper from '../common/FloatingWrapper.vue'

const value = defineModel<number | null>('value')
</script>
<template>
  <FloatingWrapper name="Ad/Campaign">
    <n-input-number
      v-model:value="value"
      max="10000"
      min="0"
      placeholder="Ad/Campaign"
    >
    </n-input-number>
  </FloatingWrapper>
</template>
