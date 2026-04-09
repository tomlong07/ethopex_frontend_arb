<script lang="ts" setup>
import useRuleStoreV3 from '@/store/details/ruleV3'
import CustomSwitch from '../common/CustomSwitch.vue'
const ruleStoreV3 = useRuleStoreV3()
</script>

<template>
  <div class="flex items-center gap-2">
    <div class="text-xs w-10 font-bold">Status</div>
    <div class="flex-1 min-w-0">
      <CustomSwitch
        v-model="ruleStoreV3.ruleV3.status"
        type="onoff"
        true-label="On"
        false-label="Off"
        size="small"
      />
    </div>
  </div>
</template>
