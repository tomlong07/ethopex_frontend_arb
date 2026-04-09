<script lang="ts" setup>
import { useDefaultAccount } from '@/store/details/defaultAccount'
import FloatingWrapper from '../common/FloatingWrapper.vue'
const defaultAccountStore = useDefaultAccount()
const name = `Traffic Source`

onMounted(async () => {
  await defaultAccountStore.fetchTrafficSourceOptions()
})
</script>

<template>
  <FloatingWrapper
    :name="name"
    :required="true"
    :error="defaultAccountStore.showErr['traffic_source']"
  >
    <n-select
      v-model:value="defaultAccountStore.defaultAccountData.traffic_source"
      :placeholder="''"
      remote
      :options="defaultAccountStore.trafficSourceOptions"
      :loading="defaultAccountStore.loadingTrafficSource"
      :disabled="defaultAccountStore.isEditPage"
    />
  </FloatingWrapper>
</template>
