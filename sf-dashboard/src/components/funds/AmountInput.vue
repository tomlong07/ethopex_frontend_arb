<template>
  <FloatingWrapper
    name="Amount"
    required
    :error="dataConfig.showErr['amount']"
    class="my-5"
  >
    <n-input-number
      v-model:value="dataConfig.fundsConfig.amount"
      class="w-full"
      :disabled="dataConfig.isDisabled"
      :max="
        dataConfig.fundsConfig.source.includes('User Funds')
          ? dataConfig.amount
          : null
      "
      :loading="dataConfig.isLoading"
      :parse="parse"
      :format="format"
      :validator="validator"
    />
  </FloatingWrapper>
</template>
<script setup lang="ts">
import useFundsStore from '@/store/details/useFundsStore'
import FloatingWrapper from '../common/FloatingWrapper.vue'

const dataConfig = useFundsStore()

const parse = (input: any) => {
  if (typeof input !== 'string') {
    input = input.toString()
  }
  const nums = input.replace(/,/g, '').trim()
  const numberValue = Number(nums)
  if (/^\d+(\.(\d+)?)?$/.test(nums) && numberValue >= 1) {
    return numberValue
  }
  return nums === '' ? null : Number.NaN
}
const validator = (x: number) => x > 0

const format = (value: number | null) => {
  if (value === null) return ''
  return value.toLocaleString('en-US')
}
</script>
