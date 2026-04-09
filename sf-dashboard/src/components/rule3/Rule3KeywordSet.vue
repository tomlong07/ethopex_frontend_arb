<script setup lang="ts">
import { ctr_filter_v2 } from '@/services/ctr_filter_v2'
import useRuleStoreV3 from '@/store/details/ruleV3'
import { debounceV2 } from '@/utils'
import FloatingWrapper from '../common/FloatingWrapper.vue'
const ruleStoreV3 = useRuleStoreV3()

const name = `Keyword Set`

const isShow = computed(() => {
  return (
    ruleStoreV3.ruleV3.isNotDataFromLink() &&
    !ruleStoreV3.ruleV3.isDataFromListCampaign()
  )
})

const getKeywordSetOptions = async (q?: string) => {
  ruleStoreV3.loadingKWSet = true

  const result = await ctr_filter_v2.FilterKeywordSet({
    q: q,
    f: ruleStoreV3.ruleV3.apply_keyword_set
      ? ruleStoreV3.ruleV3.apply_keyword_set.join(',')
      : undefined,
  })

  ruleStoreV3.keywordSetOption = result?.data || []

  ruleStoreV3.loadingKWSet = false
}

watch(
  () => isShow.value,
  (newValue) => {
    if (newValue) {
      getKeywordSetOptions()
    } else {
      ruleStoreV3.ruleV3.apply_keyword_set = []
    }
  }
)

onMounted(() => {
  if (isShow.value) {
    getKeywordSetOptions()
  }
})

const handleSearch = debounceV2(async (q: string = '') => {
  getKeywordSetOptions(q)
}, 300)
</script>

<template>
  <FloatingWrapper :name="name" v-if="isShow">
    <n-select
      v-model:value="ruleStoreV3.ruleV3.apply_keyword_set"
      filterable
      multiple
      clearable
      value-field="value"
      label-field="label"
      max-tag-count="responsive"
      :placeholder="''"
      :loading="ruleStoreV3.loadingKWSet"
      :options="ruleStoreV3.keywordSetOption"
      @search="handleSearch"
    />
  </FloatingWrapper>
</template>
