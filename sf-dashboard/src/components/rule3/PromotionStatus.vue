<script setup lang="ts">
import useRuleStoreV3 from '@/store/details/ruleV3'
import FloatingWrapper from '../common/FloatingWrapper.vue'
import { promotionStatusOptions } from '@/options/rule'

const ruleStoreV3 = useRuleStoreV3()

onMounted(() => {})

watch(
  () => ruleStoreV3.ruleV3.isDataFromListCampaign(),
  (newValue) => {
    if (newValue) {
      if (!ruleStoreV3.ruleV3.apply_account_promotion_status) {
        ruleStoreV3.ruleV3.apply_account_promotion_status = []
      }
    } else {
      ruleStoreV3.ruleV3.apply_account_promotion_status = undefined
    }
  }
)

const name = `Promotion Status`
</script>

<template>
  <FloatingWrapper
    :name="name"
    v-if="ruleStoreV3.ruleV3.isDataFromListCampaign()"
  >
    <n-select
      v-model:value="ruleStoreV3.ruleV3.apply_account_promotion_status"
      :options="promotionStatusOptions"
      multiple
      filterable
      clearable
      :max-tag-count="1"
    />
  </FloatingWrapper>
</template>
