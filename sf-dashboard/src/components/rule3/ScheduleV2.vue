<script setup lang="ts">
import useRuleStoreV3 from '@/store/details/ruleV3'
import FloatingWrapper from '../common/FloatingWrapper.vue'
import { useRuleDescription } from '@/composables/useRuleDescription'
import { RuleScheduleOptions, RuleScheduleOptionsV2 } from '@/options/rule'

const ruleStoreV3 = useRuleStoreV3()

watch(
  () => ruleStoreV3.ruleV3.isRuleStopCampaign(),
  (newValue) => {
    if (newValue) {
      ruleStoreV3.ruleV3.schedule = 'daily'
    } else {
      ruleStoreV3.ruleV3.schedule = null
    }
  }
)

watch(
  () => ruleStoreV3.ruleV3.schedule,
  (newValue) => {
    if (newValue) {
      ruleStoreV3.ruleV3.time_schedule_hour = '00'
      ruleStoreV3.ruleV3.time_schedule_min = '00'
    }
  }
)

onMounted(() => {
  ruleStoreV3.ruleV3.time_schedule_hour ??= '00'
  ruleStoreV3.ruleV3.time_schedule_min ??= '00'
  ruleStoreV3.ruleV3.time_schedule_number ??= ruleStoreV3.isEditPage ? 0 : 1
  ruleStoreV3.ruleV3.schedule ??= 'day_unit'
})

const ruleDescription = useRuleDescription(ruleStoreV3.ruleV3)

const genTimeOptions = (max: number) => {
  return Array.from({ length: max }, (_, i) => {
    const val = i.toString().padStart(2, '0')
    return { label: val, value: val }
  })
}

const hourOptions = genTimeOptions(24)
const minuteOptions = genTimeOptions(60)

const scheduleOptions = computed(() => {
  if (ruleStoreV3.isAddPage) return RuleScheduleOptionsV2
  const schedule = ruleStoreV3.ruleV3.schedule

  const inV1 = RuleScheduleOptions.some((opt) => opt.value === schedule)
  const inV2 = RuleScheduleOptionsV2.some((opt) => opt.value === schedule)

  if (schedule && inV1 && !inV2) {
    return [...RuleScheduleOptionsV2, ...RuleScheduleOptions]
  }

  return RuleScheduleOptionsV2
})
</script>

<template>
  <div class="flex gap-2 mb-2">
    <div class="w-1/4">
      <FloatingWrapper :name="'Every'" required>
        <n-input-number
          v-model:value="ruleStoreV3.ruleV3.time_schedule_number"
          placeholder=""
          :min="1"
          :max="365"
        />
      </FloatingWrapper>
    </div>

    <div class="w-1/4">
      <FloatingWrapper
        :name="'Unit'"
        required
        :error="ruleStoreV3.showErr['unit']"
      >
        <n-select
          v-model:value="ruleStoreV3.ruleV3.schedule"
          filterable
          clearable
          :placeholder="''"
          :options="scheduleOptions"
          :disabled="ruleStoreV3.ruleV3.isRuleStopCampaign()"
        />
      </FloatingWrapper>
    </div>

    <div class="w-1/4" v-if="ruleStoreV3.ruleV3.isShowHour()">
      <FloatingWrapper :name="'At'" required :error="ruleStoreV3.showErr['at']">
        <n-select
          v-model:value="ruleStoreV3.ruleV3.time_schedule_hour"
          :options="hourOptions"
          filterable
          clearable
          :placeholder="''"
        />
      </FloatingWrapper>
    </div>

    <div class="w-1/4" v-if="ruleStoreV3.ruleV3.isShowMinute()">
      <FloatingWrapper
        :name="'Minute'"
        required
        :error="ruleStoreV3.showErr['minute']"
      >
        <n-select
          v-model:value="ruleStoreV3.ruleV3.time_schedule_min"
          :options="minuteOptions"
          filterable
          clearable
          :placeholder="''"
        />
      </FloatingWrapper>
    </div>
  </div>

  <p class="text-gray-400 text-xs italic text-end -mt-4 dark-mode-text">
    {{ ruleDescription }}
  </p>
</template>
