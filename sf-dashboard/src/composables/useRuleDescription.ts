import { computed } from 'vue'
import { RuleScheduleOptionsV2 } from '@/options/rule'

export function useRuleDescription(rule: any) {
  return computed(() => {
    if (!rule?.schedule) return ''

    const {
      time_schedule_number = '',
      time_schedule_hour = '00',
      time_schedule_min = '00',
      schedule,
    } = rule

    const option = RuleScheduleOptionsV2?.find((opt) => opt.value === schedule)
    const label = option?.label ?? ''

    const suffixMap: Record<string, string> = {
      day_unit: ` at ${time_schedule_hour}:${time_schedule_min} (UTC).`,
      hour_unit: ` at ${time_schedule_min} min.`,
      minute_unit: `.`,
    }

    return `The rule will run every ${time_schedule_number} ${label}(s)${
      suffixMap[schedule] ??
      ` at ${time_schedule_hour}:${time_schedule_min} (UTC).`
    }`
  })
}
