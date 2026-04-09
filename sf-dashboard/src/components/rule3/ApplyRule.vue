<script setup lang="ts">
import { computed } from 'vue'
import useRuleStoreV3 from '@/store/details/ruleV3'
import FloatingWrapper from '../common/FloatingWrapper.vue'
import { ctr_rule } from '@/services/ctr_rule'
import { debounceV2 } from '@/utils'

const ruleStoreV3 = useRuleStoreV3()
const name = `Apply Rule`

const selectedRule = computed({
  get: () => ruleStoreV3.ruleV3.apply_rule?.[0] ?? null,
  set: (val) => {
    ruleStoreV3.ruleV3.apply_rule = val ? [val] : []
  }
})

const getApplyRuleOptions = async (search = '', size = 100) => {
  ruleStoreV3.loadingApplyRule = true
  try {
    const params: Record<string, string | number> = {}
    if (search) params.search = search
    if (size) params.size = size

    const result = await ctr_rule.GetRules(params)
    
    ruleStoreV3.ApplyRuleOption = (result?.data || []).map((item: any) => ({
      ...item,
      name: `${item.id}: ${item.name}`,
      value: item.id
    }))
  } finally {
    ruleStoreV3.loadingApplyRule = false
  }
}

const handleSearch = debounceV2(async (search) => {
  getApplyRuleOptions(search, 100)
}, 300)

onMounted(() => {
  getApplyRuleOptions() 
})
</script>

<template>
  <FloatingWrapper :name="name">
    <n-select
      v-model:value="selectedRule"
      filterable
      clearable
      remote
      value-field="id"
      label-field="name"
      :placeholder="''"
      :loading="ruleStoreV3.loadingApplyRule"
      :options="ruleStoreV3.ApplyRuleOption"
      @search="handleSearch"
    />
  </FloatingWrapper>
</template>