<script setup lang="ts">
import useRuleStoreV3 from '@/store/details/ruleV3'
import { debounceV2 } from '@/utils'
import FloatingWrapper from '../common/FloatingWrapper.vue'
import { ctr_traffic_source } from '@/services/ctr_traffic_source'
import QuestionCircleRegular from '@/assets/icons/QuestionCircleRegular.vue'
const ruleStoreV3 = useRuleStoreV3()

const name = `Ad Account`

const getAdAccountSetOptions = async (q?: string) => {
  ruleStoreV3.loadingAdAcc = true

  const result = await ctr_traffic_source.GetAccountV2({
    object: String(ruleStoreV3.ruleV3.traffic_sources),
    q: q || '',
    limit: 100,
  })

  ruleStoreV3.AdAccountOption = result?.data.accounts || []

  ruleStoreV3.loadingAdAcc = false
}

const isDisable = computed(() => {
  if (ruleStoreV3.ruleV3.traffic_sources?.length === 1) {
    getAdAccountSetOptions()
    return false
  } else {
    ruleStoreV3.ruleV3.apply_ad_account = null
    return true
  }
})

const handleSearch = debounceV2(async (q: string = '') => {
  getAdAccountSetOptions(q)
}, 300)
</script>

<template>
  <FloatingWrapper :name="name">
    <template #extra>
      <n-popover trigger="hover">
        <template #trigger>
          <n-icon size="12">
            <QuestionCircleRegular />
          </n-icon>
        </template>
        Only allow selection when selecting a traffic source
      </n-popover>
    </template>

    <n-select
      v-model:value="ruleStoreV3.ruleV3.apply_ad_account"
      filterable
      multiple
      clearable
      value-field="value"
      label-field="name"
      max-tag-count="responsive"
      :placeholder="''"
      :loading="ruleStoreV3.loadingAdAcc"
      :options="ruleStoreV3.AdAccountOption"
      @search="handleSearch"
      :disabled="isDisable"
    />
  </FloatingWrapper>
</template>
