<script setup lang="ts">
import FloatingWrapper from '@/components/common/FloatingWrapper.vue'
import { ctr_label } from '@/services/ctr_label'
import useRuleStoreV3 from '@/store/details/ruleV3'
import { SelectOption } from 'naive-ui'
const ruleStoreV3 = useRuleStoreV3()
const name = 'Label'
const labelOptions = ref<SelectOption[]>([])

const fetchLabel = async () => {
  const result = await ctr_label.GetAll()

  labelOptions.value = result?.data || []
}

watch(
  () => ruleStoreV3.ruleV3.isDataFromListCampaign(),
  (newValue) => {
    if (newValue) {
      ruleStoreV3.ruleV3.add_campaign.label = null
    } else {
      fetchLabel()
    }
  }
)

onMounted(() => {
  if (!ruleStoreV3.ruleV3.isDataFromListCampaign()) {
    fetchLabel()
  }
})
</script>

<template>
  <FloatingWrapper
    :name="name"
    v-if="!ruleStoreV3.ruleV3.isDataFromListCampaign()"
  >
    <n-select
      v-model:value="ruleStoreV3.ruleV3.add_campaign.label"
      filterable
      value-field="id"
      label-field="name"
      :placeholder="''"
      :options="labelOptions"
    />
  </FloatingWrapper>
</template>
