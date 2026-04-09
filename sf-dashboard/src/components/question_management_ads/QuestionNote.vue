<script setup lang="ts">
import QuestionMAds from '@/store/useQuestionManagementAds'
import FloatingWrapper from '../common/FloatingWrapper.vue'
const useQuestionManagementAds = QuestionMAds()
</script>
<template>
  <FloatingWrapper name="Note">
    <n-input
      type="textarea"
      v-model:value="useQuestionManagementAds.QuestionConfig.note"
      :loading="useQuestionManagementAds.isLoading"
      placeholder="Enter note"
    />
  </FloatingWrapper>
</template>
