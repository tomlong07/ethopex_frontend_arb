<script setup lang="ts">
import Close from '@/assets/icons/Close.vue'
import VueDatePicker from '@vuepic/vue-datepicker'
import GooglePerformanceRule from '@/store/useGooglePerformanceRule'
import {
  Condition,
  ConditionType,
  LogicOperator,
} from '@/types/state/google_performance_rule'
import FloatingWrapper from '../common/FloatingWrapper.vue'

const props = defineProps<{
  logicOperator: LogicOperator
  condition: Condition
}>()

const useGooglePerformanceRule = GooglePerformanceRule()

const getValuesForCondition = (type: ConditionType): string[] | null =>
  useGooglePerformanceRule.configData?.[type]?.value || null

const getOperatorOptions = (type: string) =>
  Object.entries(
    useGooglePerformanceRule.getOperatorsForCondition(type as any)
  ).map(([k, v]) => ({ label: v as string, value: k }))

const getValueOptions = (type: string) => {
  const values = getValuesForCondition(type as any)
  return values
    ? values.map((v: string) => ({ label: v, value: v }))
    : undefined
}

const needsValueSelect = (type: string) =>
  type !== 'query_selector' && getValuesForCondition(type as any) !== null

const updateCondition = (field: keyof Condition, value: any) => {
  if (!useGooglePerformanceRule.QuestionConfig) return

  useGooglePerformanceRule.updateCondition(props.condition, field, value)
}

const handleConditionTypeChange = (value: string | number) => {
  updateCondition('condition_type', value as string)
  const ops = getOperatorOptions(value as string)
  updateCondition('condition_operator', ops[0]?.value || '')
}

const handleConditionOperatorChange = (value: string | number) => {
  updateCondition('condition_operator', value as string)
}

const handleConditionValueChange = (value: string | number) => {
  updateCondition('condition_value', value as string)
}

const handleQuerySelectorChange = (value: string, inputIdx: number) => {
  const current = props.condition.condition_value || ''
  const arr = current.split('||')
  while (arr.length < 2) arr.push('')
  arr[inputIdx] = value.trim()
  handleConditionValueChange(arr.join('||'))
}

const getQuerySelectorValue = (val: string, idx: number) => {
  return val ? val.split('||')[idx] || '' : ''
}

const removeCondition = () => {
  if (!useGooglePerformanceRule.QuestionConfig) return
  useGooglePerformanceRule.removeCondition(props.logicOperator, props.condition)
}

onMounted(() => {
  const style = document.createElement('style')
  style.textContent = `
    .n-base-select-option {
      font-size: 13px !important;
    }
    .n-base-select-option__content {
      font-size: 13px !important;
    }
  `
  document.head.appendChild(style)
})
</script>
<template>
  <div
    class="flex overwrite-font-size flex-wrap relative items-start gap-2 px-[25px] p-2 border-gray-250 rounded-sm"
  >
    <div class="flex items-center flex-wrap md:flex-nowrap gap-2 w-full">
      <!-- Select Condition Type -->
      <div class="flex-1 w-full sm:min-w-[150px]">
        <FloatingWrapper :name="`Condition Type`">
          <n-select
            class="w-full"
            :value="props.condition.condition_type"
            @update:value="handleConditionTypeChange"
            :options="useGooglePerformanceRule.conditionOptions"
            placeholder="Select condition type"
            size="large"
          />
        </FloatingWrapper>
      </div>
      <!-- Selector input khi là query_selector -->
      <template v-if="props.condition.condition_type === 'query_selector'">
        <div class="flex-1 w-full sm:min-w-[150px]">
          <FloatingWrapper :name="`Selector`">
            <n-input
              :value="
                getQuerySelectorValue(props.condition.condition_value || '', 0)
              "
              @update:value="(value: string) => handleQuerySelectorChange(value, 0)"
              placeholder="Enter selector"
              size="large"
            />
          </FloatingWrapper>
        </div>
      </template>
      <!-- Operator Select -->
      <div class="flex-1 w-full sm:min-w-[150px]">
        <FloatingWrapper :name="`Selector`">
          <n-select
            :value="props.condition.condition_operator"
            @update:value="handleConditionOperatorChange"
            :options="getOperatorOptions(props.condition.condition_type)"
            placeholder="Select operator"
            :disabled="!props.condition.condition_type"
            size="large"
          />
        </FloatingWrapper>
      </div>
      <!-- Value Input / Select -->
      <div class="flex-1 min-w-[150px]">
        <FloatingWrapper :name="`Value`">
          <n-select
            v-if="needsValueSelect(props.condition.condition_type)"
            :value="props.condition.condition_value || null"
            @update:value="handleConditionValueChange"
            :options="getValueOptions(props.condition.condition_type)"
            placeholder="Select value"
            :disabled="!props.condition.condition_operator"
            size="large"
          />
          <n-input
            v-else-if="props.condition.condition_type === 'query_selector'"
            :value="
              getQuerySelectorValue(props.condition.condition_value || '', 1)
            "
            @update:value="(value: string) => handleQuerySelectorChange(value, 1)"
            placeholder="Enter value"
            size="large"
            :disabled="!props.condition.condition_operator"
          />
          <n-input-number
            :min="0"
            v-else-if="props.condition.condition_type === 'impression'"
            :value="
              props.condition.condition_value
                ? Number(props.condition.condition_value)
                : null
            "
            @update:value="
              (val: number | null) =>
                handleConditionValueChange(
                  val !== null && val !== undefined ? String(val) : ''
                )
            "
            placeholder="Enter number only"
            size="large"
            :disabled="!props.condition.condition_operator"
          />
          <VueDatePicker
            v-else-if="props.condition.condition_type === 'created_at'"
            :model-value="props.condition.condition_value"
            format="yyyy-MM-dd"
            timezone="UTC"
            utc="preserve"
            clearable
            auto-apply
            placeholder="Date"
            :disabled="!props.condition.condition_operator"
            @update:model-value="handleConditionValueChange"
          >
            <template #clear-icon> </template>
          </VueDatePicker>
          <n-input
            v-else
            :value="props.condition.condition_value || ''"
            @update:value="handleConditionValueChange"
            placeholder="Enter value"
            :disabled="!props.condition.condition_operator"
            size="large"
          />
        </FloatingWrapper>
      </div>
      <!-- Button remove -->
      <div class="flex-shrink-0 bg-[#fff]">
        <n-tooltip trigger="hover" placement="top-end">
          <template #trigger>
            <n-button
              dashed
              @click="removeCondition"
              :disabled="props.logicOperator.conditions.length <= 1"
              class="!w-10 !h-[40px] !p-0"
              size="large"
            >
              <template #icon>
                <n-icon size="17">
                  <Close />
                </n-icon>
              </template>
            </n-button>
          </template>
          Remove Condition On Group
        </n-tooltip>
      </div>
    </div>
  </div>
</template>
<style scoped>
.condition-item {
  max-width: 100%;
}
@media (min-width: 1024px) {
  .logic-group-grid:has(> .condition-item:only-child) .condition-item {
    max-width: 49.5%;
  }
}
:deep(.n-base-selection-input__content) {
  font-size: 13px !important;
}
:deep(.n-input__input-el) {
  font-size: 13px !important;
}
:deep(.dp__input) {
  font-size: 13px !important;
}

:deep(.n-input__placeholder),
:deep(.n-base-selection-placeholder) {
  font-size: 13px !important;
}
</style>
