<script setup lang="ts">
import QuestionMAds from '@/store/useQuestionManagementAds'
import CustomSwitch from '../common/CustomSwitch.vue'
const useQuestionManagementAds = QuestionMAds()
</script>

<template>
  <div class="flex items-center gap-2">
    <div class="text-xs font-bold w-10">Status</div>
    <div class="flex-1 min-w-0">
      <CustomSwitch
        v-model="useQuestionManagementAds.QuestionConfig.status"
        true-label="On"
        false-label="Off"
        size="small"
      />
    </div>
  </div>
</template>
