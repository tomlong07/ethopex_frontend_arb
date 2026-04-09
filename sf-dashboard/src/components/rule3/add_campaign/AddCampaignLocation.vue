<script setup lang="ts">
import { ctr_traffic_source } from '@/services/ctr_traffic_source'
import { SelectOption } from 'naive-ui'
import useRuleStoreV3 from '@/store/details/ruleV3'
import FloatingWrapper from '@/components/common/FloatingWrapper.vue'
const ruleStoreV3 = useRuleStoreV3()

const name = 'Location'
const countriesOptions = ref<SelectOption[]>([])
const isLoading = ref(false)

const fetchCountriesByTraffic = async () => {
  isLoading.value = true
  const countriesOptionsResult = await ctr_traffic_source.GetCountries({
    traffic_source: 'google',
  })
  if (countriesOptionsResult?.status) {
    countriesOptions.value = countriesOptionsResult?.data?.coutries || []
  }

  isLoading.value = false
}

watch(
  () => ruleStoreV3.ruleV3.isDataFromListCampaign(),
  (newValue) => {
    if (newValue) {
      ruleStoreV3.ruleV3.add_campaign.country = null
    } else {
      fetchCountriesByTraffic()
    }
  }
)

onMounted(() => {
  if (!ruleStoreV3.ruleV3.isDataFromListCampaign()) {
    fetchCountriesByTraffic()
  }
})
</script>

<template>
  <FloatingWrapper
    :name="name"
    v-if="!ruleStoreV3.ruleV3.isDataFromListCampaign()"
  >
    <n-select
      v-model:value="ruleStoreV3.ruleV3.add_campaign.country"
      filterable
      clearable
      label-field="name"
      :placeholder="''"
      :loading="isLoading"
      :options="countriesOptions"
    />
  </FloatingWrapper>
</template>
