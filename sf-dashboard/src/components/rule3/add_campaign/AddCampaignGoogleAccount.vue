<script setup lang="ts">
import FloatingWrapper from '@/components/common/FloatingWrapper.vue'
import { ctr_traffic_source } from '@/services/ctr_traffic_source'
import useRuleStoreV3 from '@/store/details/ruleV3'
import { SelectOption } from 'naive-ui'
const ruleStoreV3 = useRuleStoreV3()
const name = 'Google Account'

const accountOptions = ref<SelectOption[]>([])
const isLoading = ref<boolean>(false)

const fetchAccounts = async () => {
  isLoading.value = true

  const result = await ctr_traffic_source.GetAccount('google', '', 0)
  accountOptions.value = result?.data?.accounts || []

  isLoading.value = false
}

watch(
  () => ruleStoreV3.ruleV3.isDataFromListCampaign(),
  (newValue) => {
    if (newValue) {
      ruleStoreV3.ruleV3.add_campaign.account_supply_id = null
    } else {
      fetchAccounts()
    }
  }
)

onMounted(() => {
  if (!ruleStoreV3.ruleV3.isDataFromListCampaign()) {
    fetchAccounts()
  }
})
</script>

<template>
  <FloatingWrapper
    :name="name"
    v-if="!ruleStoreV3.ruleV3.isDataFromListCampaign()"
  >
    <n-select
      v-model:value="ruleStoreV3.ruleV3.add_campaign.account_supply_id"
      filterable
      clearable
      value-field="id"
      label-field="name"
      :loading="isLoading"
      :options="accountOptions"
      :placeholder="''"
    />
  </FloatingWrapper>
</template>
