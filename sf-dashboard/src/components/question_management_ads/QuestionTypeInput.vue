<script setup lang="ts">
import { TypeInputOptions } from '@/options/question_management'
import QuestionMAds from '@/store/useQuestionManagementAds'
import FloatingWrapper from '../common/FloatingWrapper.vue'
const useQuestionManagementAds = QuestionMAds()
</script>
<template>
  <FloatingWrapper name="Type Input">
    <n-select
      v-model:value="useQuestionManagementAds.QuestionConfig.type_input"
      placeholder="Select type input"
      :options="TypeInputOptions"
    />
  </FloatingWrapper>
</template>
