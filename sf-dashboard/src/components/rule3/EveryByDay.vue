<script setup lang="ts">
import useRuleStoreV3 from '@/store/details/ruleV3'
import FloatingWrapper from '../common/FloatingWrapper.vue'

const ruleStoreV3 = useRuleStoreV3()
const name = 'Every By Day'

watch(
  () => ruleStoreV3.ruleV3.isShowEveryByDay(),
  (newValue) => {
    if (!newValue) {
      ruleStoreV3.ruleV3.time_schedule_every_by_day = null
    }
  }
)
</script>

<template>
  <div
    v-if="ruleStoreV3.ruleV3.isShowEveryByDay()"
    class="flex items-center gap-2"
  >
    <div class="w-3/4 flex items-center">
      <div class="w-1/4">
        <FloatingWrapper :name="name">
          <n-input
            v-model:value="ruleStoreV3.ruleV3.time_schedule_every_by_day"
            placeholder="repeat every N day(s)"
            class="w-96"
          />
        </FloatingWrapper>
      </div>
    </div>
  </div>
</template>
