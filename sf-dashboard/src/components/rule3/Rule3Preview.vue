<script lang="ts" setup>
import QuestionCircleRegular from '@/assets/icons/QuestionCircleRegular.vue'

import useRuleStoreV3 from '@/store/details/ruleV3'
import CustomSwitch from '../common/CustomSwitch.vue'
const ruleStoreV3 = useRuleStoreV3()
</script>

<template>
  <div class="flex items-center gap-2">
    <div class="text-xs w-32 font-bold flex gap-2 items-center">
      Preview
      <n-popover trigger="hover" :show-arrow="false">
        <template #trigger>
          <n-icon :component="QuestionCircleRegular" />
        </template>
        <span
          >When enabled, the Rule will only log the “Rule Satisfy” as a preview
          and will not be executed yet.</span
        >
      </n-popover>
    </div>

    <div class="flex-1 min-w-0 flex items-center gap-3">
      <CustomSwitch
        v-model="ruleStoreV3.ruleV3.status_preview"
        type="onoff"
        trueLabel="On"
        falseLabel="Off"
        size="small"
      />
    </div>
  </div>
</template>
