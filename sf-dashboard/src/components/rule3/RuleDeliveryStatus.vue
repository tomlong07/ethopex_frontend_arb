<script setup lang="ts">
import { INEX } from '@/enum/campaign'
import useRuleStoreV3 from '@/store/details/ruleV3'
import FloatingWrapper from '../common/FloatingWrapper.vue'
import CustomSwitch from '../common/CustomSwitch.vue'
import { deliveryOptions } from '@/options/rule'
const ruleStoreV3 = useRuleStoreV3()

const name = `Delivery Status`

const isShow = computed(() => {
  return (
    ruleStoreV3.ruleV3.isNotDataFromLink() &&
    !ruleStoreV3.ruleV3.isDataFromListCampaign()
  )
})

watch(
  () => isShow.value,
  (newValue) => {
    if (newValue) {
      if (!ruleStoreV3.ruleV3.apply_type_delivery_status) {
        ruleStoreV3.ruleV3.apply_type_delivery_status = INEX.INCLUDE
      }
    } else {
      ruleStoreV3.ruleV3.apply_delivery_status = []
      ruleStoreV3.ruleV3.apply_type_delivery_status = null
    }
  }
)
</script>

<template>
  <div class="flex items-center gap-2" v-if="isShow">
    <div class="flex items-center flex-1 min-w-0 gap-2">
      <FloatingWrapper :name="name">
        <n-select
          :placeholder="''"
          v-model:value="ruleStoreV3.ruleV3.apply_delivery_status"
          filterable
          multiple
          clearable
          :options="deliveryOptions"
        />
      </FloatingWrapper>
      <div class="w-32 shrink-0">
        <CustomSwitch
          v-model="(ruleStoreV3.ruleV3.apply_type_delivery_status as INEX)"
          type="inex"
          true-label="Include"
          false-label="Exclude"
          size="small"
        />
      </div>
    </div>
  </div>
</template>
