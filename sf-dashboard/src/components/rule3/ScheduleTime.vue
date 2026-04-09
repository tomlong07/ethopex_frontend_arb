<script setup lang="ts">
import useRuleStoreV3 from '@/store/details/ruleV3'
import FloatingWrapper from '../common/FloatingWrapper.vue'

const ruleStoreV3 = useRuleStoreV3()

watch(
  () => ruleStoreV3.ruleV3.isShowTime(),
  (newValue) => {
    if (!newValue) {
      ruleStoreV3.ruleV3.time_schedule_hour = '00'
      ruleStoreV3.ruleV3.time_schedule_min = '00'
    }
  }
)
</script>

<template>
  <div v-if="ruleStoreV3.ruleV3.isShowTime()" class="flex items-center gap-2">
    <div class="w-3/4 flex items-center gap-2">
      <div class="w-1/4">
        <FloatingWrapper :name="'Hour'">
          <n-input
            v-model:value="ruleStoreV3.ruleV3.time_schedule_hour"
            placeholder=""
            class="w-96"
          />
        </FloatingWrapper>
      </div>
      <span class="text-gray-500">:</span>
      <div class="w-1/4">
        <FloatingWrapper :name="'Minute'">
          <n-input
            v-model:value="ruleStoreV3.ruleV3.time_schedule_min"
            placeholder=""
            class="w-96"
          />
        </FloatingWrapper>
      </div>
    </div>
  </div>
</template>
