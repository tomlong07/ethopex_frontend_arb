<script lang="ts" setup>
import useRuleStoreV3 from '@/store/details/ruleV3'
const ruleStoreV3 = useRuleStoreV3()
</script>

<template>
  <div
    class="flex flex-row-reverse sticky bottom-0 p-2 z-10"
    x-gap="12"
    cols="1 2800:2"
  >
    <n-button
      round
      size="small"
      color="#f43f5e"
      type="success"
      :loading="ruleStoreV3.isSubmitBtnLoading"
      @click="ruleStoreV3.submitForm()"
    >
      Submit
    </n-button>
  </div>
</template>
