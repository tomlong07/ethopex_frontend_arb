<script lang="ts" setup>
import useRuleStoreV3 from '@/store/details/ruleV3'
import FloatingWrapper from '../common/FloatingWrapper.vue'
const ruleStoreV3 = useRuleStoreV3()

const name = 'Name'
</script>

<template>
  <FloatingWrapper
    :name="name"
    :required="true"
    :error="ruleStoreV3.showErr['name']"
  >
    <n-input v-model:value="ruleStoreV3.ruleV3.name" :placeholder="''" />
  </FloatingWrapper>
</template>
