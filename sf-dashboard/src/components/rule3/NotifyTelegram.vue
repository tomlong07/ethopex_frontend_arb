<script lang="ts" setup>
import QuestionCircleRegular from '@/assets/icons/QuestionCircleRegular.vue'

import useRuleStoreV3 from '@/store/details/ruleV3'
import CustomSwitch from '../common/CustomSwitch.vue'
const ruleStoreV3 = useRuleStoreV3()
</script>

<template>
  <div class="flex items-center gap-2">
    <div class="text-xs w-32 font-bold flex items-center gap-2">
      Notify Telegram<n-popover trigger="hover" :show-arrow="false">
        <template #trigger>
          <n-icon :component="QuestionCircleRegular" />
        </template>
        <span>
          Enable and configure rule activity log notifications to be delivered
          to a specified Telegram chat.
          <a
            href="https://docs.google.com/document/d/1M7VZj3MDY_W_M4YIB59oZZm2O805RK5tqP1GcJ3TAZ0/edit?tab=t.0#heading=h.3455fiobcgj2"
            target="_blank"
            rel="noopener noreferrer"
            class="text-blue-400 hover:text-blue-500 transition-colors"
          >
            Guide
          </a>
        </span>
      </n-popover>
    </div>
    <div class="flex-1 min-w-0 flex items-center gap-3">
      <CustomSwitch
        v-model="ruleStoreV3.ruleV3.is_notify_telegram"
        type="onoff"
        true-label="On"
        false-label="Off"
        size="small"
      />
    </div>
  </div>
</template>
