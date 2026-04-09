<script setup lang="ts">
import useRuleStoreV3 from '@/store/details/ruleV3'
import CustomSwitch from '../common/CustomSwitch.vue'

const ruleStoreV3 = useRuleStoreV3()
</script>

<template>
  <div
    v-if="!ruleStoreV3.ruleV3.isAddCampaignRule()"
    class="flex items-center gap-2"
  >
    <div class="text-xs w-32 font-bold">Global</div>
    <div class="flex-1 min-w-0">
      <CustomSwitch
        v-model="ruleStoreV3.ruleV3.rule_global"
        type="boolean"
        true-label="On"
        false-label="Off"
        size="small"
      />
    </div>
  </div>
</template>
