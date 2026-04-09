<script setup lang="ts">
import { TypeQuestionOptions } from '@/options/question_management'
import QuestionMAds from '@/store/useQuestionManagementAds'
import FloatingWrapper from '../common/FloatingWrapper.vue';
const useQuestionManagementAds = QuestionMAds()
</script>
<template>
  <FloatingWrapper name="Type">
    <n-select
      v-model:value="useQuestionManagementAds.QuestionConfig.type"
      placeholder="Select type"
      :options="TypeQuestionOptions"
    />
  </FloatingWrapper>
</template>
