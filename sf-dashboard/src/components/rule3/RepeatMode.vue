<script lang="ts" setup>
import { RepeatMode } from '@/enum/rule'
import useRuleStoreV3 from '@/store/details/ruleV3'
import { SelectOption } from 'naive-ui'
import FloatingWrapper from '../common/FloatingWrapper.vue'

const ruleStoreV3 = useRuleStoreV3()

const isShow = computed(() => !ruleStoreV3.ruleV3.isAddCampaignRule())

watch(
  () => isShow.value,
  (newValue) => {
    if (newValue) {
      if (!ruleStoreV3.ruleV3.repeat_mode) {
        ruleStoreV3.ruleV3.repeat_mode = RepeatMode.RuleRepeatModeTYPENone
      }
    } else {
      ruleStoreV3.ruleV3.repeat_mode = null
    }
  }
)

const REPEAT_MODE_CONFIG = {
  [RepeatMode.RuleRepeatModeTYPENone]: {
    label: 'Always',
    description: 'Run every time conditions are met.',
  },
  [RepeatMode.RuleRepeatModeTYPEDaily]: {
    label: 'One Daily',
    description: 'Run once per day if conditions are met.',
  },
  [RepeatMode.RuleRepeatModeTYPEIntervalHour]: {
    label: 'Repeat Every X Hours',
    description: 'Run every X hours if conditions are met.',
  },
  [RepeatMode.RuleRepeatModeTYPEOnlyOnce]: {
    label: 'Only Once',
    description: 'Run only once when conditions are met.',
  },
}

const options = Object.entries(REPEAT_MODE_CONFIG).map(([value, config]) => ({
  ...config,
  value: value as RepeatMode,
}))

watch(
  () =>
    ruleStoreV3.ruleV3.repeat_mode ===
    RepeatMode.RuleRepeatModeTYPEIntervalHour,
  (newValue) => {
    if (!newValue) {
      ruleStoreV3.ruleV3.repeat_interval_hour = null
    }
  }
)

const renderRepeatModeLabel = (option: SelectOption) => {
  return h('div', { class: 'flex w-full' }, [
    h('div', {
      innerHTML: `${
        (option.label as any) ? option.label : `${option.id}: ${option.label}`
      }`,
    }),
    h('div', {
      class: 'ml-auto mt-[2px] text-xs text-gray-500',
      innerHTML: `<span>${option.description}</span>`,
    }),
  ])
}

const renderLabel = (option: SelectOption) => {
  return renderRepeatModeLabel(option)
}
const name = 'Running Mode'
</script>

<template>
  <div class="flex items-center gap-2" v-if="isShow">
    <div class="w-full flex gap-2">
      <FloatingWrapper :name="name">
        <n-select
          v-model:value="ruleStoreV3.ruleV3.repeat_mode"
          :options="options"
          :render-label="renderLabel"
          clearable
        >
        </n-select>
      </FloatingWrapper>
    </div>

    <div
      class="w-32"
      v-if="
        ruleStoreV3.ruleV3.repeat_mode ===
        RepeatMode.RuleRepeatModeTYPEIntervalHour
      "
    >
      <FloatingWrapper :name="'Hours'">
        <n-input-number
          placeholder=""
          v-model:value="ruleStoreV3.ruleV3.repeat_interval_hour"
        ></n-input-number>
      </FloatingWrapper>
    </div>
  </div>
</template>
