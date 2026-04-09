<script setup lang="ts">
import { ICellRendererParams } from 'ag-grid-community'

import { useRuleDescription } from '@/composables/useRuleDescription'
import { RuleScheduleOptionsV2 } from '@/options/rule'

const props = defineProps({
  params: {
    type: Object as () => ICellRendererParams,
    default: () => {},
    required: false,
  },
})

const ruleDescription = useRuleDescription(props.params?.data)

const scheduleLabel =
  [...RuleScheduleOptionsV2, ...RuleScheduleOptionsV2].find(
    (opt) => opt.value === props?.params?.data?.schedule
  )?.label ?? ''
</script>
<template>
  <div class="flex flex-col w-full">
    <div class="text-xs overflow-hidden text-ellipsis">
      {{ ruleDescription }}
    </div>

    <div class="text-xs font-medium">{{ scheduleLabel }}</div>
  </div>
</template>
