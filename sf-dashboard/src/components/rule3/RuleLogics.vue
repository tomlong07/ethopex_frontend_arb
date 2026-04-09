<script setup lang="ts">
import { ctr_rule } from '@/services/ctr_rule'
import useRuleStoreV3, {
  conditionTypeV3,
  RuleLogic,
} from '@/store/details/ruleV3'
import { SelectOption } from 'naive-ui'

import {
  percentOfOptions,
  RuleExIntervalOption,
  RuleThanOption,
} from '@/options/rule'
import { debounceV2 } from '@/utils'
import FloatingWrapper from '../common/FloatingWrapper.vue'
import CustomSwitch from '../common/CustomSwitch.vue'
import Close2 from '@/assets/icons/Close2.vue'
import PlusSmall from '@/assets/icons/PlusSmall.vue'
import CollapseSection from '../common/CollapseSection.vue'

const ruleStoreV3 = useRuleStoreV3()
const ruleConditionLogic = ref<SelectOption[]>([])
const isLoading = ref(false)
const LIMIT = 10

const ruleConditionLogicComputed = computed<SelectOption[]>(() => {
  if (ruleStoreV3.ruleV3.isDataFromListCampaign()) {
    return ruleConditionLogic.value
  }

  const excludedValues = ['cost_all_time']
  return ruleConditionLogic.value.filter(
    (item) => !excludedValues.includes(item.value as string)
  )
})

const percentOfOptionsByRuleType = computed(() => {
  if (ruleStoreV3.isSectionChoose) {
    return percentOfOptions
  }

  return [percentOfOptions[0]]
})

const headerTitle = computed(() => {
  return ruleStoreV3.ruleV3.rule_type === 'duplicate_campaign' 
    ? 'Rule Logics by geo' 
    : 'Rule Logics'
})

const onlyAllowNumber = (value: string) => !value || /^\d+$/.test(value)

const getLogicOptions = async () => {
  isLoading.value = true

  const result = await ctr_rule.GetCondition()

  ruleConditionLogic.value = result?.data || []
  isLoading.value = false
}

const initDefaultLogic = () => {
  if (!ruleStoreV3.ruleV3.rule_logics) {
    ruleStoreV3.ruleV3.rule_logics = []
  }

  if (!ruleStoreV3.ruleV3.rule_logics?.length) {
    addRulelogic()
    addCondition(ruleStoreV3.ruleV3.rule_logics.length)
  }
}

const isShow = computed(() => {
  if (
    ruleStoreV3.ruleV3.isAddCampaignRule() ||
    ruleStoreV3.ruleV3.isRuleStopCampaign()
  ) {
    return false
  }

  if (ruleStoreV3.ruleV3.isVersion2()) return true
  return false
})

watch(
  () => isShow.value,
  (newValue) => {
    if (newValue) {
      getLogicOptions()

      initDefaultLogic()
    } else {
      ruleStoreV3.ruleV3.rule_logics = []
    }
  }
)

onMounted(() => {
  ruleStoreV3.loadIntervalOptions()

  if (isShow.value) {
    getLogicOptions()

    initDefaultLogic()
  }
})
const removeCondition = (ruleIndex: number, index: number) => {
  const ruleLogics = ruleStoreV3.ruleV3.rule_logics

  if (!ruleLogics || ruleIndex < 0 || index < 0) return

  const targetRule = ruleLogics[ruleIndex]

  if (!targetRule?.conditions || targetRule.conditions.length <= 1) return

  targetRule.conditions.splice(index, 1)
}

const removeRuleLogic = (ruleIndex: number) => {
  if (ruleIndex === -1) return

  const ruleLogics = ruleStoreV3.ruleV3.rule_logics
  if (!Array.isArray(ruleLogics) || ruleLogics.length <= 1) return

  ruleLogics.splice(ruleIndex, 1)
}

const addRulelogic = () => {
  if (!ruleStoreV3.ruleV3 || ruleStoreV3.ruleV3.rule_logics?.length === LIMIT)
    return

  if (!ruleStoreV3.ruleV3.rule_logics) ruleStoreV3.ruleV3.rule_logics = []

  ruleStoreV3.ruleV3.rule_logics?.push(new RuleLogic())
}

const addCondition = (ruleIndex: number) => {
  const rules = ruleStoreV3.ruleV3.rule_logics

  if (!Array.isArray(rules) || ruleIndex < 0 || ruleIndex >= rules.length)
    return

  const rule = rules[ruleIndex]

  if (!Array.isArray(rule.conditions)) {
    rule.conditions = []
  }

  if (rule.conditions.length >= LIMIT) return

  rule.conditions.push(new conditionTypeV3())
}

const comparisonMap = {
  less: '<',
  greater: '>',
  equal: '==',
  greater_or_equal: '>=',
  less_or_equal: '<=',
} as any

const comparisonTypeMap = {
  percent_of: '%',
  percent_of_campaign: '% of campaign',
} as any

watch(
  () => ruleStoreV3.ruleV3.rule_logics,
  debounceV2((v: any) => {
    handleClickOutLine()
  }, 500),
  { immediate: true, deep: true }
)

const findLabel = (
  value: any,
  options: Array<SelectOption>,
  { prefix = '', suffix = '', useName = false } = {}
) => {
  if (!value) return ''
  const found = options?.find((item) => item.value === value)
  if (!found) return ''
  const label = useName ? String(found.name) : found.label
  return label ? `${prefix}${label}${suffix}` : ''
}

const getLabelConsidering = (value: any) =>
  findLabel(value, ruleStoreV3.intervalOptions)

const getLabelExclude = (value: any) =>
  findLabel(value, RuleExIntervalOption, { prefix: ', [Ex ', suffix: ']' })

const getLabelMetric = (value: any) =>
  findLabel(value, ruleConditionLogicComputed.value || [], { useName: true })

const disableWhenIncludeToday = [
  'today',
  'today_yesterday',
  'last_15_min',
  'last_30_min',
  'last_1_hour',
  'last_2_hour',
  'last_3_hour',
  'last_4_hour',
]
const disableWhenExcludeToday = ['today', 'today_yesterday']
const isIncludeTodayDisabled = (interval: string | null | undefined) => {
  return disableWhenIncludeToday.includes(interval ?? '')
}
const getExcludeIntervalOptions = (
  includeToday: boolean | null | undefined,
  interval: string | null | undefined
) => {
  // nếu include_today = true hoặc interval nằm trong danh sách disable
  if (includeToday || disableWhenExcludeToday.includes(interval ?? '')) {
    return RuleExIntervalOption.filter(
      (item: any) => !disableWhenExcludeToday.includes(item.value)
    )
  }

  return RuleExIntervalOption
}
const handleClickOutLine = () => {
  const rules = ruleStoreV3.ruleV3.rule_logics

  if (!rules || !rules.length) return

  rules.forEach((rule: RuleLogic) => {
    const interval = getLabelConsidering(rule.interval)
    const intervalExclude = getLabelExclude(rule.interval_exclude)
    const includeToday = rule.include_today ? ' [In Today]' : ''
    //tự động tắt include_today nếu interval nằm trong danh sách
    if (disableWhenIncludeToday.includes(rule.interval ?? '')) {
      rule.include_today = false
    }

    const conditionStrs =
      rule.conditions
        ?.map((cond: any) => {
          const field = getLabelMetric(cond.field)
          const operator = comparisonMap[cond?.comparison] ?? ''
          const value = cond.value ?? ''

          if (!field || value === '') return null

          const unit = comparisonTypeMap[cond?.comparison_type] ?? ''
          const comparisonField = cond.comparison_field
            ? ` of ${getLabelMetric(cond.comparison_field)}`
            : ''

          return `${field} ${operator} ${value}${unit}${comparisonField}`
        })
        .filter(Boolean) ?? []

    const hasPrefix = includeToday || intervalExclude
    const prefix = `${interval}${intervalExclude}${includeToday}${
      hasPrefix ? ':' : ''
    }`

    rule.name = [
      prefix?.trim(),
      conditionStrs.length > 0 ? conditionStrs.join(' AND ') : null,
    ]
      .filter(Boolean)
      .join(' ')
  })
}
</script>

<template>
  <CollapseSection
    name="rule_logics"
    :header="headerTitle"
    popover="Set logical conditions for applying the rule."
    v-if="isShow"
  >
    <n-grid x-gap="12" cols="1 2800:2">
      <n-gi class="flex flex-col gap-4">
        <div
          @click="handleClickOutLine"
          v-for="(tp_ruleLogic, ruleIndex) in ruleStoreV3.ruleV3.rule_logics"
          :key="ruleIndex"
          class="custom-border-rule"
        >
          <n-card
            :closable="
              ruleStoreV3.ruleV3?.rule_logics &&
              ruleStoreV3.ruleV3?.rule_logics?.length > 1
            "
            @close="removeRuleLogic(ruleIndex)"
          >
            <div class="flex flex-col space-y-4 w-full md:w-2/3">
              <div class="flex items-center gap-2 pb-2">
                <FloatingWrapper
                  :name="'Name'"
                  :required="true"
                  :error="ruleStoreV3.showErr[`logic_name:${ruleIndex}`]"
                >
                  <n-input
                    v-model:value="tp_ruleLogic.name"
                    disabled
                    placeholder=""
                  />
                </FloatingWrapper>
              </div>

              <div class="flex items-center gap-2 pb-2">
                <div class="flex-shrink-0 w-3/4">
                  <FloatingWrapper :name="'Considering Data From'">
                    <n-select
                      v-model:value="tp_ruleLogic.interval"
                      filterable
                      clearable
                      placeholder=""
                      :options="ruleStoreV3.intervalOptions"
                    />
                  </FloatingWrapper>
                </div>
                <div
                  class="flex items-center"
                  v-show="!isIncludeTodayDisabled(tp_ruleLogic.interval)"
                >
                  <div class="text-xs w-24 font-bold">Include Today:</div>
                  <div class="w-fit">
                    <CustomSwitch
                      v-model="tp_ruleLogic.include_today"
                      type="boolean"
                      true-label="ON"
                      false-label="OFF"
                      size="small"
                    />
                  </div>
                </div>
              </div>

              <div class="flex items-center gap-2 pb-2">
                <FloatingWrapper :name="'Exclude Days From Interval'">
                  <n-select
                    v-model:value="tp_ruleLogic.interval_exclude"
                    filterable
                    clearable
                    placeholder=""
                    :options="
                      getExcludeIntervalOptions(
                        tp_ruleLogic.include_today,
                        tp_ruleLogic.interval
                      )
                    "
                  />
                </FloatingWrapper>
              </div>
            </div>
            <div
              v-for="(tp_condition, index) in tp_ruleLogic.conditions"
              :key="index"
              class="rows-condition flex"
            >
              <div class="flex items-center mb-1 flex-1">
                <div class="w-1/5">
                  <div class="pr-2 flex gap-2 flex-col">
                    <FloatingWrapper
                      :name="index <= 0 ? 'If' : 'And'"
                      :error="
                        ruleStoreV3.showErr[`field:${ruleIndex}:${index}`]
                      "
                      :required="true"
                    >
                      <n-select
                        v-model:value="tp_condition.field"
                        @update:value="(val: string | null) => 
                          ruleStoreV3.onRuleConditionChange(val, { ruleIndex, conditionIndex: index }, 'ruleV2')"
                        placeholder="Metric"
                        filterable
                        label-field="name"
                        :consistent-menu-width="false"
                        :options="ruleConditionLogicComputed"
                        :loading="isLoading"
                      />
                    </FloatingWrapper>

                    <FloatingWrapper
                      :name="''"
                      v-if="tp_condition.field === 'rpc_last_x_conversions'"
                      :error="
                        ruleStoreV3.showErr[`field:${ruleIndex}:${index}`]
                      "
                      :required="true"
                    >
                      <n-input
                        placeholder="Conversions"
                        v-model:value="tp_condition.field_extra"
                        :allow-input="onlyAllowNumber"
                      />
                    </FloatingWrapper>
                  </div>
                </div>
                <div class="w-1/5">
                  <div class="pr-2">
                    <FloatingWrapper
                      :name="'Is'"
                      :required="true"
                      :error="
                        ruleStoreV3.showErr[`comparison:${ruleIndex}:${index}`]
                      "
                    >
                      <n-select
                        v-model:value="tp_condition.comparison"
                        placeholder="Compare"
                        filterable
                        :options="
                          ruleStoreV3.getComparisonOptions(
                            tp_condition.field || ''
                          )
                        "
                        :loading="isLoading"
                      />
                    </FloatingWrapper>
                  </div>
                </div>
                <div class="w-1/5">
                  <div class="pr-2">
                    <FloatingWrapper :name="'Than'">
                      <n-select
                        v-if="ruleStoreV3.isCampaignStatus(tp_condition.field)"
                        v-model:value="tp_condition.value"
                        placeholder="Value"
                        :options="RuleThanOption"
                        :loading="isLoading"
                      />
                      <n-input-number
                        v-else
                        v-model:value="tp_condition.value"
                        placeholder="Amount"
                        :loading="isLoading"
                      />
                    </FloatingWrapper>
                  </div>
                </div>
                <div
                  class="w-1/5"
                  v-if="!ruleStoreV3.isCampaignStatus(tp_condition.field)"
                >
                  <div class="pr-2">
                    <FloatingWrapper>
                      <n-select
                        v-model:value="tp_condition.comparison_type"
                        placeholder="Compare Type"
                        clearable
                        :disabled="tp_condition.field === 'runtime_campaign'"
                        :options="percentOfOptionsByRuleType"
                        :loading="isLoading"
                      />
                    </FloatingWrapper>
                  </div>
                </div>
                <div
                  class="w-1/5"
                  v-if="!ruleStoreV3.isCampaignStatus(tp_condition.field)"
                >
                  <!-- <div class="font-bold">&nbsp;</div> -->
                  <div class="pr-2 flex gap-2 flex-col">
                    <FloatingWrapper>
                      <n-select
                        v-model:value="tp_condition.comparison_field"
                        placeholder="Metric"
                        filterable
                        clearable
                        label-field="name"
                        :disabled="tp_condition.field === 'runtime_campaign'"
                        :options="ruleConditionLogicComputed"
                        :consistent-menu-width="false"
                        :loading="isLoading"
                      />
                    </FloatingWrapper>

                    <FloatingWrapper
                      v-if="
                        tp_condition.comparison_field ===
                        'rpc_last_x_conversions'
                      "
                    >
                      <n-input
                        placeholder="Conversions"
                        v-model:value="tp_condition.comparison_field_extra"
                        :allow-input="onlyAllowNumber"
                      />
                    </FloatingWrapper>
                  </div>
                </div>
              </div>
              <div class="mt-1">
                <n-button
                  class="remove-condition"
                  icon-placement="left"
                  tertiary
                  :disabled="
                    tp_ruleLogic.conditions &&
                    tp_ruleLogic.conditions.length <= 1
                  "
                  @click="removeCondition(ruleIndex, index)"
                >
                  <template #icon>
                    <n-icon>
                      <Close2 />
                    </n-icon>
                  </template>
                </n-button>
              </div>
            </div>
            <n-button
              icon-placement="left"
              @click="addCondition(ruleIndex)"
              class="w-fit"
              size="small"
              round
            >
              <template #icon>
                <n-icon>
                  <PlusSmall />
                </n-icon>
              </template>
              Add
            </n-button>
          </n-card>
        </div>
        <div class="flex justify-start">
          <n-button
            icon-placement="left"
            @click="addRulelogic"
            class="w-fit"
            ghost
            type="primary"
            round
            size="small"
          >
            <template #icon>
              <n-icon>
                <PlusSmall />
              </n-icon>
            </template>
            Add Logic
          </n-button>
        </div>
      </n-gi>
    </n-grid>
  </CollapseSection>
</template>
<style scoped>
:deep(.custom-border-rule .n-card.n-card--bordered) {
  border: 1px solid #e7e7e7;
}
</style>