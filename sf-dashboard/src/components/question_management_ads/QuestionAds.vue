<script setup lang="ts">
import QuestionMAds from '@/store/useQuestionManagementAds'
import FloatingWrapper from '../common/FloatingWrapper.vue'
const useQuestionManagementAds = QuestionMAds()
</script>
<template>
  <FloatingWrapper name="Question">
    <n-input
      type="textarea"
      v-model:value="useQuestionManagementAds.QuestionConfig.question"
      :loading="useQuestionManagementAds.isLoading"
      placeholder="Enter question"
    />
  </FloatingWrapper>
</template>
