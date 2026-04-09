<script setup lang="ts">
import useRuleStoreV3 from '@/store/details/ruleV3'
import type { SelectOption } from 'naive-ui'

const ruleStoreV3 = useRuleStoreV3()

const Options = ref<SelectOption[]>([])

const buildOptions = () => {
  const seen = new Set<string>()
  const result: SelectOption[] = []

  ;(ruleStoreV3.ruleV3.rule_logics || []).forEach((logic: any) => {
    if (!logic.interval) return
    if (seen.has(logic.interval)) return
    seen.add(logic.interval)

    const rawName = logic.name || ''
    const cleanedLabel = rawName.split(',')[0]?.trim() || logic.interval

    result.push({
      label: cleanedLabel,
      value: logic.interval,
    })
  })

  Options.value = result

  const current = ruleStoreV3.ruleV3.main_interval
  const hasCurrent = Options.value.some((opt) => opt.value === current)

  if (!hasCurrent) {
    ruleStoreV3.ruleV3.main_interval =
      (Options.value[0]?.value as string | undefined) || null
  }
}

watch(
  () => ruleStoreV3.ruleV3.rule_logics,
  () => {
    buildOptions()
  },
  { deep: true, immediate: true }
)

const isShowMainInterval = computed(() => {
  if (
    ruleStoreV3.ruleV3.bid &&
    ruleStoreV3.ruleV3.bid.field_comparison === 'current_bid'
  ) {
    ruleStoreV3.ruleV3.main_interval = null
    return false
  }
  if (
    ruleStoreV3.ruleV3.isRuleChangeBudget() &&
    ruleStoreV3.ruleV3.budget?.field_comparison == 'current_budget'
  ) {
    ruleStoreV3.ruleV3.main_interval = null
    return false
  }
  return (
    (ruleStoreV3.ruleV3.isRuleBid() &&
      ruleStoreV3.ruleV3.isBidPercent() &&
      ruleStoreV3.ruleV3.bid?.field_comparison !== 'rpc_last_x_conversions') ||
    (ruleStoreV3.ruleV3.isRuleBudget() &&
      ruleStoreV3.ruleV3.budget?.budget_unit === 'percent')
  )
})
</script>
<template>
  <div v-if="isShowMainInterval">
    <n-select
      class="w-40"
      v-model:value="ruleStoreV3.ruleV3.main_interval"
      placeholder="Main Interval"
      :consistent-menu-width="false"
      :options="Options"
      clearable
    >
      <template #empty>
        Please select "Considering Data From" above to use Main Interval.
      </template>
    </n-select>
  </div>
</template>
