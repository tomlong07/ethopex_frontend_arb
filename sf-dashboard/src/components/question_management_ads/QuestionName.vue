<script setup lang="ts">
import QuestionMAds from '@/store/useQuestionManagementAds'
import FloatingWrapper from '../common/FloatingWrapper.vue'
const useQuestionManagementAds = QuestionMAds()
</script>
<template>
  <FloatingWrapper name="Name">
    <n-input
      v-model:value="useQuestionManagementAds.QuestionConfig.name"
      :loading="useQuestionManagementAds.isLoading"
      placeholder="Enter name"
    />
  </FloatingWrapper>
</template>
