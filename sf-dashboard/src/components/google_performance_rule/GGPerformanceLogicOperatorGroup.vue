<script setup lang="ts">
import ConditionItem from './GGPerformanceConditionItem.vue'
import RemoveButton from '@/components/creative3/RemoveButton.vue'
import Plus from '@/assets/icons/Plus.vue'
import GooglePerformanceRule from '@/store/useGooglePerformanceRule'
import { LogicOperator } from '@/types/state/google_performance_rule'

const props = defineProps<{
  logicOperator: LogicOperator
  index: number
}>()

const useGooglePerformanceRule = GooglePerformanceRule()
</script>
<template>
  <div
    class="border p-4 shadow-lg relative rounded-md"
    :class="{
      'pointer-events-none opacity-50': useGooglePerformanceRule.isLoading,
    }"
  >
    <RemoveButton
      @onClick="
        () => useGooglePerformanceRule.removeLogicOperator(props.logicOperator)
      "
      placement="top-end"
      text="Remove Group"
    />
    <div class="flex items-center justify-between mb-4">
      <h4 class="font-semibold">Group {{ props.index + 1 }}</h4>
    </div>
    <div class="pb-5">
      <div class="logic-group-grid">
        <ConditionItem
          v-for="(condition, conditionIndex) in props.logicOperator.conditions"
          :key="conditionIndex"
          :logicOperator="props.logicOperator"
          :condition="condition"
        />
      </div>
    </div>
    <n-tooltip trigger="hover" placement="top-end">
      <template #trigger>
        <!-- truyền props.logicOperator để xác định thêm condition
         vào đúng nhóm logic hiện tại -->
        <n-button
          @click="useGooglePerformanceRule.addCondition(props.logicOperator)"
          size="medium"
        >
          <template #icon>
            <n-icon size="12"><Plus /></n-icon>
          </template>
          Condition
        </n-button>
      </template>
      Add Condition On Group
    </n-tooltip>
  </div>
  <!-- Hiển thị AND/OR -->
  <div
    v-if="
      useGooglePerformanceRule.QuestionConfig &&
      props.index <
        useGooglePerformanceRule.QuestionConfig.logic_operators.length - 1
    "
    class="text-start mt-4 flex justify-start"
  >
    <span class="bg-blue-100 text-blue-800 px-3 py-2 rounded-md text-sm">
      {{ useGooglePerformanceRule.QuestionConfig?.is_and_or ? 'AND' : 'OR' }}
    </span>
  </div>
</template>
<style scoped>
.logic-group-grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: 1fr;
}
</style>
