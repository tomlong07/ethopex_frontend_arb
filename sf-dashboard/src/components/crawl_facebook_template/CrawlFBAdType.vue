<script setup lang="ts">
import { FBAdTypeOptions } from '@/options/creative'
import FloatingWrapper from '../common/FloatingWrapper.vue'

const value = defineModel<string | null>('value')
</script>

<template>
  <FloatingWrapper name="Ad Type" small rounded required>
    <n-select v-model:value="value" :options="FBAdTypeOptions"
  /></FloatingWrapper>
</template>
