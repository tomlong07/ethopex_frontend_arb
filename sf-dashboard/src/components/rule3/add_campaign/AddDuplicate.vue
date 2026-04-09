<script setup lang="ts">
import FloatingWrapper from '@/components/common/FloatingWrapper.vue'
import { BiddingOptionsDuplicate } from '@/options/campaign'
import useRuleStoreV3 from '@/store/details/ruleV3'

const ruleStoreV3 = useRuleStoreV3()
</script>
<template>
  <n-grid y-gap="12" cols="1">
    <n-gi class="flex flex-col gap-4">
      <n-card title="Duplicate Campaign Settings" class="card-flex-gap-4">
        <FloatingWrapper name="Custom Name">
          <n-input
            v-model:value="ruleStoreV3.ruleV3.duplicate_campaign.custom_name"
            :placeholder="''"
          />
        </FloatingWrapper>
        <FloatingWrapper name="Bidding">
          <n-select
            v-model:value="ruleStoreV3.ruleV3.duplicate_campaign.bidding"
            clearable
            :placeholder="''"
            :options="BiddingOptionsDuplicate"
          />
        </FloatingWrapper>

        <FloatingWrapper name="Budget">
          <n-input-number
            v-model:value="ruleStoreV3.ruleV3.duplicate_campaign.budget"
            :min="0"
            :max="50000"
            :placeholder="''"
          >
            <template #prefix> $</template>
          </n-input-number>
        </FloatingWrapper>
      </n-card>
    </n-gi>
  </n-grid>
</template>
