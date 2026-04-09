<script setup lang="ts">
import useRuleStoreV3 from '@/store/details/ruleV3'

import FloatingWrapper from '../common/FloatingWrapper.vue'
import CollapseSection from '../common/CollapseSection.vue'
import { RuleBudgetComparisonOption } from '@/options/rule'
import MainInterval from './MainInterval.vue'

const ruleStoreV3 = useRuleStoreV3()

//Tự động set giá trị đầu tiên cái field_comparison
const updateBudgetUnit = (value: string) => {
  ruleStoreV3.ruleV3.budget!.budget_unit = value

  if (
    ruleStoreV3.ruleV3.budget?.showRuleBudgetPercent() &&
    !ruleStoreV3.ruleV3.budget?.field_comparison &&
    RuleBudgetComparisonOption.length
  ) {
    ruleStoreV3.ruleV3.budget!.field_comparison =
      RuleBudgetComparisonOption[0].value
  }
}
</script>

<template>
  <CollapseSection
    name="rule_budget"
    header="Rule Budget"
    v-if="ruleStoreV3.ruleV3.isRuleBudget()"
  >
    <div class="flex gap-2">
      <div class="flex gap-2 flex-1 min-w-0" v-if="ruleStoreV3.ruleV3.budget">
        <div class="flex flex-col gap-4 flex-1 min-w-0">
          <div class="flex gap-2">
            <FloatingWrapper :name="'Budget Type'" class="w-1/3">
              <n-select
                v-model:value="ruleStoreV3.ruleV3.budget.budget_type"
                placeholder=""
                :options="[
                  {
                    label: 'Set Budget To',
                    value: 'equal',
                    disabled: false,
                  },
                  {
                    label: 'Increase Budget By',
                    value: 'increase',
                    disabled: false,
                  },
                  {
                    label: 'Decrease Budget By',
                    value: 'decrease',
                    disabled: false,
                  },
                ]"
                :consistent-menu-width="false"
              />
            </FloatingWrapper>

            <FloatingWrapper
              name="Budget Value"
              required
              :error="ruleStoreV3.showErr['budget_value']"
              class="w-1/3"
            >
              <n-input-number
                :status="
                  ruleStoreV3.showErr['budget_value'] ? 'error' : undefined
                "
                v-model:value="ruleStoreV3.ruleV3.budget.budget_value"
                clearable
                placeholder=""
              />
            </FloatingWrapper>

            <FloatingWrapper :name="'Budget Unit'" class="w-1/3">
              <n-select
                v-model:value="ruleStoreV3.ruleV3.budget.budget_unit"
                placeholder=""
                :options="[
                  {
                    label: '$',
                    value: 'currency',
                    disabled: false,
                    select: true,
                  },
                  { label: '%', value: 'percent', disabled: false },
                ]"
                :on-update:value="updateBudgetUnit"
              />
            </FloatingWrapper>
          </div>

          <div class="w-full">
            <FloatingWrapper
              required
              :error="ruleStoreV3.showErr['budget_value_min']"
              :name="'Do not allow the Budget to be lower than'"
            >
              <n-input-number
                v-model:value="ruleStoreV3.ruleV3.budget.budget_value_min"
                clearable
                :status="
                  ruleStoreV3.showErr['budget_value_min'] ? 'error' : undefined
                "
                placeholder="Enter Minimum Budget Value"
              />
            </FloatingWrapper>
          </div>

          <div class="w-full">
            <FloatingWrapper
              required
              :error="ruleStoreV3.showErr['budget_value_max']"
              :name="'Do not allow the Budget to be higher than'"
            >
              <n-input-number
                :status="
                  ruleStoreV3.showErr['budget_value_max'] ? 'error' : undefined
                "
                v-model:value="ruleStoreV3.ruleV3.budget.budget_value_max"
                clearable
                placeholder="Enter Maximum Budget Value"
              />
            </FloatingWrapper>
          </div>
          <div v-if="ruleStoreV3.isShowInputResetBudget" class="w-full">
            <FloatingWrapper :name="'Reset Budget at end of day'">
              <n-input-number
                v-model:value="ruleStoreV3.ruleV3.budget.reset_budget"
                clearable
                placeholder="Enter a value, or type '0' to skip"
              />
            </FloatingWrapper>
          </div>
        </div>
      </div>
      <div
        class="w-80"
        v-if="
          ruleStoreV3.ruleV3.budget &&
          ruleStoreV3.ruleV3.budget.showRuleBudgetPercent()
        "
      >
        <FloatingWrapper>
          <n-select
            v-model:value="ruleStoreV3.ruleV3.budget.field_comparison"
            clearable
            filterable
            :options="RuleBudgetComparisonOption"
          />
        </FloatingWrapper>
      </div>
      <div class="flex items-start mt-1">
        <MainInterval />
      </div>
    </div>
  </CollapseSection>
</template>
