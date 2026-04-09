<script lang="ts" setup>
import QuestionCircleRegular from '@/assets/icons/QuestionCircleRegular.vue'

import { ONOFF } from '@/enum/campaign'
import useRuleStoreV3 from '@/store/details/ruleV3'
import CustomSwitch from '../common/CustomSwitch.vue'
import FloatingWrapper from '../common/FloatingWrapper.vue'
const ruleStoreV3 = useRuleStoreV3()

watch(
  () => ruleStoreV3.ruleV3.isBlockCampaign(),
  (newValue) => {
    if (newValue) {
      if (!ruleStoreV3.ruleV3.daily_reset) {
        ruleStoreV3.ruleV3.daily_reset = ONOFF.OFF
      }
    } else {
      ruleStoreV3.ruleV3.daily_reset = null
    }
  }
)

onMounted(() => {
  ruleStoreV3.ruleV3.time_reset_hour ??= '00'
  ruleStoreV3.ruleV3.time_reset_min ??= '00'
  ruleStoreV3.ruleV3.rollback_after_days ??= 0
})

const genTimeOptions = (max: number) => {
  return Array.from({ length: max }, (_, i) => {
    const val = i.toString().padStart(2, '0')
    return { label: val, value: val }
  })
}

const hourOptions = genTimeOptions(24)
const minuteOptions = genTimeOptions(60)

const ruleDescription = computed(() => {
  const days = ruleStoreV3.ruleV3.rollback_after_days
  const hour = ruleStoreV3.ruleV3.time_reset_hour
  const min = ruleStoreV3.ruleV3.time_reset_min

  const dayText = days === 1 ? '1 Day(s)' : `${days} Day(s)`

  const hasTime = hour !== null && hour !== undefined
  const hh = String(hour ?? 0).padStart(2, '0')
  const mm = String(min ?? 0).padStart(2, '0')
  const timeText = hasTime ? ` at ${hh}:${mm}` : ''

  return `Automatically rolls back this rule's effects ${timeText} UTC ${dayText} later.`
})
</script>

<template>
  <div
    class="flex items-center gap-2"
    v-if="ruleStoreV3.ruleV3.isBlockCampaign()"
  >
    <div class="text-xs w-32 font-bold flex items-center gap-2">
      Rollback
      <n-popover trigger="hover" :show-arrow="false">
        <template #trigger>
          <n-icon :component="QuestionCircleRegular" />
        </template>
        If enabled, it will reset to ON all campaigns that were affected by this
        rule yesterday when a new day begins.
      </n-popover>
    </div>
    <div class="flex-1 min-w-0 flex items-center gap-3">
      <CustomSwitch
        v-model="ruleStoreV3.ruleV3.daily_reset"
        type="onoff"
        true-label="On"
        false-label="Off"
        size="small"
      />
    </div>
  </div>
  <!-- Time Reset Section -->
  <div
    class="flex items-center gap-2"
    v-if="
      ruleStoreV3.ruleV3.isBlockCampaign() &&
      ruleStoreV3.ruleV3.daily_reset === 'on'
    "
  >
    <div class="w-full flex items-center gap-2">
      <FloatingWrapper :name="'After days'" required>
        <n-input-number
          v-model:value="ruleStoreV3.ruleV3.rollback_after_days"
          placeholder=""
          :min="0"
          :max="365"
        />
      </FloatingWrapper>
      <FloatingWrapper :name="'At'" required>
        <n-select
          v-model:value="ruleStoreV3.ruleV3.time_reset_hour"
          :options="hourOptions"
          filterable
          clearable
          :placeholder="''"
        />
      </FloatingWrapper>
      <FloatingWrapper :name="'Minute'" required>
        <n-select
          v-model:value="ruleStoreV3.ruleV3.time_reset_min"
          :options="minuteOptions"
          filterable
          clearable
          :placeholder="''"
        />
      </FloatingWrapper>
    </div>
  </div>
  <p
    class="text-gray-400 text-xs italic text-end -mt-2 dark-mode-text"
    v-if="
      ruleStoreV3.ruleV3.isBlockCampaign() &&
      ruleStoreV3.ruleV3.daily_reset === 'on'
    "
  >
    {{ ruleDescription }}
  </p>
</template>
