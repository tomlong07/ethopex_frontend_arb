<script setup lang="ts">
import { ctr_traffic_source } from '@/services/ctr_traffic_source'
import { SelectOption } from 'naive-ui'
import useRuleStoreV3 from '@/store/details/ruleV3'
import FloatingWrapper from '@/components/common/FloatingWrapper.vue'
const ruleStoreV3 = useRuleStoreV3()

const name = 'Language'
const languageOptions = ref<SelectOption[]>([])
const isLoading = ref(false)

const fetchLanguageByTraffic = async () => {
  isLoading.value = true
  const result = await ctr_traffic_source.GetLanguage('google')
  languageOptions.value = result?.data?.languages || []

  isLoading.value = false
}

watch(
  () => ruleStoreV3.ruleV3.isDataFromListCampaign(),
  (newValue) => {
    if (newValue) {
      ruleStoreV3.ruleV3.add_campaign.language = []
    } else {
      fetchLanguageByTraffic()
    }
  }
)

onMounted(() => {
  if (!ruleStoreV3.ruleV3.isDataFromListCampaign()) {
    fetchLanguageByTraffic()
  }
})
</script>

<template>
  <FloatingWrapper
    :name="name"
    v-if="!ruleStoreV3.ruleV3.isDataFromListCampaign()"
  >
    <n-select
      v-model:value="ruleStoreV3.ruleV3.add_campaign.language"
      filterable
      multiple
      label-field="name"
      :loading="isLoading"
      :options="languageOptions"
      :clearable="true"
      :placeholder="''"
    />
  </FloatingWrapper>
</template>
