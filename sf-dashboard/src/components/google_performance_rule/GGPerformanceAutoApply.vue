<script setup lang="ts">
import GooglePerformanceRule from '@/store/useGooglePerformanceRule'
import CustomSwitch from '../common/CustomSwitch.vue';
const useGooglePerformanceRule = GooglePerformanceRule()
</script>

<template>
  <div class="flex items-center">
    <div class="w-20 font-bold text-xs">Auto Apply</div>
    <div class="w-calc-150-px">
      <CustomSwitch
        v-if="useGooglePerformanceRule.QuestionConfig"
        v-model="useGooglePerformanceRule.QuestionConfig.auto_apply"
        :loading="useGooglePerformanceRule.isLoading"
        type="boolean"
        true-label="Include"
        false-label="Exclude"
        size="small"
      />
    </div>
  </div>
</template>
