<script setup lang="ts">
import Checkmark from '@/assets/icons/Checkmark.vue'
import Close from '@/assets/icons/Close.vue'
import QuestionCircleRegular from '@/assets/icons/QuestionCircleRegular.vue'
import GooglePerformanceRule from '@/store/useGooglePerformanceRule'
const useGooglePerformanceRule = GooglePerformanceRule()

const isOrMode = computed(() => {
  return !useGooglePerformanceRule.QuestionConfig?.is_and_or
})
const isAndMode = computed(() => {
  return useGooglePerformanceRule.QuestionConfig?.is_and_or
})
</script>

<template>
  <!-- Chọn loại logic (AND/OR) giữa các nhóm điều kiện -->
  <div class="flex items-center justify-between">
    <div class="flex items-center gap-4">
      <div class="w-150-px font-bold">
        <div class="flex items-center gap-2">
          And/Or Logic
          <n-popover trigger="hover" placement="bottom-start">
            <template #trigger>
              <n-icon size="14" :component="QuestionCircleRegular"></n-icon>
            </template>
            <span
              >Toggle the on/off state of the button to change the logic between
              Conditions groups ____ on = AND / off = OR</span
            >
          </n-popover>
        </div>
      </div>
      <div class="flex-shrink-0 w-calc-150-px">
        <n-switch
          v-if="useGooglePerformanceRule.QuestionConfig"
          v-model:value="useGooglePerformanceRule.QuestionConfig.is_and_or"
          :loading="useGooglePerformanceRule.isLoading"
        >
          <template #checked-icon>
            <n-icon :component="Checkmark" color="#121212" />
          </template>
          <template #unchecked-icon>
            <n-icon :component="Close" />
          </template>
        </n-switch>
      </div>
    </div>

    <!-- Right side: AND/OR Display -->
    <div class="flex items-center font-normal gap-1 ml-auto">
      <div class="flex items-center">
        <span
          :class="isAndMode ? 'text-green-500 font-medium' : 'text-gray-500'"
        >
          AND
        </span>
        <n-icon
          v-if="isAndMode"
          size="16"
          color="#4caf50"
          :component="Checkmark"
          class="ml-1"
        />
      </div>
      <span class="text-gray-300 mx-2 text-sm">/</span>
      <div class="flex items-center">
        <span
          :class="isOrMode ? 'text-green-500 font-medium' : 'text-gray-500'"
        >
          OR
        </span>
        <n-icon
          v-if="isOrMode"
          size="16"
          color="#4caf50"
          :component="Checkmark"
          class="ml-1"
        />
      </div>
    </div>
  </div>
</template>
