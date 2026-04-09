<script lang="ts" setup>
import { useDefaultAccount } from '@/store/details/defaultAccount'
import FloatingWrapper from '../common/FloatingWrapper.vue'
const defaultAccountStore = useDefaultAccount()
const name = `Demand Source`

onMounted(async () => {
  await defaultAccountStore.fetchDemandSourceOptions()
})
</script>

<template>
  <FloatingWrapper
    :name="name"
    :required="true"
    :error="defaultAccountStore.showErr['demand_source']"
  >
      <n-select
        v-model:value="defaultAccountStore.defaultAccountData.demand_source"
        :placeholder="''"
        remote
        :options="defaultAccountStore.demandSourceOptions"
        :loading="defaultAccountStore.loadingDemandSource"
        :disabled="defaultAccountStore.isEditPage"
        clearable
      />
  </FloatingWrapper>
</template>
