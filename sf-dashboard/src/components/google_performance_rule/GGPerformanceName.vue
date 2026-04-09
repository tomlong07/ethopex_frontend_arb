<script setup lang="ts">
import GooglePerformanceRule from '@/store/useGooglePerformanceRule'
import FloatingWrapper from '@/components/common/FloatingWrapper.vue';
const useGooglePerformanceRule = GooglePerformanceRule()
const name = `Name`
</script>

<template>
  <FloatingWrapper
    :name="name"
    :required="true"
    :error="useGooglePerformanceRule.showErr['name']"
  >
    <n-input
      v-if="useGooglePerformanceRule.QuestionConfig"
      v-model:value="useGooglePerformanceRule.QuestionConfig.name"
      placeholder="Enter rule name"
      :loading="useGooglePerformanceRule.isLoading"
    />
  </FloatingWrapper>
</template>
