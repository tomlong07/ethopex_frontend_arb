<template>
  <FloatingWrapper
    name="Publisher"
    class="mb-5"
  >
    <n-select
      v-model:value="dataConfig.fundsConfig.user_id"
      placeholder=""
      filterable
      :disabled="dataConfig.isDisabled"
      :options="optionPubliser"
      :on-update:value="onchangePublisher"
    />
  </FloatingWrapper>
</template>
<script setup lang="ts">
import useFundsStore from '@/store/details/useFundsStore'
import { ctr_user } from '@/services/ctr_user'
import FloatingWrapper from '../common/FloatingWrapper.vue'

const dataConfig = useFundsStore()

const optionPubliser = ref<[]>()

const onchangePublisher = (value: any) => {
  dataConfig.fundsConfig.user_id = value
  dataConfig.fetchFundSource(value)
  dataConfig.fundsConfig = {
    user_id: value,
    amount: 0,
    source: [],
    note: '',
    status: '',
  }
}
onMounted(async () => {
  GetAllUser()
})

const GetAllUser = async () => {
  const result = await ctr_user.GetAllUser()
  const option = result.data?.map((item: any) => ({
    value: item.id,
    label: item.email,
  }))
  optionPubliser.value = option
}
</script>
