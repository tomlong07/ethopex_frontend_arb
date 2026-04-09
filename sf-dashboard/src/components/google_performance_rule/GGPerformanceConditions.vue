<script setup lang="ts">
import Group from '@/assets/icons/Group.vue'
import GooglePerformanceRule from '@/store/useGooglePerformanceRule'
import LogicOperatorGroup from './GGPerformanceLogicOperatorGroup.vue'
import '@vuepic/vue-datepicker/dist/main.css'

const useGooglePerformanceRule = GooglePerformanceRule()

const HandleAndOrLogic = (isAndOr: boolean) => {
  if (!useGooglePerformanceRule.QuestionConfig) return
  useGooglePerformanceRule.QuestionConfig.is_and_or = isAndOr
}
</script>

<template>
  <div v-if="useGooglePerformanceRule.QuestionConfig">
    <!-- Tiêu đề section điều kiện -->
    <div class="mb-6 flex items-center justify-between">
      <div class="flex items-center gap-4">
        <div class="font-medium">
          <div class="flex items-center gap-2">Conditions</div>
        </div>
        <n-button-group class="m-2">
          <n-button
            @click="HandleAndOrLogic(true)"
            :type="
              useGooglePerformanceRule.QuestionConfig?.is_and_or
                ? 'warning'
                : undefined
            "
          >
            AND
          </n-button>
          <n-button
            @click="HandleAndOrLogic(false)"
            :type="
              !useGooglePerformanceRule.QuestionConfig?.is_and_or
                ? 'warning'
                : undefined
            "
          >
            OR
          </n-button>
        </n-button-group>
      </div>
    </div>

    <!-- Vòng lặp qua các nhóm logic operators -->
    <div class="space-y-5">
      <LogicOperatorGroup
        v-for="(logicOperator, operatorIndex) in useGooglePerformanceRule
          .QuestionConfig.logic_operators"
        :key="operatorIndex"
        :logicOperator="logicOperator"
        :index="operatorIndex"
      />
    </div>

    <n-tooltip trigger="hover" placement="top-end">
      <template #trigger>
        <!-- Nút thêm nhóm logic mới -->
        <n-button
          type="info"
          dashed
          class="mt-6"
          size="large"
          @click="useGooglePerformanceRule.addLogicOperator()"
          :disabled="!useGooglePerformanceRule.QuestionConfig"
        >
          <template #icon>
            <Group />
          </template>
          Add Logic Group
        </n-button>
      </template>
      Add New Group
    </n-tooltip>
  </div>
</template>
<style scoped>
:deep(.dp__input) {
  padding: 7px 15px !important;
}
</style>
