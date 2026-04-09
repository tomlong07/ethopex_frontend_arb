<script setup lang="ts">
import useRuleStoreV3 from '@/store/details/ruleV3'

const ruleStoreV3 = useRuleStoreV3()

watch(
  () => ruleStoreV3.ruleV3.isRuleStopCampaign(),
  (newValue) => {
    if (!newValue) {
      ruleStoreV3.ruleV3.time_hour_start = null
      ruleStoreV3.ruleV3.time_min_start = null
    }
  }
)
</script>

<template>
  <div
    v-if="ruleStoreV3.ruleV3.isRuleStopCampaign()"
    class="flex items-center gap-2"
  >
    <div class="w-20 font-bold">Time Start</div>
    <div class="flex-1 min-w-0 flex items-center gap-2">
      <div class="w-1/4">
        <n-input
          v-model:value="ruleStoreV3.ruleV3.time_hour_start"
          placeholder="Hour"
          class="w-96"
          min="0"
          max="23"
        />
      </div>
      :
      <div class="w-1/4">
        <n-input
          v-model:value="ruleStoreV3.ruleV3.time_min_start"
          placeholder="Min"
          class="w-96"
          min="0"
          max="59"
        />
      </div>
    </div>
  </div>
</template>
