<template>
  <FloatingWrapper
  name="Source"
  class="my-5"
  >
    <n-select
      v-model:value="dataConfig.fundsConfig.source"
      placeholder=""
      filterable
      :disabled="dataConfig.isDisabled || !dataConfig.optionSource"
      :options="dataConfig.optionSource"
      :on-update:value="onchangeSource"
    />
  </FloatingWrapper>
</template>
<script setup lang="ts">
import { ctr_payment } from '@/services/ctr_payment'
import useFundsStore from '@/store/details/useFundsStore'
import FloatingWrapper from '../common/FloatingWrapper.vue'

const dataConfig = useFundsStore()

const fetchAmount = async () => {
  dataConfig.isLoading = true
  const result = await ctr_payment.GetAmountInvoicePending(
    dataConfig.fundsConfig.user_id,
    dataConfig.fundPermission.showPublisher
  )
  dataConfig.fundsConfig.amount = result?.data?.amount
  dataConfig.amount = result?.data?.amount
  dataConfig.isLoading = false
}

const onchangeSource = (value: any) => {
  dataConfig.fundsConfig.source = value
  if (value === 'User Funds') {
    fetchAmount()
    return
  }
  dataConfig.fundsConfig.amount = 0
}
</script>
