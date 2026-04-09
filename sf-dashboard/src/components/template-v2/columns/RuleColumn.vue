<script setup lang="ts">
import { useTemplateV2 } from '@/store/templateV2Store'
import { ColumnItem } from '@/types/state/general'
import ExcutionTime from '@/components/rule/cell/ExcutionTime.vue'
import Level from '@/components/rule/cell/Level.vue'
import RuleName from '@/components/rule/cell/RuleName.vue'
import ScheduleRule from '@/components/rule3/cell/ScheduleRule.vue'
import Tooltip from '@/components/template-v2/cell/Tooltip.vue'
import Round from '@/components/template-v2/cell/Round.vue'
import IntervalExclude from '@/components/rule3/cell/IntervalExclude.vue'
import RuleCellStatus from '@/components/rule/cell/RuleCellStatus.vue'
import RuleCellInterval from '@/components/rule3/cell/RuleCellInterval.vue'
import RuleActions from '@/components/rule/cell/RuleActions.vue'
const templateV2Store = useTemplateV2(helper.truePath())()

templateV2Store.componentMap = (column: ColumnItem) => {
  if (!column.field) return

  switch (column.field) {
    case 'name':
      return RuleName
    case 'action':
      return RuleActions
    case 'status':
      return RuleCellStatus
    case 'rule_global':
      return Level
    case 'type':
    case 'traffic_sources':
    case 'demands':
      return Tooltip

    case 'schedule':
      return ScheduleRule
    case 'process_status':
      return Round
    case 'execution_time':
      return ExcutionTime

    case 'interval':
      return RuleCellInterval

    case 'interval_exclude':
      return IntervalExclude
  }
  return
}
</script>

<template></template>
