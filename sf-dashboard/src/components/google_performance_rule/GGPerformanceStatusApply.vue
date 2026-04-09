<script setup lang="ts">
import GooglePerformanceRule from '@/store/useGooglePerformanceRule'
import FloatingWrapper from '../common/FloatingWrapper.vue'
import { statusApplyOptions } from '@/options/gg_performance_rule';
const useGooglePerformanceRule = GooglePerformanceRule()

const name = `Status Apply`
</script>

<template>
  <!-- Chọn trạng thái áp dụng (Whitelist/Blacklist) -->
  <FloatingWrapper :name="name">
    <n-select
      v-if="useGooglePerformanceRule.QuestionConfig"
      v-model:value="useGooglePerformanceRule.QuestionConfig.status_apply"
      :options="statusApplyOptions"
      placeholder="Select status apply"
      :loading="useGooglePerformanceRule.isLoading"
    />
  </FloatingWrapper>
</template>
