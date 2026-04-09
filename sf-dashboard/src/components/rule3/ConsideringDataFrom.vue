<script lang="ts" setup>
import useRuleStoreV3 from '@/store/details/ruleV3'
import FloatingWrapper from '../common/FloatingWrapper.vue'
import CustomSwitch from '../common/CustomSwitch.vue'
const ruleStoreV3 = useRuleStoreV3()

const name = 'Considering Data From'

const isShow = computed(() => {
  if (
    ruleStoreV3.ruleV3.isRuleStopCampaign() ||
    ruleStoreV3.ruleV3.isDataFromLink() ||
    ruleStoreV3.ruleV3.isVersion2()
  ) {
    return false
  }
  return true
})

watch(
  () => isShow.value,
  (newValue) => {
    if (newValue) {
      ruleStoreV3.ruleV3.interval = null
      ruleStoreV3.ruleV3.include_today = false
    }
  }
)

onMounted(() => {
  ruleStoreV3.loadIntervalOptions()
})
</script>

<template>
  <div class="flex items-center gap-2" v-if="isShow">
    <div class="w-full flex gap-2 items-center">
      <FloatingWrapper
        :name="name"
        :required="true"
        :error="ruleStoreV3.showErr['interval']"
      >
        <n-select
          v-model:value="ruleStoreV3.ruleV3.interval"
          filterable
          clearable
          :placeholder="''"
          :options="ruleStoreV3.intervalOptions"
        />
      </FloatingWrapper>

      <CustomSwitch
        v-model="ruleStoreV3.ruleV3.include_today"
        type="boolean"
        true-label="Include"
        false-label="Exclude"
        size="small"
      />
    </div>
  </div>
</template>
