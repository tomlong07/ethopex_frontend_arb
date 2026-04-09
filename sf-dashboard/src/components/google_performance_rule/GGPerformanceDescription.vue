<script setup lang="ts">
import GooglePerformanceRule from '@/store/useGooglePerformanceRule'
import { ModeClass } from '@/types/components/base'
import FloatingWrapper from '../common/FloatingWrapper.vue'
const useGooglePerformanceRule = GooglePerformanceRule()
const modeData = helper.deepFreeze(new ModeClass(window.route)) as ModeClass
const name = `Description`
</script>

<template>
  <div class="flex items-center">
    <div
      class="w-full"
      :class="{ 'min-height-input': modeData.isEditPage() }"
    >
      <FloatingWrapper
        :name="name"
      >
        <n-input
          v-if="useGooglePerformanceRule.QuestionConfig"
          v-model:value="useGooglePerformanceRule.QuestionConfig.description"
          type="textarea"
          placeholder="Enter rule description"
          :rows="3"
        />
      </FloatingWrapper>
    </div>
  </div>
</template>
<style scoped>
.min-height-input :deep(.n-input-wrapper) {
  min-height: 108px !important;
}
</style>
