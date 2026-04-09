<script setup lang="ts">
import QuestionCircleRegular from '@/assets/icons/QuestionCircleRegular.vue'

import useRuleStoreV3 from '@/store/details/ruleV3'
import { computed, watch } from 'vue'
import FloatingWrapper from '../common/FloatingWrapper.vue'
import { PerformanceGoalOptions } from '@/options/campaign'

const ruleStoreV3 = useRuleStoreV3()

if (ruleStoreV3.ruleV3.apply_performance_goal === undefined) {
  ruleStoreV3.ruleV3.apply_performance_goal = null
}

const name = 'Apply Performance goal'

const applyPerformanceGoalOptions = [
  { label: 'All', value: 'all' },
  ...PerformanceGoalOptions,
]

const isApplyPerformanceGoal = computed(() => {
  return ruleStoreV3.ruleV3.IsHasPerformanceGoal()
})

watch(isApplyPerformanceGoal, (visible) => {
  if (!visible) {
    ruleStoreV3.ruleV3.apply_performance_goal = null
  }
})
</script>

<template>
  <div class="flex items-center gap-2" v-if="isApplyPerformanceGoal">
    <div class="flex-1 min-w-0">
      <FloatingWrapper :name="name">
        <n-select
          v-model:value="ruleStoreV3.ruleV3.apply_performance_goal"
          placeholder=""
          :disabled="false"
          :options="applyPerformanceGoalOptions"
        />
      </FloatingWrapper>
    </div>

    <div class="font-bold">
      <!-- {{ name }} -->
      <n-popover trigger="hover">
        <template #trigger>
          <n-icon size="14" :component="QuestionCircleRegular"></n-icon>
        </template>
        Example: You can tell Meta to maximize purchase volume while keeping
        your average cost per action (CPA) at about $5.
      </n-popover>
    </div>
  </div>
</template>
